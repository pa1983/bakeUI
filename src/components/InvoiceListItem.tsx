import React from "react";
import type {InvoiceListResponse} from "../models/invoice.ts";
import StatusIcon from "./statusIcon.tsx";  // model interface for invoice list item
import FriendlyDate from "./friendlyDate.tsx";

const InvoiceListElementCard = ({invoice}: InvoiceListResponse) => {


    return (
        <div className="card">
            <div className="card-header">
                <div className="columns">
                    <div className="column is-6 title">
                {invoice.supplier_name ? invoice.supplier_name : "Supplier name not found"}
                    </div>
                    <div className="column is-6 title">
                {invoice.invoice_number? invoice.invoice_number : "Invoice number not found"}
                    </div>
                </div>

            </div>



            <div className="card-content">
                <div className="content">
                    {invoice.id} -- {invoice.date_added} - {invoice.supplier_name}
                    {invoice.status.name}
                    {invoice.image?.file_name}{invoice.image?.file_ext}
                    <StatusIcon status={invoice.status.name}/>
                </div>

                <span className="card-footer-item">Added: <FriendlyDate date={invoice.date_added}
                                                                        classname="is-size-8 has-text-grey"/>
                    </span>
                                    <span className="card-footer-item">
                    Modified: <FriendlyDate date={invoice.date_modified} classname="is-size-8 has-text-grey"/>
                    </span>


            </div>
            <div className="card-footer">
                <button>Edit</button>


            <button>Delete</button>
        </div>
</div>


)
}

export default InvoiceListElementCard;