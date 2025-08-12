import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import axios, {type AxiosResponse} from "axios";
import {useAuth} from "react-oidc-context";

// todo - move this to services.invoice to keep the component tidy
// todo - refactor UploadInvoice to use the generic FIleUploader function - just need to refactor callbacks and titles
function UploadInvoice() {
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth();

    const uploadInvoiceFile = useCallback(async (file: File) => {

        if (!auth.user?.access_token) {
            setError("Authentication token not available. Please log in.");
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
            const res: AxiosResponse = await axios.post('http://localhost:8000/invoice', formData, {headers});
            console.log(res.data);
            setError(null);
            return res;

        } catch (err) {
            console.error(err);
            setError("Invoice upload failed");
        }

    }, [auth]);


    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Do something with the files  todo - add call to POST file

        if (acceptedFiles.length > 0) {
            // axios post file - same logic as ingredient image uploader
            uploadInvoiceFile(acceptedFiles[0])
                .then((response) => {
                    console.log(response);  // todo - handle the response and use to flash a success message etc
                })
            ;  // acceptedFiles returns a list - only uploading the first.  todo - set restrictions in invoice upload for file type, qty and size
        }

    }, [uploadInvoiceFile]);  // list uploadInvoiceFile as a dependancy of onDrop

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