import { createListView } from '../ListView/createListView';
import type { ListViewConfig } from '../../config/listViewConfig';

// Define the configuration for the Brand list view to be passed to the factory function, createListView
const brandListConfig: ListViewConfig = {
    title: 'Brand',
    endpoint: 'buyable/brand',
    pickerArraySelector: (data) => data.PickerBrandArray,
};

// Create the component by calling the factory
const BrandList = createListView(brandListConfig);

// export the component
export default BrandList;