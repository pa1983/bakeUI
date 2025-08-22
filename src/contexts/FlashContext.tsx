// C:/web/bake/src/contexts/FlashContext.tsx
import {createContext, useState, useContext, type ReactNode, useEffect, useCallback, useMemo} from 'react';

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

    // useEffect hook manages the timer and its cleanup
    useEffect(() => {
        // If a message is not visible, do nothing.
        if (!flashState.visible) {
            return;
        }

        // Set up the timer to hide the message after a delay.
        const timerId = setTimeout(() => {
            setFlashState((prevState) => ({...prevState, visible: false}));
        }, 3000); // Message disappears after 3 seconds

        // This runs if the component unmounts or if the effect runs again.
        return () => {
            clearTimeout(timerId);
        };
    }, [flashState]);


    // callback and memo below to fix multiple-rerender bug on invoice viewer when any changes were made to form conts
    // wrapped in useCallback to gives the function a stable identity across re-renders, preventing it
    // from triggering updates in components that consume it via the useFlash hook.
    // The dependency array is empty because setFlashState is guaranteed to be stable.
    const showFlashMessage = useCallback((message: string, type: FlashMessageType) => {
        setFlashState({message, type, visible: true});
    }, []);

    // This ensures that the object passed to the provider is consistent across renders
    const contextValue = useMemo(() => ({
        showFlashMessage
    }), [showFlashMessage]);

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
