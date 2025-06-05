import React, { useState } from "react";
import Image from "next/image";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const africanCountries = [
  "Nigeria", "Ethiopia", "Egypt", "DR Congo", "South Africa",
  "Tanzania", "Kenya", "Uganda", "Algeria", "Sudan",
  "Morocco", "Angola", "Ghana", "Mozambique", "Madagascar",
  "Cameroon", "Côte d'Ivoire", "Niger", "Burkina Faso",
  "Mali", "Malawi", "Zambia", "Senegal", "Chad", "Somalia",
  "Zimbabwe", "Guinea", "Rwanda", "Benin", "Burundi",
  "Tunisia", "South Sudan", "Togo", "Sierra Leone", "Libya",
  "Congo", "Liberia", "Central African Republic", "Mauritania",
  "Eritrea", "Namibia", "Gambia", "Botswana", "Gabon",
  "Lesotho", "Guinea-Bissau", "Equatorial Guinea",
  "Mauritius", "Eswatini", "Djibouti", "Comoros",
  "Cabo Verde", "Sao Tome and Principe", "Seychelles"
];

type FormState = {
  firstName: string;
  middleName: string;
  surname: string;
  phone: string;
  country: string;
  previousProgram: string;
  intendedProgram: string;
  paymentOption: "admission" | "both";
  agreed: boolean;
};

type ReceiptType = FormState & {
  fee: number;
  isDiscounted: boolean;
  documentUrl: string | null;
  timestamp: any; // Firebase Timestamp
};

export default function Home() {
  const [form, setForm] = useState<FormState>({
    firstName: "",
    middleName: "",
    surname: "",
    phone: "",
    country: "",
    previousProgram: "",
    intendedProgram: "",
    paymentOption: "admission",
    agreed: false,
  });

  const [fileUrl, setFileUrl] = useState<string | null>(null); // Placeholder if you want to add file upload later
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptType | null>(null);

  function calculateFee() {
    let baseFee = form.paymentOption === "both" ? 588 : 294;
    if (
      africanCountries
        .map((c) => c.toLowerCase())
        .includes(form.country.toLowerCase())
    ) {
      baseFee = baseFee / 2;
    }
    return baseFee;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.agreed) {
      alert("Please agree to the terms.");
      return;
    }
    setLoading(true);

    const fee = calculateFee();
    const isDiscounted = fee < (form.paymentOption === "both" ? 588 : 294);

    const data = {
      ...form,
      fee,
      isDiscounted,
      documentUrl: fileUrl,
      timestamp: Timestamp.now(),
    };

    try {
      await addDoc(collection(db, "applications"), data);
      setReceipt(data);
      setLoading(false);
      alert("Application submitted successfully!");
    } catch (error: any) {
      alert("Error submitting application: " + (error.message || error));
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: "#f5f7fa",
        color: "#333",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          backgroundColor: "#330066",
          color: "white",
          padding: "15px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 5px rgb(0 0 0 / 0.1)",
          fontWeight: "600",
          fontSize: "18px",
        }}
      >
        <div>
          <Image src="/Logo.png" alt="My Logo" width={70} height={70} />
        </div>
        <div style={{ display: "flex", gap: 20, fontWeight: "400", fontSize: "14px" }}>
          <a href="#form" style={{ color: "white", textDecoration: "none" }}>
            Apply
          </a>
          <a href="#terms" style={{ color: "white", textDecoration: "none" }}>
            Terms
          </a>
          <a href="#contact" style={{ color: "white", textDecoration: "none" }}>
            Contact
          </a>
        </div>
      </nav>

      {/* Main content container */}
      <main style={{ flex: 1, maxWidth: 700, margin: "40px auto", padding: "0 20px" }}>
        <h1
          style={{
            textAlign: "center",
            marginBottom: 30,
            color: "#222",
            fontSize: 40,
            fontWeight: "bolder",
          }}
        >
          Registration Form
        </h1>

        <form
          id="form"
          onSubmit={handleSubmit}
          style={{
            background: "white",
            padding: 30,
            borderRadius: 10,
            boxShadow: "0 4px 12px rgb(0 0 0 / 0.05)",
          }}
        >
          {/* Input fields */}
          {[
            { label: "First Name", key: "firstName", required: true },
            { label: "Middle Name (optional)", key: "middleName", required: false },
            { label: "Surname", key: "surname", required: true },
            { label: "Phone (Eg. +233 246456756)", key: "phone", required: true, type: "tel" },
            { label: "Country", key: "country", required: true },
            { label: "Previous Program (Eg. BSc. Computer Science)", key: "previousProgram", required: true },
            { label: "Intended Program (Eg. MSc. Mathematics)", key: "intendedProgram", required: true },
          ].map(({ label, key, required, type }) => (
            <input
              key={key}
              type={type || "text"}
              placeholder={label}
              required={required}
              value={form[key as keyof FormState] ?? ""}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: 15,
                borderRadius: 6,
                border: "1px solid #ccc",
                fontSize: "15px",
                outline: "none",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#4f46e5")}
              onBlur={(e) => (e.target.style.borderColor = "#ccc")}
            />
          ))}

          {/* Payment Option */}
          <label style={{ display: "block", marginBottom: 10, fontWeight: 600 }}>
            Service Fee:
            <select
              value={form.paymentOption}
              onChange={(e) =>
                setForm({ ...form, paymentOption: e.target.value as "admission" | "both" })
              }
              style={{
                marginLeft: 10,
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc",
                fontSize: "15px",
                outline: "none",
                cursor: "pointer",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#4f46e5")}
              onBlur={(e) => (e.target.style.borderColor = "#ccc")}
            >
              <option value="admission">Admission Only ($294)</option>
              <option value="both">Admission & Funding ($588)</option>
            </select>
          </label>

          <p style={{ marginTop: 10 }}>
            Fee: <b>${calculateFee()}</b>{" "}
            {calculateFee() < (form.paymentOption === "both" ? 588 : 294) && (
              <span style={{ color: "green" }}>(50% African Discount applied)</span>
            )}
          </p>

          {/* Terms and Conditions */}
          <div
            id="terms"
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              maxHeight: "200px",
              overflowY: "scroll",
              marginTop: 20,
              background: "#f9f9f9",
              borderRadius: 8,
              fontSize: "14px",
              lineHeight: "1.6",
              color: "#444",
            }}
          >
            <h3>
              <strong>Terms and Conditions</strong>
            </h3>

            <p>
              <strong>Accuracy of Information:</strong> You confirm that all information
              provided in this form is accurate, complete, and truthful to the best of your
              knowledge.
            </p>

            <p>
              <strong>Document Uploads:</strong> Any documents uploaded are authentic and
              legally owned by you. Submission of forged or misrepresented documents may result
              in permanent disqualification.
            </p>

            <p>
              <strong>Non-Refundable Fee:</strong> The service fee paid for admission or
              combined admission and funding support is non-refundable.
            </p>

            <p>
              <strong>Service Scope:</strong>
            </p>
            <ul>
              <li>
                <strong>Admission Only:</strong> Help in applying to institutions based on your
                qualifications.
              </li>
              <li>
                <strong>Admission & Funding:</strong> Includes scholarship/funding assistance
                where available.
              </li>
            </ul>

            <p>
              <strong>No Guarantee Clause:</strong> While we strive to support your application
              process, we do not guarantee scholarships or visa approvals.
            </p>

            <p>
              <strong>Confidentiality:</strong> Your personal information will be handled with
              strict confidentiality and used only for application and advisory purposes.
            </p>

            <p>
              <strong>Communication:</strong> We may contact you via email, phone, or WhatsApp to
              share updates related to your application or provide relevant information.
            </p>

            <p>
              <strong>Changes to Terms:</strong> We reserve the right to update these terms at any
              time. Any changes will be communicated on the application platform.
            </p>
          </div>

          <label style={{ marginTop: 10, display: "block", fontSize: "15px" }}>
            <input
              type="checkbox"
              checked={form.agreed}
              onChange={(e) => setForm({ ...form, agreed: e.target.checked })}
              required
              style={{ marginRight: 8 }}
            />
            I agree to the Terms and Conditions above.
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 20,
              padding: "12px 25px",
              backgroundColor: "#4f46e5",
              border: "none",
              color: "white",
              fontWeight: "600",
              fontSize: "16px",
              borderRadius: 6,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 12px rgb(79 70 229 / 0.4)",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (!loading) (e.currentTarget.style.backgroundColor = "#4338ca");
            }}
            onMouseLeave={(e) => {
              if (!loading) (e.currentTarget.style.backgroundColor = "#4f46e5");
            }}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

        {/* Receipt */}
        {receipt && (
          <div
            style={{
              marginTop: 40,
              padding: 30,
              border: "1px solid #e5e7eb",
              backgroundColor: "#ffffff",
              borderRadius: 12,
              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.06)",
              fontFamily: "Segoe UI, sans-serif",
              maxWidth: 600,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <h2 style={{ marginBottom: 24, fontSize: "1.8rem", color: "#111827" }}>
              ✅ Application Summary
            </h2>

            <div style={{ lineHeight: 1.8, color: "#374151", fontSize: "1rem" }}>
              <p>
                <strong>Name:</strong> {receipt.firstName} {receipt.middleName} {receipt.surname}
              </p>
              <p>
                <strong>Phone:</strong> {receipt.phone}
              </p>
              <p>
                <strong>Country:</strong> {receipt.country}
              </p>
              <p>
                <strong>Previous Program:</strong> {receipt.previousProgram}
              </p>
              <p>
                <strong>Intended Program:</strong> {receipt.intendedProgram}
              </p>
              <p>
                <strong>Payment Option:</strong>{" "}
                {receipt.paymentOption === "both" ? "Admission & Funding" : "Admission Only"}
              </p>
              <p>
                <strong>Fee Charged:</strong>{" "}
                <span style={{ fontWeight: "bold", color: "#111827" }}>${receipt.fee}</span>{" "}
                {receipt.isDiscounted && (
                  <span style={{ color: "green" }}>(African Discount Applied)</span>
                )}
              </p>
              {receipt.documentUrl && (
                <p>
                  <strong>Document Uploaded:</strong>{" "}
                  <a
                    href={receipt.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#2563eb", textDecoration: "underline" }}
                  >
                    View
                  </a>
                </p>
              )}
              <p>
                <strong>Agreed to Terms:</strong> {receipt.agreed ? "Yes" : "No"}
              </p>
            </div>

            <div style={{ marginTop: 30, display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `*Application Summary*:
Name: ${receipt.firstName} ${receipt.middleName} ${receipt.surname}
Phone: ${receipt.phone}
Country: ${receipt.country}
Previous Program: ${receipt.previousProgram}
Intended Program: ${receipt.intendedProgram}
Payment Option: ${
                    receipt.paymentOption === "both"
                      ? "Admission & Funding"
                      : "Admission Only"
                  }
Fee Paid: $${receipt.fee}
Agreed to Terms: ${receipt.agreed ? "Yes" : "No"}
${receipt.documentUrl ? `Document: ${receipt.documentUrl}` : ""}`
                )}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  backgroundColor: "#25D366",
                  color: "#fff",
                  padding: "10px 16px",
                  borderRadius: 8,
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                📤 Share on WhatsApp
              </a>

              <a
                href={`mailto:?subject=Application Summary&body=${encodeURIComponent(
                  `Application Summary:
Name: ${receipt.firstName} ${receipt.middleName} ${receipt.surname}
Phone: ${receipt.phone}
Country: ${receipt.country}
Previous Program: ${receipt.previousProgram}
Intended Program: ${receipt.intendedProgram}
Payment Option: ${
                    receipt.paymentOption === "both"
                      ? "Admission & Funding"
                      : "Admission Only"
                  }
Fee Paid: $${receipt.fee}
Agreed to Terms: ${receipt.agreed ? "Yes" : "No"}
${receipt.documentUrl ? `Document: ${receipt.documentUrl}` : ""}`
                )}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  padding: "10px 16px",
                  borderRadius: 8,
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                ✉️ Share via Email
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        id="contact"
        style={{
          backgroundColor: "#222",
          color: "#eee",
          textAlign: "center",
          padding: "15px 10px",
          fontSize: "14px",
          marginTop: "auto",
        }}
      >
        <h5>
          <i>
            Contact for support:{" "}
            <a href="mailto:support.yesglobal@gmail.com">service.yesglobal@gmail.com</a>
          </i>
        </h5>
        <br />
        © {new Date().getFullYear()} YesGlobal. All rights reserved.
      </footer>
    </div>
  );
}
