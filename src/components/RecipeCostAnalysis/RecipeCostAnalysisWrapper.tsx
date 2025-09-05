import {useParams} from "react-router-dom";
import NotFound from "../Home/NotFound.tsx";
import RecipeCostAnalysis from "./RecipeCostAnalysis.tsx";

const RecipeCostAnalysisWrapper = () => {
    const { id } = useParams<{ id: string }>();

    //  Ensure the ID from the URL is a valid number.
    const recipeId = id ? parseInt(id, 10) : 0;
    if (isNaN(recipeId) || recipeId <= 0) {
        return <NotFound />;
    }

    return <RecipeCostAnalysis recipe_id={recipeId} />;
};
export default RecipeCostAnalysisWrapper;