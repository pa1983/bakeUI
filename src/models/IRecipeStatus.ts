/**
 * Interface for reading a recipe status.
 * Corresponds to the Python SQLModel `RecipeStatusRead`.
 * Used to populate drop down list in recipe form
 */
export interface IRecipeStatus {
    recipe_status_id: number;
    recipe_status_name: string;
    recipe_status_description: string;
}