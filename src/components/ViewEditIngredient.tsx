import {UnitOfMeasureProvider} from "../contexts/UnitOfMeasureContext.tsx";

// wrap the form with UOM provider
return (

<UnitOfMeasureProvider>
    <IngredientsForm/>
</UnitOfMeasureProvider>
)