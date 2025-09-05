import React, {useState} from 'react'; // Import useState
import useFlash from "../../contexts/FlashContext.tsx";
import {deleteElement} from "../../services/commonService.ts";
import {useAuth} from "react-oidc-context";
import ConfirmationModal from "./ConfirmationModal.tsx";

interface DeleteElementProps {
    element_id: number;
    endpoint: string;
    elementName?: string;
    onDelete: () => void;
}

const DeleteElement = ({element_id, endpoint, elementName = 'this item', onDelete}: DeleteElementProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const {showFlashMessage} = useFlash();
    const auth = useAuth();
    const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = React.useState(false);

    const submitDeleteElement = async () => {

        if (!auth.user?.access_token) {
            showFlashMessage('You must be logged in to delete an element', 'danger');
            return;
        }


        setIsLoading(true);

        try {
            await deleteElement(auth.user.access_token, element_id, endpoint);
            //confirm success
            showFlashMessage('Deleted successfully', 'info');
            //close the modal
            setIsDeleteConfirmationModalOpen(false);
            //call the success callback
            setIsLoading(false); // Always set loading back to false
            onDelete();
            return;

        } catch (err) {
            console.error("Error during deletion:", err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            showFlashMessage(`Could not delete item. Error: ${errorMessage}`, 'danger');
            setIsLoading(false);
        }


    };

    const handleClick = async () => {
        setIsDeleteConfirmationModalOpen(true);
    };

    return (
        <>
            <button className="button is-danger" type="button"
                    onClick={isLoading ? undefined : handleClick}
                    style={{pointerEvents: isLoading ? 'none' : 'auto', opacity: isLoading ? 0.5 : 1}}
                    title="Delete"
            >
                <i
                    className={`fa-solid fa-trash-can ${isLoading ? 'is-loading is-warning' : 'is-clickable is-danger'}`}
                ></i>
            </button>

            <ConfirmationModal
                isOpen={isDeleteConfirmationModalOpen}
                title={`Confirm Delete ${elementName.length > 0 ? ` ${elementName}`: 'this item'}`}
                onClose={() => setIsDeleteConfirmationModalOpen(false)}
                onConfirm={submitDeleteElement} children={`Are you sure you want to delete ${elementName}?`}/>
        </>
    );
};

export default DeleteElement;