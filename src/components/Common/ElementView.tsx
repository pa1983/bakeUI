import LoadingSpinner from '../Utility/LoadingSpinner';
import { useElementFormLogic, type ElementFormConfig } from '../../hooks/useElementFormLogic';

interface ElementViewProps<T> {
    config: ElementFormConfig<T>;
}

export const ElementView = <T extends { [key: string]: any }>({ config }: ElementViewProps<T>) => {
    // pull out FormComponent so function remains the same as before adding component to the config type
    const {FormComponent, ...restOfConfig} = config;

    const {
        element,
        isLoading,
        error,
        isSaving,
        formTitle,
        handleSave,
        handleChange,
        handleEdit,
        handleCancel,
        handleDelete,
    } = useElementFormLogic<T>(config);

    if (isLoading) {
        return <LoadingSpinner size='is-large' text={`Loading ${config.elementName} details...`} />;
    }

    // todo = abstract the details of this error to avoid giving user too much potnentially sensative information
    if (error) {
        return <div className="h2 is-danger">{error}</div>;
    }

    if (!element) {
        return <div className="h2 is-warning">{config.elementName} not found.</div>;
    }

    return (
        <div className="container p-4">
            <h1 className="title">{formTitle}</h1>
            <div className="box">
                <FormComponent
                    formData={element}
                    onSave={handleSave}
                    onChange={handleChange}
                    onCancel={handleCancel}
                    onEdit={handleEdit}
                    isSaving={isSaving}
                    onDelete={handleDelete}
                    isModal={!!config.prop_element_id} // concise way to determine if it's a modal
                />
            </div>
        </div>
    );
};