import {createContext, useState, useContext, type ReactNode} from 'react';
import CustomAlert from '../components/Utility/CustomAlert.tsx';

interface AlertContextType {
    showAlert: (message: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface CustomAlertProviderProps {
    children: ReactNode;
}

export function CustomAlertProvider({children}: CustomAlertProviderProps) {
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const showAlert = (message: string) => {
        setAlertMessage(message);
    };

    const closeAlert = () => {
        setAlertMessage(null);
    };
    const value: AlertContextType = {showAlert};

    return (
        <AlertContext.Provider value={value}>
            {children}
            <CustomAlert message={alertMessage} onClose={closeAlert}/>
        </AlertContext.Provider>
    );
}

function useAlert() {
    const context = useContext(AlertContext);
    if (context === undefined) {
        throw new Error('useAlert must be used within a CustomAlertProvider');
    }
    return context;
}

export default useAlert;