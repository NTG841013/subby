import PostHog from 'posthog-react-native'

const posthogKey = process.env.EXPO_PUBLIC_POSTHOG_KEY;

if (!posthogKey) {
  throw new Error(
    'Missing PostHog Key. Please set EXPO_PUBLIC_POSTHOG_KEY in your .env'
  )
}

export const posthog = new PostHog(posthogKey, {
  host: process.env.EXPO_PUBLIC_POSTHOG_HOST,
})
