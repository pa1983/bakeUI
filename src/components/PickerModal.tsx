// pickerModal.tsx

import React, {useState, useEffect, useCallback} from 'react';
import PickerListElementCard, {type PickerElementProp} from "./PickerListElementCard.tsx";


export interface PickerProps {
    isActive: boolean;
    pickerArray: PickerElementProp[];  // todo change this to an array of PickerElementProps once get it working
    pickerTitle: string;
    onSelect: () => void;  // callback function when an element is selected that doesn't have a return
    onClose: () => void;
}

// define shape of pickerArray as an interface to ensure that it always receives correct elements to function
// list of elements.  Elements: name, description, image_url?
function PickerModal({
                         isActive,  // modal is active value passed from parent state.  onClose callback controls this, changing it to false one onClose is clicked, or onSelect in an element where onClose is also called
                         pickerArray,
                         pickerTitle,
                         onSelect,  // to be passed on to the picker elements to allow it to update the grandparent function from where the picker list is called
                         onClose
                     }: PickerProps) {
    // State variables to hold the fetched data, error, and loading status

    console.log(`PickerModal being rerun - isActive state is ${isActive}`);

    const [error, setError] = useState(null); // Added setError  // todo - add error handlers in all functions that setError if there's an issue - currently error is never set, even on error
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');  // search variable

    // filter the array against the searchterm, looking in both the title and description
    const filteredPickerArray = pickerArray.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // function to combine the onSelect and onClose, so when an element is clicked it updates the selected value into the grandparent and closes down the picker modal

    // const handleOnSelect = useCallback(()=> {
    //     on
    // })

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // value of the search bar has changed - set newSearchTerm to the new search value
        const newSearchTerm = event.target.value;
        setSearchTerm(newSearchTerm);
        // if (newSearchTerm) {
        //     setSearchParams({searchterm: newSearchTerm});  // was this just to change the value in the address bar to match the search ?  don't need this?  // todo - do i just need an arrow function on the search bar to apply setSearchterm?
        // } else {
        //     setSearchParams({}); // Clear the search term
        // }
    };

    // const handleCreateNewClick = () => {
    //     navigate('/ingredient/new'); // Navigate to the new ingredient creation page  // todo - do I want to keep this for adding a new pickerElement?  too complex to make generic?
    // };

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

                    <div className="section">
                        <h1 className="title is-3 has-text-grey-light">{pickerTitle}</h1>

                        {/* Controls Section using Bulma's columns for responsive layout */}
                        <div className="columns is-vcentered mb-5">
                            <div className="column">
                                <div className="field">
                                    <p className="control has-icons-left">
                                        <input
                                            type="text"
                                            placeholder="Search name and description ..."
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            className="input is-medium"
                                        />
                                        <span className="icon is-small is-left">
                                <i className="fas fa-search" aria-hidden="true"></i>
                            </span>
                                    </p>
                                </div>
                            </div>

                            {/*todo - consider conditionally allowing the inclusion of an add new button to create a new element, if suitable.  e.g. not suitable for currency, may be suitable for ingredient*/}
                            {/*<div className="column is-narrow">*/}
                            {/*    <button*/}
                            {/*        onClick={handleCreateNewClick}*/}
                            {/*        className="button is-info is-medium is-fullwidth"*/}
                            {/*    >*/}
                            {/*        Create New Ingredient*/}
                            {/*    </button>*/}
                            {/*</div>*/}
                        </div>

                        {filteredPickerArray.length === 0 && searchTerm === '' && !loading ? (
                            <p className="is-size-5 has-text-grey">Nothing found in picker list</p>
                        ) : filteredPickerArray.length === 0 && searchTerm !== '' ? (
                            <p className="is-size-5 has-text-grey">No matches for your search ("{searchTerm})".</p>
                        ) : (
                            /* Responsive Grid using Bulma columns */
                            <div className="columns is-multiline">
                                {filteredPickerArray.map(item => (
                                    <div key={item.id} className="column is-one-third-desktop is-half-tablet">
                                        {/*// is this the corect place to have the item id?*/}
                                        <PickerListElementCard

                                            imageUrl={item.imageUrl}
                                            title={item.title}
                                            subtitle={item.subtitle}
                                            id={item.id}
                                            onSelect={onSelect}
                                            onClose={onClose}

                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>


                </section>
            </div>
        </div>
    );
}

export default PickerModal;