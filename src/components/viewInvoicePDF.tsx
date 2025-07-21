import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Document, Page } from 'react-pdf';
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { getInvoiceURL } from "../services/InvoiceServices.ts";
import { useAuth } from "react-oidc-context";

function ViewInvoicePDF({invoice_id: invoice_id_from_prop}) {
    const auth = useAuth()

    const {invoice_id: invoice_id_from_params} = useParams<{ invoice_id: string }>(); // 3. Get invoice_id from URL

    // allow for invoice ID coming either from prop (preferred) or request params
    const invoice_id = invoice_id_from_prop||invoice_id_from_params;

    // State for the PDF URL and any loading/error states
    const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // State for PDF page navigation
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);

    // useEffect to fetch data when the component mounts or invoice_id changes
    useEffect(() => {
        if (!invoice_id || !auth.user?.access_token) {
            setLoading(false);
            setError("Authentication token or Invoice ID is missing.");
            return;
        }

        const fetchUrl = async () => {
            try {
                setLoading(true);
                console.log(`fetch url in pdf component is getting invoice ${invoice_id}`);
                const response = await getInvoiceURL(auth.user.access_token, invoice_id);
                console.log(`Type of fetchUrl response (${response.data}) from getInvoiceURL.data:`);
                console.log(typeof response.data);
                setInvoiceUrl(response.data); // Assuming response.data contains the URL
                setError(null);
            } catch (err: any) {
                console.error("Failed to fetch invoice URL:", err);
                setError(err.message || "Failed to load invoice. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchUrl();
    }, [invoice_id, auth.user?.access_token]); // Dependency array

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    function goToPrevPage() {
        setPageNumber(prev => Math.max(prev - 1, 1));
    }

    function goToNextPage() {
        if (!numPages) return;
        setPageNumber(prev => Math.min(prev + 1, numPages));
    }

    // Conditional Rendering based on state
    if (loading) {
        return <div>Loading Invoice...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!invoiceUrl) {
        return <div>Could not find invoice URL.</div>;
    }

    return (
        <div>
            {/* Navigation Controls */}
            <div style={{ padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                <button className="button" onClick={goToPrevPage} disabled={pageNumber <= 1}>Prev</button>
                <span>Page {pageNumber} of {numPages || '--'}</span>
                <button className="button" onClick={goToNextPage} disabled={!numPages || pageNumber >= numPages}>Next</button>
            </div>

            {/* PDF Document */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Document file={invoiceUrl} onLoadSuccess={onDocumentLoadSuccess}>
                    <Page pageNumber={pageNumber} />
                </Document>
            </div>
        </div>
    );
}

export default ViewInvoicePDF;