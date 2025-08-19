/**
 * Represents a single labour entry for a recipe.
 * This interface is based on the RecipeLabourRead model from the backend.
 */
export interface IRecipeLabour {
    id: number;
    recipe_id: number;
    labourer_id: number;
    // Using number for Decimal, assuming standard precision is sufficient for the frontend.
    // For high-precision financial calculations, consider using a string or a library like decimal.js.
    labour_minutes: number;
    labour_category_id: number;
    /**
     * Description of the labour covered by the entry, relating to an action on the full batch.
     * E.g., "Knead dough", "Clean mixer", "Weigh out ingredients".
     */
    description: string;
    sort_order: number;
}

/**
 * Creates a new, empty Recipe Labour object with default values.
 * This is useful for initializing a new labour entry in the UI before it's saved.
 * @param recipeId - The ID of the parent recipe to associate with this labour entry.
 * @returns A new IRecipeLabour object with default values.
 */
export function createEmptyRecipeLabour(recipeId: number): IRecipeLabour {
    return {
        id: 0, // A temporary ID, the backend will assign the real one.
        recipe_id: recipeId,
        labourer_id: 0, // Default or placeholder
        labour_minutes: 0.0,
        labour_category_id: 0, // Default or placeholder
        description: '',
        sort_order: 10,
    };
}