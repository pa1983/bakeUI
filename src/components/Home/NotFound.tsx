import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <section className="section">
            <div className="container has-text-centered">
                <div className="columns is-centered">
                    <div className="column is-half">
                        <div className="mb-5">
                            <span className="icon is-large has-text-warning">
                                <i className="fas fa-exclamation-triangle fa-7x"></i>
                            </span>
                        </div>
                        <h1 className="title is-1">
                            404
                        </h1>
                        <h2 className="subtitle is-3 mt-4">
                            Page Not Found
                        </h2>
                        <p className="mb-5">
                            Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                        </p>
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