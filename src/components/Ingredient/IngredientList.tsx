import { createListView } from '../ListView/createListView';
import type { ListViewConfig } from '../../config/listViewConfig';

// 1. Define the configuration for the Ingredient list
const IngredientListConfig: ListViewConfig = {
    title: 'Ingredient',
    endpoint: 'ingredient',
    pickerArraySelector: (data) => data.PickerIngredientArray,
};

// 2. Create the component by calling the factory
const IngredientList = createListView(IngredientListConfig);

// 3. Export the resulting component
export default IngredientList;