import React from 'react';

// reusable confirmation modal

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    onConfirm: () => void;
    children: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, title, onClose, onConfirm, children }) => {
    // If the modal is not set to be open, render nothing.
    if (!isOpen) {
        return null;
    }

    // The main container gets the 'is-active' class to be visible.
    return (
        <div className={`modal ${isOpen ? 'is-active' : ''}`}>
            {/* The semi-transparent background; clicking it will close the modal. */}
            <div className="modal-background" onClick={onClose}></div>

            {/* The modal dialog box, using the modal-card structure */}
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">{title}</p>
                    <button className="delete" aria-label="close" onClick={onClose}></button>
                </header>
                <section className="modal-card-body">
                    {children}
                </section>
                <footer className="modal-card-foot">
                    {/* Add type="button" to prevent form submission - was creating new record every time hit delete */}
                    <button type="button" className="button" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="button" className="button is-danger" onClick={onConfirm}>
                        Confirm
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ConfirmationModal;
