import type {IPickerElement} from "../../models/picker.ts";

interface FormFieldWithPickerProps {
    label: string;
    fieldValue: string | number| null;        // The current value to find - can be any database table id type
    pickerArray: IPickerElement[];     // The array to search
    onLaunch: () => void;   // The callback to open the modal - will be defined in the parent component and contain specific details for setting up a particular array
}

/**
 * Component to display the currently selected element from the picker array, and provide logic to handle
 * clicking of the edit button to trigger the population and opening of the picker modal.
 *
 * @param label
 * @param fieldValue
 * @param pickerArray
 * @param onLaunch
 * @constructor
 */
const FormFieldWithPicker = ({
                                 label,
                                 fieldValue,
                                 pickerArray,
                                 onLaunch
                             }: FormFieldWithPickerProps) => {

    // Find the object and get the specific property to display
    const displayValue = pickerArray
        ?.find((element: IPickerElement) => element.id === fieldValue)
        ?.title || 'Not Selected';

    return (
        <div className="field">
            <label className="label">{label}</label>
            {/*<p>picker array keys: {Object.keys(pickerArray[0])}</p>  for toubleshooting*/}
            <div className="is-flex is-align-items-center">
                {pickerArray && pickerArray.length > 0 ? (
                    <strong className="mr-3">{displayValue}</strong>
                ) : (
                    <p className="mr-3 bake-subtitle-subtle">Loading...</p>
                )}

                <span className="icon is-clickable ml-2" onClick={onLaunch} title={`Select ${label}`}>
                    <i className="fa-solid fa-pencil"></i>
                </span>
            </div>
        </div>
    );
//      todo - add an optional thumbnail image where available in pickerArray - simple conditional display if the imageUrl in element is defined
}

export default FormFieldWithPicker;