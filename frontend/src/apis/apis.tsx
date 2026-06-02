import { Platform } from 'react-native';


const BASE_URL =
    Platform.OS === 'android'
        ? 'http://10.0.2.2:5186'
        : 'http://localhost:5186';


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