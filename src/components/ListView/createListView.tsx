import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Picker from '../Picker/Picker';
import { useData } from '../../contexts/DataContext';
import type { ListViewConfig } from '../../config/listViewConfig';

// Define the props that the generated component will accept.
interface ListViewComponentProps {
    title?: string;
    onSelectOverride?: (id: number | string) => void;
}

/**
 * A factory function that creates a configured list view component.
 * The generated component can accept its own `title` and `onSelectOverride` props
 * to override the initial configuration.
 * @param {ListViewConfig} config - The default configuration for the list view.
 * @returns A React component that renders a configured Picker.
 */
export function createListView(config: ListViewConfig) {
    // These are the default values from the factory configuration.
    const {
        title: configTitle,
        endpoint,
        pickerArray,
        pickerArrayName,
        pickerArraySelector,
        onSelectOverride: configOnSelectOverride,
        onAddNewOverride
    } = config;

    // The generated component accepts its own props.
    const ListViewComponent = (props: ListViewComponentProps) => {
        // Props to be passed directly to the component at render time.
        const { title: propTitle, onSelectOverride: propOnSelectOverride } = props;
        const dataContext = useData();
        const navigate = useNavigate();

        // Determine the data source - can optionally pass one in or pull it from context
        const itemsToRender = useMemo(() => {
            if (pickerArray) return pickerArray;
            if (!dataContext) return [];
            if (pickerArrayName) return dataContext[pickerArrayName] || [];
            if (pickerArraySelector) return pickerArraySelector(dataContext);

            console.warn(`ListView for "${configTitle}" has no valid data source configured.`);
            return [];
        }, [dataContext]);

        // Determine the final values, giving precedence to props.
        // Use the title from props if provided, otherwise fall back to the config title.
        const finalTitle = propTitle || configTitle;

        // Use the onSelect from props if provided, otherwise fall back to the config onSelect.
        const finalOnSelectOverride = propOnSelectOverride || configOnSelectOverride;

        // Update the callback to use the final override function.


        const elementOnSelect = useCallback((id: number | string) => {
                if (finalOnSelectOverride) {
                    console.log('using the override onSelect');
                    finalOnSelectOverride(id);
                } else {
                    navigate(`/${endpoint}/${id}`);
                }
            },
            [navigate, finalOnSelectOverride] 
        );

        const pickerOnAddNewClicked = useCallback(() => {
            if (onAddNewOverride) {
                onAddNewOverride();
            } else {
                navigate(`/${endpoint}/new`);
            }
        }, [navigate]);

        return (
            <Picker
                pickerArray={itemsToRender}
                pickerTitle={finalTitle}
                pickerOnSelect={elementOnSelect}
                onClose={() => {
                }}
                pickerOnAddNewClicked={pickerOnAddNewClicked}
            />
        );
    };

    ListViewComponent.displayName = `${configTitle.replace(/\s/g, '')}ListView`;

    return ListViewComponent;
}