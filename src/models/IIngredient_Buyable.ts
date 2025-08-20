
export interface IIngredientBuyable {
    id?: number;
    ingredient_id: number;
    buyable_id: number;
    sort_order?: number;
    notes?: string | null;
}

// no need for a create empty function here - links will only ever be created programatically via the picker function.
// Will be option later to edit the sort order and notes, but this will use the patch process (if it's implemented)
