    import { createListView } from '../ListView/createListView';
    import type { ListViewConfig } from '../../config/listViewConfig';

    // 1. Define the configuration for the Buyable list
    const buyableListConfig: ListViewConfig = {
        title: 'Buyable Item',
        endpoint: 'buyable',
        pickerArraySelector: (data) => data.PickerBuyableArray,  // get data array by name from data context.
    };

    // 2. Create the component by calling the factory
    const BuyableList = createListView(buyableListConfig);

    // 3. Export the resulting component
    export default BuyableList;