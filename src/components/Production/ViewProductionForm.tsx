import {useParams} from 'react-router-dom';
import {useData} from '../../contexts/DataContext';
import {ElementView} from '../Common/ElementView';
import {type ElementFormConfig} from '../../hooks/useElementFormLogic';

import ProductionForm from './ProductionForm.tsx';
import {createEmptyProductionLog, type IProductionLog} from "../../models/IProductionLog.ts";
import {fetchProductionLog, postProductionLog} from "../../services/productionLogService.ts";

interface ViewProductionFormProps {
    prop_element_id?: string | number;
    onSuccess?: (id: number) => void;
    isModal?: boolean;
}

const ViewProductionForm = (
    {prop_element_id, onSuccess, isModal = false}: ViewProductionFormProps
) => {
    const {id: param_id} = useParams<{ id: string }>();
    const elementId = prop_element_id ?? param_id;

    const {refetchLabourers: refetchDataList} = useData();
    const ProductionConfig: ElementFormConfig<IProductionLog, 'id'> = {
        // Use the determined elementId - coming either from params or props
        prop_element_id: elementId,
        primaryKeyName: 'id',
        elementName: 'Production Log Entry',
        apiEndpoint: 'production',
        createEmptyElement: createEmptyProductionLog,
        getElement: fetchProductionLog,
        postNewElement: postProductionLog,
        refetchDataList: refetchDataList,
        FormComponent: ProductionForm,
        onSuccess: onSuccess,
        isModal: isModal

    };

    return (
        <ElementView
            config={ProductionConfig}

        />
    );
};

export default ViewProductionForm;