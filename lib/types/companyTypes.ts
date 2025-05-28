export interface CompanyTypes {
    addresses: AddressList[];
    company_benefits: string;
    company_description: string;
    company_id: string;
    company_name: string;
    company_website: string;
    industry_name: string;
    industry_id: number;
    telephone: string;
}

export type AddressList = {
    address_id?: number;
    address: string;
}