import {useEffect, useState, useCallback, useMemo} from "react";
import {useDataFetcher} from "../../hooks/useDataFetcher.ts";
import {updateRecipeElementsOrder, type IElementOrderUpdate} from "../../services/recipeService.ts";
import RecipeIngredientForm from "../RecipeIngredient/RecipeIngredientForm.tsx";
import {useAuth} from "react-oidc-context";
import useFlash from "../../contexts/FlashContext.tsx";
import RecipeLabourForm from "../RecipeLabour/RecipeLabourForm.tsx";
import type {IGenericFormProps} from "../../models/IFormProps.ts";
import {patchField} from "../../services/commonService.ts";
import RecipeSubRecipeForm from "../RecipeSubRecipe/RecipeSubRecipeForm.tsx";
import type {AIRecipeAnalysis} from "../../models/RecipeAIAnalysis.ts";
import type {IRecipeElement} from "../../models/IRecipeElement.ts";
import type {IRecipeIngredient} from "../../models/IRecipeIngredient.ts";
import type {IRecipeLabour} from "../../models/IRecipeLabour.ts";
import type {IRecipeSubRecipe} from "../../models/IRecipeSubRecipe.ts";
import {DndContext, type DragEndEvent} from "@dnd-kit/core";
import Droppable from "./Droppable.tsx";
import {SortableContext, arrayMove} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem.tsx";
import LoadingBar from "../Utility/LoadingBar.tsx";
import RecipeAIOverview from "./RecipeAIOverview.tsx";

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
    } = useDataFetcher<IRecipeElement[]>(endpointToFetch);


    // State and fetcher for AI Analysis data, now managed entirely by the hook.
    const {
        data: aiAnalysis,
        loading: isAiAnalysisLoading,
        error: aiAnalysisError,
        refetch: fetchAiAnalysis
    } = useDataFetcher<AIRecipeAnalysis>(`/recipe/${recipe_id}/ai_analysis`, {}, {lazy: true});

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

    const handleFetchAiAnalysis = async () => {
        try {
            await fetchAiAnalysis(); // This will now fetch and update the `aiAnalysis` state within the hook
            showFlashMessage("AI analysis loaded successfully!", "success");
            console.log("AI analysis loaded successfully!");
            console.log(aiAnalysis);
        } catch (err: unknown) {
            showFlashMessage(`Failed to load AI analysis.`, "danger");
            console.log(err);
        }
    };

    // Create a memoized array of unique IDs for dnd-kit's SortableContext.
    const sortableIds = useMemo(() =>
            recipeElements.map(el => `${el.element_type}-${el.data.id}`),
        [recipeElements]);

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
                                data: {...item.data, [fieldName]: value}
                            };
                        case 'labour':
                            return {
                                ...item,
                                data: {...item.data, [fieldName]: value}
                            };
                        case 'subrecipe':
                            return {
                                ...item,
                                data: {...item.data, [fieldName]: value}
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
            <div className="box recipe-elements-list mt-4">
                <p>This recipe has no ingredients or labour steps defined yet.</p>
            </div>
        );
    }
    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;

        if (active && over && active.id !== over.id) {
            // Keep a copy of the original order in case of API failure
            const originalItems = [...recipeElements];

            const oldIndex = sortableIds.indexOf(active.id as string);
            const newIndex = sortableIds.indexOf(over.id as string);

            // Create the new sorted array for an optimistic UI update
            const newItems = arrayMove(originalItems, oldIndex, newIndex);

            // 1. Optimistically update the UI
            setRecipeElements(newItems);

            // 2. Prepare the data payload for the API
            const orderUpdatePayload: IElementOrderUpdate[] = newItems.map((item, index) => ({
                element_type: item.element_type,
                id: item.data.id,
                sort_order: index,
            }));

            // 3. Make the API call to persist the changes
            if (auth.user?.access_token) {
                console.log('pushing new sort order to API');
                updateRecipeElementsOrder(recipe_id, orderUpdatePayload, auth.user.access_token)
                    .then(() => showFlashMessage('Order saved!', 'success'))
                    .catch((err) => {
                        console.error("Failed to save new order:", err);
                        showFlashMessage('Failed to save order. Reverting.', 'danger');
                        setRecipeElements(originalItems); // Revert to the old order on failure
                    });
            }
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <SortableContext items={sortableIds}>
                <Droppable droppableId="droppable-recipe-elements">

                    <div className="box recipe-elements-list">
                        <h3 className="title is-5">Recipe Elements ({recipeElements?.length})</h3>


                        <div className="block">
                            <button
                                className={`button is-info ${isAiAnalysisLoading ? 'is-loading' : ''}`}
                                onClick={handleFetchAiAnalysis}
                                disabled={isAiAnalysisLoading}
                            >
                                Get AI Analysis
                            </button>
                            {aiAnalysisError && (
                                <p className="help is-danger mt-2">Could not load AI analysis: {aiAnalysisError}</p>
                            )}
                        </div>
                        <LoadingBar
                            isLoading={isAiAnalysisLoading}
                            max_duration={95}
                        />

                        {/*/!*todo - move this into a component  to format ai analysis in a standard format*!/*/}
                        {/*<div>*/}
                        {/*    {aiAnalysis && aiAnalysis.overall_opinion && (*/}
                        {/*    <div className=" is-info is-light">*/}
                        {/*        <h4 className="title is-6">AI Opinion</h4>*/}
                        {/*        <p>{aiAnalysis.overall_opinion.summary}</p>*/}
                        {/*    </div>*/}

                        {/*)}*/}
                        {/*</div>*/}

                        <RecipeAIOverview aiAnalysis={aiAnalysis}/>



                        <ul style={{listStyle: 'none', paddingLeft: 0}}>
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
                                            onSave: () => {
                                            },
                                            onChange: (fieldName, value) => handleChange(element.data.id, 'ingredient', fieldName, value),
                                            onEdit: (fieldName, value, originalValue) => handleEdit(element.data.id, 'ingredient', fieldName, value, originalValue),
                                            onDelete: () => handleDelete(element.data.id, 'ingredient'),
                                            onCancel: () => {
                                            },
                                            isSaving: false,
                                            aiAnalysis: aiAnalysis,
                                            isModal: false
                                        };
                                        return (
                                            <SortableItem key={key} id={key}>
                                                <ElementComponent {...elementProps} />
                                            </SortableItem>
                                        );
                                    }

                                    case 'labour': {
                                        const ElementComponent = recipeElementConfig.labour.component;
                                        // Inside this block, TS knows element.data is IRecipeLabour
                                        const elementProps: IGenericFormProps<IRecipeLabour> = {
                                            formData: element.data,
                                            onSave: () => {
                                            },
                                            onChange: (fieldName, value) => handleChange(element.data.id, 'labour', fieldName, value),
                                            onEdit: (fieldName, value, originalValue) => handleEdit(element.data.id, 'labour', fieldName, value, originalValue),
                                            onDelete: () => handleDelete(element.data.id, 'labour'),
                                            onCancel: () => {
                                            },
                                            isSaving: false,
                                            aiAnalysis: aiAnalysis,
                                            isModal: false
                                        };
                                        return (
                                            <SortableItem key={key} id={key}>
                                                <ElementComponent {...elementProps} />
                                            </SortableItem>
                                        );
                                    }

                                    case 'subrecipe': {
                                        const ElementComponent = recipeElementConfig.subrecipe.component;
                                        // Inside this block, TS knows element.data is IRecipeSubRecipe
                                        const elementProps: IGenericFormProps<IRecipeSubRecipe> = {
                                            formData: element.data,
                                            onSave: () => {
                                            },
                                            onChange: (fieldName, value) => handleChange(element.data.id, 'subrecipe', fieldName, value),
                                            onEdit: (fieldName, value, originalValue
                                            ) => handleEdit(element.data.id, 'subrecipe', fieldName, value, originalValue),
                                            onDelete: () => handleDelete(element.data.id, 'subrecipe'),
                                            onCancel: () => {
                                            },
                                            isSaving: false,
                                            aiAnalysis: aiAnalysis,
                                            isModal: false
                                        };
                                        return (
                                            <SortableItem key={key} id={key}>
                                                <ElementComponent {...elementProps} />
                                            </SortableItem>
                                        );
                                    }

                                    default:
                                        // Handle unexpected element types gracefully
                                        return null;
                                }
                            })}
                        </ul>
                    </div>


                </Droppable>
            </SortableContext>
        </DndContext>
    );
};

export default RecipeElementList;