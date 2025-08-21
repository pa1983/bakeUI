import { Link } from 'react-router-dom'; // Using Link for client-side routing

function NotFound() {
    return (
        <section className="section">
            <div className="container has-text-centered">
                <div className="columns is-centered">
                    <div className="column is-half">
                        {/* Icon */}
                        <div className="mb-5">
                            <span className="icon is-large has-text-warning">
                                <i className="fas fa-exclamation-triangle fa-7x"></i>
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="title is-1">
                            404
                        </h1>

                        {/* Subtitle */}
                        <h2 className="subtitle is-3 mt-4">
                            Page Not Found
                        </h2>

                        {/* Description */}
                        <p className="mb-5">
                            Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                        </p>

                        {/* Button */}
                        <Link to="/" className="button is-primary">
                            Go to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default NotFound;