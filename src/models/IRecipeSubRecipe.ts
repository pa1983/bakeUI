/**
 * Represents a link between a parent Recipe and a sub-recipe.
 * Corresponds to the Python SQLModel `RecipeSubRecipeRead`.
 */


export interface IRecipeSubRecipe {
    id: number;
    parent_recipe_id: number;
    sub_recipe_id: number;
    quantity: number | string;
    uom_id: number;
    notes: string | null;
    sort_order: number;
};

/**
 * Creates a new, empty Recipe Sub-Recipe object with default values.
 * FOr use by factory function when initialising a new sub-recipe link in the UI.
 * @returns A new IRecipeSubRecipe object with default values.
 */
export const createEmptyRecipeSubRecipe = (): IRecipeSubRecipe => {
    return {
        id: 0, // A temporary ID, the backend will assign the real one.
        parent_recipe_id: 0,  // To be populated from the parent recipe form.
        sub_recipe_id: 0, // To be populated from a recipe picker.
        quantity: 1,  // Default to '1' to avoid type errors on initial creation.
        uom_id: 1 ,// Default to '1' to avoid type errors on initial creation.
        notes: "",
        sort_order: 10
    }
}
