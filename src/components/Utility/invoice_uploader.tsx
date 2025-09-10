import {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import axios, {type AxiosResponse} from "axios";
import {useAuth} from "react-oidc-context";
import config from '../../../src/services/api.ts';
import useFlash from '../../contexts/FlashContext.tsx';
import {useNavigate} from "react-router-dom";

// todo - move this to services.invoice to keep the component tidy
// todo - refactor UploadInvoice to use the generic FIleUploader function - just need to refactor callbacks and titles
function UploadInvoice() {
    const auth = useAuth();
    const {showFlashMessage} = useFlash();
    const navigate = useNavigate();
    const uploadInvoiceFile = useCallback(async (file: File) => {

        if (!auth.user?.access_token) {
            showFlashMessage("Authentication token not available. Please log in.", 'danger');
            return false;
        }
        console.log('uploading invoice...');
        const formData = new FormData();
        formData.append('file', file);

        try {
            const headers = {
                Authorization: `Bearer ${auth.user.access_token}`,
                'Content-Type': 'multipart/form-data',
            };
            const url = `${config.API_URL}/invoice`;
            console.log(`posting invoice to ${url}`);
            const res: AxiosResponse = await axios.post(url, formData, {headers});
            console.log(res.data);
            return res;

        } catch (err) {
            console.error(err);
            showFlashMessage("File upload failed", 'danger');
            return false;
        }

    }, [auth.user?.access_token, showFlashMessage]);


    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Do something with the files  todo - add call to POST file

        if (acceptedFiles.length > 0) {
            // axios post file - same logic as ingredient image uploader
            uploadInvoiceFile(acceptedFiles[0])
                .then((response) => {
                        console.log(response);  // todo - handle the response and use to flash a success message etc
                    // todo - validate the response against the invoice model
                        if (response) {
                            const invoice_id: number = response.data.data.id;
                            console.log(`invoice id ${invoice_id} created `);
                            showFlashMessage('Invoice uploaded successfully', 'info');
                            navigate(`/invoice/${invoice_id}`);
                        } else {
                            showFlashMessage('Invoice upload failed', 'danger');
                        }
                    }
                ).catch(error => {
                console.error("Upload promise rejected:", error);
                showFlashMessage('Invoice upload failed', 'danger');
            });
            ;  // acceptedFiles returns a list - only uploading the first.  todo - set restrictions in invoice upload for file type, qty and size
        }

    }, [uploadInvoiceFile]);  // list uploadInvoiceFile as a dependency of onDrop

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (

        <div className="file is-boxed">
            <label className="file-label">
                <span className="file-cta">
      <span className="file-icon">
        <i className="fas fa-upload"></i>
      </span>
                <div {...getRootProps()}>
                        <input {...getInputProps()} />
                    {
                        isDragActive ?
                            <p>Drop to upload!</p> :
                            <p>Drag file here here ...</p>
                    }
                    </div>
                    <span className="file-label"> Drop an invoice here to let AI input it for you </span>
        </span>
            </label>
        </div>

    )
}

export default UploadInvoice;