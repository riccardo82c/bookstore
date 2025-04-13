import { StyleSheet, Text, View } from 'react-native'
import { Link } from 'expo-router'
import { LinkProps } from 'expo-router'

export default function Index() {

  return (
    <View style={styles.container}>
      <Text
        style={styles.text}
      >
        Landing Page
      </Text>
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
