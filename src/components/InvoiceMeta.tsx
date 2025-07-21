// display form containing all the invoice's meta data

function InvoiceMeta({invoice_details}: {invoice_details: any}) {

    return (
        <div className="container">
        <form>
            <div className="form-content">
                {/* Hidden ID field */}
                <input type="hidden" name="id" value={invoice_details.id} />

                <div className="columns is-multiline">
                    {/* Received Date */}
                    <div className="column is-half">
                        <div className="field">
                            <label className="label">Received Date</label>
                            <div className="control">
                                {/* The date input expects a 'YYYY-MM-DD' format. You may need to format the incoming string. */}
                                <input
                                    className="input"
                                    type="date"
                                    name="received_date"
                                    value={invoice_details.received_date ? new Date(invoice_details.received_date).toISOString().split('T')[0] : ''}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Invoice Status */}
                    <div className="column is-half">
                        <div className="field">
                            <label className="label">Status</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    {/* Assuming you have a list of statuses to map over */}
                                    <select name="invoice_status" value={invoice_details.invoice_status?.name || ''}>
                                        <option value="processing">Processing</option>
                                        <option value="approved">Approved</option>
                                        <option value="paid">Paid</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Organisation (Read-only) */}
                    <div className="column is-full">
                        <div className="field">
                            <label className="label">Organisation</label>
                            <div className="control">
                                <p className="is-size-5 has-text-grey-dark">
                                    {invoice_details.organisation?.organisation_name || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="column is-full">
                        <div className="field">
                            <label className="label">Notes</label>
                            <div className="control">
                        <textarea
                            className="textarea"
                            name="notes"
                            rows="7"
                            placeholder="Add any relevant notes here..."
                            value={invoice_details.notes || ''}
                        ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Non-editable meta-data */}
            <div className="content is-small has-text-grey mt-auto pt-4" style={{borderTop: '1px solid #dbdbdb'}}>
                <p className="mb-1">
                    <strong>Date Added:</strong> {invoice_details.date_added ? new Date(invoice_details.date_added).toLocaleString() : 'N/A'}
                </p>
                <p className="mb-1">
                    <strong>Last Modified:</strong> {invoice_details.date_modified ? new Date(invoice_details.date_modified).toLocaleString() : 'N/A'}
                </p>
                <p>
                    <strong>Parse Duration:</strong> {invoice_details.parse_duration_ms}ms | <strong>AI Tokens:</strong> {invoice_details.parse_ai_tokens}
                </p>
            </div>
        </form>
        </div>

    )
}

export default InvoiceMeta;