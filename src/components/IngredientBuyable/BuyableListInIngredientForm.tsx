import { createListView } from '../ListView/createListView';
import type { ListViewConfig } from '../../config/listViewConfig';
//specific component for use in the ingredient form.  Copied from the Buyable list, and with some changes specific to the needs of the component shown in the ingredient form (namely some callback overrides)

const buyableListInIngredientFormConfig: ListViewConfig = {
    title: 'Buyable Item',
    endpoint: 'buyable',
    pickerArraySelector: (data) => data.PickerBuyableArray,  // get data array by name from data context.
};

const BuyableListInIngredientForm = createListView(buyableListInIngredientFormConfig);

export default BuyableListInIngredientForm;