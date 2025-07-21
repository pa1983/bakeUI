import React from "react";

function InvoiceLineItem({item}) {
return (
    <li key={item.id}>
        <div className="level is-mobile">
            <div className="level-left">
                <div className="level-item has-text-left">
                    <p className="is-size-6">{item.description}</p>
                </div>
            </div>
            <div className="level-right">
                <div className="level-item">
                    <p className="is-size-6 has-text-weight-semibold">
                        {/*todo - addd rest of fields and move to individual line item components*/}
                        £{item.value_inc_vat?.toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    </li>
)

}

export default InvoiceLineItem;