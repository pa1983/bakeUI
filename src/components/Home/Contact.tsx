import React from 'react';

function Contact() {
    return (
        <section className="section">
            <div className="container">
                <div className="columns is-centered">
                    <div className="column is-half has-text-centered">

                        <h1 className="title is-4">Paul Anderson</h1>
                        <h2 className="subtitle is-6 has-text-grey">Contact Information</h2>

                        <div className="mt-5">
                            <div className="icon-text mb-3 is-justify-content-center">
                                <span className="icon">
                                    <i className="fas fa-phone" aria-hidden="true"></i>
                                </span>
                                <span>+44 7841 903012</span>
                            </div>

                            <div className="icon-text mb-3 is-justify-content-center">
                                <span className="icon">
                                    <i className="fas fa-envelope" aria-hidden="true"></i>
                                </span>
                                <a href="mailto:pa1983@gmail.com">pa1983@gmail.com</a>
                            </div>

                            <div className="icon-text mb-3 is-justify-content-center">
                                <span className="icon">
                                    <i className="fab fa-linkedin" aria-hidden="true"></i>
                                </span>
                                <a href="https://www.linkedin.com/in/panderson83" target="_blank" rel="noopener noreferrer">
                                    linkedin.com/in/panderson83
                                </a>
                            </div>

                            <div className="icon-text mb-3 is-justify-content-center">
                                <span className="icon">
                                    <i className="fab fa-github" aria-hidden="true"></i>
                                </span>
                                <a href="https://github.com/pa1983" target="_blank" rel="noopener noreferrer">
                                    github.com/pa1983
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}

export default Contact;