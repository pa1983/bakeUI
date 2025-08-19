
// mirror the format of the data returned from the api for recipe elements
export interface IIngredientElement {
    element_type: "ingredient";
    data: IRecipeIngredientData;
}

export interface ILabourElement {
    element_type: "labour";
    data: IRecipeLabourData;
}

export interface ISubRecipeElement{
    element_type: "subrecipe";
    data: IRecipeSubRecipeData;
}
// define a Discriminated Union type for the recipe elements
export type IRecipeElement = IIngredientElement | ILabourElement | ISubRecipeElement;


