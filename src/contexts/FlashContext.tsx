import React, {createContext, useState, useContext, type ReactNode, useEffect} from 'react';

type FlashMessageType = 'success' | 'danger' | 'info';

interface FlashContextType {
    showFlashMessage: (message: string, type: FlashMessageType) => void;
}

interface FlashState {
    message: string;
    type: FlashMessageType;
    visible: boolean;
}

// Create the context with a default value
const FlashContext = createContext<FlashContextType | undefined>(undefined);
const FlashStateContext = createContext<FlashState | undefined>(undefined);

// Create the provider component
export const FlashProvider = ({children}: { children: ReactNode }) => {
    const [flashState, setFlashState] = useState<FlashState>({
        message: '',
        type: 'info',
        visible: false,
    });

    // This useEffect hook manages the timer and its cleanup
    useEffect(() => {
        // If a message is not visible, do nothing.
        if (!flashState.visible) {
            return;
        }

        // Set up the timer to hide the message after a delay.
        const timerId = setTimeout(() => {
            setFlashState((prevState) => ({...prevState, visible: false}));
        }, 2000); // Message disappears after 2 seconds

        // ✨ Return a cleanup function.
        // This runs if the component unmounts or if the effect runs again.
        return () => {
            clearTimeout(timerId);
        };
    }, [flashState]); // The effect re-runs whenever the flashState changes.

    // This function now ONLY sets the state. The effect handles the timer.
    const showFlashMessage = (message: string, type: FlashMessageType) => {
        // USAGE
        //
        // import useFlash from '../contexts/FlashContext';
        //
        // const { showFlashMessage } = useFlash();
        //
        // showFlashMessage('Here is my message!', 'info');

        setFlashState({message, type, visible: true});
    };

    const contextValue = {showFlashMessage};

    return (
        <FlashContext.Provider value={contextValue}>
            <FlashStateContext.Provider value={flashState}>
                {children}
            </FlashStateContext.Provider>
        </FlashContext.Provider>
    );
};

// Custom hook to easily use the flash message functions
const useFlash = () => {
    const context = useContext(FlashContext);
    if (context === undefined) {
        throw new Error('useFlash must be used within a FlashProvider');
    }
    return context;
};

// Custom hook to get the flash message state
export const useFlashState = () => {
    const context = useContext(FlashStateContext);
    if (context === undefined) {
        throw new Error('useFlashState must be used within a FlashProvider');
    }
    return context;
};

export default useFlash;