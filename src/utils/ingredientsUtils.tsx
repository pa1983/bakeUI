//
// import type { IIngredientRead, IngredientFormData } from '../models/IIngredient.ts';
//
// /**
//  * Transforms an IngredientRead object into an IngredientFormData object,
//  * effectively removing read-only or nested fields not part of the form data.
//  *
//  * @param ingredient The IngredientRead object to transform.
//  * @returns An IngredientFormData object.
//  */
//
// export type IngredientFormData = Omit<IngredientRead, 'standard_uom' | 'organisation_id' | 'organisation' | 'created_timestamp' | 'modified_timestamp' | 'image_links' | 'images'> & {
//     ingredient_id?: number; // Make ingredient_id optional for new creations
// };
//
// export function mapIngredientReadToFormData(ingredient: IngredientRead): IngredientFormData {
//     // Destructure and exclude the fields that are not part of IngredientFormData
//     const {
//         ingredient_id: _, // Exclude ingredient_id (it's optional in FormData, and we don't want to copy it directly from Read)
//         organisation_id: __,
//         organisation: ___,
//         created_timestamp: ____,
//         modified_timestamp: _____,
//         image_links: ______,
//         images: _______,
//         standard_uom: ________,
//         ...restIngredient // Collect all other properties
//     } = ingredient;
//
//     // Type assertion to ensure the result matches IngredientFormData
//     // You might need to explicitly set ingredient_id if it's meant to be passed for edits
//     // but based on your Omit, it's not directly part of the base FormData.
//     // If you need ingredient_id for patch, it's handled by your updateIngredientData function using `ingredient?.ingredient_id`
//     return restIngredient as IngredientFormData;
// }