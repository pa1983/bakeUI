// src/context/AlertContext.jsx
import React, { createContext, useState, useContext } from 'react';
import CustomAlert from '../components/CustomAlert';

// 1. Create the context
const AlertContext = createContext();

// 2. Create the Provider component
export function CustomAlertProvider({ children }) {
    const [alertMessage, setAlertMessage] = useState('');

    const showAlert = (message) => {
        setAlertMessage(message);
    };

    const closeAlert = () => {
        setAlertMessage('');
    };

    // The value provided to consuming components
    const value = { showAlert };

    return (
        <AlertContext.Provider value={value}>
            {children}
            {/* The Alert UI is now managed by the provider itself! */}
            <CustomAlert message={alertMessage} onClose={closeAlert} />
        </AlertContext.Provider>
    );
}

// 3. Create a custom hook for easy consumption
function useAlert() {
    return useContext(AlertContext);
}

export default useAlert;