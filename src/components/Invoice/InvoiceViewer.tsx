import {useEffect, useState} from "react";
import {useAuth} from "react-oidc-context";
import {useParams} from "react-router-dom";
import {getInvoiceFull} from "../../services/InvoiceServices.ts";
// I noticed you previously asked for this interface, so let's use it!
import {type InvoiceRead} from "../../models/invoice.ts";
import InvoiceMeta from "./InvoiceMeta.tsx";
import ViewInvoicePDF from "./viewInvoicePDF.tsx"; // Adjust the path as needed
import InvoiceLineItemsList from "./InvoiceLineItemsList.tsx";
import StatusIcon from "./statusIcon.tsx";
import DeleteInvoice from "./DeleteInvoice.tsx";
import useFlash from "../../contexts/FlashContext.tsx";
import MoreInfo from "../Home/MoreInfo.tsx";

function InvoiceViewer() {
    const {showFlashMessage} = useFlash();
    const auth = useAuth();
    const {invoice_id} = useParams<{ invoice_id: string }>();

    // Use the specific InvoiceRead type for better type safety
    const [invoice, setInvoice] = useState<InvoiceRead | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {

        if (!invoice_id || !auth.user?.access_token) {
            setLoading(false);
            setError("Authentication token or Invoice ID is missing.");
            return;
        }

        const fetchInvoice = async () => {
            try {
                setLoading(true);
                const fetchedInvoice = await getInvoiceFull(auth.user.access_token, invoice_id);
                setInvoice(fetchedInvoice.data);

                // Important: Log the fetched data directly, not the state variable,
                // as `setInvoice` is async and won't be updated immediately.
                showFlashMessage(`Got invoice details from API: ID ${fetchedInvoice.id}`, 'success')
                console.log(`Got invoice details from API: ID ${fetchedInvoice.id}`);
                console.log(fetchedInvoice);

                setError(null);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch invoice data.");
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
    }, [invoice_id, auth.user?.access_token]);

    // --- Corrected Return Block ---

    if (loading) {
        return <div>Loading invoice...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!invoice) {
        return <div>No invoice data found.</div>;
    }

    const moreInfo = (event) => {
    // when element is clicked for more info, display a modal containing the description text.
        // todo - build the modal and include in all forms to allow use of moreInfo function.  Maybe get working from hover rather than click?

        const description: string = event.currentTarget.title;
        console.log(description);
        showAlert(description);
    }

    // Now, render the properties of the invoice object
    return (
<>
        <section className="hero is-fullheight is-light">
            <div className="hero-body">
                <div className="container is-fluid">
                    <div className="columns">

                        {/*pdf on left col */}
                        <div className="column is-half full-height-content">
                            <div className="box">
                                <h1 className="title is-4 has-text-grey-light">Invoice Viewer for {invoice.id}</h1>
                                <p className="subtitle is-6 has-text-grey">{invoice.invoice_image?.file_name}.{invoice.invoice_image?.file_ext}</p>
                                <div className="content">
                                    <ViewInvoicePDF invoice_id={invoice.id}/>
                                </div>
                            </div>
                            <div className="box"></div>
                        </div>


                        {/*INVOICE COLUMN:*/}
                        {/*- This column takes up the remaining 50% of the width.*/}
                        {/*- It contains two separate 'box' elements. As block-level elements, they will*/}
                        {/*  stack on top of each other, creating the appearance of two rows.*/}
                        {/*- Their height will adjust automatically to fit their content.*/}

                        <div className="column">

                            <div className="box mb-4">
                                Actions
                                <StatusIcon status={invoice.invoice_status}
                                            id={invoice.id}/>
                                {/*<DeleteInvoice invoice_id={invoice.id}/>*/}
                            </div>

                            <div className="box  mb-4">
                                <h2 className="title is-5 has-text-grey-light">Details     <MoreInfo message="check the details below match the invoice, correct as necessary. No need to save."/></h2>

                                <div className="content">
                                    <InvoiceMeta
                                    invoice_details={invoice}/>
                                </div>
                            </div>


                            <div className="box ">
                                <h2 className="title is-5 has-text-grey-light">Line Items <MoreInfo message="Check content of each line item matches invoice. Correct as required. Make sure each line item matches a buyable item."/></h2>
                                <div className="content">
                                    {invoice.line_items[0]?.description}
                                    <InvoiceLineItemsList
                                    line_items={invoice.line_items}/>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
        <div>
            // --- Basic Invoice Details ---<br />
            ID: ${invoice?.id}<br />
            Invoice Number: ${invoice?.invoice_number}<br />
            Supplier Name: ${invoice?.supplier_name}<br />
            Supplier ID: ${invoice?.supplier_id}<br />
            Customer Account Number: ${invoice?.customer_account_number}<br />
            User Reference: ${invoice?.user_reference}<br />
            Supplier Reference: ${invoice?.supplier_reference}<br />
            <br />
            // --- Financials ---<br />
            Invoice Total: ${invoice?.invoice_total}<br />
            Calculated Total: ${invoice?.calculated_total}<br />
            Delivery Cost: ${invoice?.delivery_cost}<br />
            Currency: ${invoice?.parsed_currency}<br />
            <br />
            // --- Dates ---<br />
            Invoice Date: ${invoice?.invoice_date}<br />
            Date Added: ${invoice?.date_added}<br />
            Date Modified: ${invoice?.date_modified}<br />
            Received Date: ${invoice?.received_date}<br />
            <br />
            // --- Parsing & Status ---<br />
            Document Type: ${invoice?.document_type}<br />
            Confidence Score: ${invoice?.confidence_score}<br />
            Parse Duration (ms): ${invoice?.parse_duration_ms}<br />
            Parse AI Tokens: ${invoice?.parse_ai_tokens}<br />
            Status: invoice?.invoice_status?.name({invoice?.invoice_status?.display_name})<br />
            Notes: ${invoice?.notes}<br />
            <br />
            // --- Linked Objects ---<br />
            Organisation Name: ${invoice?.organisation?.organisation_name}<br />
            Image ID: ${invoice?.invoice_image?.image_id}<br />
            Image S3 Key: ${invoice?.invoice_image?.s3_key}<br />
            <br />
            // --- Line Items ---<br />
            Line Items Count: ${invoice?.line_items?.length}<br />
        </div>
    </>
    );
}

export default InvoiceViewer;