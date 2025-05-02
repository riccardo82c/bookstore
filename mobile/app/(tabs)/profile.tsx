import { View, Text, Alert, FlatList, TouchableOpacity, RefreshControl } from 'react-native'
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
import { sleep } from '~/lib/utils'
import Toast from 'react-native-toast-message'

export default function Profile() {

  const [books, setBooks] = useState<IBook[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const router = useRouter()

  const { token } = useAuthStore()

  useEffect(() => {
    // Show toast notification about pull-to-refresh after a short delay
    const timer = setTimeout(() => {
      Toast.show({
        type: 'info',
        position: 'top',
        text1: 'Bookstore tip',
        text2: 'Scroll down the page from top to reload content',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 50
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const getUserBooks = async (refresh = false) => {
    try {

      if (refresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

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
      if (refresh) {
        await sleep(500)
        setRefreshing(false)
      } else {
        setLoading(false)
      }
    }
  }

  const handleDeleteBook = async (bookId: string) => {
    try {
      setLoading(true)
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
    } finally {
      setLoading(false)
    }

  }

  useEffect(() => {
    getUserBooks()
  }, [])

  const handleRefresh = async () => {
    await getUserBooks(true)
  }

  return (
    <View style={styles.container}>

      <FlatList
        ListHeaderComponent={
          (<>
            <ProfileHeader />
            <LogoutButton />
            <View style={styles.booksHeader}>
              <Text style={styles.booksTitle}>Your Reccomendation 📚</Text>
              <Text style={styles.booksCount}>{books?.length} books</Text>

            </View>


          </>
          )
        }
        data={books}
        renderItem={({ item }) => <ReccomendedBookCard item={item} loading={loading} handleDeleteBook={handleDeleteBook} />}
        keyExtractor={(item: IBook) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.booksList}

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }

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
