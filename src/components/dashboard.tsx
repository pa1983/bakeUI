const Dashboard = () => {
    return (
        <section className="section">
            <div className="container">
                <div className="card has-shadow">
                    <header className="card-header">
                        <p className="card-header-title is-size-4">
                            <span className="icon is-medium">
                                <i className="fas fa-chart-line" aria-hidden="true"></i>
                            </span>
                            <span>Dashboard</span>
                        </p>
                    </header>

                    <div className="card-content">
                        <div className="content">
                            <h3 className="title is-5">Overview</h3>
                            <p className="subtitle is-6">
                                Here are your key metrics and activities that need attention.
                            </p>

                            {/*  stats boxes todo - consider what else needs to be here */}
                            <div className="columns is-multiline is-centered">
                                <div className="column is-one-third">
                                    <div className="box has-background-info-light has-text-centered">
                                        <p className="title is-1 has-text-info">23</p>
                                        <p className="subtitle is-5 has-text-info-dark">Invoices for Review</p>
                                    </div>
                                </div>
                                <div className="column is-one-third">
                                    <div className="box has-background-warning-light has-text-centered">
                                        <p className="title is-1 has-text-warning-dark">7</p>
                                        <p className="subtitle is-5">Active Recipes</p>
                                    </div>
                                </div>
                                <div className="column is-one-third">
                                    <div className="box has-background-success-light has-text-centered">
                                        <p className="title is-1 has-text-success-dark">90%</p>
                                        <p className="subtitle is-5">Ingredient Utilisation</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Dashboard;