import { createListView } from '../ListView/createListView';
import type { ListViewConfig } from '../../config/listViewConfig';

const LabourerListConfig: ListViewConfig = {
    title: 'Labourer',
    endpoint: 'labourer',
    pickerArraySelector: (data) => data.PickerLabourerArray,
};
// Create the component by calling the factory
const LabourerList = createListView(LabourerListConfig);

export default LabourerList;