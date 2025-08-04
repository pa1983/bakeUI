import React from 'react';

interface FormFieldWithPickerProps {
    label: string;
    fieldValue: string | number;        // The current value to find - can be any database table id type
    pickerArray: any[];     // The array to search
    onLaunch: () => void;   // The callback to open the modal
}

const FormFieldWithPicker = ({
                                 label,
                                 fieldValue,
                                 pickerArray,
                                 onLaunch
                             }: FormFieldWithPickerProps) => {

    // Find the object and get the specific property to display
    const displayValue = pickerArray
        ?.find((element: any) => element.id === fieldValue)
        ?.title || 'Not Selected'; // ✅ Corrected optional chaining syntax

    return (
        <div className="field">
            <label className="label">{label}</label>
            {/*<p>picker array keys: {Object.keys(pickerArray[0])}</p>  for toubleshooting*/}
            <div className="is-flex is-align-items-center">
                {pickerArray && pickerArray.length > 0 ? (
                    <strong className="mr-3">{displayValue}</strong>
                ) : (
                    <p className="mr-3 has-text-grey">Loading...</p>
                )}

                <span className="icon is-clickable ml-2" onClick={onLaunch} title={`Select ${label}`}>
                    <i className="fa-solid fa-pencil"></i>
                </span>
            </div>
        </div>
    );
//      todo - add an optional thumbnail image where available in pickerArray
}

export default FormFieldWithPicker;