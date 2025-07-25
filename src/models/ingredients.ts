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


export interface IngredientRead {
    ingredient_id: number;
    ingredient_name: string;
    standard_uom_id: number;
    density: number | null;
    organisation_id: number | null;
    notes: string | null; // Added notes field
    created_timestamp: string; // ISO string
    modified_timestamp: string; // ISO string
    standard_uom: UnitOfMeasure; // Nested UOM object
    organisation: OrganisationRead | null; // Nested Organisation object
    image_links: IngredientImageRead[];
    images: ImageRead[]; // Computed property from Pydantic
}