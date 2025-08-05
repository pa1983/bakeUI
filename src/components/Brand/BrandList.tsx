import React, {useState, useEffect, useMemo, useCallback} from 'react';
import Picker from "../Picker/Picker.tsx";
import {useInvoice} from "../../contexts/InvoiceContext.tsx";
import type {Brand} from '../../models/brand.ts';
import type {PickerElement} from '../../models/picker.ts';
import {useNavigate} from "react-router-dom";


function BrandList() {
    // thin layer over picker to display brand list.  This component simply reshapes the data array and defines the
    // callbacks
    //  will be called from router /brand/all
    const {brands} = useInvoice();
    const navigate = useNavigate();
    const endpoint = 'buyable/brand';


    const pickerArray = useMemo(() => {
        return brands.map((brand: Brand): PickerElement => ({
            id: brand.brand_id,
            title: brand.brand_name,
            subtitle: `${brand.notes || '      \n\n'}`,
            imageUrl: null
        }))
    }, [brands]);

    const elementOnSelect = useCallback((id: number | string) => {
            // navigate to the element form
            navigate(`/${endpoint}/${id}`);
        },
        []);

    const pickerOnClose = useCallback(() => {
            // nothing required here - no modal to close etc.
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