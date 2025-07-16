import React, {useEffect, useState} from 'react';
import UploadInvoice from './file_uploader.tsx';
import {fetchInvoices} from "../services/InvoiceServices.ts";
import type {InvoiceListResponse} from "../models/invoice.ts";
import {useAuth} from "react-oidc-context";
import InvoiceListElementCard from "./InvoiceListItem.tsx";

function InvoiceList() {
    const auth = useAuth();
    const [invoices, setInvoices] = useState<InvoiceListResponse[]>([]);


    useEffect(() => {

        const loadInvoices = async () => {
            try {
                // check user is signed in
                if (auth.user?.access_token) {
                    const invoiceList = await fetchInvoices(auth.user.access_token);
                    setInvoices(invoiceList);
                }
            } catch (err) {
                console.error("Failed to fetch invoices: ", err);
            }


        }

        loadInvoices();
    }, [auth.user?.access_token])


    return (
        <>
            dropzone here
            <UploadInvoice></UploadInvoice>

            <div className="container">
                <h1 className="title">Invoices</h1>
                <h2>Invoices</h2>


                {invoices.map(invoice => (
                    <InvoiceListElementCard
                        invoice={invoice}
                        key={invoice.id}
                    />

                ))}


            </div>
        </>

    );
}

export default InvoiceList;