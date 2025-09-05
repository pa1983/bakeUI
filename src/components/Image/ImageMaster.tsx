// image master - encapsulate both an image viewer and image uploader
import ImageList from "./ImageList.tsx";
import {useDataFetcher} from "../../hooks/useDataFetcher.ts";
import FileUploader from "..//Utility/FileUploader.tsx"
import {deleteImage} from "../../services/imageService.ts";
import {useAuth} from 'react-oidc-context';
import type {IIngredientImage} from "../../models/IIngredientImage.ts";

interface ImageMasterProps {
    title: string
    getEndpoint: string // endpoint from which to fetch a list of image elements, including filter for a key.  keeping it generic so this component can serve in brands, buyables, ingredients, etc.
    postEndpoint: string
}

const ImageMaster = ({title, getEndpoint, postEndpoint}: ImageMasterProps) => {

    const auth = useAuth();

    // Guard the fetch call. Only provide the endpoint URL if the user is authenticated.
    const {
        data: images,
        loading,
        error,
        refetch,
    } = useDataFetcher<IIngredientImage>(auth.isAuthenticated ? getEndpoint : null);

    // It's good practice to define the delete handler outside the JSX.
    // This function will call the service and then refetch the data on success.
    const handleDeleteImage = (imageLinkId: number) => {
        if (!auth.user?.access_token) {
            console.error("Cannot delete image: user is not authenticated.");
            return;
        }

        deleteImage(imageLinkId, auth.user.access_token)
            .then(() => {
                console.log(`Successfully deleted image link ${imageLinkId}. Refetching list.`);
                // Refetch the list to show the change immediately
                refetch();
            })
            .catch(err => {
                console.error(`Failed to delete image link ${imageLinkId}:`, err);
                // todo -  set an error state here to show a message in the UI
            });
    };

    if (auth.isLoading) {
        return <p>Authenticating...</p>;
    }

    return (
        <>
            <h1 className="title is-h2">{title}</h1>
            <h2 className="subtitle">Double click thumbnails to delete</h2>

            {/* Only show the uploader and image list if the user is authenticated */}
            {auth.isAuthenticated ? (
                <>
                    <FileUploader
                        PostUrl={postEndpoint}
                        instructionText={"Drop image here to upload"}
                        onSuccess={refetch}
                    />
                    {loading && <p>Loading images...</p>}
                    {error && <p>Error loading images: {error}</p>}
                    {images && (
                        <ImageList
                            imageLinks={images}
                            deleteImage={handleDeleteImage} // Pass the new handler function
                        />
                    )}
                </>
            ) : (
                <p>Please log in to manage images.</p>
            )}
        </>
    )
}

export default ImageMaster;
