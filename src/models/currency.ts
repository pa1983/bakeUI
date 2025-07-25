export interface Currency {
    currency_code: string;
    currency_name: string;
    is_base_currency?: boolean;
    conversion_rate_to_base: number;
    symbol: string;
}
