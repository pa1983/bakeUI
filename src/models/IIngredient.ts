import type {OrganisationRead} from './organisation.ts'
import type {UnitOfMeasure} from './uom.ts';
import type {ImageRead} from './image.ts';


export interface IngredientImageRead {
    ingredient_image_id: number;
    ingredient_id: number;
    image_id: number;
    sort_order: number;
    image: ImageRead; // Nested ImageRead object
}


// export interface IIngredient {
//     ingredient_id: number;
//     ingredient_name: string;
//     standard_uom_id: number;
//     density: number | null;
//     organisation_id: number | null;
//     notes: string | null; // Added notes field
//     created_timestamp: string; // ISO string
//     modified_timestamp: string; // ISO string
//     standard_uom: UnitOfMeasure|null; // Nested UOM object
//     image_links: IngredientImageRead[];
//     images: ImageRead[]; // Computed property from Pydantic
// }

/**
 * Rich ingredient result set with nested results
 */
export interface IIngredient {
    ingredient_id: number;
    ingredient_name: string;
    standard_uom_id: number;
    density: number | null;
    organisation_id: number | null;
    notes: string | null; // Added notes field
    created_timestamp: string; // ISO string
    modified_timestamp: string; // ISO string
    standard_uom: UnitOfMeasure|null; // Nested UOM object
    image_links: IngredientImageRead[];
    images: ImageRead[]; // Computed property from Pydantic
}

/**
 * Creates and returns a new, empty ingredient object.
 * Ideal for initializing the state for a "Create New Ingredient" form.
 *
 * @returns {IIngredient} A new object conforming to the IIngredient interface.
 */
export const createEmptyIngredient = (): IIngredient => {
    return {
        ingredient_id: 0, // Use 0 to indicate a new, unsaved item.
        ingredient_name: '',
        standard_uom_id: 0, // Default to 0
        density: null,
        notes: null,
        standard_uom: null,
        image_links: [], // Always initialize arrays as empty.
        images: [],
        ingredient_id: 0,
        ingredient_name: '',
        standard_uom_id: 0,
        density: null,
        organisation_id: null,
        notes: null,
        created_timestamp: '',
        modified_timestamp: '',
        standard_uom: null,
        image_links: [],
        images: []
    };
};