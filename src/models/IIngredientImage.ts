import type {IImage} from "./IImage.ts";

export interface IIngredientImage {
    id: number
    sort_order: number
    ingredient_id: number
    image: IImage
}