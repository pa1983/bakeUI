// UnitOfMeasureGuideBulma.jsx

export const BuyableUOMInfo = (

        <div className="box">
            <div className="content">
                <h2 className="title is-4">How to Set the Correct Unit of Measure</h2>
                <p>
                    The Unit of Measure is a critical field that determines how item costs
                    are calculated for your recipes and inventory. The golden rule is:{" "}
                    <strong>
                        the unit should match how the item is measured for use and for
                        purchase.
                    </strong>
                </p>

                <h3 className="title is-5 mt-5">1. Consider How You Use It</h3>
                <p>Ask yourself, "How do I measure this in a recipe?"</p>
                <ul>
                    <li>
                        <strong>Counted Items:</strong> Items you use one at a time (e.g.,
                        eggs, bread rolls, drink bottles).
                        <blockquote>
                            <em>Example:</em> A tray of 36 eggs is used individually. Set the
                            unit to <strong>each</strong>.
                        </blockquote>
                    </li>
                    <li>
                        <strong>Weighted Items:</strong> Items you measure by weight (e.g.,
                        flour, meat, spices, vegetables).
                        <blockquote>
                            <em>Example:</em> A 16kg sack of flour is used by weight. Set the
                            unit to <strong>kg</strong> (or <strong>g</strong> for smaller
                            items like spices).
                        </blockquote>
                    </li>
                    <li>
                        <strong>Volume Items:</strong> Items you measure by volume (e.g.,
                        milk, oil, stock).
                        <blockquote>
                            <em>Example:</em> A 5-litre bottle of cooking oil is used by
                            volume. Set the unit to <strong>litre</strong> (or{" "}
                            <strong>ml</strong>).
                        </blockquote>
                    </li>
                </ul>

                <h3 className="title is-5 mt-5">
                    2. Check How Your Supplier Invoices You
                </h3>
                <p>
                    The unit should also align with the unit price on your invoices. This
                    is key for accurate cost tracking, especially when delivery quantities
                    vary.
                </p>
                <blockquote>
                    <em>Example:</em> You order pork mince. The invoice line reads{" "}
                    <code>Pork Mince - 2.6kg @ £10.00/kg</code>. By setting your item's
                    unit to <strong>kg</strong>, the system can correctly process this
                    purchase. If you had set the unit to 'pack', you couldn't account for
                    the weight variation.
                </blockquote>

                <h3 className="title is-5 mt-5">Summary</h3>

                {/* The table-container div helps make the table responsive on small screens */}
                <div className="table-container">
                    <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                        <thead>
                        <tr>
                            <th>If you buy...</th>
                            <th>And your recipe uses...</th>
                            <th>And the invoice says...</th>
                            <th>Your Unit should be...</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>A tray of 36 eggs</td>
                            <td>2 eggs</td>
                            <td>£0.15 / <strong>each</strong></td>
                            <td><strong>each</strong></td>
                        </tr>
                        <tr>
                            <td>A 5kg pack of mince</td>
                            <td>500g of mince</td>
                            <td>£10.00 / <strong>kg</strong></td>
                            <td><strong>kg</strong></td>
                        </tr>
                        <tr>
                            <td>A 10L drum of oil</td>
                            <td>250ml of oil</td>
                            <td>£25.00 / <strong>litre</strong></td>
                            <td><strong>litre</strong></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );