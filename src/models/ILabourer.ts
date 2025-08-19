/**
 * Represents a Labourer object, combining all possible fields
 * from the database model and its read representation.
 */
export interface ILabourer {
    id: number;
    name: string;
    description?: string | null;

}

export const createEmptyLabourer = (): ILabourer => {
    return {
        id: 0,
        name: '',
        description: null,

    }
}