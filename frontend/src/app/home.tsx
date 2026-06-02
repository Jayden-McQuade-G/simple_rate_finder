


//My imports
import {Button, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter, useLocalSearchParams } from 'expo-router';


export default function TabTwoScreen() {
    const router = useRouter();
    const { customerId, name } = useLocalSearchParams();


    return (
        <ThemedView style={styles.container} >
            <ThemedText>
                Welcome {name}
            </ThemedText>

            <ThemedText>
                Customer ID: {customerId}
            </ThemedText>

            <Button
                title="Go to Login"
                onPress={() => {
                    router.push({
                        pathname: "/login",
                    });
                }}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    textAlign: 'center'
  }
});
