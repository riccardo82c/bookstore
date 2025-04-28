import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '~/constants/colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function TabLayout() {

  const insets = useSafeAreaInsets()
  return (
    <Tabs
      screenOptions={
        {
          tabBarActiveTintColor: COLORS.primary,
          tabBarStyle: {
            backgroundColor: COLORS.cardBackground,
            borderTopWidth: 1,
            paddingTop: 5,
            paddingBottom: insets.bottom,
            height: 60 + insets.bottom
          },
          headerShown: false,
          headerTitleStyle: {
            color: COLORS.primary,
            fontWeight: "bold"
          },
          headerShadowVisible: false,
        }
      }
    >
      <Tabs.Screen name="index"
        options={
          {
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Ionicons size={size} name='home-outline' color={color} />
          }
        }
      />
      <Tabs.Screen name="create"
        options={
          {
            title: 'Create',
            tabBarIcon: ({ color, size }) => <Ionicons size={size} name='add-circle-outline' color={color} />
          }
        }
      />
      <Tabs.Screen name="profile"
        options={
          {
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <Ionicons size={size} name='person-outline' color={color} />
          }
        }
      />
    </Tabs>
  )
}
