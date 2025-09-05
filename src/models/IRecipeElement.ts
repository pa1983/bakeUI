// mirror the format of the data returned from the api for recipe elements
import type {IRecipeIngredient} from "./IRecipeIngredient.ts";
import type {IRecipeLabour} from "./IRecipeLabour.ts";
import type {IRecipeSubRecipe} from "./IRecipeSubRecipe.ts";

export interface IIngredientElement {
    element_type: "ingredient";
    data: IRecipeIngredient;
}

export interface ILabourElement {
    element_type: "labour";
    data: IRecipeLabour;
}

export interface ISubRecipeElement {
    element_type: "subrecipe";
    data: IRecipeSubRecipe;
}

// Discriminated Union type for the recipe elements -
// IRecipeElement can only contain this list of item types
// These types have all been defined in a similar
// format that is expected by the RecipeElementList component.
export type IRecipeElement =
    IIngredientElement |
    ILabourElement |
    ISubRecipeElement;
