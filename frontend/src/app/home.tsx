//My imports
import {StyleSheet, Image, Pressable, Text } from 'react-native';
import { Spacing, Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import DropdownMenu, { MenuOption } from '@/components/drop-down';

import { GetCustomerAccounts, GetBestSavingsAccount, PostCompareRate, PostUpdateAccount } from '@/apis/apis';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';


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

    // customer accounts data type and retrieval on render
    type CustomerAccount = {
        customerAccountId: number;
        marketAccountId: number;
        customerId: number;
        balance: number;
        accountName: string;
        updatedAt: Date;
    };
    const [customerAccounts, setCustomerAccounts] = useState<CustomerAccount []>([]);

    useEffect(() => {
    async function loadCustomerAccounts() {
        var customerIntId = parseInt(String(customerId)) //Abit of a hack work around there's a better way to do this
        const data = await GetCustomerAccounts(customerIntId);
        setCustomerAccounts(data);
        console.log(data); // DEV LOGGING ***
    }
    loadCustomerAccounts();
    }, []);

    return (
        <ThemedView style={styles.root} >
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

            {/*Welcome Message */}
            <ThemedView style={styles.welcomeHeader}>
                <ThemedText style={styles.welcomeText}>
                    Welcome {name}
                </ThemedText>
            </ThemedView>

            {/*Best Market Rate */}
            <ThemedView style={styles.subHeader}>
                <ThemedText style={styles.subHeaderText}>
                    Best Market Rate Today
                </ThemedText>
                <ThemedText type="small">
                    {bestAccount?.companyName} - {bestAccount?.accountName} - {bestAccount?.interestRate}% Per Annum
                </ThemedText>
            </ThemedView>
            
            {/*Account Panels --- May want to make it a seperate component*/}
            <ThemedView style={styles.body}>
                {customerAccounts.map((account) => (
                    <ThemedView key={account.customerAccountId} style={styles.accountGroup}>
                        <ThemedView style={styles.body}>
                            <Text>{account.accountName} </Text>
                        </ThemedView>
                        <ThemedView style={styles.accountBalance}>
                            <ThemedText type='subtitle'> ${account.balance} </ThemedText>
                            <Text> Balance </Text>
                        </ThemedView>

                    </ThemedView>
                ))};
            </ThemedView>





            <ThemedView style={styles.footer}>
                <Pressable style={styles.footerButton} onPress={() => {router.push({ pathname: "/"})}}>
                    <Text>Logout</Text>
                </Pressable>
            </ThemedView>
        </ThemedView>
    );
}


const styles = StyleSheet.create({
  //root
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

  //Body
  body: {
    flex: 1,
    justifyContent: 'flex-start',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },

  //Account group
  accountGroup: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.one,
    justifyContent: 'flex-start',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  accountBalance: {
    justifyContent: 'center',
  },

  //Footer
  footer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },

  footerButton : {
    alignItems: 'center',
    padding: Spacing.two,
    width: 100,
    backgroundColor: '#d8d8db',
    borderRadius: Spacing.two,
  }
});