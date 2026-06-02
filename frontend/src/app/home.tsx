import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Platform, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExternalLink } from '@/components/external-link';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

//My imports
import { useLocalSearchParams } from 'expo-router';

export default function TabTwoScreen() {
    const { customerId, name } = useLocalSearchParams();
    return (
        <ThemedView>
            <ThemedText>
                Welcome {name}
            </ThemedText>

            <ThemedText>
                Customer ID: {customerId}
            </ThemedText>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
  },
});
