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

        // IMPROVEMENT: Find the actual ID of the link record to be deleted.
        const linkToDelete = links.find(link => link.buyable_id === buyableIdToUnlink);
        if (!linkToDelete || !linkToDelete.id) {
            showFlashMessage("Could not find the link to delete.", "danger");
            return;
        }

        // It's highly recommended to wrap this in a confirmation modal.
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

    // SUGGESTION: Create a handler for the modal's confirm action.
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

    // SUGGESTION: Use better loading and error components.
    if (loading) return <LoadingSpinner text="Loading linked items..."/>;
    if (error) return <div className="title is-danger">{error}</div>;


    // --- Conditional Rendering Logic ---
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

            {/* SUGGESTION: Add the confirmation modal for a safer UX. */}
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


// // src/components/IngredientBuyablesList.tsx
//
// import React, {useMemo, useCallback} from "react";
// import {useNavigate} from "react-router-dom";
// import {useDataFetcher} from "../../hooks/useDataFetcher.ts";
// import {useData} from "../../contexts/DataContext.tsx";
// import type {IIngredientBuyable} from "../../models/IIngredient_Buyable.ts";
// import type {IPickerElement} from "../../models/picker.ts";
// import Picker from "../Picker/Picker";
// import BuyableList from "../Buyable/BuyableList.tsx";
// import {postNewIngredientBuyableLink} from "../../services/ingredientBuyableService.ts";
// import type {ListViewConfig} from '../../config/listViewConfig';
// import {createListView} from "../ListView/createListView.tsx";
//
// interface IngredientBuyablesListProps {
//     ingredient_id: number;
// }
//
// const IngredientBuyablesList = ({ingredient_id}: IngredientBuyablesListProps) => {
//     const navigate = useNavigate();
//     const {PickerBuyableArray} = useData();
//     const [showBuyablePicker, setShowBuyablePicker] = useState(false);  // flag to switch from view of already linked items (false) to picker to add more items (true)
//     const {auth} = useAuth();
//
//     // Fetch the array of link objects; encodes the ingredient ID int the url to fetch only the buyables
//     // linked to the ingredient with that ID
//     const {
//         data: links,
//         loading,
//         error,
//     } = useDataFetcher<IIngredientBuyable[]>(`/ingredient/link_buyable/all?ingredient_id=${ingredient_id}`);
//
//     // `useMemo` to calculate the filtered list. This logic will only re-run
//     //    if `links` or `PickerBuyableArray` changes.
//     const filteredBuyables = useMemo(() => {
//         // If we don't have the links array yet, or it's empty, return an empty array.
//         if (!links || links.length === 0) {
//             return [];
//         }
//
//         // create a Set of the buyable_ids from the fetched links for faster filtering
//         const linkedBuyableIds = new Set(links.map(link => link.buyable_id));
//
//         // Filter the master list of buyables. Keep only the ones whose IDs are in our Set.
//         return PickerBuyableArray.filter((buyable: IPickerElement) =>
//             linkedBuyableIds.has(buyable.id)
//         );
//
//     }, [links, PickerBuyableArray]);
//
//     // 3. Define callbacks for the Picker component
//     const endpoint = 'buyable'; // Endpoint for navigating to a single buyable item
//
//
//     const onAddNewBuyable = useCallback(() => {
//         // need to **either** leave this out so no add new button is visible,
//         // or, have it trigger a switch from viewing the linked buyable list, to a create new buyable form
//         // NOT this navigate as it takes user away from the form:
//         // navigate(`/${endpoint}/new?linkToIngredient=${ingredient_id}`);
//
//         // override the default add new function whcih would open a new add new buyable form.
//         //
//
//         // 1. Open a buyable list modal - add modal stuff and modal at bottom here.  OR change rendering logic
//         // so that the buyables picker is displayed - standard buyable list view, add new can have the same function??
//
//
//         // 2. define callbacks for the buyable modal -
//         // onSelect need to take the id of the selected item, and pass it, along with the ingredient ID to the api to create a new link element via post,
//         // then trigger regeneration of the linked buyables list data so that the list viewer updates
//         console.log('onAddNewBuyable called but not yet configured - prob needs to just use same callback as onSelect??  is this logical??');
//
//
//     }, [navigate, endpoint, ingredient_id]);
//
//
//     if (loading) return <p>Loading linked items...</p>;
//     if (error) return <p>Error loading linked items.</p>;
//
//     /**
//      * callback to pass to the buyable picker, so that when an item in the picker list is clicked, the buyable ID is
//      * used to create a new link to the currnet ingredient id
//      * @param buyableId
//      * @param ingredient_id
//      */
//     const createLink = async (buyable_id: number) => {
//         // todo - add checks for valid auth and error handling.
//
//         // create the new link
//         const newLink: IIngredientBuyable = {
//             ingredient_id = ingredient_id,
//             buyable_id = buyable_id
//         }
//
//         const response = await postNewIngredientBuyableLink(newLink,
//             auth.user.auth_token)
//
//         return response;
//
//     };
//
//     const onSelectBuyable = useCallback((id: number | string) => {
//         createLink(id);
//         // refetch the data array and trigger a refresh of the list of selected items
//         // hidde the attach buyables component
//
//     }, []);
//
//
//     const buyableListInIngredientFormConfig: ListViewConfig = {
//         title: 'Add Buyables to Ingredient',
//         endpoint: 'buyable',
//         pickerArray: PickerBuyableArray,  // todo - add a filter to remove items already linked to the ingredient, i.e. not has links.id
//         onSelectOverride: onSelectBuyable,
//         onAddNewOverride: onAddNewBuyable
//     };
//
//     // customised buyable list component with overrides for onSelect etc
//     const BuyableListInIngredientForm = createListView(buyableListInIngredientFormConfig);
//
//
//     // 4. Render the Picker component directly with the filtered data and callbacks.
//     //    This is more flexible and avoids the anti-pattern of creating components in render.
//     return (
//         <>
//             <Picker
//                 pickerTitle="Linked Buyable Items"
//                 pickerArray={filteredBuyables}
//                 pickerOnSelect={onSelectBuyable}
//                 pickerOnAddNewClicked={onAddNewBuyable}
//                 onClose={() => {
//                 }} // Not needed here as you noted
//                 addNewButtonText="Link Buyable Item"
//                 showSearch={false}
//             />
//             <BuyableListInIngredientForm
//             />
//         </>
//     );
// };
//
// export default IngredientBuyablesList;