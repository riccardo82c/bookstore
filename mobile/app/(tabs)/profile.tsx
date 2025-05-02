import { View, Text, Alert, FlatList, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { BASE_URL } from '~/config/api'
import { useAuthStore } from '~/store/authStore'
import styles from '~/assets/styles/profile.styles'
import ProfileHeader from '~/components/ProfileHeader'
import LogoutButton from '~/components/LogoutButton'
import ReccomendedBookCard from '~/components/ReccomendedBookCard'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '~/constants/colors'
import { IBook } from '~/types'

export default function Profile() {

  const [books, setBooks] = useState<IBook[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const router = useRouter()

  const { token } = useAuthStore()

  const getUserBooks = async () => {
    try {
      const response = await fetch(`${BASE_URL}/books/user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.message || 'Failed fetching user books')

      setBooks(data)

    } catch (error: any) {
      console.log('Error fetching data', error.message)
      Alert.alert('Error', 'Could not fetch books. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBook = async (bookId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.message || 'Failed to delete book Reccomendation')

      setBooks(books.filter((book: IBook) => book._id !== bookId))
      Alert.alert('Success', 'Book deleted successfully')

    } catch (error) {
      if (error instanceof Error) Alert.alert('Error', error.message)
      else Alert.alert('Error', 'An unknown error occurred.')
    }
  }

  useEffect(() => {
    getUserBooks()
  }, [])

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />

      <View style={styles.booksHeader}>
        <Text style={styles.booksTitle}>Your Reccomendation 📚</Text>
        <Text style={styles.booksCount}>{books?.length} books</Text>

      </View>

      <FlatList
        data={books}
        renderItem={({ item }) => <ReccomendedBookCard item={item} handleDeleteBook={handleDeleteBook} />}
        keyExtractor={(item: IBook) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.booksList}

        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name='book-outline' size={60} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No books found</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push('/create')}>
              <Text style={styles.addButtonText}>Add your first book</Text>
            </TouchableOpacity>
          </View>
        }
      />

    </View>
  )
}
