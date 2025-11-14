import { createListView } from '../ListView/createListView';
import type {ListViewConfig} from '../../config/listViewConfig';
import type {IPickerElement} from "../../models/picker.ts";

interface ProductionListProps {
    pickerArray: IPickerElement[];
    subtitle?: string;
}

const ProductionList = ({ pickerArray, subtitle }: ProductionListProps) => {
    const ProductionListConfig: ListViewConfig = {
        title: 'Production Log',
        endpoint: 'production',
        pickerArray: pickerArray,

    };

    const ListViewComponent = createListView(ProductionListConfig);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return <ListViewComponent subtitle={subtitle} />;
};

export default ProductionList;