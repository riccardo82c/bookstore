import { Stack, useRouter, useSegments } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import SafeScreen from '~/components/SafeScreen'
import { StatusBar } from 'expo-status-bar'
import { useAuthStore } from '~/store/authStore'
import { useEffect } from 'react'

export default function RootLayout() {

  const router = useRouter()
  const segments = useSegments()

  console.log('segments', segments)

  const { checkAuth, user, token } = useAuthStore()

  // al mount facciamo la checkAuth di modo da avere user e token aggiornati
  useEffect(() => {
    checkAuth()
  }, [])

  // gestisce la navigazione quando cambiano le dependencies ( aggiornate )
  // da checkAuth() triggerato al mounted
  useEffect(() => {

    // check se sono nello auth screen
    const inAuthScreen = segments[0] === '(auth)'
    // se sono loggato
    const isSignedIn = user && token

    console.log('isSignedIn', !!isSignedIn)

    if (!isSignedIn && !inAuthScreen) router.replace('/(auth)')
    else if (isSignedIn && inAuthScreen) router.replace('/(tabs)')

  }, [user, token, segments])

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name='(tabs)' />
          <Stack.Screen name='(auth)' />
        </Stack>
      </SafeScreen>
      <StatusBar style='auto'></StatusBar>
    </SafeAreaProvider>
  )
}
