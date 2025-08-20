import useAlert from "../../contexts/CustomAlertContext.tsx"


import React from 'react';

interface MoreInfoProps {
    message: string;
}

const MoreInfo = ({ message }: MoreInfoProps) => {
    // You might be using a different context hook, like useFlash, adjust as needed.
    const { showAlert } = useAlert();

    const handleClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        showAlert(message);
    };

    return (
        <span
            className="icon is-small has-text-info"
            onClick={handleClick}
            // The title is the native browser tooltip on hover.
            title={message}
            style={{ cursor: 'pointer' }}
        >
            <i className="fas fa-info-circle"></i>
        </span>
    );
};

export default MoreInfo;