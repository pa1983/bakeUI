import {useEffect, useState, useCallback} from 'react';
import UploadInvoice from '../Utility/invoice_uploader.tsx';
import {fetchInvoices} from "../../services/InvoiceServices.ts";
import type {InvoiceListResponse, InvoiceRead} from "../../models/invoice.ts";
import {useAuth} from "react-oidc-context";
import InvoiceListElementCard from "./InvoiceListItem.tsx";
import axios from "axios";
import useFlash from "../../contexts/FlashContext.tsx";
import config from "../../services/api.ts";
import {useNavigate} from "react-router-dom";
import type {ApiResponse} from "../../models/api.ts";

function InvoiceList() {
    const auth = useAuth();
    const [invoices, setInvoices] = useState<InvoiceListResponse[]>([]);
    const [refreshContextData, setRefreshContextData] = useState(1);
    const {showFlashMessage} = useFlash();
    const navigate = useNavigate();


    const createNewInvoice = async () => {
        // guard clause - check user logged in before proceeding
        if (!auth.user?.access_token) {
            showFlashMessage('You must be logged in to create an invoice', 'danger');
            return; // Exit the function early.
        }

        try {
            const response = await axios.get<ApiResponse<InvoiceRead>>(`${config.API_URL}/invoice/new`, {
                headers: {
                    'Authorization': `Bearer ${auth.user?.access_token}`
                }
            });

            console.log(response);

            if (!response.data.data) {
             // no invoice was created
                showFlashMessage('Failed to create new invoice', 'danger');
                return;
            } else {
                // navigate to the new blank invoice so user can populate manually
                navigate(`/invoice/${response.data.data.id}`)

            }
        } catch (error) {
            console.log(error);
        }

    }

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
            <UploadInvoice></UploadInvoice>

            <div className="container is-fluid">

                <h1 className="title">Invoices</h1>
                <a onClick={createNewInvoice} className="button is-primary">Add New</a>

                <div className="columns is-multiline pd-5">
                    {invoices.map(invoice => (
                        <InvoiceListElementCard
                            invoice={invoice}
                            key={invoice.id}
                            onUpdate={triggerInvoiceReload}  // increment the RefreshContextData state to trigger a reload of the invoice list from the API
                        />

                    ))}
                </div>

            </div>
        </>

    );
}

export default InvoiceList;