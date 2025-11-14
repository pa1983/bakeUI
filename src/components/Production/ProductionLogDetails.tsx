import React from 'react';
import { formatQuantity } from '../../utils/numberUtils';
import type {IProductionType} from "../../models/IProductionType.ts";

interface ProductionLogDetailsProps {
    productionQuantity: number;
    expectedQuantity: number | undefined;
    productionType: IProductionType | undefined;
}

const calculateProductionEfficiency = (production_yield: number, expected_yield: number | undefined): number => {
    // Guard against invalid inputs, especially a missing or zero expected yield

    if (typeof production_yield !== 'number' || typeof expected_yield !== 'number' || expected_yield === 0) {
        return 0;
    }
    // Calculate the efficiency as a percentage
    return (production_yield / expected_yield) * 100;
};

export const ProductionLogDetails: React.FC<ProductionLogDetailsProps> = ({
    productionQuantity,
    expectedQuantity,
    productionType,
}) => {
    const efficiency = calculateProductionEfficiency(productionQuantity, expectedQuantity);

    return (
        <div className={`productionType production-${productionType?.name} picker-card-body`}>
            <p>
              <strong>  {productionType?.name}</strong>
            </p>
            <p>
                Quantity produced: {formatQuantity(productionQuantity)}
                <br />
                Expected recipe yield: {expectedQuantity ? formatQuantity(expectedQuantity) : 'N/A'}
                <br />
                Yield percentage: {efficiency.toFixed(0)}%
            </p>
        </div>
    );
};
