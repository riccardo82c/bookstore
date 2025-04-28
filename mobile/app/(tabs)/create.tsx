import { View, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { useState } from 'react'
import styles from '~/assets/styles/create.styles'
import COLORS from '~/constants/colors'
import { useRouter } from 'expo-router'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { BASE_URL } from '~/config/api'
import { useAuthStore } from '~/store/authStore'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Create() {

  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [rating, setRating] = useState(3)
  const [image, setImage] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null | undefined>(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const pickImage = async () => {

    try {
      // check permessi
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!permissionResult.granted) {
        Alert.alert('Permission to access camera roll is required!')
        return
      }

      // launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true
      })

      if (!result.canceled) {
        setImage(result.assets[0].uri)

        if (result.assets[0].base64) {
          setImageBase64(result.assets[0].base64)
        }
        else {
          //converti uri in base64 se non è già presente nella conversione
          const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
            encoding: FileSystem.EncodingType.Base64,
          })
          setImageBase64(base64)
        }
      }

    } catch (error) {
      console.error('Error picking image:', error)
      if (error instanceof Error) Alert.alert('Error picking image:', error.message)
      else Alert.alert('Error picking image:', 'An unknown error occurred.')
    }
  }

  const handleSubmit = async () => {


    const token = await AsyncStorage.getItem('token')

    if (!title || !caption || !imageBase64 || !rating) return Alert.alert('Error', 'Please fill all fields')

    try {
      setLoading(true)

      // get file ext from uri
      const uriParts = imageBase64.split('.')
      const fileType = uriParts[uriParts.length - 1]
      const imageType = fileType ? `image/${fileType.toLowerCase()}` : 'image/jpeg'

      const imageDataUrl = `data:${imageType};base64,${imageBase64}`

      const response = await fetch(`${BASE_URL}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          caption,
          image: imageDataUrl,
          rating
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'something went wrong')
      } else {
        setLoading(false)
        Alert.alert('Success', 'Book added successfully')
        router.push('/')
      }

    } catch (error) {
      if (error instanceof Error) Alert.alert('Error', error.message)
      else Alert.alert('Error', 'An unknown error occurred.')
      setLoading(false)
    }
  }

  return (

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
        <View style={styles.card}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>Add a book recommendation</Text>
            <Text style={styles.subtitle}>Share your favourire reads with others</Text>
          </View>

          {/* FORM */}

          <View style={styles.form}>

            {/* BOOK TITLE */}

            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Title</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name='book-outline'
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder='Enter book title'
                  placeholderTextColor={COLORS.placeholderText}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
            </View>

            {/* RATING */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Your Rating</Text>
              <View style={[styles.inputContainer, styles.starContainer]}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                  >
                    <Ionicons
                      name={star <= rating ? 'star' : 'star-outline'}
                      size={30}
                      color={star <= rating ? '#f4b400' : COLORS.textSecondary}
                    />
                  </TouchableOpacity>
                ))}
              </View>

            </View>

            {/* IMAGE */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Image</Text>
              <TouchableOpacity
                style={styles.imagePicker}
                onPress={pickImage}
              >
                {image ? (
                  <Image
                    source={{ uri: image }}
                    style={styles.previewImage}
                  />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Ionicons
                      name='image-outline'
                      size={40}
                      color={COLORS.textSecondary}
                    />
                    <Text style={styles.placeholderText}>Tap to select image</Text>
                  </View>
                )}

              </TouchableOpacity>

            </View>

            {/* CAPTION */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Caption</Text>
              <TextInput style={styles.textArea}
                placeholder='Write your review about this book...'
                placeholderTextColor={COLORS.placeholderText}
                value={caption}
                onChangeText={setCaption}
                multiline
              >
              </TextInput>
            </View>

            {/* BUTTON */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ?
                <ActivityIndicator size='small' color={COLORS.white} />
                :
                (
                  <>
                    <Ionicons
                      name='cloud-upload-outline'
                      size={20}
                      color={COLORS.white}
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.buttonText}>Share</Text>
                  </>
                )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>


    </KeyboardAvoidingView>


  )
}
