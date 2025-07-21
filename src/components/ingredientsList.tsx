import React, {useState, useEffect} from 'react';
// import axios from 'axios';
// import {useAuth} from "react-oidc-context";
import ListElementCard from "./ingredientListItemElement.tsx"
import {useSearchParams, useNavigate} from "react-router-dom";
import {useIngredients} from "../contexts/ingredientContext.tsx";



function IngredientsList() {
    // State variables to hold the fetched data, error, and loading status
    // const auth = useAuth();
    const { ingredients, loadingIngredients, ingredientError, refetchIngredients } = useIngredients();
    const navigate = useNavigate();
    const [error, setError] = useState(null); // Added setError
    const [loading, setLoading] = useState(true);

    const[searchParams, setSearchParams] = useSearchParams()
    const searchTerm = searchParams.get('searchterm') || '';

    const filteredIngredients = ingredients.filter(ingredient =>
        ingredient.ingredient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ingredient.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = event.target.value;
        if (newSearchTerm) {
            setSearchParams({ searchterm: newSearchTerm });
        } else {
            setSearchParams({}); // Clear the search term
        }
    };

    const handleCreateNewClick = () => {
        navigate('/ingredient/new'); // Navigate to the new ingredient creation page
    };

    if (loadingIngredients) {
        return <p>Loading ingredients...</p>;
    }

    if (ingredientError) {
        return <p className="text-red-700 p-4 bg-red-100 rounded-md">{ingredientError}</p>;
    }

    return (
        <div className="section">
            <h1 className="title is-3 has-text-grey-light">Ingredients</h1>

            {/* Controls Section using Bulma's columns for responsive layout */}
            <div className="columns is-vcentered mb-5">
                <div className="column">
                    <div className="field">
                        <p className="control has-icons-left">
                            <input
                                type="text"
                                placeholder="Search ingredients by name or notes..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="input is-medium"
                            />
                            <span className="icon is-small is-left">
                        <i className="fas fa-search" aria-hidden="true"></i>
                    </span>
                        </p>
                    </div>
                </div>
                <div className="column is-narrow">
                    <button
                        onClick={handleCreateNewClick}
                        className="button is-info is-medium is-fullwidth"
                    >
                        Create New Ingredient
                    </button>
                </div>
            </div>

            {/* Conditional Rendering Logic (remains the same) */}
            {filteredIngredients.length === 0 && searchTerm === '' && !loadingIngredients ? (
                <p className="is-size-5 has-text-grey">No ingredients found. Try creating one!</p>
            ) : filteredIngredients.length === 0 && searchTerm !== '' ? (
                <p className="is-size-5 has-text-grey">No ingredients match your search for "{searchTerm}".</p>
            ) : (
                /* Responsive Grid using Bulma columns */
                <div className="columns is-multiline">
                    {filteredIngredients.map(ingredient => (
                        <div key={ingredient.ingredient_id} className="column is-one-third-desktop is-half-tablet">
                            <ListElementCard
                                imageUrl={ingredient.images?.[0]?.image_url}
                                title={ingredient.ingredient_name}
                                subtitle=''
                                linkTo={`/ingredient/${ingredient.ingredient_id}`}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default IngredientsList;