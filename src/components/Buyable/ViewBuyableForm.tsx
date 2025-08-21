import { useParams } from 'react-router-dom';

import { createEmptyBuyable } from '../../models/IBuyable';
import { fetchBuyable, postNewBuyable } from '../../services/buyableService';
import { useData } from '../../contexts/DataContext';

import BuyableForm from './BuyableForm';
import { ElementView } from '../Common/ElementView';
import { type ElementFormConfig } from '../../hooks/useElementFormLogic';
import type {IBuyable} from '../../models/IBuyable';

interface ViewBuyableFormProps {
    prop_element_id?: string | number;
    onSuccess?: (id: number) => void;
    isModal?: boolean;
}

const ViewBuyableForm = ({ prop_element_id, onSuccess, isModal }: ViewBuyableFormProps) => {
    const { id: param_id } = useParams<{ id: string }>();
    const { refetchBuyables : refetchDataList } = useData();

    const elementId = prop_element_id ?? param_id;

    const buyableConfig: ElementFormConfig<IBuyable, 'id'> = {
        // Use the determined elementId - coming either from params or props
        prop_element_id: elementId,
        primaryKeyName: 'id',
        elementName: 'Buyable',
        apiEndpoint: 'buyable',
        createEmptyElement: createEmptyBuyable,
        getElement: fetchBuyable,
        postNewElement: postNewBuyable,
        refetchDataList: refetchDataList,
        FormComponent: BuyableForm,
        // Pass the modal-specific props through the config
        onSuccess: onSuccess,
        isModal: isModal,
    };

    return (
        <ElementView
            config={buyableConfig}
        />
    );
};

export default ViewBuyableForm;