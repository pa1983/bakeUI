import { useData } from '../../contexts/DataContext.tsx';
import type { IProductionType } from '../../models/IProductionType.ts';

// --- Type Definitions ---
interface ProductionTypeSelectorProps {
    value?: number;
    onChange: (value: number) => void;
}

/**
 * A helper function to determine the Bulma class for a button based on the production type name.
 * @param typeName The name of the production type (e.g., "Product", "Waste").
 * @returns A string with the appropriate Bulma color class.
 */
const getButtonClass = (typeName: string): string => {
    switch (typeName.toLowerCase()) {
        case 'product':
            return 'is-primary';
        case 'test':
            return 'is-warning';
        case 'waste':
            return 'is-danger';
        default:
            return 'is-info'; // A sensible default
    }
};

function ProductionTypeSelector({ value, onChange }: ProductionTypeSelectorProps) {
    const { productionTypes } = useData();

    return (
        // Use Bulma's "buttons has-addons" class to group the buttons
        <div className="buttons has-addons">
            {productionTypes.map((type: IProductionType) => (
                <button
                    key={type.id}
                    // Set type="button" to prevent default form submission
                    type="button"
                    // Dynamically set the class based on the 'value' prop
                    className={`button ${getButtonClass(type.name)} ${
                        type.id === value ? 'is-link is-selected' : 'is-light'
                    }`}
                    // Call the parent's onChange handler when clicked
                    onClick={() => onChange(type.id)}
                >
                    {type.name}
                </button>
            ))}
        </div>
    );
}

export default ProductionTypeSelector;