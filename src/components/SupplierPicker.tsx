import React from "react";

// Define the shape of the props object
interface SupplierPickerProps {
    supplierName: string;
    selectedSupplierId: number | string; // The currently selected ID
    handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleBlur: (e: React.FocusEvent<HTMLSelectElement>) => void;
}
// todo - add some logic to try and find the best match against current list of supplier
// todo - add an option in the drop down to create a new supplier, opening a create supplier modal form
// todo - populate list of suppliers from an api call, possibly store this at a context level to avoid calls each time a new invoice is opened

const SupplierPicker = ({ supplierName, selectedSupplierId, handleChange, handleBlur }: SupplierPickerProps) => {
    return (
        <div className="field">
            <label className="label">Supplier to match <strong>{supplierName}</strong></label>
            <div className="control">
                <div className="select is-fullwidth">
                    {/* The value now comes from a prop */}
                    <select
                        name="supplier_id"
                        value={selectedSupplierId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    >
                        <option value="" disabled>Select a supplier</option>
                        <option value="1">Draynes Farm</option>
                        <option value="2">Sysco</option>
                        <option value="2">La Rousse</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default SupplierPicker;