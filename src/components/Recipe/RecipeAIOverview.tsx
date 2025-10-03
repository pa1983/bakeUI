import {useState} from 'react';
import type {AIRecipeAnalysis} from '../../models/RecipeAIAnalysis';
import '../../styles/AIOverview.css';

interface ReviewItemCardProps {
    aiAnalysis: AIRecipeAnalysis | null;
}

const RecipeAIOverview = ({aiAnalysis}: ReviewItemCardProps) => {
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

    if (!aiAnalysis) {
        return null; // Or render a placeholder if no item is provided
    }
    // 1. Get the array of severity numbers using map()
    const severityNumbers = aiAnalysis.items_for_review.map(item => item.severity);

    const severityDisplay = getSeverityDisplay(Math.min(...severityNumbers));

    if (!aiAnalysis) return (<></>);

    return (

        <div
            className="card mb-3 ml-5 is-shadowless has-text-light image-box"> {/* Removed default shadow for line item usage */}
            <header className="card-header is-clickable" onClick={() => setIsOpen(!isOpen)}>
                <p className="card-header-title is-size-5 py-2"> {/* Smaller title for compactness */}
                    <span className={`icon is-medium mr-2 ${severityDisplay.colorClass}`}>
            <i className={severityDisplay.iconClass}></i>

          </span>
                    <span>AI Overview : {severityDisplay.text}         </span>
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
                    <p className="mb-2">
                        {aiAnalysis.overall_opinion.summary}
                    </p>

                    {aiAnalysis.overall_opinion.potential_missing_items && aiAnalysis.overall_opinion.potential_missing_items.length > 0 && (
                        <div className="mt-3">
                            <p><strong>Potential Missing Items:</strong></p>
                            <ul>
                                {aiAnalysis.overall_opinion.potential_missing_items.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                </div>
            </div>
        </div>

    );
};

export default RecipeAIOverview;