/**
 * Represents a Labour Category.
 * Corresponds to the Python SQLModel `LabourCategoryRead`.
 */
export interface ILabourCategory {
    id: number;
    name: string;
    description: string | null;
}