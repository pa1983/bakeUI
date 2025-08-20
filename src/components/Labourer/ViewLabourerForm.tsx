import React from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';

import {fetchLabourer, postNewLabourer} from '../../services/labourerService';
import {createEmptyLabourer} from "../../models/ILabourer.ts";
import { ElementView } from '../common/ElementView';
import { type ElementFormConfig } from '../../hooks/useElementFormLogic';

import type {ILabourer} from "../../models/ILabourer.ts";
import LabourerForm from './LabourerForm';

const ViewLabourerForm = () => {
    const { id } = useParams<{ id: string }>();
    const { refetchLabourers : refetchDataList } = useData();
    const labourerConfig: ElementFormConfig<ILabourer, 'id'> = {
        prop_element_id: id,
        primaryKeyName: 'id',
        elementName: 'Labourer',
        apiEndpoint: 'labourer',
        createEmptyElement: createEmptyLabourer,
        getElement: fetchLabourer,
        postNewElement: postNewLabourer,
        refetchDataList: refetchDataList,
        FormComponent:LabourerForm
    };

    return (
        <ElementView
            config={labourerConfig}

        />
    );
};

export default ViewLabourerForm;