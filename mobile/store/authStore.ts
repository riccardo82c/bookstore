import { create } from 'zustand'
import { AuthStore } from './authStore.type'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BASE_URL } from '~/config/api'

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,

  // chiamata endpoint register + salvataggio dati nello store zustand + salvataggio dati nell AsyncStorage
  register: async (username, email, password) => {
    set({ isLoading: true })

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
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
      return { success: true, message: 'User registered successfully' }
    } catch (error: any) {
      set({ isLoading: false })
      return { success: false, message: error.message }
    }
  },

  // login fn + salvataggio dati in zustand + salvataggio dati in asyncStorage
  login: async (email, password) => {
    set({ isLoading: true })

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.message || 'something went wrong')

      await AsyncStorage.setItem('user', JSON.stringify(data.user))
      await AsyncStorage.setItem('token', data.token)

      set({ user: data.user, token: data.token, isLoading: false })
      return { success: true, message: 'User logged in successfully' }
    } catch (error: any) {
      set({ isLoading: false })
      return { success: false, message: error.message }
    }
  },

  // verifica presenza di user e token in AsyncStorage se presenti li salva nello store zustand
  checkAuth: async () => {
    const user = await AsyncStorage.getItem('user')
    const token = await AsyncStorage.getItem('token')

    if (user && token) {
      set({ user: JSON.parse(user), token })
    }
  },

  // rimuove dati utente da store zustand e AsyncStorage
  logout: async () => {
    await AsyncStorage.removeItem('user')
    await AsyncStorage.removeItem('token')
    set({ user: null, token: null })
  }
}))
