import {useEffect, useState, useCallback} from "react";
import {useDataFetcher} from "../../hooks/useDataFetcher.ts";
import RecipeIngredientForm from "../RecipeIngredient/RecipeIngredientForm.tsx";
import {useAuth} from "react-oidc-context";
import useFlash from "../../contexts/FlashContext.tsx";
import RecipeLabourForm from "../RecipeLabour/RecipeLabourForm.tsx";
import type {IGenericFormProps} from "../../models/IFormProps.ts";
import {patchField} from "../../services/commonService.ts";
import RecipeSubRecipeForm from "../RecipeSubRecipe/RecipeSubRecipeForm.tsx";
import type {IRecipeElement} from "../../models/IRecipeElement.ts";
import type {IRecipeIngredient} from "../../models/IRecipeIngredient.ts";
import type {IRecipeLabour} from "../../models/IRecipeLabour.ts";
import type {IRecipeSubRecipe} from "../../models/IRecipeSubRecipe.ts";
// import {DndContext, useDroppable, useDraggable} from "@dnd-kit/core";
import {DndContext} from "@dnd-kit/core";


interface ElementDataMap {
    ingredient: IRecipeIngredient;
    labour: IRecipeLabour;
    subrecipe: IRecipeSubRecipe;
}

// Configuration object to map an element type to
// its specific component and API endpoint.
const recipeElementConfig = {
    ingredient: {
        component: RecipeIngredientForm,
        apiEndpoint: 'recipe_ingredient',
    },
    labour: {
        component: RecipeLabourForm,
        apiEndpoint: 'recipe_labour',
    },
    subrecipe: {
        component: RecipeSubRecipeForm,
        apiEndpoint: 'recipe_sub_recipe',
    },
} as const;

type ElementType = IRecipeElement['element_type'];

interface RecipeElementListProps {
    recipe_id: number;
    refetchTrigger: number;
}

const RecipeElementList = ({recipe_id, refetchTrigger}: RecipeElementListProps) => {
    const auth = useAuth();
    const {showFlashMessage} = useFlash();

    const endpointToFetch = (recipe_id && recipe_id > 0)
        ? `/recipe/${recipe_id}/elements`
        : null;

    const {
        data: fetchedElements,
        loading,
        error,
        refetch,
    } = useDataFetcher<IRecipeElement>(endpointToFetch);

    const [recipeElements, setRecipeElements] = useState<IRecipeElement[]>([]);

    useEffect(() => {
        if (fetchedElements) {
            const sortedElements = [...fetchedElements].sort((a, b) => a.data.sort_order - b.data.sort_order);
            setRecipeElements(sortedElements);
        }
    }, [fetchedElements]);

    useEffect(() => {
        if (recipe_id > 0) {
            refetch();
        }
    }, [refetchTrigger, refetch, recipe_id]);

    // Handler signatures use the correctly derived ElementType
    // Handle change - called when a change is made within one of the recipe elements (e.g. a quantity is modified)
    // takes the element's id, it's type (from which the correct endpoint can be derived) the name of the field being modifed, and the new value
    // it used these values to update the current state of the recipe elements (setRecipeElements).
    // to get around type checking errors relating to the range of possible element types when using spread syntax a switch statement is required.
    // looks messy, but was the only way I could find around type-checking blocking build
    // Complex signature required to typecheck field names and values against the element type being changed, but now is
    // fully type-safe
    const handleChange = useCallback(
        <E extends ElementType, K extends keyof ElementDataMap[E]>(
            id: number,
            elementType: E,
            fieldName: K,
            value: ElementDataMap[E][K]
        ) => {
        setRecipeElements(currentList =>
            currentList.map(item => {
                // If this is not the item we're looking for, return it unchanged.
                if (item.data.id !== id || item.element_type !== elementType) {
                    return item;
                }
                switch (item.element_type) {
                    case 'ingredient':
                        // Inside each block, TS knows `item` is IIngredientElement and so on
                        return {
                            ...item,
                            data: { ...item.data, [fieldName]: value }
                        };
                    case 'labour':
                        return {
                            ...item,
                            data: { ...item.data, [fieldName]: value }
                        };
                    case 'subrecipe':
                        return {
                            ...item,
                            data: { ...item.data, [fieldName]: value }
                        };
                    default:
                        return item;
                }
            })
        );
    }, []);

    const handleEdit = useCallback(
        async <E extends ElementType, K extends keyof ElementDataMap[E]>(
            id: number,
            elementType: E,
            fieldName: K,
            value: ElementDataMap[E][K],
            originalValue: ElementDataMap[E][K]
        ) => {
            if (String(value) === String(originalValue) || !auth.user?.access_token) {
                return;
            }

            const apiEndpoint = recipeElementConfig[elementType]?.apiEndpoint;

            if (!apiEndpoint) {
                showFlashMessage(`Unknown element type: ${elementType}`, 'danger');
                return;
            }
            try {
                // The 'value' passed to patchField is now strongly typed
                await patchField<ElementDataMap[E], 'id'>(auth.user.access_token, id, fieldName, value, apiEndpoint);
                showFlashMessage('Saved!', 'success');
            } catch (err) {
                showFlashMessage(err instanceof Error ? err.message : 'Failed to save changes', 'danger');
                refetch();
            }
        },
        [refetch, auth, showFlashMessage]
    );

    const handleDelete = useCallback(async (id: number, elementType: ElementType) => {
        console.log(`Deleting ${elementType} with id ${id}`);
        refetch();
    }, [refetch]);

    if (loading && !recipeElements) {
        return <p>Loading recipe steps...</p>;
    }

    if (error) {
        return <div className="notification is-danger">Error loading recipe steps: {error}</div>;
    }

    if (!recipeElements || recipeElements.length === 0) {
        return (
            <div className="box">
                <p>This recipe has no ingredients or labour steps defined yet.</p>
            </div>
        );
    }

    // DRAG AND DROP FUNCTIONS
    // function Droppable(props) {
    //     const {isOver, setNodeRef} = useDroppable({
    //         id: 'droppable',
    //     });
    //     const style = {
    //         color: isOver? 'green' : undefined,
    //     }
    // }



    return (
        <DndContext>

        <div className="box">
            <h3 className="title is-5">Recipe Elements  ({recipeElements?.length})</h3>
            {recipeElements.map(element => {
                if (!element.data.id || element.data.id === 0) {
                    // This can happen with new, unsaved elements or bad data - skip rendering to avoid type errors
                    console.warn('Skipping render for element without a valid database ID:', element);
                    return null;
                }

                const key = `${element.element_type}-${element.data.id}`;

                // Use a switch statement to allow TypeScript to narrow the element type
                switch (element.element_type) {
                    case 'ingredient': {
                        const ElementComponent = recipeElementConfig.ingredient.component;
                        // Inside this block, TS knows element.data is IRecipeIngredient
                        const elementProps: IGenericFormProps<IRecipeIngredient> = {
                            formData: element.data,
                            onSave: () => {},
                            onChange: (fieldName, value) => handleChange(element.data.id, 'ingredient', fieldName, value),
                            onEdit: (fieldName, value, originalValue) => handleEdit(element.data.id, 'ingredient', fieldName, value, originalValue),
                            onDelete: () => handleDelete(element.data.id, 'ingredient'),
                            onCancel: () => {},
                            isSaving: false,
                            isModal: false
                        };
                        return <ElementComponent key={key} {...elementProps} />;
                    }

                    case 'labour': {
                        const ElementComponent = recipeElementConfig.labour.component;
                        // Inside this block, TS knows element.data is IRecipeLabour
                        const elementProps: IGenericFormProps<IRecipeLabour> = {
                            formData: element.data,
                            onSave: () => {},
                            onChange: (fieldName, value) => handleChange(element.data.id, 'labour', fieldName, value),
                            onEdit: (fieldName, value, originalValue) => handleEdit(element.data.id, 'labour', fieldName, value, originalValue),
                            onDelete: () => handleDelete(element.data.id, 'labour'),
                            onCancel: () => {},
                            isSaving: false,
                            isModal: false
                        };
                        return <ElementComponent key={key} {...elementProps} />;
                    }

                    case 'subrecipe': {
                        const ElementComponent = recipeElementConfig.subrecipe.component;
                        // Inside this block, TS knows element.data is IRecipeSubRecipe
                        const elementProps: IGenericFormProps<IRecipeSubRecipe> = {
                            formData: element.data,
                            onSave: () => {},
                            onChange: (fieldName, value) => handleChange(element.data.id, 'subrecipe', fieldName, value),
                            onEdit: (fieldName, value, originalValue
                            ) => handleEdit(element.data.id, 'subrecipe', fieldName, value, originalValue),
                            onDelete: () => handleDelete(element.data.id, 'subrecipe'),
                            onCancel: () => {},
                            isSaving: false,
                            isModal: false
                        };
                        return <ElementComponent key={key} {...elementProps} />;
                    }

                    default:
                        // Handle unexpected element types gracefully
                        return null;
                }
            })}
        </div>
        </DndContext>
    );
};

export default RecipeElementList;