/**
 * Represents a Recipe Type read from the database.
 * Corresponds to the Python SQLModel `RecipeTypeRead`.
 */
export interface IRecipeType {
    recipe_type_id: number;
    recipe_type: string;
    description: string;
}