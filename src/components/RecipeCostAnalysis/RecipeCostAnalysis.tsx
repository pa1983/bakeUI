import React from 'react';
import { useDataFetcher } from "../../hooks/useDataFetcher.ts";
import type { RecipeCostAnalysis as RecipeCostAnalysisType } from "../../models/IRecipeCostAnalysis.ts";
import RecipeCostChart from './RecipeCostChart';

interface RecipeCostAnalysisProps  {
    recipe_id: number;
    date_point_prop?: string;
}

const RecipeCostAnalysis: React.FC<RecipeCostAnalysisProps> = ({recipe_id, date_point_prop}) => {
    // Set date_point to the prop value, or default to today's date.
    const date_point = date_point_prop || new Date().toISOString().slice(0, 10);

    const endpointToFetch = (recipe_id && recipe_id > 0)
        ? `/recipe/${recipe_id}/cost-analysis`
        : null;

    const params = {
        'date_point': date_point
    };

    const {
        data: analysisData,
        loading,
        error,
    } = useDataFetcher<RecipeCostAnalysisType>(endpointToFetch, params);

    if (loading) {
        return (
            <section className="section">
                <div className="container has-text-centered">
                    <div className="loader is-large" style={{ margin: 'auto' }}></div>
                    <p className="is-size-4 mt-4">Loading cost analysis...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return <div className="notification is-danger">{error}</div>;
    }

    if (!analysisData || analysisData.length === 0) {
        return <div className="notification is-warning">No analysis data found.</div>
    }


    // Render chart once data is available
    return (
        <div className="container">
            <section className="section">
                <h1 className="title is-2 has-text-centered mb-5">
                    Recipe Cost Analysis
                </h1>
                <RecipeCostChart data={analysisData} />
            </section>
        </div>
    );
}

export default RecipeCostAnalysis;