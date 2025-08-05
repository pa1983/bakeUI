import React, {useState, useEffect} from 'react';
import Picker from "../Picker/Picker.tsx";

function BrandList() {
// layer over picker to display brand list.
    //  will be called from router /brand/all

    return (
        <Picker
            pickerArray={}
            pickerTitle={}
            onSelect={}  // to be passed on to the picker elements to allow it to update the grandparent function from where the picker list is called
            onClose={}
        />
    )
}

export default BrandList;