interface LoadingSpinnerProps {
    /** Optional size, defaults to 'is-large'. */
    size?: 'is-small' | 'is-medium' | 'is-large';
    /** Optional message text to display below the spinner. */
    text?: string;
}




const LoadingSpinner = ({ size = 'is-large', text = 'Loading...' }: LoadingSpinnerProps) => {
    return (
        <div className="section is-flex is-justify-content-center is-align-items-center loading-spinner">
            <div className="has-text-centered">
                <div className={`loader is-loading ${size}`}></div>
                {text && <p className="is-size-5 has-text-grey mt-4">{text}</p>}
            </div>
        </div>
    );
};

export default LoadingSpinner;