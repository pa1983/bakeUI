export interface UnitOfMeasure {
    uom_id: number;
    name: string;
    abbreviation: string;
    type: string;
    conversion_factor: number;
    is_base_unit: boolean;
}