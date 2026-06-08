import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TextInput, Platform, Keyboard } from 'react-native';
import { SafeAreaView as RNSafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { HOME_SUBSCRIPTIONS } from '@/constants/data';
import SubscriptionCard from '@/components/SubscriptionCard';
import { Ionicons } from '@expo/vector-icons';
import { styled } from 'nativewind';
import { components } from '@/constants/theme';

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
    const insets = useSafeAreaInsets();

    const filteredSubscriptions = useMemo(() => {
        const subs = HOME_SUBSCRIPTIONS || [];
        const query = searchQuery?.toLowerCase().trim();

        if (!query) return subs;

        return subs.filter((sub) => {
            const name = sub.name || "";
            const category = sub.category || "";
            const plan = sub.plan || "";

            return name.toLowerCase().includes(query) ||
                   category.toLowerCase().includes(query) ||
                   plan.toLowerCase().includes(query);
        });
    }, [searchQuery]);

    const handleSubscriptionPress = (id: string) => {
        setExpandedSubscriptionId((currentId) => (currentId === id ? null : id));
    };

    const tabBar = components.tabBar;

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
            <FlatList
                data={filteredSubscriptions}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <View className="px-5">
                        <Text className="text-3xl font-sans-bold text-primary my-8">Subscriptions</Text>

                        {/* Search Bar */}
                        <View className="flex-row items-center bg-card border border-border rounded-2xl px-4 py-3 mb-6">
                            <Ionicons name="search" size={20} color="rgba(0, 0, 0, 0.4)" />
                            <TextInput
                                placeholder="Search subscriptions..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                className="flex-1 ml-3 text-base font-sans-medium text-primary"
                                placeholderTextColor="rgba(0, 0, 0, 0.4)"
                            />
                        </View>
                    </View>
                }
                renderItem={({ item }) => (
                    <View className="px-5">
                        <SubscriptionCard
                            {...item}
                            expanded={expandedSubscriptionId === item.id}
                            onPress={() => handleSubscriptionPress(item.id)}
                        />
                    </View>
                )}
                extraData={expandedSubscriptionId}
                ItemSeparatorComponent={() => <View className="h-4" />}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View className="flex-1 items-center justify-center px-5 py-20">
                        <Text className="text-lg font-sans-medium text-muted-foreground text-center">
                            {searchQuery ? "No subscriptions found" : "No subscriptions yet"}
                        </Text>
                    </View>
                }
                contentContainerStyle={{
                    paddingBottom: tabBar.height + Math.max(insets.bottom, tabBar.horizontalInset) + 20,
                    flexGrow: 1
                }}
                keyboardShouldPersistTaps="handled"
                onScrollBeginDrag={Keyboard.dismiss}
                automaticallyAdjustKeyboardInsets={true}
                keyboardDismissMode="on-drag"
            />
        </SafeAreaView>
    );
};

export default Subscriptions;
