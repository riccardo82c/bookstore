import { create } from 'zustand'
import { AuthStore, User } from './authStore.type'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,

  register: async (username, email, password) => {
    set({ isLoading: true })
    try {
      const response = await fetch('http://10.0.2.2:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.message || 'something went wrong')

      await AsyncStorage.setItem('user', JSON.stringify(data.user))
      await AsyncStorage.setItem('token', data.token)

      set({ user: data.user, token: data.token, isLoading: false })
      return {success: true, message: 'User registered successfully'}
    } catch (error : any) {
      set({ isLoading: false })
      return {success: false, message: error.message}
    }
  },
}))
