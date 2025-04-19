import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Link } from 'expo-router'
import { LinkProps } from 'expo-router'
import { useAuthStore } from '~/store/authStore'
import { useEffect } from 'react'

export default function Index() {

  const {user, token, checkAuth, logout} = useAuthStore()
  console.log(user, token)

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello {user?.username} !</Text>

      <TouchableOpacity onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>

      <Link href={'/(auth)/signup'}>Signup</Link>
      <Link href={'/(auth)' as LinkProps['href']}>Login</Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 50,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'grey',
    marginBottom: 20,
  },
})
