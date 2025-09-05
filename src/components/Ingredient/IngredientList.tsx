import { createListView } from '../ListView/createListView';
import type { ListViewConfig } from '../../config/listViewConfig';
const IngredientListConfig: ListViewConfig = {
    title: 'Ingredient',
    endpoint: 'ingredient',
    pickerArraySelector: (data) => data.PickerIngredientArray,
};
const IngredientList = createListView(IngredientListConfig);
export default IngredientList;