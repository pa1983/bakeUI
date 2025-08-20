interface CustomAlertProps {
    message: string | null;
    onClose: () => void;
}

const CustomAlert = ({ message, onClose }:CustomAlertProps) => {
    if (!message) {
        return null;
    }

    const handleBackdropClick = () => {
        onClose();
    };

    // todo - add a click handler to close on ESCAPE click

    return (
        <div className="modal is-active">

            {/* semi-transparent background. Clicking it closes the modal. */}
            <div className="modal-background" onClick={handleBackdropClick}></div>

            <div className="modal-content">
                <div className="box has-text-centered">
                    <p className="mb-4">{message}</p>
                    <button className="button is-link" onClick={onClose}>
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
}

export default CustomAlert;