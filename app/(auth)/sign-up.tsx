import React, { useState } from 'react'
import { Link, useRouter } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { useSignUp, useAuth } from "@clerk/expo";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {
    const { signUp } = useSignUp();
    const { isLoaded: authLoaded } = useAuth();
    const router = useRouter();

    console.log('[SignUp] Rendering, signUpDefined:', !!signUp, 'authLoaded:', authLoaded);

    const [firstName, setFirstName] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState("");
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

                            <Text className="auth-title">
                                {pendingVerification ? "Verify email" : "Join Subby"}
                            </Text>
                            <Text className="auth-subtitle">
                                {pendingVerification 
                                    ? `We've sent a 6-digit code to ${emailAddress}` 
                                    : "Start managing your subscriptions with ease today"}
                            </Text>
                        </View>

                        {/* Card */}
                        <View className="auth-card">
                            {!pendingVerification ? (
                                <View className="auth-form">
                                    {/* Name Field */}
                                    <View className="auth-field">
                                        <Text className="auth-label">First Name</Text>
                                        <TextInput
                                            value={firstName}
                                            placeholder="Enter your name"
                                            className="auth-input"
                                            onChangeText={(name) => setFirstName(name)}
                                        />
                                    </View>

                                    {/* Email Field */}
                                    <View className="auth-field">
                                        <Text className="auth-label">Email</Text>
                                        <TextInput
                                            autoCapitalize="none"
                                            value={emailAddress}
                                            placeholder="Enter your email"
                                            className="auth-input"
                                            onChangeText={(email) => setEmailAddress(email)}
                                            keyboardType="email-address"
                                        />
                                    </View>

                                    {/* Password Field */}
                                    <View className="auth-field">
                                        <Text className="auth-label">Password</Text>
                                        <TextInput
                                            value={password}
                                            placeholder="Create a password"
                                            secureTextEntry={true}
                                            className="auth-input"
                                            onChangeText={(password) => setPassword(password)}
                                        />
                                    </View>

                                    {error ? (
                                        <Text className="auth-error text-center">{error}</Text>
                                    ) : null}

                                    <TouchableOpacity
                                        onPress={async () => {
                                            if (!signUp) return;

                                            setLoading(true);
                                            setError("");

                                            try {
                                                const { error: signUpError } = await signUp.create({
                                                    firstName,
                                                    emailAddress,
                                                    password,
                                                });

                                                if (signUpError) {
                                                    setError(signUpError.message || "Invalid sign up details");
                                                    return;
                                                }

                                                // Send verification email
                                                await signUp.verifications.sendEmailCode();

                                                // Display the second form to collect the verification code
                                                setPendingVerification(true);
                                            } catch (err: any) {
                                                if (__DEV__) {
                                                    console.error("Sign-up error:", JSON.stringify(err, null, 2));
                                                } else {
                                                    console.error(`Auth error: ${err?.name ?? 'Error'} - ${err?.message ?? 'no message'}`);
                                                }
                                                setError("Something went wrong. Please try again.");
                                            } finally {
                                                setLoading(false);
                                            }
                                        }}
                                        disabled={loading}
                                        className={`auth-button ${loading ? 'auth-button-disabled' : ''}`}
                                    >
                                        <Text className="auth-button-text">
                                            {loading ? "Creating account..." : "Create account"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View className="auth-form">
                                    <View className="auth-field">
                                        <Text className="auth-label">Verification Code</Text>
                                        <TextInput
                                            value={code}
                                            placeholder="Enter 6-digit code"
                                            className="auth-input"
                                            onChangeText={(code) => setCode(code)}
                                            keyboardType="number-pad"
                                        />
                                        <Text className="auth-helper text-center">
                                            Please enter the code sent to your email.
                                        </Text>
                                    </View>

                                    {error ? (
                                        <Text className="auth-error text-center">{error}</Text>
                                    ) : null}

                                    <TouchableOpacity
                                        onPress={async () => {
                                            if (!signUp) return;

                                            setLoading(true);
                                            setError("");

                                            try {
                                                const { error: verifyError } = await signUp.verifications.verifyEmailCode({
                                                    code,
                                                });

                                                if (verifyError) {
                                                    setError(verifyError.message || "Invalid code. Please try again.");
                                                    return;
                                                }

                                                if (signUp.status === "complete") {
                                                    await signUp.finalize({
                                                        navigate: (url) => router.replace(url),
                                                    });
                                                } else {
                                                    setError("Verification failed. Please check the code and try again.");
                                                }
                                            } catch (err: any) {
                                                if (__DEV__) {
                                                    console.error("Verification error:", JSON.stringify(err, null, 2));
                                                } else {
                                                    console.error(`Auth error: ${err?.name ?? 'Error'} - ${err?.message ?? 'no message'}`);
                                                }
                                                setError("Something went wrong. Please try again.");
                                            } finally {
                                                setLoading(false);
                                            }
                                        }}
                                        disabled={loading}
                                        className={`auth-button ${loading ? 'auth-button-disabled' : ''}`}
                                    >
                                        <Text className="auth-button-text">
                                            {loading ? "Verifying..." : "Verify email"}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity 
                                        onPress={() => setPendingVerification(false)}
                                        className="items-center mt-2"
                                    >
                                        <Text className="auth-link-copy">Edit email address</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        {/* Footer Links */}
                        {!pendingVerification && (
                            <View className="auth-link-row">
                                <Text className="auth-link-copy">Already have an account?</Text>
                                <Link href="/(auth)/sign-in" asChild>
                                    <TouchableOpacity>
                                        <Text className="auth-link">Sign in</Text>
                                    </TouchableOpacity>
                                </Link>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default SignUp