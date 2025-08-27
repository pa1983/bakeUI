import { useMemo, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import useFlash from "../../contexts/FlashContext.tsx";
import type {RecipeCostAnalysis as RecipeCostAnalysisType} from "../../models/IRecipeCostAnalysis.ts";

// Define clear types for our data structures
// interface CostAnalysisItem {
//     total_cost: string;
//     top_level_batch_quantity: string;
//     cost_type: 'Ingredient' | 'Labour' | string;
//     item_name: string;
//     top_level_recipe_name: string;
//     unit_cost?: number; // Make unit_cost optional as it's added during parsing
// }
//
// interface ChartDataItem {
//     label: string;
//     value: number;
//     cost_type?: string; // Add cost_type for sorting
// }

const RecipeCostChart = ({ data }: { data: RecipeCostAnalysisType[] }) => {
    const { showFlashMessage } = useFlash();

    // useMemo is perfect for this complex data transformation.
    const { innerRingData, outerRingData, totalUnitCost, topLevelRecipeName } = useMemo(() => {
        if (!data || data.length === 0) {
            return {
                innerRingData: [],
                outerRingData: [],
                totalUnitCost: 0,
                topLevelRecipeName: 'Recipe'
            };
        }

        // 1. First, parse the raw data to calculate the correct unit cost for each item.
        const parsedData = data.map(item => {
            const totalCostForBatch = item.total_cost;
            const batchQuantity = item.top_level_batch_quantity;
            const costPerUnit = (batchQuantity > 0) ? totalCostForBatch / batchQuantity : 0;
            return { ...item, unit_cost: costPerUnit };
        }).filter(item => item.unit_cost > 0);

        // 2. Aggregate the parsed data by `item_name` to create the outer ring data.
        const outerRingAgg = parsedData.reduce((acc, item) => {
            const key = item.item_name;
            if (!acc[key]) {
                acc[key] = { value: 0, cost_type: item.cost_type };
            }
            acc[key].value += item.unit_cost;
            return acc;
        }, {} as Record<string, { value: number; cost_type: string }>);

        // 3. Convert the aggregated object to an array and perform the multi-level sort.
        let finalOuterRingData = Object.entries(outerRingAgg).map(([label, data]) => ({
            label,
            value: data.value,
            cost_type: data.cost_type,
        }));

        finalOuterRingData.sort((a, b) => {
            const costTypeComparison = a.cost_type.localeCompare(b.cost_type);
            if (costTypeComparison !== 0) return costTypeComparison;
            return b.value - a.value; // Secondary sort by value descending
        });

        // 4. Now, create the inner ring by aggregating the already-aggregated outer ring data.
        const innerRingAgg = finalOuterRingData.reduce((acc, item) => {
            const group = item.cost_type;
            acc[group] = (acc[group] || 0) + item.value;
            return acc;
        }, {} as Record<string, number>);

        const finalInnerRingData = Object.entries(innerRingAgg).map(([label, value]) => ({
            label,
            value,
        }));
        // Also sort the inner ring to be certain of the order
        finalInnerRingData.sort((a, b) => a.label.localeCompare(b.label));

        // 5. Calculate the total for display.
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
                        // Outer Ring: A thin doughnut with a large inner radius
                        {
                            data: outerRingData,
                            outerRadius: 140,
                            innerRadius: 110, // Increase this to make the ring thinner and create a gap
                            valueFormatter,
                        },
                        // Inner Ring: A solid pie
                        {
                            data: innerRingData,
                            outerRadius: 90,  // Decrease this to create a larger gap from the outer ring
                            innerRadius: 0,   // Set to 0 to make it a solid pie instead of a doughnut
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