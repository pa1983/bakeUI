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

const ShortcutContext = createContext<ShortcutContextType | null>(null);

// The Provider component that will wrap the application
export const ShortcutProvider = ({children}: { children: ReactNode }) => {
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
                s.key.toLowerCase() === event.key.toLowerCase() &&
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
        <ShortcutContext.Provider value={{addShortcut, removeShortcut}}>
            {children}
        </ShortcutContext.Provider>
    );
};

//  custom hook that components will use
export const useShortcut = (
    key: string,
                            callback: () => void,
                            options: { ctrl?: boolean } = {}) => {
    const context = useContext(ShortcutContext);
    if (!context) {
        throw new Error('useShortcut must be used within a ShortcutProvider');
    }

    const {addShortcut, removeShortcut} = context;
    const shortcutIdRef = useRef<symbol | null>(null);

    useEffect(() => {
        // Memoize the callback to prevent re-registering on every render
        const memoizedCallback = callback;

        // Register the shortcut and store its ID
        const id = addShortcut({
            key,
            callback: memoizedCallback,
            ctrl: options.ctrl || false,
        });
        shortcutIdRef.current = id;

        // Cleanup - remove the shortcut when the component unmounts or dependencies change
        return () => {
            if (shortcutIdRef.current) {
                removeShortcut(shortcutIdRef.current);
            }
        };
    }, [key, callback, options.ctrl, addShortcut, removeShortcut]);
};