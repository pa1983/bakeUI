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