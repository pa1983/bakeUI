import { useParams } from "react-router-dom";
import NotFound from "../Home/NotFound.tsx";
import RecipeCostAnalysis from "./RecipeCostAnalysis.tsx";

const RecipeCostAnalysisWrapper = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return <NotFound />;
    }

    const recipeId = parseInt(id, 10);
    if (isNaN(recipeId) || recipeId <= 0) {
        return <NotFound />;
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const todayString = `${year}-${month}-${day}`;

    const year_minus_one= `${year-1}-${month}-${day}`;
    const year_minus_two = `${year-2}-${month}-${day}`;


    return (
        <>
        <RecipeCostAnalysis
            recipeId={recipeId}
            date_point_prop={todayString}
            title={`Recipe Cost Analysis ${todayString}`}
        />

            <RecipeCostAnalysis
                recipeId={recipeId}
                date_point_prop={year_minus_one}
                title={'1 Year Ago'}
            />

            <RecipeCostAnalysis
                recipeId={recipeId}
                date_point_prop={year_minus_two}
                title={'2 Years Ago'}
            />

            </>


    );
};

export default RecipeCostAnalysisWrapper;