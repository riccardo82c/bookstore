import { View, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { useState, useRef } from 'react' // Added useRef import
import styles from '~/assets/styles/create.styles'
import COLORS from '~/constants/colors'
import { useRouter } from 'expo-router'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { BASE_URL } from '~/config/api'
import { useAuthStore } from '~/store/authStore'
import * as ImagePicker from 'expo-image-picker'

export default function Create() {
  // Your existing state variables
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [rating, setRating] = useState(3)
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Add these references
  const scrollViewRef = useRef<ScrollView>(null)
  const captionInputRef = useRef<TextInput>(null)

  const { token } = useAuthStore()
  const router = useRouter()

  // Function to scroll to the bottom when caption is focused
  const handleCaptionFocus = () => {
    // Small delay to ensure keyboard is visible before scrolling
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }

  // Your existing methods remain unchanged
  const checkCameraPermissions = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync()
    if (!permissionResult.granted) {
      Alert.alert('Permission to access camera is required!')
      return false
    }
    return true
  }

  const checkMediaLibraryPermissions = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permissionResult.granted) {
      Alert.alert('Permission to access camera roll is required!')
      return false
    }
    return true
  }

  const takePhoto = async () => {
    try {
      // Check camera permissions
      const hasPermission = await checkCameraPermissions()
      if (!hasPermission) return

      // Launch camera with updated media types syntax
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5
      })

      if (!result.canceled) {
        setImage(result.assets[0].uri)
      }
    } catch (error) {
      console.error('Error taking photo:', error)
      if (error instanceof Error) Alert.alert('Error taking photo:', error.message)
      else Alert.alert('Error taking photo:', 'An unknown error occurred.')
    }
  }

  const pickFromGallery = async () => {
    try {
      // Check media library permissions
      const hasPermission = await checkMediaLibraryPermissions()
      if (!hasPermission) return

      // Launch image picker with updated media types syntax
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], // Use array of strings instead of MediaTypeOptions
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5
      })

      if (!result.canceled) {
        setImage(result.assets[0].uri)
      }
    } catch (error) {
      console.error('Error picking image:', error)
      if (error instanceof Error) Alert.alert('Error picking image:', error.message)
      else Alert.alert('Error picking image:', 'An unknown error occurred.')
    }
  }

  const pickImage = () => {
    Alert.alert(
      'Choose Option',
      'Would you like to take a photo or select from gallery?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickFromGallery }
      ]
    )
  }

  const handleSubmit = async () => {
    if (!token) {
      Alert.alert('Error', 'You are not logged in')
      return
    }

    if (!title || !caption || !image || !rating) return Alert.alert('Error', 'Please fill all fields')

    try {
      setLoading(true)

      // Create a FormData object
      const formData = new FormData()

      // Add text data
      formData.append('title', title)
      formData.append('caption', caption)
      formData.append('rating', rating.toString())

      // Prepare image file for FormData
      let filename = image.split('/').pop()
      let match = /\.(\w+)$/.exec(filename || '')
      let type = match ? `image/${match[1]}` : 'image/jpeg'

      formData.append('image', {
        uri: image,
        name: filename || 'photo.jpg',
        type
      } as unknown as Blob)

      const response = await fetch(`${BASE_URL}/books`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.message || 'something went wrong')

      Alert.alert('Success', 'Book added successfully')

      setTitle('')
      setCaption('')
      setImage(null)
      setRating(3)

      router.push({
        pathname: '/',
        params: { showToast: 'true' }
      })

    } catch (error) {
      if (error instanceof Error) Alert.alert('Error', error.message)
      else Alert.alert('Error', 'An unknown error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[styles.container,{paddingBottom: 80}]}
        style={styles.scrollViewStyle}
      >
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
              <TextInput
                ref={captionInputRef}
                style={styles.textArea}
                placeholder='Write your review about this book...'
                placeholderTextColor={COLORS.placeholderText}
                value={caption}
                onChangeText={setCaption}
                multiline
                onFocus={handleCaptionFocus} // Add the onFocus handler here
              />
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
