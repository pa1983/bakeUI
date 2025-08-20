import {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import axios, {type AxiosResponse} from "axios";
import {useAuth} from "react-oidc-context";
import config from "../../services/api";

interface FileUploaderProps {
    PostUrl: string
    instructionText: string
    onSuccess: () => void

}

function FileUploader({
                          PostUrl,
                          instructionText = 'Drop file to upload',
                          onSuccess = () => { console.log("Default onSuccess handler triggered."); }
                      }: FileUploaderProps) {

    const [error, setError] = useState<string | null>(null);
    const auth = useAuth();

    const uploadFile = useCallback(async (file: File) => {
        if (!auth.user?.access_token) {
            setError("Authentication token not available. Please log in.");
            return;
        }

        // Reset error on new upload attempt
        setError(null);
        console.log(`uploading ${file.name} to ${PostUrl} ...`);

        const formData = new FormData();
        formData.append('file', file);

        try {
            // BEST PRACTICE: Let Axios set the 'Content-Type' with the correct boundary for FormData.
            const headers = {
                Authorization: `Bearer ${auth.user.access_token}`,
            };
            const url = `${config.API_URL}${PostUrl}`;
            const res: AxiosResponse = await axios.post(url, formData, {headers});

            console.log(res.data);
            onSuccess();
            return res;

        } catch (err: any) {
            console.error(err);
            // Provide more specific feedback if the server sends an error message
            setError(err.response?.data?.message || "File upload failed");
        }

    }, [auth, PostUrl, onSuccess]); // Added dependencies


    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            uploadFile(acceptedFiles[0]);
        }
    }, [uploadFile]);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (
        <>
            <div className="file is-boxed">
                <label className="file-label">
                    <span className="file-cta">
                        <span className="file-icon">
                            <i className="fas fa-upload"></i>
                        </span>
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            {/* This div prevents the layout shift.
                              By setting a min-height and using flexbox to center the content,
                              the container's size remains constant when the text inside changes.
                            */}
                            <div className="dropzone">
                                {isDragActive ?
                                    "Drop to upload!" :
                                    instructionText
                                }
                            </div>
                        </div>
                    </span>
                </label>
            </div>
            {/* Display any upload error to the user */}
            {error && <p className="help is-danger mt-2">{error}</p>}
        </>
    )
}

export default FileUploader;
