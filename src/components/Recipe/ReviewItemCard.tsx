import{ useState } from 'react';
import type {ItemForReview} from '../../models/RecipeAIAnalysis';
interface ReviewItemCardProps {
    itemForReview: ItemForReview;
}

const ReviewItemCard = ({ itemForReview }:ReviewItemCardProps) => {
    const [isOpen, setIsOpen] = useState(true);

    // Function to get icon and color classes for severity
    const getSeverityDisplay = (severity: number) => {
        switch (severity) {
            case 1: // Critical
                return {
                    iconClass: 'fas fa-exclamation-triangle', // Font Awesome CDN class
                    colorClass: 'has-text-danger', // Bulma class
                    text: 'Critical'
                };
            case 2: // Warning
                return {
                    iconClass: 'fas fa-exclamation-circle',
                    colorClass: 'has-text-warning',
                    text: 'Warning'
                };
            case 3: // Information (or any other less severe)
            default:
                return {
                    iconClass: 'fas fa-info-circle',
                    colorClass: 'has-text-info',
                    text: 'Information'
                };
        }
    };

    if (!itemForReview) {
        return null; // Or render a placeholder if no item is provided
    }

    const severityDisplay = getSeverityDisplay(itemForReview.severity);

    return (
        <div className="card mb-3 is-shadowless image-box"> {/* Removed default shadow for line item usage */}
            <header className="card-header is-clickable" onClick={() => setIsOpen(!isOpen)}>
                <p className="card-header-title is-size-5 py-2"> {/* Smaller title for compactness */}
                    <span className={`icon is-medium mr-2 ${severityDisplay.colorClass}`}>
            <i className={severityDisplay.iconClass}></i>

          </span>
                    <span>{severityDisplay.text}</span>
                    {/*<span className="ml-2 tag is-dark is-size-5"></span> /!* Tag for cost_type *!/*/}
                </p>
                <button
                    className="card-header-icon"
                    aria-label="Toggle details"
                >
          <span className="icon is-small">
            <i className={isOpen ? 'fas fa-angle-up' : 'fas fa-angle-down'}></i>
          </span>
                </button>
            </header>
            <div className={`card-content p-3 ${isOpen ? '' : 'is-hidden'}`}> {/* Smaller padding for content */}
                <div className="content is-size-6"> {/* Smaller font for content */}
                    <p className="mb-2" title={`Item ID: ${itemForReview.item_id}`}>
                        <strong>Comment:</strong> {itemForReview.comment}
                    </p>
                    { itemForReview.total_cost === 0 &&
                    <p>
                        Item cost recorded as zero - check a suitable value has been entered
                    </p>
                    }
                    <div className="is-flex is-justify-content-space-between is-align-items-center mt-3">
                        <span><strong>Total Cost:</strong> £{itemForReview.total_cost.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewItemCard;