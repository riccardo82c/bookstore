import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import SafeScreen from '~/components/SafeScreen'
import { StatusBar } from 'expo-status-bar'
import { useAuthStore } from '~/store/authStore'
import { useEffect } from 'react'
import Toast, { BaseToast, ToastProps } from 'react-native-toast-message'
import COLORS from '~/constants/colors'
import { useFonts } from 'expo-font'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {

  const router = useRouter()
  const segments = useSegments()

  const { checkAuth, user, token } = useAuthStore()

  const [fontsLoaded] = useFonts({
    'JetBrainsMono-Medium': require('../assets/fonts/JetBrainsMono-Medium.ttf'),
  })

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync()
  }, [fontsLoaded])

  const toastConfig = {
    // Customize the info toast type (the one you're using)
    info: (props: ToastProps) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: COLORS.primary,
          backgroundColor: COLORS.background,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: COLORS.textPrimary,
        }}
        text2Style={{
          fontSize: 14,
          color: COLORS.textPrimary,
        }}
      />
    ),
  }

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
      <Toast config={toastConfig} />
    </SafeAreaProvider>
  )
}
