// pickerModal.tsx

import React, {useState} from 'react';

import Picker, {type PickerProps} from "./Picker.tsx";

export interface PickerModalProps extends PickerProps{
    isActive: boolean;
}

// define shape of pickerArray as an interface to ensure that it always receives correct elements to function
// list of elements.  Elements: name, description, image_url?
function PickerModal({
                         isActive,  // modal is active value passed from parent state.  onClose callback controls this, changing it to false one onClose is clicked, or onSelect in an element where onClose is also called
                         pickerArray,
                         pickerTitle,
                         onSelect,  // to be passed on to the picker elements to allow it to update the grandparent function from where the picker list is called
                         onClose
                     }: PickerModalProps) {
    // State variables to hold the fetched data, error, and loading status

    const [error, setError] = useState(null);
    //todo -  do i need to pass an error setter down to the picker element or just handle it at the picker level since there's not much to go wrong here - just passing props through?
    console.log(`PickerModal being rerun - isActive state is ${isActive}`);



    if (!isActive) {
        return null;
    }

    if (error) {
        return <p className="text-red-700 p-4 bg-red-100 rounded-md">{error} That didn't work. Why? </p>;
    }

    return (
        <div className={`modal ${isActive ? 'is-active' : ''}`}>
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">{pickerTitle}</p>
                    <button className="delete" aria-label="close" onClick={onClose}></button>
                </header>
                <section className="modal-card-body">

                    <Picker
                    pickerArray={pickerArray}
                    pickerTitle={pickerTitle}
                    onSelect={onSelect}
                    onClose={onClose}
                    ></Picker>



                </section>
            </div>
        </div>
    );
}

export default PickerModal;