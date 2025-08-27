/**
 * Represents a single row from the final combined recipe cost analysis query.
 *
 * This interface captures both labour and ingredient costs (and energy/equipment in future),
 * standardised into a uniform structure, and includes analytical data like the percentage of
 * the total cost.
 */
export interface RecipeCostAnalysis {
    // --- Core Identification Fields ---
    /**
     * The type of cost, e.g., 'Labour' or 'Ingredient'.
     */
    cost_type: string;

    /**
     * The ID of the recipe this cost item belongs to.
     */
    recipe_id: number;

    /**
     * The name of the recipe this cost item belongs to.
     */
    recipe_name: string;

    /**
     * The ID of the parent recipe in the hierarchy. null for top-level items.
     */
    parent_recipe_id: number | null;

    /**
     * The unique ID of the cost item (e.g., labourer_id or ingredient_id).
     */
    item_id: number;

    /**
     * The name of the cost item (e.g., 'Head Baker' or 'Flour').
     */
    item_name: string;

    /**
     * The category of the cost item (e.g., 'Labour' or 'Raw Ingredient').
     */
    item_category: string;

    // --- Top-Level Context Fields ---
    /**
     * The ID of the top-level recipe being analysed.
     */
    top_level_recipe_id: number;

    /**
     * The name of the top-level recipe being analysed.
     */
    top_level_recipe_name: string;

    /**
     * The total quantity produced by the top-level recipe (e.g., 40 croissants).
     * Note: Using number for Decimal, consider a library like decimal.js if high precision is needed.
     */
    top_level_batch_quantity: number;

    /**
     * The unit of measure for the top-level recipe's quantity (e.g., 'pcs').
     */
    top_level_uom: string;

    // --- Calculated Cost and Quantity Fields ---
    /**
     * The total scaled quantity of this item needed for the top-level recipe.
     */
    total_quantity: number;

    /**
     * The unit of measure for the total_quantity (e.g., 'minutes', 'kg').
     */
    unit: string;

    /**
     * The total calculated cost for this item.
     */
    total_cost: number;

    /**
     * This item's percentage contribution to the grand total cost.
     */
    percentage_of_total_cost: number;
}
