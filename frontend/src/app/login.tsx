import * as Device from 'expo-device';
import { Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

import DropdownMenu, {MenuOption}  from '@/components/drop-down'

import { GetAllCustomers } from '@/apis/apis'
import { useRouter } from 'expo-router'; //Routing navigation instead of native tabs


function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}



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
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <ThemedText type="title" style={styles.title}>
            Simple Rate Finder
          </ThemedText>
          <ThemedText type="code" style={styles.code}>
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
        {Platform.OS === 'web' && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  code: {
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
