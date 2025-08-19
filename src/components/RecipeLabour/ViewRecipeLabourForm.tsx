import React from 'react';
import { useParams } from 'react-router-dom';

import { createEmptyBuyable } from '../../models/IBuyable';
import {fetchRecipeLabour, postNewRecipeLabour} from "../../services/recipeLabourService.ts";
import { useData } from '../../contexts/DataContext';


import RecipeLabourForm from "./RecipeLabourForm.tsx";
import { ElementView } from '../common/ElementView';
import { type ElementFormConfig } from '../../hooks/useElementFormLogic';
import type {IRecipeLabour} from "../../models/IRecipeLabour.ts";

// todo - don't think i use this now - confirm and delete.

const ViewLabourerForm = () => {
    const { id } = useParams<{ id: string }>();  // ID of the labourer element to display
    const { refetchLabourers : refetchDataList } = useData();
    ``
    const recipeLabourerConfig: ElementFormConfig<IRecipeLabour> = {
        prop_element_id: id,
        primaryKeyName: 'id' as const,
        elementName: 'Recipe Labour Item',
        apiEndpoint: 'recipe_labour',
        createEmptyElement: createEmptyBuyable,
        getElement: fetchRecipeLabour,
        postNewElement: postNewRecipeLabour,
        refetchDataList: refetchDataList,
        FormComponent:RecipeLabourForm
    };

    return (
        <ElementView
            config={recipeLabourerConfig}

        />
    );
};

export default ViewLabourerForm;