import {useFlashState} from '../../contexts/FlashContext.tsx'
import React from "react";

export const FlashMessage = () => {
    const {message, type, visible} = useFlashState(null, 'success', true);
    console.log(`Flash type: ${type}`);
    if (!visible) {
        return null;
    }

    // Using Bulma classes for styling
    return (

        <div className={`notification is-${type} flash-message`}>
            {message}
        </div>

    );
};