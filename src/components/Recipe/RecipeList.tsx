import { createListView } from '../ListView/createListView';
import type { ListViewConfig } from '../../config/listViewConfig';

// 1. Define the configuration for the recipe list
const recipeListConfig: ListViewConfig = {
    title: 'Recipes',
    endpoint: 'recipe',
    pickerArraySelector: (data) => data.PickerRecipeArray,  // get data array by name from data context.
};

// 2. Create the component by calling the factory
const RecipeList = createListView(recipeListConfig);

// 3. Export the resulting component
export default RecipeList;