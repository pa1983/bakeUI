export interface IGenericFormProps<T> {
    // the data that will be displayed in the form, of type T
    formData: T;
    // only ever used for creating a new element from scratch - all other changes are made by patching
    onSave: (updatedData: T | null) => void ;
    // onEdit and onChange expect a callback with fieldnames and value types that match the formData Type (T)
    // K is a list of string literal keys from type T;
    // fieldname must be a type found in the list (K)
    // its value must be of the type that corresponds to that key in the type T.
    onChange: <K extends keyof T>(fieldName: K, value: T[K]) => void;
    onEdit: <K extends keyof T>(fieldName: K, value: T[K], originalValue: T[K]) => void;
    onDelete: () => void;
    onCancel: () => void;
    isSaving: boolean;
    isModal: boolean;
}