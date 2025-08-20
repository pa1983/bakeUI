// pickerModal.tsx

import Picker from './Picker.tsx';
import {type IPickerModalConfig} from '../../models/picker.ts';


// define the shape of pickerArray as an interface to ensure that it always receives correct elements to function
// a list of elements.  Elements: name, description, image_url?
function PickerModal({
                         isPickerModalActive,  // modal is active value passed from parent state.  onClose callback controls this, changing it to false if onClose is clicked, or onSelect in an element where onClose is also called
                         addNewFormActive,
                         addNewComponent,
                         pickerArray,
                         pickerTitle,
                         pickerOnSelect,  // to be passed on to the picker elements to allow it to update the grandparent function from where the picker list is called
                         onClose,
                         pickerOnAddNewClicked  // callback for the preferred method of triggering an 'add new' form to load.
                     }: IPickerModalConfig) {
    // State variables to hold the fetched data, error, and loading status

    if (!isPickerModalActive) {
        return null;
    }

    return (

        <div className={`modal ${isPickerModalActive ? 'is-active' : ''}`}>


            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">

                {addNewFormActive && addNewComponent ?
                    addNewComponent :
                    <>
                        <header className="modal-card-head">
                            <p className="modal-card-title">{pickerTitle}</p>
                            <button className="delete" aria-label="close" onClick={onClose}></button>
                        </header>
                        <section className="modal-card-body">

                            {/*Conditional logic here - show either the picker or the Add New element.
                    How can I encapsulate various forms in order to make this dynamic?

                    Rather than changing the data being fed TO the modal, could I just have a list of different
                    modals defined that all contain the necessary fields and components?

                    This is then selected and made visible by the same trigger?

                    */}


                            <Picker
                                pickerArray={pickerArray}
                                pickerTitle={pickerTitle}
                                pickerOnSelect={pickerOnSelect}
                                onClose={onClose}
                                pickerOnAddNewClicked={pickerOnAddNewClicked}
                            ></Picker>


                        </section>
                    </>
                }
            </div>
        </div>
    );
}

export default PickerModal;