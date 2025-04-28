import { View, Text, FlatList } from 'react-native'
import { useEffect, useState } from 'react'
import { useAuthStore } from '~/store/authStore'
import { BASE_URL } from '~/config/api'
import styles from '~/assets/styles/home.styles'
import { Image } from 'expo-image'

interface IUser {
  username: string
  email: string
  password: string
  profileImage: string
}

interface IBook {
  _id: string,
  title: string,
  caption: string,
  image: string,
  rating: number,
  user: IUser, // L'ID dell'utente come stringa
  createdAt?: string,
  updatedAt?: string,
}

export default function Home() {

  const { token } = useAuthStore()

  const [books, setBooks] = useState<IBook[] | []>([])
  const [loading, setLoading] = useState(false)
  const [rereshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const getBooks = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${BASE_URL}/books?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })

      const data = await response.json()

      console.log(data)

      if (!response.ok) throw new Error(data.message || 'something went wrong')

      if (data.length < 10) {
        setHasMore(false)
      }

      setBooks(data.books)
      setLoading(false)
      setRefreshing(false)
    } catch (error: any) {
      setLoading(false)
      setRefreshing(false)
      return { success: false, message: error.message }
    }

  }

  const handleLoadMore = async () => {
    if (hasMore) {
      setPage(page + 1)
      getBooks()
    }
  }

  const renderBook = ({ item }: { item: IBook }) => {
    return (
      <View style={styles.bookCard}>
        <View style={styles.bookHeader}>
          <View style={styles.userInfo}>
            <Image source={{ uri: item.user.profileImage }} style={styles.avatar} />
            <Text style={styles.username}>{item.user.username}</Text>
          </View>
        </View>

      </View>
    )
  }

  useEffect(() => {
    if (token) {
      getBooks()
    }
  }, [])


  return (
    <View style={styles.container}>
      {/* crate list from books */}
      <FlatList
        data={books}
        keyExtractor={(item: any) => item._id}
        renderItem={renderBook}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (hasMore) {
            setPage(page + 1)
            getBooks()
          }
        }}
        onEndReachedThreshold={0.5}
        refreshing={rereshing}
        onRefresh={() => {
          setRefreshing(true)
          setPage(1)
          getBooks()
        }}
      />

    </View>
  )
}
