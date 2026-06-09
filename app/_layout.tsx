import {Slot, SplashScreen, Stack, useRouter, useSegments} from "expo-router";
import "../global.css";
import {useFonts} from 'expo-font';
import {useEffect, useState} from "react";
import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/expo";
import * as SecureStore from "expo-secure-store";
import { View } from "react-native";
import { PostHogProvider } from "posthog-react-native";
import { posthog } from "@/src/config/posthog";
import { SubscriptionProvider } from "@/src/context/SubscriptionContext";

const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      // Only delete if the error indicates corruption or other specific issues
      // Otherwise, return null to let Clerk handle it without potentially losing valid data
      // Common corruption error message on Android might contain "UnrecoverableKeyException" or similar
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("UnrecoverableKeyException") || errorMessage.includes("Integrity") || errorMessage.includes("corrupted")) {
        console.log("Attempting to delete corrupted key:", key);
        await SecureStore.deleteItemAsync(key).catch(() => {});
      }
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error("SecureStore save item error:", err);
      throw err;
    }
  },
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
    throw new Error(
        'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
    )
}

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
    initialRouteName: "(tabs)",
};

function InitialLayout() {
    const { isLoaded, isSignedIn } = useAuth();
    const segments = useSegments();
    const router = useRouter();
    const [isNavigationReady, setIsNavigationReady] = useState(false);

    useEffect(() => {
        setIsNavigationReady(true);
    }, []);

    useEffect(() => {
        console.log('[InitialLayout] State Update - isLoaded:', isLoaded, 'isSignedIn:', isSignedIn, 'segments:', segments, 'isNavigationReady:', isNavigationReady);
        
        if (!isLoaded || !isNavigationReady) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (isSignedIn && inAuthGroup) {
            router.replace('/(tabs)');
        } else if (!isSignedIn && !inAuthGroup) {
            console.log('[InitialLayout] Redirecting to sign-in');
            router.replace('/(auth)/sign-in');
        }
    }, [isSignedIn, isLoaded, segments, isNavigationReady]);

    useEffect(() => {
        if (isLoaded) {
            console.log('[InitialLayout] Clerk is loaded, hiding splash screen');
            SplashScreen.hideAsync().catch(err => console.error('[InitialLayout] Failed to hide splash screen:', err));
        }
    }, [isLoaded]);

    return (
        <View style={{ flex: 1, backgroundColor: '#fff9e3' }}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </View>
    );
}

export default function RootLayout() {
    const [fontsLoaded, fontError] = useFonts({
        'sans-regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
        'sans-bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
        'sans-medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
        'sans-semibold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
        'sans-extrabold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
        'sans-light': require('../assets/fonts/PlusJakartaSans-Light.ttf')
    })

    useEffect(() => {
        if (fontError) console.error('[RootLayout] Font Error:', fontError);
        if (fontsLoaded) console.log('[RootLayout] Fonts loaded successfully');
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <PostHogProvider client={posthog}>
            <SubscriptionProvider>
                <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
                    <InitialLayout />
                </ClerkProvider>
            </SubscriptionProvider>
        </PostHogProvider>
    )
}