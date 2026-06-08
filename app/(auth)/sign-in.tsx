import React, { useState } from 'react'
import { Link, useRouter } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { useSignIn, useAuth } from "@clerk/expo";
import { SafeAreaView } from "react-native-safe-area-context";

const SignIn = () => {
    const { signIn } = useSignIn();
    const { isLoaded: authLoaded } = useAuth();
    const router = useRouter();

    console.log('[SignIn] Rendering, signInDefined:', !!signIn, 'authLoaded:', authLoaded);

    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!authLoaded) {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff9e3', justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading Auth State...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background" style={{ flex: 1 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
                style={{ flex: 1 }}
            >
                <ScrollView className="auth-scroll" contentContainerStyle={{ flexGrow: 1 }}>
                    <View className="auth-content" style={{ flex: 1 }}>
                        {/* Brand Block */}
                        <View className="auth-brand-block">
                            <View className="auth-logo-wrap">
                                <View className="auth-logo-mark">
                                    <Text className="auth-logo-mark-text">S</Text>
                                </View>
                                <View>
                                    <Text className="auth-wordmark">Subby</Text>
                                    <Text className="auth-wordmark-sub">Smart Billing</Text>
                                </View>
                            </View>

                            <Text className="auth-title">Welcome back</Text>
                            <Text className="auth-subtitle">
                                Sign in to continue managing your subscriptions
                            </Text>
                        </View>

                        {/* Card */}
                        <View className="auth-card">
                            <View className="auth-form">
                                {/* Email Field */}
                                <View className="auth-field">
                                    <Text className="auth-label">Email</Text>
                                    <TextInput
                                        autoCapitalize="none"
                                        value={emailAddress}
                                        placeholder="Enter your email"
                                        className={`auth-input ${error && !emailAddress ? 'auth-input-error' : ''}`}
                                        onChangeText={(email) => setEmailAddress(email)}
                                        keyboardType="email-address"
                                    />
                                </View>

                                {/* Password Field */}
                                <View className="auth-field">
                                    <Text className="auth-label">Password</Text>
                                    <TextInput
                                        value={password}
                                        placeholder="Enter your password"
                                        secureTextEntry={true}
                                        className={`auth-input ${error && !password ? 'auth-input-error' : ''}`}
                                        onChangeText={(password) => setPassword(password)}
                                    />
                                </View>

                                {error ? (
                                    <Text className="auth-error text-center">{error}</Text>
                                ) : null}

                                <TouchableOpacity
                                    onPress={async () => {
                                        if (!signIn) return;

                                        setLoading(true);
                                        setError("");

                                        try {
                                            const { error: signInError } = await signIn.password({
                                                identifier: emailAddress,
                                                password,
                                            });

                                            if (signInError) {
                                                setError(signInError.message || "Invalid email or password");
                                                return;
                                            }

                                            if (signIn.status === "complete") {
                                                await signIn.finalize({
                                                    navigate: (url) => router.replace(url),
                                                });
                                            }
                                        } catch (err: any) {
                                            console.error(JSON.stringify(err, null, 2));
                                            setError("Something went wrong. Please try again.");
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    disabled={loading}
                                    className={`auth-button ${loading ? 'auth-button-disabled' : ''}`}
                                >
                                    <Text className="auth-button-text">
                                        {loading ? "Signing in..." : "Sign in"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Footer Links */}
                        <View className="auth-link-row">
                            <Text className="auth-link-copy">New to Subby?</Text>
                            <Link href="/(auth)/sign-up" asChild>
                                <TouchableOpacity>
                                    <Text className="auth-link">Create an account</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default SignIn
