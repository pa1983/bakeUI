import { createListView } from '../ListView/createListView';
import type { ListViewConfig } from '../../config/listViewConfig';


const recipeListConfig: ListViewConfig = {
    title: 'Recipes',
    endpoint: 'recipe',
    pickerArraySelector: (data) => data.PickerRecipeArray,
};

const RecipeList = createListView(recipeListConfig);
export default RecipeList;