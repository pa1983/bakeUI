import {useAlert} from "../../contexts/CustomAlertContext.tsx"
import React from 'react';

interface MoreInfoProps {
    // Accept any renderable content for the alert body
    message: React.ReactNode;
    // Add an optional string for the hover tooltip
    title?: string;
}

const MoreInfo = ({ message, title }: MoreInfoProps) => {
    const { showAlert } = useAlert();

    const handleClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        // The showAlert function now receives the React.ReactNode
        showAlert(message, title);
    };

    // Determine the text for the tooltip.
    // If a 'title' prop is given, use it.
    // Otherwise, if the message is a simple string, use that.
    // As a final fallback, use a generic default.
    const tooltipText = title || (typeof message === 'string' ? message : 'More information');

    return (
        <span
            className="icon is-small has-text-info"
            onClick={handleClick}
            title={tooltipText} // Use the derived string tooltip
            style={{ cursor: 'pointer' }}
        >
            <i className="fas fa-info-circle"></i>
        </span>
    );
};

export default MoreInfo;

// import useAlert from "../../contexts/CustomAlertContext.tsx"
//
//
// import React from 'react';
//
// interface MoreInfoProps {
//     message: string;
// }
//
// const MoreInfo = ({ message }: MoreInfoProps) => {
//     const { showAlert } = useAlert();
//
//     const handleClick = (event: React.MouseEvent) => {
//         event.stopPropagation();
//         showAlert(message);
//     };
//
//     return (
//         <span
//             className="icon is-small has-text-info"
//             onClick={handleClick}
//             title={message}
//             style={{ cursor: 'pointer' }}
//         >
//             <i className="fas fa-info-circle"></i>
//         </span>
//     );
// };
//
// export default MoreInfo;