import {useMemo, useEffect, useState, memo} from "react";
import {useAuth} from "react-oidc-context";
import DeleteInvoice from "./DeleteInvoice.tsx";
import {useParams, useNavigate} from "react-router-dom";
import {createInvoice, getInvoiceFull} from "../../services/InvoiceServices.ts";
import {type InvoiceRead} from "../../models/invoice.ts";
import InvoiceMeta from "./InvoiceMeta.tsx";
import ViewInvoicePDF from "./viewInvoicePDF.tsx";
import InvoiceLineItemsList from "./InvoiceLineItemsList.tsx";
import StatusIcon from "./statusIcon.tsx";
import useFlash from "../../contexts/FlashContext.tsx";
import MoreInfo from "../Home/MoreInfo.tsx";
import LoadingSpinner from "../Utility/LoadingSpinner.tsx";

function InvoiceViewer() {
    const {showFlashMessage} = useFlash();
    const auth = useAuth();
    const navigate = useNavigate();
    const {invoice_id: rawInvoiceId} = useParams<{ invoice_id: string }>();

    // This useMemo is still useful for the fetch logic
    const invoice_id = useMemo(() => {
        if (!rawInvoiceId || rawInvoiceId === 'new') {
            return null;
        }
        const num = parseInt(rawInvoiceId, 10);
        return isNaN(num) ? null : num;
    }, [rawInvoiceId]);

    const [invoice, setInvoice] = useState<InvoiceRead | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const handleCreateInvoice = async () => {
            if (!auth.user?.access_token) {
                showFlashMessage('You must be logged in to create an invoice', 'danger');
                setError("Authentication token is missing.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const newInvoice = await createInvoice(auth.user.access_token);
                setInvoice(newInvoice);
                showFlashMessage('New invoice created successfully!', 'info');
                // CHANGE 3: Replace the URL with the new invoice's ID
                if (newInvoice && newInvoice.id) {

                    navigate(`/invoice/${newInvoice.id}`, {replace: true});
                }
            } catch (err) {
                console.error("Failed to create invoice:", err);
                setError("Failed to create a new invoice.");
                showFlashMessage("Failed to create a new invoice.", "danger");
            } finally {
                setLoading(false);
            }
        };

        const fetchInvoice = async () => {
            if (!invoice_id || !auth.user?.access_token) {
                setError("Authentication token or Invoice ID is invalid.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const fetchedInvoice = await getInvoiceFull(auth.user.access_token, invoice_id);
                setInvoice(fetchedInvoice);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch invoice:", err);
                setError("Failed to fetch invoice data.");
            } finally {
                setLoading(false);
            }
        };

        // CHANGE 4: The main logic router
        if (rawInvoiceId === 'new') {
            handleCreateInvoice();
        } else if (invoice_id) {
            fetchInvoice();
        } else {
            // Handle cases where the ID is neither 'new' nor a valid number
            setError("Invalid Invoice ID provided.");
            setLoading(false);
        }

    }, [rawInvoiceId, auth.user?.access_token, navigate, showFlashMessage]); // Dependencies updated

    if (loading) {
        return (
            <div>
                <LoadingSpinner
                    size='is-large'
                    text={rawInvoiceId === 'new' ? 'Creating new invoice...' : 'Loading invoice...'}
                />
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!invoice) {
        return <div>No invoice data found.</div>;
    }

    return (
        <>
            {/*todo - try alternative styling to hero class - it seems to be throwing out the zindex layering and causing this form to appear over the top of the flash messages*/}
            <section className="hero is-fullheight is-light">
                <div className="hero-body">
                    <div className="container is-fluid">
                        <div className="columns">

                            {/* pdf on left col */}
                            {invoice.invoice_image && (
                                <div className="column is-half full-height-content is-sticky-desktop" >
                                    <div className="box">
                                        <h1 className="title is-4">Invoice Viewer
                                            for {invoice.id}</h1>
                                        <p className="subtitle is-6 bake-subtitle-subtle">
                                            {invoice.invoice_image.file_name}.{invoice.invoice_image.file_ext}
                                        </p>
                                        <div className="content">
                                            <ViewInvoicePDF invoice_id={invoice.id}/>
                                        </div>
                                    </div>
                                    <div className="box"></div>
                                </div>
                            )}


                            <div className="column">

                                <div className="box mb-4">
                                    Actions
                                    <div className="columns">
                                        <div className="column">
                                            <StatusIcon status={invoice.invoice_status || undefined}
                                                        id={invoice.id}/>
                                        </div>
                                        <div className="column">
                                            <DeleteInvoice invoice_id={invoice.id}
                                                           onUpdate={() => navigate('/invoice/invoices')}

                                            />
                                        </div>
                                    </div>


                                </div>

                                <div className="box  mb-4">
                                    <h2 className="title is-5 ">Details <MoreInfo
                                        message="check the details below match the invoice, correct as necessary. No need to save."/>
                                    </h2>

                                    <div className="content">
                                        <InvoiceMeta
                                            initialFormDetails={invoice}/>
                                    </div>
                                </div>


                                <div className="box ">
                                    <h2 className="title is-5 ">Line Items <MoreInfo
                                        message="Check content of each line item matches invoice. Correct as required. Make sure each line item matches a buyable item."/>
                                    </h2>
                                    <div className="content">
                                        <InvoiceLineItemsList
                                            invoice_id={invoice.id}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

// export as memo to fix re-rendering of whole invoice viewer on every change to lineitems
export default memo(InvoiceViewer);