export interface IRecipeSubRecipe {
    id: number;
    parent_recipe_id: number;
    sub_recipe_id: number;
    quantity: number | string;
    uom_id: number;
    notes: string | null;
    sort_order: number;
};
