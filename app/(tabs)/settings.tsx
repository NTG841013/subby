import {Text, View, TouchableOpacity, Image} from 'react-native'
import React from 'react'
import {SafeAreaView} from 'react-native-safe-area-context'
import {useAuth, useUser} from "@clerk/expo";
import dayjs from "dayjs";

const Settings = () => {
    const { signOut } = useAuth();
    const { user } = useUser();

    return (
        <SafeAreaView className="flex-1 bg-background px-5">
            <Text className="text-3xl font-sans-bold text-primary my-8">Settings</Text>

            {user && (
                <View className="gap-6">
                    {/* Profile Card */}
                    <View className="flex-row items-center p-6 bg-card border border-border rounded-3xl">
                        <View className="size-16 rounded-2xl bg-accent items-center justify-center overflow-hidden">
                            {user.imageUrl ? (
                                <Image source={{ uri: user.imageUrl }} className="size-16" />
                            ) : (
                                <Text className="text-2xl font-sans-bold text-white">
                                    {user.firstName?.charAt(0) || user.emailAddresses[0].emailAddress.charAt(0).toUpperCase()}
                                </Text>
                            )}
                        </View>
                        <View className="ml-4 flex-1">
                            <Text className="text-xl font-sans-bold text-primary" numberOfLines={1}>
                                {user.firstName} {user.lastName}
                            </Text>
                            <Text className="text-sm font-sans-medium text-muted-foreground" numberOfLines={1}>
                                {user.emailAddresses[0].emailAddress}
                            </Text>
                        </View>
                    </View>

                    {/* Account Info Card */}
                    <View className="p-6 bg-card border border-border rounded-3xl">
                        <Text className="text-lg font-sans-bold text-primary mb-4">Account</Text>
                        
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-sm font-sans-medium text-muted-foreground">Account ID</Text>
                            <Text className="text-sm font-sans-bold text-primary" numberOfLines={1} ellipsizeMode="middle">
                                {user.id}
                            </Text>
                        </View>

                        <View className="flex-row justify-between items-center">
                            <Text className="text-sm font-sans-medium text-muted-foreground">Joined</Text>
                            <Text className="text-sm font-sans-bold text-primary">
                                {user.createdAt ? dayjs(user.createdAt).format("DD. MM. YYYY.") : "N/A"}
                            </Text>
                        </View>
                    </View>

                    {/* Sign Out Button */}
                    <TouchableOpacity 
                        onPress={() => signOut()}
                        className="w-full items-center rounded-2xl bg-accent py-4 mt-2"
                    >
                        <Text className="text-base font-sans-bold text-white">Sign Out</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    )
}
export default Settings
