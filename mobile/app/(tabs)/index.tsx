import { View, Text, FlatList, Alert, ActivityIndicator, RefreshControl, Animated } from 'react-native'
import { useEffect, useState, useRef } from 'react'
import { useAuthStore } from '~/store/authStore'
import { BASE_URL } from '~/config/api'
import styles from '~/assets/styles/home.styles'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '~/constants/colors'
import { sleep } from '~/lib/utils'
import Loader from '~/components/Loader'
import BookCard from '~/components/BookCard'
import { IBook, BooksResponse } from '~/types'
import Toast, { BaseToast } from 'react-native-toast-message'
import { useLocalSearchParams } from 'expo-router'

export default function Home() {
  const { token } = useAuthStore()
  const params = useLocalSearchParams()
  console.log('params', params)

  const [books, setBooks] = useState<IBook[] | []>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [totalBooks, setTotalBooks] = useState(0)
  const [totalPage, setTotalPage] = useState(0)

  useEffect(() => {
    // Show toast either on first mount OR when route parameters have showToast='true'
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
  }, [params.showToast])

  // Riferimento allo scroll per gestire animazioni
  const scrollY = useRef(new Animated.Value(0)).current

  // Stato per controllare la visibilità dell'indicatore di pagina flottante
  const [showPageIndicator, setShowPageIndicator] = useState(false)

  const getBooks = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true)
      } else if (pageNum === 1) {
        setLoading(true)
      } else {
        setLoading(true)
      }

      const response = await fetch(`${BASE_URL}/books?page=${pageNum}&limit=5`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })

      const data: BooksResponse = await response.json()

      if (!response.ok) throw new Error(data.message || 'Failed fetching books')

      const uniqueBooks: IBook[] =
        refresh || pageNum === 1
          ? data.books
          : [...books, ...data.books]
            .filter((book, index, self) =>
              index === self.findIndex((b) => b._id === book._id)
            )

      setBooks(uniqueBooks)
      setHasMore(pageNum < data.totalPage)
      setPage(pageNum)
      setTotalBooks(data.totalBooks)
      setTotalPage(data.totalPage)

      // Mostra l'indicatore di pagina solo se ci sono più pagine
      setShowPageIndicator(data.totalPage > 1)

    } catch (error: any) {
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

  const handleLoadMore = async () => {
    if (hasMore && !loading && !refreshing) {
      await getBooks(page + 1)
    } else {
      setShowPageIndicator(false)

    }
  }

  const handleRefresh = async () => {
    await getBooks(1, true)
  }

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={styles.headerTitle}>Bookworm 🐛</Text>
        </View>
        {totalBooks > 0 && (
          <Text style={styles.totalBooksText}> <Text style={{ fontWeight: 800 }}>{totalBooks}</Text> books!!!</Text>
        )}
        <Text style={styles.headerSubtitle}>Discover great read from the community 👇</Text>
      </View>
    )
  }

  useEffect(() => {
    if (token) {
      getBooks()
    }
  }, [])

  // Calcola l'opacità dell'indicatore di pagina in base allo scroll
  const pageIndicatorOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [0, 0.7, 1],
    extrapolate: 'clamp'
  })

  // mostra loader SOLO al primo caricamento dei dati
  const isInitialLoading = loading && books.length === 0 && !refreshing

  return (
    <View style={styles.container}>
      {isInitialLoading ? (
        <Loader />
      ) : (
        <>
          <Animated.FlatList
            data={books}
            renderItem={BookCard}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}

            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
              />
            }

            ListHeaderComponent={renderHeader()}

            ListFooterComponent={
              hasMore && loading && !refreshing ? (
                <ActivityIndicator size="small" color={COLORS.primary} style={styles.footerLoader} />
              ) : null
            }

            ListEmptyComponent={
              !isInitialLoading ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name='book-outline' size={60} color={COLORS.textSecondary} />
                  <Text style={styles.emptyText}>No books found</Text>
                  <Text style={styles.emptySubtext}>Be the first to share your thoughts!</Text>
                </View>
              ) : null
            }
          />

          {/* Indicatore di pagina flottante */}
          {showPageIndicator && totalPage > 1 && (
            <Animated.View
              style={[
                styles.floatingPageIndicator,
                { opacity: pageIndicatorOpacity }
              ]}
            >
              <Text style={styles.floatingPageText}>
                {page}/{totalPage}
              </Text>
            </Animated.View>
          )}
        </>
      )}
    </View>
  )
}
