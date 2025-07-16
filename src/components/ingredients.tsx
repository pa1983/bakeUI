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
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Ingredients</h1>

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
                <input
                    type="text"
                    placeholder="Search ingredients by name or notes..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full sm:w-2/3 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base"
                />
                <button
                    onClick={handleCreateNewClick}
                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 ease-in-out transform hover:scale-105 whitespace-nowrap"
                >
                    Create New Ingredient
                </button>
            </div>


            {filteredIngredients.length === 0 && searchTerm === '' && !loadingIngredients ? (
                <p className="text-gray-600 text-lg">No ingredients found. Try creating one!</p>
            ) : filteredIngredients.length === 0 && searchTerm !== '' ? (
                <p className="text-gray-600 text-lg">No ingredients match your search for "{searchTerm}".</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredIngredients.map(ingredient => (
                        <ListElementCard
                            key={ingredient.ingredient_id}
                            imageUrl={ingredient.images?.[0]?.image_url}
                            title={ingredient.ingredient_name}
                            subtitle=''
                            // Add a link to the detail page
                            linkTo={`/ingredient/${ingredient.ingredient_id}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default IngredientsList;