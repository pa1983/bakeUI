import { useFlashState } from '../../contexts/FlashContext.tsx';
import React from "react";

export const FlashMessage = () => {
    // Note: I'm assuming your useFlashState hook works as intended.
    // The default values here might not be active if the context provides others.
    const { message, type, visible, setVisible } = useFlashState();

    // The component is not rendered at all if not visible, which is perfect.
    if (!visible) {
        return null;
    }

    return (
        <div className={`notification is-${type}`} onClick={() => setVisible(false)}>
            {message}
        </div>
    );
};