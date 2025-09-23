import UploadInvoice from '../Utility/invoice_uploader.tsx';
import {useNavigate} from "react-router-dom";

function InvoiceNew() {
    const navigate = useNavigate();
    const createNewInvoice = async () => {
        console.log('creating a new invoice');
        navigate('/invoice/new');
    }

    return (
        <>
            <div className="container is-fluid m-20">

                <h1 className="title is-size-1 ">Add New Invoice</h1>
                <div className={"card invoice-card"}>
                    <div className={"card-content"}>
                        <h2 className="title is-size-2 has-text-centered">
                            AI Entry
                        </h2>
                        <div className="is-flex is-justify-content-center is-align-items-center">
                            <UploadInvoice></UploadInvoice>
                        </div>

                    </div>
                </div>
                <div className={"card invoice-card"}>
                    <div className={"card-content"}>
                        <div className="title is-size-2 has-text-centered ">

                            Manual Entry
                        </div>

                        <div className="is-flex is-justify-content-center is-align-items-center">
                            <a onClick={createNewInvoice} className="button is-primary">Add New</a>
                        </div>
                    </div>

                </div>

            </div>

        </>

    );
}

export default InvoiceNew;