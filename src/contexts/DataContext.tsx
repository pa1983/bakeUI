// contexts/DataContext.tsx

import {createContext, useContext, useMemo, type ReactNode} from 'react';
import {type ICurrency} from "../models/ICurrency.ts";
import {type ISupplier} from "../models/ISupplier.ts";
import type {IBrand} from "../models/IBrand.ts";
import type {IBuyable} from "../models/IBuyable.ts";
import type {IPickerElement} from "../models/picker.ts";
import {useDataFetcher} from '../hooks/useDataFetcher';
import type {IIngredient} from "../models/IIngredient.ts";
import type {IRecipeStatus} from "../models/IRecipeStatus.ts";
import type {IProductType} from "../models/IProductType.ts";
import type {IRecipeType} from "../models/IRecipeType.ts";
import type {IRecipe} from "../models/IRecipe.ts";
import type {ILabourer} from "../models/ILabourer.ts";
import type {ILabourCategory} from "../models/ILabourCategory.tsx";

//  loading/error states and refetch functions
export interface DataContextType {
    currencies: ICurrency[];
    suppliers: ISupplier[];
    brands: IBrand[];
    buyables: IBuyable[];
    ingredients: IIngredient[];
    recipeStatuses: IRecipeStatus[];
    productTypes: IProductType[];
    recipeTypes: IRecipeType[];
    recipes: IRecipe[];
    labourers: ILabourer[];
    labourCategories: ILabourCategory[];


    PickerSupplierArray: IPickerElement[],
    PickerBrandArray: IPickerElement[],
    // PickerCurrencyArray: IPickerElement[],
    PickerBuyableArray: IPickerElement[],
    PickerIngredientArray: IPickerElement[],
    PickerRecipeArray: IPickerElement[],
    PickerLabourerArray: IPickerElement[],
    PickerLabourCategoryArray: IPickerElement[],


    loading: {
        currencies: boolean;
        suppliers: boolean;
        brands: boolean;
        buyables: boolean;
        ingredients: boolean;
        recipeStatuses: boolean;
        productTypes: boolean;
        recipeTypes: boolean;
        recipes: boolean;
        labourers: boolean;
        labourCategories: boolean;
    };

    error: {
        currencies: string | null;
        suppliers: string | null;
        brands: string | null;
        buyables: string | null;
        ingredients: string | null;
        recipeStatuses: string | null;
        productTypes: string | null;
        recipeTypes: string | null;
        recipes: string | null;
        labourers: string | null;
        labourCategories: string | null;
    };


    refetchCurrencies: () => void;
    refetchSuppliers: () => void;
    refetchBrands: () => void;
    refetchBuyables: () => void;
    refetchIngredients: () => void;
    refetchRecipeStatuses: () => void;
    refetchProductTypes: () => void;
    refetchRecipeTypes: () => void;
    refetchRecipes: () => void;
    refetchLabourers: () => void;
    refetchLabourCategories: () => void;

    refetchAllData: () => void;

}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

export const DataProvider = ({children}: { children: ReactNode }) => {

    const {
        data: currencies,
        loading: loadingCurrencies,
        error: errorCurrencies,
        refetch: refetchCurrencies
    } = useDataFetcher<ICurrency>('/common/currency');
    const {
        data: suppliers,
        loading: loadingSuppliers,
        error: errorSuppliers,
        refetch: refetchSuppliers
    } = useDataFetcher<ISupplier>('/buyable/supplier/all');
    const {
        data: brands,
        loading: loadingBrands,
        error: errorBrands,
        refetch: refetchBrands
    } = useDataFetcher<IBrand>('/buyable/brand/all');
    const {
        data: buyables,
        loading: loadingBuyables,
        error: errorBuyables,
        refetch: refetchBuyables
    } = useDataFetcher<IBuyable>('/buyable/all');
    const {
        data: ingredients,
        loading: loadingIngredients,
        error: errorIngredients,
        refetch: refetchIngredients
    } = useDataFetcher<IIngredient>('/ingredient/all');  // ?own_organisation=False <- do I need to pass this or set as a default?
    const {
        data: recipeStatuses,
        loading: loadingRecipeStatuses,
        error: errorRecipeStatuses,
        refetch: refetchRecipeStatuses
    } = useDataFetcher<IRecipeStatus>('/common/recipe_status');
    const {
        data: productTypes,
        loading: loadingProductTypes,
        error: errorProductTypes,
        refetch: refetchProductTypes
    } = useDataFetcher<IProductType>('/common/product_type');
    const {
        data: recipeTypes,
        loading: loadingRecipeTypes,
        error: errorRecipeTypes,
        refetch: refetchRecipeTypes
    } = useDataFetcher<IRecipeType>('/common/recipe_type');
    const {
        data: recipes,
        loading: loadingRecipes,
        error: errorRecipes,
        refetch: refetchRecipes
    } = useDataFetcher<IRecipe>('/recipe/all');
    const {
        data: labourers,
        loading: loadingLabourers,
        error: errorLabourers,
        refetch: refetchLabourers
    } = useDataFetcher<ILabourer>('/labourer/all');
    const {
        data: labourCategories,
        loading: loadingLabourCategories,
        error: errorLabourCategories,
        refetch: refetchLabourCategories
    } = useDataFetcher<ILabourCategory>('/labourer/labour_category/all');


    //  Memoized Picker Arrays
    const PickerSupplierArray = useMemo((): IPickerElement[] => {
        return (suppliers || []).map((supplier): IPickerElement => ({
            id: supplier.supplier_id,
            title: supplier.supplier_name || "",
            subtitle: supplier.account_number || "",
            imageUrl: '' // todo - add images for Supplier
        }));
    }, [suppliers]);

    const PickerBrandArray = useMemo((): IPickerElement[] => {
        return (brands || []).map((brand): IPickerElement => ({
            id: brand.brand_id,
            title: brand.brand_name,
            subtitle: `${brand.notes || ''}`,
            imageUrl: null
        }));
    }, [brands]);

    //
    // const PickerCurrencyArray = useMemo((): IPickerElement[] => {
    //     return (currencies || []).map((currency): IPickerElement => ({
    //         id: currency.currency_code,
    //         title: `${currency.symbol} - ${currency.currency_name}`,
    //         subtitle: currency.currency_code,
    //         imageUrl: '' // todo - create image icons for currencies and make them callable by the currency code so no need to for a link saved in currency table
    //     }));
    // }, [currencies]);


    const PickerBuyableArray = useMemo((): IPickerElement[] => {
        const safeBrands = brands || [];
        return (buyables || []).map((buyable: IBuyable): IPickerElement => ({
            id: buyable.id,
            title: `${buyable.sku} - ${safeBrands.find(brand => brand.brand_id === buyable.brand_id)?.brand_name || '      \n\n'}  -  ${buyable.item_name}`,
            subtitle: buyable.notes,
            imageUrl: null
        }))
    }, [buyables]);

    const PickerIngredientArray = useMemo((): IPickerElement[] => {
        return (ingredients || []).map((ingredient: IIngredient): IPickerElement => ({
            id: ingredient.ingredient_id,
            title: `${ingredient.ingredient_name}`,
            subtitle: ingredient.notes || '',
            imageUrl: ingredient.images?.length > 0 ? ingredient.images[0].image_url : null
        }))
    }, [ingredients]);

    const PickerRecipeArray = useMemo((): IPickerElement[] => {
        return (recipes || []).map((recipe: IRecipe): IPickerElement => ({
            id: recipe.recipe_id,
            title: recipe.recipe_name,
            subtitle: recipe.recipe_description || '',
            imageUrl: null // come back and populate this
        }))

    }, [recipes]);

    const PickerLabourerArray = useMemo((): IPickerElement[] => {
        return (labourers || []).map((labourer: ILabourer): IPickerElement => ({
            id: labourer.id,
            title: labourer.name,
            subtitle: labourer.description || '',
            imageUrl: null

        }))
    }, [labourers])


    // --- Refetching Logic ---
    const refetchAllData = () => {
        refetchCurrencies();
        refetchSuppliers();
        refetchBrands();
        refetchBuyables();
        refetchIngredients();
        refetchRecipeStatuses();
        refetchProductTypes();
        refetchRecipeTypes();
        refetchRecipes();
        refetchLabourers();
        refetchLabourCategories();
    };

    // --- Assemble the context value array ---
    const contextValue: DataContextType = {
        currencies: currencies || [],
        suppliers: suppliers || [],
        brands: brands || [],
        buyables: buyables || [],
        ingredients: ingredients || [],
        recipeStatuses: recipeStatuses || [],
        productTypes: productTypes || [],
        recipeTypes: recipeTypes || [],
        recipes: recipes || [],
        labourers: labourers || [],
        labourCategories: labourCategories || [],

        PickerSupplierArray,
        PickerBrandArray,
        // PickerCurrencyArray,
        PickerBuyableArray,
        PickerIngredientArray,
        PickerRecipeArray,
        PickerLabourerArray,

        loading: {
            currencies: loadingCurrencies,
            suppliers: loadingSuppliers,
            brands: loadingBrands,
            buyables: loadingBuyables,
            ingredients: loadingIngredients,
            recipeStatuses: loadingRecipeStatuses,
            productTypes: loadingProductTypes,
            recipeTypes: loadingRecipeTypes,
            recipes: loadingRecipes,
            labourers: loadingLabourers,
            labourCategories: loadingLabourCategories,
        },
        error: {
            currencies: errorCurrencies,
            suppliers: errorSuppliers,
            brands: errorBrands,
            buyables: errorBuyables,
            ingredients: errorIngredients,
            recipeStatuses: errorRecipeStatuses,
            productTypes: errorProductTypes,
            recipeTypes: errorRecipeTypes,
            recipes: errorRecipes,
            labourers: errorLabourers,
            labourCategories: errorLabourCategories,
        },
        refetchAllData,
        refetchCurrencies,
        refetchSuppliers,
        refetchBuyables,
        refetchBrands,
        refetchIngredients,
        refetchRecipeStatuses,
        refetchProductTypes,
        refetchRecipeTypes,
        refetchRecipes,
        refetchLabourers,
        refetchLabourCategories,
        PickerLabourCategoryArray: []
    };

    return (
        <DataContext.Provider value={contextValue}>
            {children}
        </DataContext.Provider>
    );
};