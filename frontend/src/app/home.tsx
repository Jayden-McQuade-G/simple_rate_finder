//My imports
import { StyleSheet, Image, Pressable, Text, ScrollView } from 'react-native';
import { Spacing, Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import DropdownMenu, { MenuOption } from '@/components/drop-down';

import { GetCustomerAccounts, GetBestSavingsAccount, PostCompareRate, PostUpdateAccount } from '@/apis/apis';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';

function getYearlyGain(bestRate: number, accountRate: number, balance: number): number {
    const difference = bestRate - accountRate;
    return (difference / 100) * balance;
}

export default function TabTwoScreen() {
    const router = useRouter();
    const { customerId, name } = useLocalSearchParams();

    //Best Account Data Type and retrieval on render
    type BestAccount = {
        marketAccountId: number;
        accountName: string;
        companyName: string;
        interestRate: number;
        updatedAt: Date;
    };
    const [bestAccount, setBestAccount] = useState<BestAccount | null>(null);

    useEffect(() => {
        async function loadBestAccount() {
            const data = await GetBestSavingsAccount();
            setBestAccount(data);
            console.log(data); // DEV LOGGING ***
        }
        loadBestAccount();
    }, []);

    //Customer accounts data type and retrieval on render
    type CustomerAccount = {
        customerAccountId: number;
        marketAccountName: string;
        companyName: string;
        interestRate: number;
        accountName: string;
        balance: number;
    };
    const [customerAccounts, setCustomerAccounts] = useState<CustomerAccount[]>([]);

    useEffect(() => {
        async function loadCustomerAccounts() {
            var customerIntId = parseInt(String(customerId));
            const data = await GetCustomerAccounts(customerIntId);
            setCustomerAccounts(data);
            console.log(data); // DEV LOGGING ***
        }
        loadCustomerAccounts();
    }, []);

    return (
        <ThemedView style={styles.root}>

            {/*Header*/}
            <ThemedView style={styles.header}>
                <Image
                    source={require('@/assets/images/open-logo-black.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </ThemedView>

            {/*Subheader*/}
            <ThemedView style={styles.subHeader}>
                <ThemedText type="small" style={styles.subHeaderText}>
                    Simple Rate Finder
                </ThemedText>
            </ThemedView>

            {/*Welcome Message*/}
            <ThemedView style={styles.welcomeHeader}>
                <ThemedText style={styles.welcomeText}>
                    Welcome {name}
                </ThemedText>
            </ThemedView>

            {/*Best Market Rate*/}
            <ThemedView style={styles.bestRateGroup}>
                <ThemedText type="smallBold" style={styles.subHeaderText}>
                    Best Market Rate Today
                </ThemedText>
                <ThemedText type="small" style={styles.subHeaderText}>
                    {bestAccount?.companyName} — {bestAccount?.accountName} — {bestAccount?.interestRate}% p.a.
                </ThemedText>
            </ThemedView>

            {/*Scrollable Accounts*/}
            <ScrollView
                style={styles.scrollArea}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {customerAccounts.map((account) => (
                    <ThemedView key={account.customerAccountId} style={styles.accountGroup}>

                        {/*Account Info*/}
                        <ThemedView style={styles.accountInfo}>
                            <ThemedText type="smallBold">{account.accountName}</ThemedText>
                            <ThemedText type="small">{account.companyName}</ThemedText>
                            <ThemedText type="small">{account.marketAccountName}</ThemedText>
                            <ThemedText type="small">{account.interestRate}% p.a.</ThemedText>

                            <ThemedView style={styles.rateMessageContainer}>
                                {bestAccount && account.interestRate >= bestAccount.interestRate ? (
                                    <ThemedText type="small" style={styles.bestRateText}>
                                        You are on the best rate
                                    </ThemedText>
                                ) : (
                                    <ThemedText type="small" style={styles.switchRateText}>
                                        You could earn ${getYearlyGain(bestAccount?.interestRate ?? 0, account.interestRate, account.balance).toFixed(2)} more/yr switching to {bestAccount?.companyName} {bestAccount?.accountName}
                                    </ThemedText>
                                )}
                            </ThemedView>
                        </ThemedView>

                        {/*Account Balance*/}
                        <ThemedView style={styles.accountBalance}>
                            <ThemedText type="subtitle">${account.balance.toFixed(2)}</ThemedText>
                            <ThemedText type="small" style={styles.balanceLabel}>Balance</ThemedText>
                        </ThemedView>

                    </ThemedView>
                ))}

                {/*Add more accounts* --- Not Yet Implemented */}
                <ThemedView style={styles.addAccountRow}>
                    <Pressable style={styles.button} onPress={() => { router.push({ pathname: "/" }) }}>
                        <Text>Link more accounts</Text>
                    </Pressable>
                </ThemedView>

            </ScrollView>

            <ThemedView style={styles.footer}>
                <Pressable style={styles.button} onPress={() => { router.push({ pathname: "/" }) }}>
                    <Text>Logout</Text>
                </Pressable>
            </ThemedView>

        </ThemedView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: 'column',
    },

    //Header
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.four,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
    },
    logo: {
        height: 40,
        width: 120,
    },

    //Subheader
    subHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.two,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
    },
    subHeaderText: {
        textAlign: 'center',
    },

    //Welcome Message
    welcomeHeader: {
        paddingVertical: Spacing.two,
        paddingHorizontal: Spacing.three,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
    },
    welcomeText: {
        textAlign: 'left',
    },

    //Best rate group
    bestRateGroup: {
        alignItems: 'center',
        paddingVertical: Spacing.two,
        paddingHorizontal: Spacing.three,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
        gap: Spacing.one,
    },

    scrollArea: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: Spacing.three,
        paddingTop: Spacing.three,
        paddingBottom: Spacing.four,
        gap: Spacing.three,
    },

    //Account group
    accountGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.three,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        borderRadius: Spacing.two,
    },
    accountInfo: {
        flex: 1,
        gap: Spacing.one,
        paddingRight: Spacing.three,
    },
    rateMessageContainer: {
        marginTop: Spacing.one,
    },
    bestRateText: {
        color: '#2f8633',
    },
    switchRateText: {
        color: '#c25e11',
    },
    accountBalance: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: Spacing.one,
    },
    balanceLabel: {
        textAlign: 'right',
        color: '#888',
    },

    //Add account row
    addAccountRow: {
        alignItems: 'center',
        marginTop: Spacing.two,
    },

    //Footer
    footer: {
        alignItems: 'flex-start',
        padding: Spacing.three,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#ccc',
    },

    button: {
        alignItems: 'center',
        paddingVertical: Spacing.two,
        paddingHorizontal: Spacing.three,
        backgroundColor: '#ccc',
        borderRadius: Spacing.two,
    },
});
