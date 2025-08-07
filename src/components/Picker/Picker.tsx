import PickerListElementCard from "./PickerListElementCard.tsx";
import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import type {PickerProps} from "../../models/picker.ts";


function Picker({
                    pickerArray,
                    pickerTitle,
                    pickerOnSelect,  // to be passed on to the picker elements to allow it to update the grandparent function from where the picker list is called
                    onClose,
                    pickerOnAddNewClicked  // callback for preferred method of triggering an add new form to load.
                }: PickerProps) {


    const [error, setError] = useState(null); // Added setError  // todo - add error handlers in all functions that setError if there's an issue - currently error is never set, even on error
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');  // search variable


    // SET FOCUS ELEMENT
    //create a ref for the input element to be focussed on first render
    const focusInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // On first render, focus on the element with ref = focusInputRef
        focusInputRef.current?.focus();
    }, []);
    //

    // filter the array against the searchterm, looking in both the title and description
    const filteredPickerArray = pickerArray.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // value of the search bar has changed - set newSearchTerm to the new search value
        const newSearchTerm = event.target.value;
        setSearchTerm(newSearchTerm);
    };


    return (
        <div className="section">
            <h1 className="title is-3 has-text-grey-light">{pickerTitle}</h1>

            {/* Controls Section using Bulma's columns for responsive layout */}
            <div className="columns is-vcentered mb-5">
                <div className="column is-9">
                    <div className="field">
                        <p className="control has-icons-left">
                            <input
                                ref={focusInputRef}  // set initial focus so can start typing without clicking into search bar
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
                 {/*conditionally render the add new button only if a callback has been defined */}
                {pickerOnAddNewClicked && (
                <div className={`column is-3`}>
                    <button
                        className="button is-info is-medium is-fullwidth"
                        onClick={pickerOnAddNewClicked}  // trigger the onAddNew callback to apply the preferred method of triggering an add new form to load
                    >
                        Add New
                    </button>
                </div>
                    )}
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
                            <PickerListElementCard

                                imageUrl={item.imageUrl}
                                title={item.title}
                                subtitle={item.subtitle}
                                id={item.id}
                                onSelect={pickerOnSelect}
                                onClose={onClose}

                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Picker;