import React, {createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode} from 'react';

interface Shortcut {
    id: symbol; // unique id for each shortcut
    key: string;
    callback: () => void;  // to be called in detection of shortcut sequence
    ctrl: boolean;
}

// Define what the context will provide
interface ShortcutContextType {
    addShortcut: (shortcut: Omit<Shortcut, 'id'>) => symbol; // shortcut.id will be created later as a unique symbol
    removeShortcut: (id: symbol) => void;
}

const KeyboardShortcutContext = createContext<ShortcutContextType | null>(null);

// The Provider component that will wrap the application
export const KeyboardShortcutProvider = ({children}: { children: ReactNode }) => {
    const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);

    const addShortcut = useCallback((shortcut: Omit<Shortcut, 'id'>): symbol => {
        const id = Symbol('shortcut');  // generate a unique ID for the shortcut created
        setShortcuts(prev => [...prev, {...shortcut, id}]);  // update the Shortcuts state array
        return id;
    }, []);

    const removeShortcut = useCallback((id: symbol) => {
        setShortcuts(prev => prev.filter(s => s.id !== id));
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Find a matching shortcut
            const shortcut = shortcuts.find(s =>
                s.key?.toLowerCase() === event.key?.toLowerCase() &&
                s.ctrl === (event.ctrlKey || event.metaKey) // Handle Ctrl (Win) and Cmd (Mac)
            );

            if (shortcut) {
                event.preventDefault();
                shortcut.callback();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [shortcuts]); // Rerun if the list of shortcuts changes

    return (
        <KeyboardShortcutContext.Provider value={{addShortcut, removeShortcut}}>
            {children}
        </KeyboardShortcutContext.Provider>
    );
};
//  custom hook that components will use
export const useShortcut = (
    // Allow key and callback to be null to disable the hook
    key: string | null,
    callback: (() => void) | null,
    options: { ctrl?: boolean } = {}
) => {
    const context = useContext(KeyboardShortcutContext);
    if (!context) {
        throw new Error('useShortcut must be used within ShortcutProvider');
    }

    const { addShortcut, removeShortcut } = context;

    //  Use a ref to store the callback. This prevents the effect from re-running
    //    every time the parent re-renders if the callback is an inline function.
    const savedCallback = useRef(callback);
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);


    useEffect(() => {
        // Guard clause - If key or callback is missing, do nothing.
        if (!key || !savedCallback.current) {
            return;
        }

        const handler = () => {
            if (savedCallback.current) {
                savedCallback.current();
            }
        };

        const id = addShortcut({
            key,
            callback: handler,
            ctrl: options.ctrl || false,
        });

        // Cleanup function
        return () => {
            removeShortcut(id);
        };

    }, [key, options.ctrl, addShortcut, removeShortcut]);
};