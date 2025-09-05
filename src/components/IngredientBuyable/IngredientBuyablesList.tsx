import {useMemo, useCallback, useState} from "react"; // Import useState
import {useDataFetcher} from "../../hooks/useDataFetcher.ts";
import {useData} from "../../contexts/DataContext.tsx";
import {useAuth} from "react-oidc-context"; // Import useAuth
import type {IIngredientBuyable} from "../../models/IIngredient_Buyable.ts";

import Picker from "../Picker/Picker";
import {deleteIngredientBuyableLink, postNewIngredientBuyableLink} from "../../services/ingredientBuyableService.ts";
import useFlash from "../../contexts/FlashContext.tsx";
import LoadingSpinner from "../Utility/LoadingSpinner.tsx";
import ConfirmationModal from "../Utility/ConfirmationModal.tsx";

interface IngredientBuyablesListProps {
    ingredient_id: number;
}

const IngredientBuyablesList = ({ingredient_id}: IngredientBuyablesListProps) => {
    const {PickerBuyableArray} = useData();
    const auth = useAuth();
    const {showFlashMessage} = useFlash();

    const [showBuyablePicker, setShowBuyablePicker] = useState(false);
    const [itemToUnlink, setItemToUnlink] = useState<number | null>(null);
    // Fetch the array of link objects for this specific ingredient
    const {
        data: links,
        loading,
        error,
        refetch,
    } = useDataFetcher<IIngredientBuyable>(`/ingredient/link_buyable/all?ingredient_id=${ingredient_id}`);
    console.log("ingredient links pulled: ");
    console.log(links);
    // Memoize the lists of linked and unlinked buyables for performance
    const {linkedBuyables, unlinkedBuyables} = useMemo(() => {
        if (!links) return {linkedBuyables: [], unlinkedBuyables: PickerBuyableArray};

        const linkedBuyableIds = new Set(links.map(link => link.buyable_id));

        const linked = PickerBuyableArray.filter(buyable => linkedBuyableIds.has(buyable.id));
        const unlinked = PickerBuyableArray.filter(buyable => !linkedBuyableIds.has(buyable.id));

        return {linkedBuyables: linked, unlinkedBuyables: unlinked};
    }, [links, PickerBuyableArray]);


    // --- Callbacks for specific actions ---

    // 1. Callback for when an item in the UNLINKED picker is selected
    const handleCreateLink = useCallback(async (id: number) => {
        console.log(`handleCreateLink called with id: ${id}`);
        if (!auth.user?.access_token) {
            console.error("Authentication token not found.");
            showFlashMessage("You must be logged in to link items.", "danger");
            return;
        }

        try {
            //  Note passing in null values for sort_order and notes to avoid errors on create new in FastAPI
            const newLink: IIngredientBuyable = {
                ingredient_id: ingredient_id,
                buyable_id: id,
            };

            await postNewIngredientBuyableLink(newLink, auth.user.access_token);
            showFlashMessage("Buyable Item Linked", "success");
            // On success, hide the picker and refetch the data to update the list
            setShowBuyablePicker(false);
            if (refetch) {
                refetch();
            }
        } catch (err) {
            console.error("Failed to create link:", err);
            showFlashMessage('Failed to create buyable item link', 'danger');
        }
    }, [auth.user?.access_token, ingredient_id, refetch]);

    // 2. Callback for when an ALREADY LINKED item is clicked
    const handleUnlinkBuyable = useCallback(async (buyableIdToUnlink: number) => {
        if (!auth.user?.access_token || !links) {
            showFlashMessage("Cannot perform action: data not ready.", "danger");
            return;
        }

        const linkToDelete = links.find(link => link.buyable_id === buyableIdToUnlink);
        if (!linkToDelete || !linkToDelete.id) {
            showFlashMessage("Could not find the link to delete.", "danger");
            return;
        }
        try {
            await deleteIngredientBuyableLink(linkToDelete.id, auth.user.access_token);
            showFlashMessage("Buyable Item Unlinked", "success");
            if (refetch) refetch();
        } catch (err) {
            console.error("Failed to unlink item:", err);
            const message = err instanceof Error ? err.message : "Failed to unlink item.";
            showFlashMessage(message, "danger");        }
    }, [auth.user?.access_token, refetch, showFlashMessage, links]);

    const handleUnlinkClick = (id: number) => {
        setItemToUnlink(id);
    };

    const confirmUnlink = async () => {
        if (itemToUnlink !== null) {
            await handleUnlinkBuyable(itemToUnlink);
        }
        setItemToUnlink(null); // Close the modal
    };

    const safeSelectHandler = (id: string | number, action: (id: number) => void) => {
        const numericId = typeof id === 'number' ? id : parseInt(String(id), 10);
        if (!isNaN(numericId)) {
            action(numericId);
        } else {
            console.error("Invalid ID provided from picker:", id);
            showFlashMessage("An invalid item was selected.", "danger");
        }
    };

    if (loading) return <LoadingSpinner text="Loading linked items..."/>;
    if (error) return <div className="title is-danger">{error}</div>;


    // Use the `showBuyablePicker` state to render one view or the other.
    return (
        <div className="box p-5">
            {/*{showBuyablePicker? "Show buyable picker": "don't show buyable picker"};*/}
            {showBuyablePicker ? (
                <Picker
                    pickerTitle="Link a New Buyable Item"
                    pickerArray={unlinkedBuyables}
                    pickerOnSelect={(id) => safeSelectHandler(id, handleCreateLink)}
                    pickerOnAddNewClicked={() => setShowBuyablePicker(false)}
                    addNewButtonText="Cancel"
                    onClose={() => setShowBuyablePicker(false)}
                    showSearch={true}
                    pickerSubtitle="Click to add to list"
                />
            ) : (
                <Picker
                    pickerTitle="Linked Buyable Items"
                    pickerArray={linkedBuyables}
                    pickerOnSelect={(id) => safeSelectHandler(id, handleUnlinkClick)}
                    pickerOnAddNewClicked={() => setShowBuyablePicker(true)}
                    addNewButtonText="Link Another Buyable"
                    showSearch={false}
                    onClose={() => {}}
                    pickerSubtitle="Click to remove from list"
                />
            )}

            <ConfirmationModal
                isOpen={itemToUnlink !== null}
                onClose={() => setItemToUnlink(null)}
                onConfirm={confirmUnlink}
                title="Confirm Unlink"
            >
                Are you sure you want to unlink this buyable item? This action cannot be undone.
            </ConfirmationModal>
        </div>
    );
};

export default IngredientBuyablesList;