import { useMemo, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import useFlash from "../../contexts/FlashContext.tsx";
import type {RecipeCostAnalysis as RecipeCostAnalysisType} from "../../models/IRecipeCostAnalysis.ts";

const RecipeCostChart = ({ data }: { data: RecipeCostAnalysisType[] }) => {
    const { showFlashMessage } = useFlash();

    const { innerRingData, outerRingData, totalUnitCost, topLevelRecipeName } = useMemo(() => {
        if (!data || data.length === 0) {
            return {
                innerRingData: [],
                outerRingData: [],
                totalUnitCost: 0,
                topLevelRecipeName: 'Recipe'
            };
        }

        //  parse the raw data to calculate the unit cost for each item.
        const parsedData = data.map(item => {
            const totalCostForBatch = item.total_cost;
            const batchQuantity = item.top_level_batch_quantity;
            const costPerUnit = (batchQuantity > 0) ? totalCostForBatch / batchQuantity : 0;
            return { ...item, unit_cost: costPerUnit };
        }).filter(item => item.unit_cost > 0);

        // aggregate by `item_name` to create the chart's outer ring data
        const outerRingAgg = parsedData.reduce((acc, item) => {
            const key = item.item_name;
            if (!acc[key]) {
                acc[key] = { value: 0, cost_type: item.cost_type };
            }
            acc[key].value += item.unit_cost;
            return acc;
        }, {} as Record<string, { value: number; cost_type: string }>);

        // Convert the aggregated object to an array and sort so outer ring position matches inner
        const finalOuterRingData = Object.entries(outerRingAgg).map(([label, data]) => ({
            label,
            value: data.value,
            cost_type: data.cost_type,
        }));

        finalOuterRingData.sort((a, b) => {
            const costTypeComparison = a.cost_type.localeCompare(b.cost_type);
            if (costTypeComparison !== 0) return costTypeComparison;
            return b.value - a.value;
        });

        // create the inner ring data by aggregating the outer ring data - gives the two layers of details I want for the 2-layer pie chart
        const innerRingAgg = finalOuterRingData.reduce((acc, item) => {
            const group = item.cost_type;
            acc[group] = (acc[group] || 0) + item.value;
            return acc;
        }, {} as Record<string, number>);

        const finalInnerRingData = Object.entries(innerRingAgg).map(([label, value]) => ({
            label,
            value,
        }));
        // Sort inner ring in same order as outer ring
        finalInnerRingData.sort((a, b) => a.label.localeCompare(b.label));

        // Calculate the total for display
        const totalUnitCost = finalInnerRingData.reduce((sum, item) => sum + item.value, 0);

        return {
            innerRingData: finalInnerRingData,
            outerRingData: finalOuterRingData,
            totalUnitCost,
            topLevelRecipeName: data[0].top_level_recipe_name,
        };
    }, [data]);

    useEffect(() => {
        if (!data || data.length === 0) {
            showFlashMessage('No analysis data available to display in chart.', 'danger');
        }
    }, [data, showFlashMessage]);

    const valueFormatter = (v: { value: number }) => `£${v.value.toFixed(2)}`;

    return (
        <div className="box">
            <div className="has-text-centered mb-4">

                <h2 className="title is-4">{`${topLevelRecipeName} Unit Cost Breakdown`}</h2>
                <p className="subtitle is-5">Total Unit Cost: £{totalUnitCost.toFixed(2)}</p>
            </div>

            <div>
                <PieChart
                    series={[
                        // Outer Ring
                        {
                            data: outerRingData,
                            outerRadius: 140,
                            innerRadius: 110,
                            valueFormatter,
                        },
                        // Inner Ring
                        {
                            data: innerRingData,
                            outerRadius: 90,
                            innerRadius: 0,
                            valueFormatter,
                        },
                    ]}
                    height={400}
                    slotProps={{
                        legend: {
                            position: { vertical: 'bottom', horizontal: 'center' },
                            sx: {
                                '& .MuiLegend-label': {
                                    fontSize: 12,
                                    color: 'aliceblue'
                                },
                            },
                        },
                    }}
                    margin={{ bottom: 80 }}
                />
            </div>
        </div>
    );
};

export default RecipeCostChart;