import LoadingSpinner from '../Utility/LoadingSpinner';
import {useElementFormLogic, type ElementFormConfig} from '../../hooks/useElementFormLogic';

interface ElementViewProps<T, K extends keyof T> {
    config: ElementFormConfig<T, K>;
}

export const ElementView = <
    T extends Record<K, number | string>,
    K extends keyof T
>({ config }: ElementViewProps<T, K>) => {
    // pull out FormComponent so function remains the same as before adding component to the config type.
    // Unused params are ignored
    // FormComponent is a reference to the actual custom form component with custom styling and layout specific
    // to the particular element.
    const { FormComponent, aiAnalysis } = config;

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
    } = useElementFormLogic<T, K>(config);

    if (isLoading) {
        return <LoadingSpinner size='is-large' text={`Loading ${config.elementName} details...`}/>;
    }

    // todo = abstract the details of this error to avoid giving user too much potentially sensitive information
    if (error) {
        return <div className="h2 is-danger">{error}</div>;
    }

    if (!element) {
        return <div className="h2 is-warning">{config.elementName} not found.</div>;
    }

    return (
        <div className="container p-4">
            <h1 className="title">{formTitle} </h1>
            <div className="box">
                {/* The FormComponent passed in as a prop is now populated with the correct data and logic
                and returned as a JSX element.*/}
                <FormComponent
                    formData={element}
                    onSave={handleSave}
                    onChange={handleChange}
                    onCancel={handleCancel}
                    onEdit={handleEdit}
                    isSaving={isSaving}
                    onDelete={handleDelete}
                    isModal={!!config.prop_element_id} // concise way to determine if it's a modal
                    aiAnalysis={aiAnalysis}
                />
            </div>
            {aiAnalysis && aiAnalysis.items_for_review && aiAnalysis.items_for_review.length > 0 && (
                <div className="box mt-4">
                    <h2 className="subtitle">AI Analysis: Items to Review</h2>
                    <ul>
                        {aiAnalysis.items_for_review.map((element, index) => (
                            <li key={index}>{element.comment}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};