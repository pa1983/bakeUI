function Home() {
    return (
        <section className="hero is-fullheight-with-navbar">
            <div className="hero-body">
                <div className="container has-text-centered">
                    <div className="columns is-centered">
                        <div className="column is-three-quarters">

                            <span className="icon is-large has-text-info mb-5">
                                <i className="fas fa-home fa-7x" aria-hidden="true"></i>
                            </span>

                            <h1 className="title is-2">
                                Welcome to Bake
                            </h1>

                            <h2 className="subtitle is-5 has-text-light">
                                Bringing efficiency to artisan bakers
                            </h2>

                            <p className="is-size-5 has-text-grey-light mb-5" style={{ lineHeight: 1.6 }}>
                                Bake helps artisanal bakers improve operational efficiency by tracking costs at every stage of the production process.
                                It helps owners keep all production data in one place, logging invoices, ingredients, recipes and menu items.
                            </p>

                            <a className="button is-info is-large" href="/src/components/Home/Contact">
                                Learn More
                            </a>

                            <div className="mt-6">
                                <h4 className="title is-4">Shortcuts</h4>
                                <div className="content is-medium">
                                    <ul className="no-dots">
                                        <li><kbd>CTRL</kbd>+<kbd>Enter</kbd> to save changes</li>
                                        <li><kbd>CTRL</kbd>+<kbd>E</kbd> to edit and cancel an edit</li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Home;