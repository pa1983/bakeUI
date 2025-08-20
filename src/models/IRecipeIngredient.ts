/**
 * Represents a link between a Recipe and an Ingredient.
 * Corresponds to the Python SQLModel `RecipeIngredientRead`.
 */
export interface IRecipeIngredient {
    id: number;
    recipe_id: number;
    ingredient_id: number;
    quantity: number | null;
    uom_id: number;
    notes: string | null;
    sort_order: number;
};


export const CreateEmptyRecipeIngredient = (): IRecipeIngredient => {
    return {
        id: 0,
        recipe_id: 0,  // fron the recipe form
        ingredient_id: 0, // from the ingredient picker
        quantity: 1,  // to be populated by user once it's been picked and added - default in '1' to avoid type errors in api when generating
        uom_id: 1 ,// to be populated by user once it's been picked and added - default in '1' to avoid type errors in api when generating
        notes: "",
        sort_order: 10
    }
}