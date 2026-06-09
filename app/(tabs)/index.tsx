import "../../global.css";
import {styled} from "nativewind";
import {FlatList, Image, Text, View, Pressable} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import {HOME_BALANCE, HOME_USER} from "@/constants/data";
import {icons} from "@/constants/icons";
import {formatCurrency} from "@/lib/utils";
import dayjs from "dayjs";
import ListHeading from "@/components/ListHeading";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import SubscriptionCard from "@/components/SubscriptionCard";
import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import {useMemo, useState} from "react";
import { useSubscriptions } from "@/src/context/SubscriptionContext";


import {useUser} from "@clerk/expo";

const SafeAreaView = styled(RNSafeAreaView);

export default function Home() {
    const { user } = useUser();
    const { subscriptions, addSubscription } = useSubscriptions();
    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const upcomingSubscriptions = useMemo(() => {
        return subscriptions
            .filter(sub => sub.status === 'active' && sub.renewalDate)
            .map(sub => {
                const daysLeft = dayjs(sub.renewalDate).diff(dayjs(), 'day');
                return {
                    id: sub.id,
                    name: sub.name,
                    price: sub.price,
                    currency: sub.currency,
                    icon: sub.icon,
                    daysLeft: daysLeft > 0 ? daysLeft : 0
                } as UpcomingSubscription;
            })
            .sort((a, b) => a.daysLeft - b.daysLeft)
            .slice(0, 5); // Take top 5 upcoming
    }, [subscriptions]);

    const handleSubscriptionPress = (item: any) => {
        setExpandedSubscriptionId((currentId) => (currentId === item.id ? null : item.id));
    };

    const handleCreateSubscription = (newSub: Subscription) => {
        addSubscription(newSub);
    };

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <FlatList
                ListHeaderComponent={() => (
                    <>
                        <View className="home-header">
                            <View className="home-user">
                                <Image
                                    source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar}
                                    className="home-avatar"
                                />
                                <Text className="home-user-name">
                                    {user?.firstName ? `Hi, ${user.firstName}` : HOME_USER.name}
                                </Text>
                            </View>

                            <Pressable onPress={() => setIsModalVisible(true)}>
                                <Image source={icons.add} className="home-add-icon" />
                            </Pressable>
                        </View>

                        <View className="home-balance-card">
                            <Text className="home-balance-label">Balance</Text>

                            <View className="home-balance-row">
                                <Text className="home-balance-amount">
                                    {formatCurrency(HOME_BALANCE.amount)}
                                </Text>
                                <Text className="home-balance-date">
                                    {dayjs(HOME_BALANCE.nextRenewalDate).format('MM/DD')}
                                </Text>
                            </View>
                        </View>

                        <View className="mb-5">
                            <ListHeading title="Upcoming" />

                            <FlatList
                                data={upcomingSubscriptions}
                                renderItem={({ item }) => (<UpcomingSubscriptionCard {...item} />)}
                                keyExtractor={(item) => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                ListEmptyComponent={<Text className="home-empty-state">No upcoming renewals yet.</Text>}
                            />
                        </View>

                        <ListHeading title="All Subscriptions" />
                    </>
                )}
                data={subscriptions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <SubscriptionCard
                        {...item}
                        expanded={expandedSubscriptionId === item.id}
                        onPress={() => handleSubscriptionPress(item)}
                    />
                )}
                extraData={expandedSubscriptionId}
                ItemSeparatorComponent={() => <View className="h-4" />}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<Text className="home-empty-state">No subscriptions yet.</Text>}
                contentContainerClassName="pb-30"
            />
            <CreateSubscriptionModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSubmit={handleCreateSubscription}
            />
        </SafeAreaView>
    );
}