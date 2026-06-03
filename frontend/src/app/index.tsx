import { StyleSheet, Image } from 'react-native';
import { Spacing } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useState, useEffect } from 'react';
import DropdownMenu, { MenuOption } from '@/components/drop-down';
import { GetAllCustomers } from '@/apis/apis';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [menuVisible, setMenuVisible] = useState(false);

  type Customer = {
    customerId: number;
    name: string;
  };

  const [customers, setCustomers] = useState<Customer[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const data = await GetAllCustomers();
      setCustomers(data);
      console.log(data); // DEV LOGGING ***
    }
    loadData();
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

      {/*Body*/}
      <ThemedView style={styles.body}>
        {/*Subtitle*/}
        <ThemedText type="subtitle" style={styles.loginHeading}>
          Login
        </ThemedText>

        {/*Dropdown cta text */}
        <ThemedText type="small" style={styles.label}>
          Select a user
        </ThemedText>

        {/*Dropdown*/}
        <ThemedView type="backgroundElement" style={styles.dropdownWrapper}>
          <DropdownMenu
            visible={menuVisible}
            handleOpen={() => setMenuVisible(true)}
            handleClose={() => setMenuVisible(false)}
            trigger={
              <ThemedText type="small">Select</ThemedText>
            }
          >
            <>
              {customers.map((customer) => (
                <MenuOption
                  key={customer.customerId}
                  onSelect={() => {
                    console.log(customer); // DEV LOGGING ***
                    setMenuVisible(false);
                    router.push({
                      pathname: '/home',
                      params: {
                        customerId: customer.customerId,
                        name: customer.name,
                      },
                    });
                  }}
                >
                  <ThemedText type="small">{customer.name}</ThemedText>
                </MenuOption>
              ))}
            </>
          </DropdownMenu>
        </ThemedView>
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

  //Body
  body: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
    justifyContent: 'flex-start',
  },
  loginHeading: {
    marginBottom: Spacing.three,
  },
  label: {
    marginBottom: Spacing.two,
  },
  dropdownWrapper: {
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },

  //Footer
  footer: {
    flex: 1,
  },
});