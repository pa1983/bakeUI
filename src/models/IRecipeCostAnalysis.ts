
export interface RecipeCostAnalysis {

    cost_type: string;
    recipe_id: number;
    recipe_name: string;
    parent_recipe_id: number | null;
    item_id: number;
    item_name: string;
    item_category: string;
    top_level_recipe_id: number;
    top_level_recipe_name: string;
    top_level_batch_quantity: number;
    top_level_uom: string;
    total_quantity: number;
    unit: string;
    total_cost: number;

    percentage_of_total_cost: number;
}
