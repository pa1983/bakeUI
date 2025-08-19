/**
 * Represents a Product Type read from the database.
 * Corresponds to the Python SQLModel `ProductTypeRead`.
 */
export interface IProductType {
    product_type_id: number;
    product_type_name: string;
    description: string;
}