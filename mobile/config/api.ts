import Constants from 'expo-constants'
type ApiEnvironment = 'standard' | 'emulator' | 'remote'

const API_URLS: Record<ApiEnvironment, string> = {
  standard: 'http://192.168.1.162:3000/api',     // IP locale standard
  emulator: 'http://10.0.2.2:3000/api',          // Per emulatori
  remote: 'https://bookstore-abp0.onrender.com/api'  // Backend su Render
}

// Determina l'ambiente in base ai parametri di avvio
export const getApiUrl = (): string => {
  const apiType = Constants.expoConfig?.extra?.apiType as ApiEnvironment || 'remote'

  if (apiType in API_URLS) {
    return API_URLS[apiType]
  }

  return API_URLS.standard
}

export const BASE_URL = getApiUrl()

// Per debugging
console.log(`API configurata: ${getApiUrl()}`)
