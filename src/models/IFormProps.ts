

export interface IGenericFormProps<T> {
    formData: T;  // Same Type (T) used as the initial form data (for new items it's  a blank instance created by a helper function in the type definition) ...
    onSave: (updatedData: T) => void;  // and as the on save, which is expected to return a full modified dataset which is populated into the form
    // onEdit and onChange expect a callback with fieldnames and value types that match the formData Type (T)
    // K is a list of string literal keys from type T;
    // fieldname must be a type found in the list (K)
    // its value must be of the type that corresponds to that key in the type T.
    onChange: <K extends keyof T>(fieldName: K, value: T[K]) => void;
    onEdit: <K extends keyof T>(fieldName: K, value: T[K]) => void;
    onCancel: () => void;
    isSaving: boolean;
    onDelete: () => void;
    isModal: boolean;
}