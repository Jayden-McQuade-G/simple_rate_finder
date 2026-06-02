import { Platform } from 'react-native';

// Stores server side URL, if running in adroid studio will use the first address or use local host.
const BASE_URL =
    Platform.OS === 'android'
        ? 'http://10.0.2.2:5186'
        : 'http://localhost:5186';

//Requests all customers from backend
export async function GetAllCustomers() {
    try {
        const response = await fetch(`${BASE_URL}/all-customers`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        });
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

//Request all accounts for a given customer
export async function GetCustomerAccounts(customerId: number) {
    try {
        const response = await fetch(
            `${BASE_URL}/customer-accounts/${customerId}`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            }
        );

        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

//Requests the savings account with the highest interest rate
export async function GetBestSavingsAccount() {
    try {
        const response = await fetch(`${BASE_URL}/best-savings-account`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        });

        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

//posts two accounts and requests the server to return the best option
export async function PostCompareRate(accountA: number, accountB: number) {
    try {
        const response = await fetch(`${BASE_URL}/compare-accounts`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                accountAInterestRate: accountA,
                accountBInterestRate: accountB,
            }),
        });

        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

//posts updated details for a given customer and requests the server to update the details in the database
export async function PostUpdateAccount(account: {
    customerAccountId: number;
    marketAccountId: number;
    balance: number;
    accountName: string;
}) {
    try {
        const response = await fetch(`${BASE_URL}/update-account`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(account),
        });

        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}