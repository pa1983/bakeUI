import { useParams } from 'react-router-dom';

import {createEmptySupplier} from "../../models/ISupplier.ts";
import {fetchSupplier, postNewSupplier} from "../../services/supplierService.ts";
import { useData } from '../../contexts/DataContext';

import SupplierForm from './SupplierForm';
import { ElementView } from '../Common/ElementView';

const ViewSupplierForm = () => {
    const { id } = useParams<{ id: string }>();  // string even fun numebr since paramas are always strings
    const { refetchSuppliers : refetchDataList } = useData();

    const supplierConfig = {
        prop_element_id: id,
        primaryKeyName: 'supplier_id' as const,
        elementName: 'Supplier',
        apiEndpoint: 'buyable/supplier',
        createEmptyElement: createEmptySupplier,
        getElement: fetchSupplier,
        postNewElement: postNewSupplier,
        refetchDataList: refetchDataList,
        FormComponent:SupplierForm
    };

    return (
        <ElementView
            config={supplierConfig}
        />
    );
};

export default ViewSupplierForm;
