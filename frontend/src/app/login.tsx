import { StyleSheet } from 'react-native';


import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

//My imports
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useState, useEffect } from 'react';
import DropdownMenu, {MenuOption}  from '@/components/drop-down'
import { GetAllCustomers } from '@/apis/apis'
import { useRouter } from 'expo-router'; //Routing navigation instead of native tabs



export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false)
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
      console.log(data) //DEV LOGGING ***
    };
    loadData()
  }, [])

  return (
    <ThemedView style={styles.container}>
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>
            Simple Rate Finder
          </ThemedText>
          <ThemedText type="code" style={styles.text}>
          Select a user
        </ThemedText>

        <ThemedView
            type="backgroundElement"
            style={styles.stepContainer}
        >
            <DropdownMenu
                visible={menuVisible}
                handleOpen={() => setMenuVisible(true)}
                handleClose={() => setMenuVisible(false)}
                trigger={
                    <ThemedText>
                        Select User
                    </ThemedText>
                }
            >
            <>
              {customers.map(customer => (
                  <MenuOption
                      key={customer.customerId}
                      onSelect={() => {
                          console.log(customer); //DEV LOGGING ***
                          setMenuVisible(false);
                          router.push({
                            pathname: "/home",
                            params: {
                                customerId: customer.customerId,
                                name: customer.name,
                            },
                          })
                      }}
                  >
                      <ThemedText>{customer.name}</ThemedText>
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
  container: {
    flex: 1,
    alignItems:'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  title: {
    textAlign: 'center',
  },
  text: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});
