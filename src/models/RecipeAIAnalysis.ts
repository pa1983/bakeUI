/**
 * Represents the overall summary and notes about the recipe.
 */
interface OverallOpinion {
    /**
     * The overall summary text.
     */
    summary: string;

    /**
     * A list of items (e.g., ingredients, steps) that might be missing from the analysis.
     */
    potential_missing_items: string[];
}



    /**
     * Represents a single ingredient or labour item flagged for review.
     */
    export interface ItemForReview {
    /**
     * The type of cost (e.g., 'ingredient', 'labour', 'overhead').
     */
    cost_type: string;

    /**
     * The unique identifier for the specific item.
     */
    item_id: number;

    /**
     * The name of the item flagged for review.
     */
    item_name: string;

    /**
     * The total calculated cost associated with the item.
     */
    total_cost: number;

    /**
     * A comment or reason why this item was flagged for review.
     */
    comment: string;
//     severity - represents the significance of the result
        severity: number;
}



    /**
     * Mirrors the Python AIRecipeAnalysis class, providing the top-level structure
     * for a recipe's AI-generated analysis.
     */
    export interface AIRecipeAnalysis {
    /**
     * The unique identifier for the top-level recipe.
     */
    recipe_id: number;

    /**
     * The overall summary and notes about the recipe.
     */
    overall_opinion: OverallOpinion;

    /**
     * A list of items flagged by the AI for manual review.
     */
    items_for_review: ItemForReview[];
}