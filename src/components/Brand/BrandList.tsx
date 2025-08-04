import React, {useState, useEffect, useMemo, useCallback} from 'react';
import Picker from "../Picker/Picker.tsx";
import {useInvoice} from "../../contexts/InvoiceContext.tsx";
import type {Brand} from '../../models/brand.ts';
import type {PickerElement} from '../../models/picker.ts';
import {useNavigate} from "react-router-dom";


function BrandList() {
// layer over picker to display brand list.
    //  will be called from router /brand/brands
    const {brands} = useInvoice();
    const navigate = useNavigate();
    const endpoint = 'buyable/brand';

    // todo - can i add friendly date component to the subtitle to extract the text output so it renders nicely?
    const pickerArray = useMemo(() => {
        return brands.map((brand: Brand): PickerElement => ({
            id: brand.brand_id,
            title: brand.brand_name,
            subtitle: brand.notes && '',
            imageUrl: null
        }))
    }, [brands]);

    const elementOnSelect = useCallback((id: number | string) => {
            // navigate to the element form
            console.log(`element id ${id} selected`);
            navigate(`/${endpoint}/${id}`);
        },
        []);

    const pickerOnClose = useCallback(() => {
            console.log('non-modal picker closed - do something?');
        },
        []);

    return (
        <>
            <Picker
                pickerArray={pickerArray}
                pickerTitle='Brand'
                onSelect={elementOnSelect}  // to be passed on to the picker elements to allow it to update the grandparent function from where the picker list is called
                onClose={pickerOnClose}
                addNewLink={`/${endpoint}/new`}
            />
        </>
    )
}

export default BrandList;