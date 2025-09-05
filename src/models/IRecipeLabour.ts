export interface IRecipeLabour {
    id: number;
    recipe_id: number;
    labourer_id: number;
    labour_minutes: number;
    labour_category_id: number;
    description: string;
    sort_order: number;
}
