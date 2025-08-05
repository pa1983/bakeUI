import React, {useState, useEffect, useMemo, useCallback} from 'react';
import Picker from "../Picker/Picker.tsx";
import {useInvoice} from "../../contexts/InvoiceContext.tsx";
import type {PickerElement} from '../../models/picker.ts';
import type { Supplier } from '../../models/supplier.ts';
import {useNavigate} from "react-router-dom";


function SupplierList() {
    //  will be called from router /supplier/suppliers


    const {suppliers} = useInvoice();
    const navigate = useNavigate();
    const endpoint = 'supplier';
    // todo - can i add friendly date component to the subtitle to extract the text output so it renders nicely?
    const pickerArray = useMemo(() => {
        return suppliers.map((supplier: Supplier): PickerElement => ({
            id: supplier.supplier_id,
            title: supplier.supplier_name,
            subtitle: supplier.notes || '',
            imageUrl: null
        }))
    }, [suppliers]);

    const ElementOnSelect = useCallback((id: number | string) => {
            // render the brand element form  by going to the router link??
            console.log(`supplier element id ${id} selected - create a form viewer now.  how to display the form?`);
            // # todo - have this onSelect go to the full brand form.  how? using router?
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
                pickerTitle='Suppliers'
                onSelect={ElementOnSelect}  // to be passed on to the picker elements to allow it to update the grandparent function from where the picker list is called
                onClose={pickerOnClose}
            />
        </>
    )
}

export default SupplierList;