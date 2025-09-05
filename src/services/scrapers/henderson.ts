import * as cheerio from 'cheerio';

// NOTE this was experimented with, but not yet implemented in the applicaiton - leaving it here for future integration

interface NutritionalInfo {
    [key: string]: string;
}

interface Allergens {
    contains: string[];
    may_contain: string[];
    does_not_contain: string[];
}

interface ProductData {
    title: string | null;
    product_code: string | null;
    description: string | null;
    ingredients: string | null;
    product_data_pdf_url: string | null;
    image_url: string | null;
    nutritional_information: NutritionalInfo;
    allergens: Allergens;
}


async function scrapeProductData(productCode: string): Promise<ProductData> {
    const urlBase = 'https://www.henderson-foodservice.com/catalogsearch/result/?q=';
    const url = `${urlBase}${productCode}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        const $ = cheerio.load(html);

        // 1. Title
        const title = $('h1.page-title span.base').text().trim() ?? null;

        // 2. Product Code
        const code = $('div[itemprop="sku"]').text().trim() ?? null;

        // 3. Description
        const description = $('div.overview_long_desc div.value').text().trim() ?? null;

        // 4. Ingredients
        const ingredientsText = $('#attributes\\.ingredients').text().trim();
        const ingredients = ingredientsText ? ingredientsText.replace(/\s\s+/g, ' ') : null;

        // 5. Product Data PDF URL
        const product_data_pdf_url = $('#attributes\\.downloads a').attr('href') ?? null;

        // 6. Image URL
        const image_url = $('meta[property="og:image"]').attr('content') ?? null;

        // 7. Nutritional Information
        const nutritional_information: NutritionalInfo = {};
        $('#attributes\\.nutritional table tr').each((_, element) => {
            const key = $(element).find('th').text().trim();
            const value = $(element).find('td').text().trim();
            if (key) { // Ensure the key is not empty
                nutritional_information[key] = value;
            }
        });

        // 8. Allergens
        const allergens: Allergens = {
            contains: [],
            may_contain: [],
            does_not_contain: [],
        };
        $('#attributes\\.allergens\\.imgs ul.allergens__wrapper li').each((_, element) => {
            const item = $(element);
            const allergenName = item.find('span').text().trim();
            if (!allergenName) return;

            if (item.hasClass('allergen-red')) {
                allergens.contains.push(allergenName);
            } else if (item.hasClass('allergen-yellow')) {
                allergens.may_contain.push(allergenName);
            } else if (item.hasClass('allergen-grey')) {
                allergens.does_not_contain.push(allergenName);
            }
        });

        const productData: ProductData = {
            title,
            product_code: code,
            description,
            ingredients,
            product_data_pdf_url,
            image_url,
            nutritional_information,
            allergens
        };

        return productData;

    } catch (error) {
        console.error("Failed to scrape product data:", error);
        // On failure, return all null values to indicate missing data and maintain consistency in result structure.
        return {
            title: null,
            product_code: null,
            description: null,
            ingredients: null,
            product_data_pdf_url: null,
            image_url: null,
            nutritional_information: {},
            allergens: { contains: [], may_contain: [], does_not_contain: [] },
        };
    }
}

const productCode = '908948';
scrapeProductData(productCode).then(data => {
    console.log(JSON.stringify(data, null, 2));
});