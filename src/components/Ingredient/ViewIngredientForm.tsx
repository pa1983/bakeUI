import React from 'react';
import { useParams } from 'react-router-dom';

import { createEmptyIngredient } from '../../models/IIngredient';
import { fetchIngredient, postNewIngredient } from '../../services/ingredientService';
import { useData } from '../../contexts/DataContext';
import IngredientForm from './IngredientForm';
import { ElementView } from '../common/ElementView';

const ViewIngredientForm = () => {
    const { id } = useParams<{ id: string }>();
    const { refetchIngredients : refetchDataList } = useData();

    const IngredientConfig = {
        prop_element_id: id,
        primaryKeyName: 'ingredient_id' as const,
        elementName: 'Ingredient',
        apiEndpoint: 'ingredient',
        createEmptyElement: createEmptyIngredient,
        getElement: fetchIngredient,
        postNewElement: postNewIngredient,
        refetchDataList: refetchDataList,
        FormComponent:IngredientForm
    };

    return (
        <ElementView
            config={IngredientConfig}
        />
    );
};

export default ViewIngredientForm;