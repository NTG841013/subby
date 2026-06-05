import React from 'react'
import {Link} from "expo-router";
import {View, Text} from 'react-native'

const SignUp = () => {
    return (
        <View>
            <Text>SignUp</Text>
            <Link href="/(auth)/sign-up">Sign In</Link>
        </View>
    )
}
export default SignUp