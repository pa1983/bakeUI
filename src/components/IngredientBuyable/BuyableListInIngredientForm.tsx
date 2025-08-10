import { createListView } from '../ListView/createListView';
import type { ListViewConfig } from '../../config/listViewConfig';
/// specific component for use in the ingredient form.  Copied from the Buyable list, and with some changes specific to the needs of the component shown in the ingredient form (namely some callback overrides)
// 1. Define the configuration for the Buyable list
const buyableListInIngredientFormConfig: ListViewConfig = {
    title: 'Buyable Item',
    endpoint: 'buyable',
    pickerArraySelector: (data) => data.PickerBuyableArray,  // get data array by name from data context.
};

// 2. Create the component by calling the factory
const BuyableListInIngredientForm = createListView(buyableListInIngredientFormConfig);

// 3. Export the resulting component
export default BuyableListInIngredientForm;