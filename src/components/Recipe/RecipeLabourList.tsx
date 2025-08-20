// import {useEffect} from "react";
// import {useDataFetcher} from "../../hooks/useDataFetcher.ts";
// import type {IRecipeLabour} from "../../models/IRecipeLabour.ts";
// import ViewRecipeLabourForm from "../RecipeLabour/ViewRecipeLabourForm.tsx";
//
// interface IRecipeIngredientListProps {
//     recipe_id: number;
//     refetchData: number; // incremented in parent when refetch required
// }
//
// // todo - refactor this to be a RecipeELEMENTlist.
// // add logic to look up correct component type to match the api resposne.
// // First job - craete labour API endpoints, routers, interfaces, and form.  Can then call the form here
// // by way of a fixed enum/lookup against the datatype
// const RecipeLabourList = ({recipe_id, refetchData}: IRecipeIngredientListProps) => {
//
//     // todo - HERE - fetch all recipe elements - API will need to bundle together a number of queries to fetch
//     // all of ingredients, labour, energy etc.
//
//     /* todo - here - wripte logic to find correct component type based on element types returned.  API will return an ordered list of different types of element.
//       todo - HERE - need to decide which componentForm each elmeent of the reutrned array required and render in order
//
//       todo - add reordering function - needs to allow dragging of individual element components.  When one is dropped, push new sort order array to db.
//         More complex than planned as will have to push to multiple different endpoints. OR, have an endpoint designed to destructure the full array returned
//         and send multiple UPDATE commands to cover all changed elements as a result of the reordering
//
//     */
//
//     const endpointToFetch = (recipe_id && recipe_id > 0)
//         ? `/recipe_labour/all?recipe_id=${recipe_id}`
//         : null;
//
//     const {
//         data: recipeLabour,
//         loading,
//         error,
//         refetch,
//     } = useDataFetcher<IRecipeLabour[]>(endpointToFetch); // Use the conditional endpoint
//     useEffect(() => {
//         refetch();
//     }, [refetchData, refetch]);
//
//     // Handle the initial "no recipe selected" state ---
//     if (!recipe_id || recipe_id === 0) {
//
//         return <div className="h3 is-light">Select a recipe to view its labour entries. recipe ID prop : {recipe_id}--</div>
//     }
//
//     if (loading) {
//         return <p>Loading labour data...</p>
//     }
//     if (error) {
//         return <div className="h3 is-danger">Error loading labour data: {error}</div>
//     }
//
//     return (
//         <div className="box">
//             <h3 className="title is-5">Elements</h3>
//             {recipeLabour && recipeLabour.length > 0 ? (
//                 recipeLabour.map(labour => (
//
//                     /* todo - need to populate form props here, in same way as would have done from the ListView.
//                     * May be best to have a list of configs, one for each form type to be rendered
//                     * */
//
//                     <>
//                         {/* todo - need to be specifying the full range of callbacks here for the form.  Are there not default fallbacks? */}
//                         <ViewRecipeLabourForm
//                             formData = {labour}
//                         />
//                         <div key={recipeLabour.id} className="is-family-monospace">
//                             <p>Ingredient ID: {labour.ingredient_id} -- Quantity: {labour.quantity}</p>
//                         </div>
//                     </>
//                 ))
//             ) : (
//                 <p>No ingredients found for this recipe.</p>
//             )}
//         </div>
//     );
// };
//
// export default RecipeLabourList;