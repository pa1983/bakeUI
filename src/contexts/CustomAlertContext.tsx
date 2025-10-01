import { createContext, useState, useContext, type ReactNode } from 'react';
// import '../../styles/CustomAlert.css'; // We'll create this for styling

interface AlertState {
    content: ReactNode;
    title?: string;
    isOpen: boolean;
}

interface AlertContextType {
    showAlert: (content: ReactNode, title?: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
    const [alertState, setAlertState] = useState<AlertState>({
        content: null,
        title: '',
        isOpen: false,
    });

    const showAlert = (content: ReactNode, title?: string) => {
        setAlertState({ content, title, isOpen: true });
    };

    const hideAlert = () => {
        setAlertState({ content: null, title: '', isOpen: false });
    };

    const value = { showAlert };

    return (
        <AlertContext.Provider value={value}>
            {children}
            {alertState.isOpen && (
                <div className="modal is-active">
                    <div className="modal-background" onClick={hideAlert}></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">{alertState.title || 'Information'}</p>
                            <button className="delete" aria-label="close" onClick={hideAlert}></button>
                        </header>
                        <section className="modal-card-body">
                            {/* This now correctly renders string or complex React nodes */}
                            {alertState.content}
                        </section>
                        <footer className="modal-card-foot">
                            <button className="button" onClick={hideAlert}>Close</button>
                        </footer>
                    </div>
                </div>
            )}
        </AlertContext.Provider>
    );
};

// Make sure to wrap your app in this provider, e.g., in App.tsx or main.tsx
/*
<AlertProvider>
  <App />
</AlertProvider>
*/