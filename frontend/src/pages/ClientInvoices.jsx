import { useEffect, useState } from "react";
import axios from "axios";
import "./ClientInvoices.css";

function ClientInvoices() {
const [invoices, setInvoices] = useState([]);
const [selectedInvoice, setSelectedInvoice] = useState(null);
const [loading, setLoading] = useState(true);
const [errorMessage, setErrorMessage] = useState("");

const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
const [successMessage, setSuccessMessage] = useState("");
const [savingPaymentMethod, setSavingPaymentMethod] = useState(false);
// FETCH CLIENT INVOICES
const fetchInvoices = async () => {
    try {
        setLoading(true);
        setErrorMessage("");

        const token = localStorage.getItem("token");

        const response = await axios.get(
            "https://artconnect-backend-87br.onrender.com/api/invoices/client",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setInvoices(response.data.invoices || []);
    } catch (error) {
        console.error(
            "Unable to fetch client invoices:",
            error.response?.data || error.message
        );

        setErrorMessage(
            error.response?.data?.message ||
            "Unable to load invoices. Please try again."
        );
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    fetchInvoices();
}, []);

// PRINT OR SAVE INVOICE AS PDF
const printInvoice = () => {
    window.print();
};

const savePaymentMethod = async () => {
if (!selectedInvoice || !selectedPaymentMethod) {
setErrorMessage("Please select a payment method.");
return;
}

try {
    setSavingPaymentMethod(true);
    setErrorMessage("");
    setSuccessMessage("");

    const token = localStorage.getItem("token");

    const response = await axios.patch(
        `https://artconnect-backend-87br.onrender.com/api/invoices/${selectedInvoice._id}/payment-method`,
        {
            paymentMethod: selectedPaymentMethod
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const updatedInvoice = response.data.invoice;

    setInvoices((previousInvoices) =>
        previousInvoices.map((invoice) =>
            invoice._id === updatedInvoice._id
                ? { ...invoice, ...updatedInvoice }
                : invoice
        )
    );

    setSelectedInvoice((previousInvoice) => ({
        ...previousInvoice,
        ...updatedInvoice
    }));

    setSuccessMessage("Payment method saved successfully!");
} catch (error) {
    console.error(
        "Unable to save payment method:",
        error.response?.data || error.message
    );

    setErrorMessage(
        error.response?.data?.message ||
        "Unable to save payment method. Please try again."
    );
} finally {
    setSavingPaymentMethod(false);
}

};
// FORMAT DATE
const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

return (
    <div className="client-invoices-page">
        <div className="client-invoices-container">

            {/* PAGE HEADER */}
            <div className="client-invoices-header">
                <p>YOUR TRANSACTIONS</p>
                <h1>My Invoices</h1>
                <span>
                    View your commission invoices and payment status.
                </span>
            </div>

            {/* LOADING */}
            {loading && (
                <div className="client-invoices-message">
                    Loading your invoices...
                </div>
            )}

            {/* ERROR */}
            {!loading && errorMessage && (
                <div className="client-invoices-error">
                    {errorMessage}
                    <button
                        type="button"
                        onClick={fetchInvoices}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* EMPTY STATE */}
            {!loading && !errorMessage && invoices.length === 0 && (
                <div className="client-invoices-empty">
                    <div className="client-invoices-empty-icon">
                        <i className="bi bi-receipt"></i>
                    </div>

                    <h2>No Invoices Yet</h2>

                    <p>
                        When an artist creates an invoice for your
                        accepted commission, it will appear here.
                    </p>
                </div>
            )}

            {/* INVOICE LIST */}
            {!loading && !errorMessage && invoices.length > 0 && (
                <div className="client-invoices-list">
                    {invoices.map((invoice) => (
                        <div
                            className="client-invoice-card"
                            key={invoice._id}
                        >
                            <div className="client-invoice-card-header">
                                <div>
                                    <span className="client-invoice-label">
                                        INVOICE NUMBER
                                    </span>

                                    <h3>{invoice.invoiceNumber}</h3>
                                </div>

                                <span
                                    className={`client-invoice-status ${
                                        invoice.paymentStatus === "Paid"
                                            ? "client-invoice-paid"
                                            : "client-invoice-unpaid"
                                    }`}
                                >
                                    {invoice.paymentStatus}
                                </span>
                            </div>

                            <div className="client-invoice-details">
                                <div>
                                    <span>Commission</span>
                                    <strong>
                                        {invoice.commissionTitle}
                                    </strong>
                                </div>

                                <div>
                                    <span>Artist</span>
                                    <strong>
                                        {invoice.artist?.artistName ||
                                            invoice.artistName ||
                                            "Artist"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Amount</span>
                                    <strong>
                                        ₹{Number(invoice.amount).toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>Due Date</span>
                                    <strong>
                                        {formatDate(invoice.dueDate)}
                                    </strong>
                                </div>
                            </div>

                            <div className="client-invoice-card-actions">
                                <button
                                    type="button"
                                    onClick={() => {
                                    setSelectedInvoice(invoice);
                                    setSelectedPaymentMethod(invoice.paymentMethod || "");
                                    setSuccessMessage("");
                                    setErrorMessage("");
                                }}
                                >
                                    <i className="bi bi-eye me-1"></i>
                                    View Invoice
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* INVOICE PREVIEW MODAL */}
            {selectedInvoice && (
                <div
                    className="client-invoice-modal-overlay"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            setSelectedInvoice(null);
                        }
                    }}
                >
                    <div className="client-invoice-modal">

                        <div className="client-invoice-modal-header no-print">
                            <h2>Invoice Details</h2>

                            <button
                                type="button"
                                className="client-invoice-close"
                                onClick={() => setSelectedInvoice(null)}
                                aria-label="Close invoice"
                            >
                                &times;
                            </button>
                        </div>

                        {/* PRINTABLE INVOICE */}
                        <div className="client-invoice-print-area">
                            <div className="client-invoice-document">

                                <div className="client-invoice-document-header">
                                    <div>
                                        <h2>ArtConnect</h2>
                                        <p>Artist Commission Invoice</p>
                                    </div>

                                    <span
                                        className={`client-invoice-status ${
                                            selectedInvoice.paymentStatus === "Paid"
                                                ? "client-invoice-paid"
                                                : "client-invoice-unpaid"
                                        }`}
                                    >
                                        {selectedInvoice.paymentStatus}
                                    </span>
                                </div>

                                <hr />

                                <div className="client-invoice-number">
                                    <span>Invoice Number</span>
                                    <strong>
                                        {selectedInvoice.invoiceNumber}
                                    </strong>
                                </div>

                                <div className="client-invoice-date-grid">
                                    <div>
                                        <span>Issue Date</span>
                                        <strong>
                                            {formatDate(
                                                selectedInvoice.issueDate
                                            )}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Due Date</span>
                                        <strong>
                                            {formatDate(
                                                selectedInvoice.dueDate
                                            )}
                                        </strong>
                                    </div>
                                </div>

                                <h3>Commission Details</h3>

                                <p>
                                    <strong>Title:</strong>{" "}
                                    {selectedInvoice.commissionTitle}
                                </p>

                                <p>
                                    <strong>Description:</strong>{" "}
                                    {selectedInvoice.description ||
                                        "No description provided"}
                                </p>

                                <p>
                                    <strong>Artist:</strong>{" "}
                                    {selectedInvoice.artist?.artistName ||
                                        selectedInvoice.artistName ||
                                        "Artist"}
                                </p>

                                <div className="client-payment-method-section no-print">
                                    <label htmlFor="paymentMethod">
                                        <strong>Choose Payment Method</strong>
                                    </label><select
                                    id="paymentMethod"
                                    value={selectedPaymentMethod}
                                    onChange={(event) => {
                                        setSelectedPaymentMethod(event.target.value);
                                        setSuccessMessage("");
                                        setErrorMessage("");
                                    }}
                                    disabled={
                                        selectedInvoice.paymentStatus === "Paid" ||
                                        savingPaymentMethod
                                    }
                                >
                                    <option value="">Select a payment method</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Other">Other</option>
                                </select>

                                {selectedInvoice.paymentStatus !== "Paid" && (
                                    <button
                                        type="button"
                                        onClick={savePaymentMethod}
                                        disabled={savingPaymentMethod || !selectedPaymentMethod}
                                    >
                                        {savingPaymentMethod
                                            ? "Saving..."
                                            : "Save Payment Method"}
                                    </button>
                                )}

                                {successMessage && (
                                    <p className="client-payment-success">
                                        {successMessage}
                                    </p>
                                )}

                                {errorMessage && (
                                    <p className="client-payment-error">
                                        {errorMessage}
                                    </p>
                                )}

                                </div><p>
                                    <strong>Selected Payment Method:</strong>{" "}
                                    {selectedInvoice.paymentMethod || "Not selected"}
                                </p>

                                <div className="client-invoice-total">
                                    <span>Total Amount Due</span>

                                    <strong>
                                        ₹{Number(
                                            selectedInvoice.amount
                                        ).toLocaleString("en-IN")}
                                    </strong>
                                </div>

                                {selectedInvoice.paymentStatus === "Paid" && (
                                    <p className="client-invoice-paid-note">
                                        Payment received on{" "}
                                        {formatDate(selectedInvoice.paidAt)}.
                                    </p>
                                )}

                                <div className="client-invoice-note">
                                    <strong>Payment Information</strong>

                                    <p>
                                        Please pay the artist using the
                                        agreed payment method. ArtConnect
                                        does not process online payments.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="client-invoice-modal-actions no-print">
                            <button
                                type="button"
                                onClick={printInvoice}
                            >
                                <i className="bi bi-printer me-1"></i>
                                Print / Save PDF
                            </button>

                            <button
                                type="button"
                                className="client-invoice-close-btn"
                                onClick={() => setSelectedInvoice(null)}
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    </div>
);

}

export default ClientInvoices;