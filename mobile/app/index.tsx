import { StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'

export default function Index() {
  return (
    <View style={styles.container}>
      <Text
        style={{
          color: 'red',
          fontSize: 24,
          textAlign: 'center',
          marginHorizontal: 20,
          fontWeight: 'bold',
          marginBottom: 20,
        }}
      >
        Benvenuto in Expo Router!


      </Text>
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1741851373441-88b6f673d655?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        }}
        style={styles.image}
      ></Image>
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
    borderRadius: 20,
  },
})
