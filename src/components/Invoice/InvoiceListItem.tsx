import React from "react";
import type {InvoiceListResponse} from "../../models/invoice.ts";
import StatusIcon from "./statusIcon.tsx";  // model interface for invoice list item
import FriendlyDate from "../Utility/FriendlyDate.tsx";
import DeleteInvoice from "./DeleteInvoice.tsx";
const InvoiceListElementCard = ({invoice}: InvoiceListResponse) => {


    return (
        <div className="card">
            <div className="card-header">
                <h1 className="title">Invoice {invoice.id}</h1>
            </div>


            <div className="card-content">

                {/*table structure start */}


                <div className="columns">
                    <div className="column">
                        <div className="columns">

                            <div className="column is-6">
                                <h1 className="title is-size-4">Supplier {invoice.supplier_name ? invoice.supplier_name : "name not found"} </h1>
                            </div>
                            <div className="column is-6">
                                <h1 className="title is-size-4"> Invoice
                                    Number {invoice.invoice_number ? invoice.invoice_number : "not found"}</h1>
                            </div>

                        </div>
                        <div className="columns is-mobile">
                            <div className="column is-6">
                                Added: <FriendlyDate date={invoice.date_added}
                                                     classname="is-size-8 has-text-grey"/>
                            </div>
                            <div className="column is-6">
                                Modified: <FriendlyDate date={invoice.date_modified}
                                                        classname="is-size-8 has-text-grey"/>
                            </div>

                        </div>
                    </div>
                </div>

                {/*    table structure end  */}

            </div>


            <div className="card-footer">
                <div className="card-footer-item">
                    <a href={`/invoice/${invoice.id}`}> <i className="fa-solid fa-pen-to-square fa-2x"/></a>
                </div>


                <div className="card-footer-item">
                    <DeleteInvoice invoice_id={parseInt(invoice.id,10)}/>
                </div>
                <div className="card-footer-item">
                    <i className="fa-solid fa-file-pdf fa-2x"/>
                </div>
                <div className="card-footer-item">
                    <StatusIcon status={invoice.status}
                    id={invoice.id}/>
                </div>
            </div>

        </div>


    )
}

export default InvoiceListElementCard;