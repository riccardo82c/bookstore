import { View, Text, TextInput } from 'react-native'
import styles from '~/assets/styles/login.styles'
import { useEffect, useState } from 'react'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '~/constants/colors'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = () => {
    console.log('handleLogin')
  }

  return (
    <View style={styles.container}>
      {/* ILLUSTRATION */}
      <View style={styles.topIllustration}>
        <Image
          source={require('~/assets/images/i.png')}
          style={styles.illustrationImage}
        ></Image>
      </View>

      <View style={styles.card}>
        <View style={styles.formContainer}>
          {/* EMAIL */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name='mail-outline'
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder='Enter your email'
                placeholderTextColor={COLORS.placeholderText}
                value={email}
                onChangeText={setEmail}
                keyboardType='email-address'
              />
            </View>
          </View>

          {/* PASSWORD */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name='key-outline'
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder='Enter your email'
                placeholderTextColor={COLORS.placeholderText}
                value={email}
                onChangeText={setEmail}
                keyboardType='email-address'
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
