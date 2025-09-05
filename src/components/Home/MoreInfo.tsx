import useAlert from "../../contexts/CustomAlertContext.tsx"


import React from 'react';

interface MoreInfoProps {
    message: string;
}

const MoreInfo = ({ message }: MoreInfoProps) => {
    const { showAlert } = useAlert();

    const handleClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        showAlert(message);
    };

    return (
        <span
            className="icon is-small has-text-info"
            onClick={handleClick}
            title={message}
            style={{ cursor: 'pointer' }}
        >
            <i className="fas fa-info-circle"></i>
        </span>
    );
};

export default MoreInfo;