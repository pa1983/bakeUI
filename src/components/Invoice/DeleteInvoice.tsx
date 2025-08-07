import {deleteInvoice} from "../../services/InvoiceServices.ts";
import {useAuth} from "react-oidc-context";
import ConfirmationModal from "../Utility/ConfirmationModal.tsx";
import React from "react";
import useFlash from "../../contexts/FlashContext.tsx";

interface DeleteInvoiceProps {
    invoice_id: number | string;
    onUpdate: () => void;
}

const DeleteInvoice = ({ invoice_id, onUpdate }: DeleteInvoiceProps) => {
    const auth = useAuth();
    const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = React.useState(false);
    const {showFlashMessage} = useFlash();
    // callback function to be passed to the delete invoice confirmation modal - called when confirmation is clicked
    const handleConfirmDelete = async() => {
        const id = parseInt(invoice_id)
        console.log(`click handled to delete invoice ${id}`)
        const res = await deleteInvoice(auth.user.access_token, id);
        console.log(`${res.message}`);
        setIsDeleteConfirmationModalOpen(false);
        showFlashMessage("Invoice Deleted successfully", "success");
        onUpdate();  // callback to update the invoice list data to refresh the list with the deleted invoice removed
    }


    async function handleClick() {
        // delete invoice
        // todo - add a confirmation message here - are you sure?  can this be a generic message used elsewhere?  pass in a component somehow to keep things unified?
        setIsDeleteConfirmationModalOpen(true);
        // todo - handle response status - flash?
        // todo change the delete button to hidden, redirect to invoice list page/refresh page

    }

    return (
    <>
        <i onClick={handleClick} className="fa-solid fa-trash-can fa-2x" title={`Delete Invoice ${invoice_id}`}></i>

        <ConfirmationModal
            isOpen={isDeleteConfirmationModalOpen}
            title="Cofirm Delete Invoice"
            onClose={() => setIsDeleteConfirmationModalOpen(false)}
            onConfirm={handleConfirmDelete}
            >
            Are you sure you want to delete this item?  This action cannot be undone.
        </ConfirmationModal>
        </>
    )
}

export default DeleteInvoice;