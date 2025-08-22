// C:/web/bake/src/components/Invoice/viewInvoicePDF.tsx
import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {Document, Page} from 'react-pdf';
import styled from '@emotion/styled';
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {getInvoiceURL} from "../../services/InvoiceServices.ts";
import {useAuth} from "react-oidc-context";
import useFlash from "../../contexts/FlashContext.tsx";

// --- Styled Components ---

const PDFWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
`;

const PDFControls = styled.div`
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    background-color: #f5f5f5;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: fit-content;
    z-index: 10; // Ensure controls stay on top
`;

const PDFDocumentWrapper = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    max-width: 900px; // Set a max-width for large screens

    .react-pdf__Page__canvas {
        // Target the canvas rendered by react-pdf
        max-width: 100%;
        height: auto !important; // Override default height to maintain aspect ratio
    }
`;


type ViewInvoicePDFProps = {
    invoice_id?: number; // Make prop optional
}

function ViewInvoicePDF({invoice_id: invoice_id_from_prop}: ViewInvoicePDFProps) {
    const auth = useAuth()
    const {showFlashMessage} = useFlash();
    const {invoice_id: invoice_id_from_params} = useParams<{ invoice_id: string }>();

    // SUGGESTION: This logic is more robust for parsing the ID from either source.
    let invoice_id: number | undefined;
    if (invoice_id_from_prop) {
        invoice_id = invoice_id_from_prop;
    } else if (invoice_id_from_params) {
        const parsedId = parseInt(invoice_id_from_params, 10);
        invoice_id = isNaN(parsedId) ? undefined : parsedId;
    }

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
                // guard clause - check user logged in before proceeding
                if (!auth.user?.access_token) {
                    showFlashMessage('You must be logged in to delete an element', 'danger');
                    return; // Exit the function early.
                }
                const response = await getInvoiceURL(auth.user.access_token, invoice_id);
                // allow for no invoice populated
                setInvoiceUrl(response.data);
                setError(null);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'An unknown error occurred';
                console.error(message);
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        void fetchUrl();
    }, [invoice_id, auth, showFlashMessage]); // Dependency array

    function onDocumentLoadSuccess({numPages}: { numPages: number }): void {
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

    if (!invoiceUrl) {
        return (<div className='is-3'>No invoice uploaded</div>)
    }

    return (
        <PDFWrapper>
            {/* Navigation Controls */}
            <PDFControls>
                <button className="button" onClick={goToPrevPage} disabled={pageNumber <= 1}>Prev</button>
                <span>Page {pageNumber} of {numPages || '--'}</span>
                <button className="button" onClick={goToNextPage} disabled={!numPages || pageNumber >= numPages}>Next
                </button>
            </PDFControls>

            {/* PDF Document */}
            {/*don't render if no invoice URL found */}

            <PDFDocumentWrapper>
                <Document file={invoiceUrl} onLoadSuccess={onDocumentLoadSuccess}>
                    <Page pageNumber={pageNumber}/>
                </Document>
            </PDFDocumentWrapper>

        </PDFWrapper>
    );
}

export default ViewInvoicePDF;