import {useMemo, useEffect, useState, memo} from "react";
import {useAuth} from "react-oidc-context";
import {useParams} from "react-router-dom";
import {getInvoiceFull} from "../../services/InvoiceServices.ts";
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
    const {invoice_id: rawInvoiceId} = useParams<{ invoice_id: string }>();

    //  invoice ID should be a number, but useParams produces a string.  Convert to a number or null in order
    // to use invoice_id where a number is expected, e.g. in api calls, etc.
    const invoice_id = useMemo(() => {
        if (!rawInvoiceId) {
            return null; // Handle the case where the param is missing
        }
        const num = parseInt(rawInvoiceId, 10);
        return isNaN(num) ? null : num;
    }, [rawInvoiceId]);

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
            if (!auth.user?.access_token) {
                showFlashMessage('You must be logged in to delete an element', 'danger');
                return;
            }


            try {
                setLoading(true);

                const fetchedInvoice = await getInvoiceFull(auth.user.access_token, invoice_id);
                setInvoice(fetchedInvoice);

                setError(null);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch invoice data.");
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
    }, [invoice_id, auth, showFlashMessage]);

    if (loading) {
        return (<div>
            <LoadingSpinner
                size='is-large'
                text='Loading invoice...'
            />
        </div>)
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!invoice) {
        return <div>No invoice data found.</div>;
    }

    // const moreInfo = (event) => {
    // // when element is clicked for more info, display a modal containing the description text.
    //     // todo - build the modal and include in all forms to allow use of moreInfo function.  Maybe get working from hover rather than click?
    //
    //     const description: string = event.currentTarget.title;
    //     console.log(description);
    //     showAlert(description);
    // }

    // Now, render the properties of the invoice object
    return (
        <>
            {/*todo - try alternative styling to hero class - it seems to be throwing out the zindex layering and causing this form to appear over the top of the flash messages*/}
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


                            <div className="column">

                                <div className="box mb-4">
                                    Actions
                                    <StatusIcon status={invoice.invoice_status || undefined}
                                                id={invoice.id}/>
                                    {/*<DeleteInvoice invoice_id={invoice.id}/>*/}
                                    {/*// todo - implement the delete*/}
                                    {/*shortcut here think I have a generic delete button ready to go...*/}
                                </div>

                                <div className="box  mb-4">
                                    <h2 className="title is-5 has-text-grey-light">Details <MoreInfo
                                        message="check the details below match the invoice, correct as necessary. No need to save."/>
                                    </h2>

                                    <div className="content">
                                        <InvoiceMeta
                                            initialFormDetails={invoice}/>
                                    </div>
                                </div>


                                <div className="box ">
                                    <h2 className="title is-5 has-text-grey-light">Line Items <MoreInfo
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