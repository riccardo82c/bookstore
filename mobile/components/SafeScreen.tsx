import { View, Text } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import COLORS from '../constants/colors'
import { PropsWithChildren } from 'react'
import { StyleSheet } from 'react-native'

export default function SafeScreen({ children }: PropsWithChildren) {
  const insets = useSafeAreaInsets()

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
})
