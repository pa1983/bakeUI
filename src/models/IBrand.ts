export interface IBrand {
    brand_id: number;
    added_date: string;
    brand_name: string;
    notes: string | null;
    image_url: string | null;


}

export function createEmptyBrand(): IBrand {
    return {
        brand_id: 0,
        added_date: '',
        brand_name: '',
        notes: null,
        image_url: null,
    };
}