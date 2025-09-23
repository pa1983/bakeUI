import {useEffect, useState, useCallback} from 'react';
import {fetchInvoices} from "../../services/InvoiceServices.ts";
import type {InvoiceListResponse} from "../../models/invoice.ts";
import {useAuth} from "react-oidc-context";
import InvoiceListElementCard from "./InvoiceListItem.tsx";

function InvoiceList() {
    const auth = useAuth();
    const [invoices, setInvoices] = useState<InvoiceListResponse[]>([]);
    const [refreshContextData, setRefreshContextData] = useState(1);
    // const {showFlashMessage} = useFlash();
    // const navigate = useNavigate();


    useEffect(() => {

        const loadInvoices = async () => {
            try {
                // check user is signed in
                if (auth.user?.access_token) {
                    const invoiceList = await fetchInvoices(auth.user.access_token);
                    setInvoices(invoiceList || []);
                }
            } catch (err) {
                console.error("Failed to fetch invoices: ", err);
            }


        }

        loadInvoices();
    }, [auth.user?.access_token, refreshContextData])

    const triggerInvoiceReload = useCallback(() => {
        console.log('triggering an invoice list reload');
        setRefreshContextData(prev => prev + 1);
    }, []);

    return (
        <>
            <div className="container is-fluid m-20">

                <h1 className="title">All Invoices</h1>
                {/*<a onClick={createNewInvoice} className="button is-primary">Add New</a>*/}

                    {invoices.map(invoice => (
                        <InvoiceListElementCard
                            invoice={invoice}
                            key={invoice.id}
                            onUpdate={triggerInvoiceReload}  // increment the RefreshContextData state value to trigger a reload of the invoice list from the API
                        />

                    ))}
                {/*</div>*/}

            </div>
        </>

    );
}

export default InvoiceList;