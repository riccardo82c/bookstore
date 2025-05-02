import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import styles from '~/assets/styles/profile.styles'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import COLORS from '~/constants/colors'
import { IBook } from '~/types'
import { formatPublishDate } from '~/lib/utils'

export default function ReccomendedBookCard({
  item,
  handleDeleteBook
}: {
  item: IBook,
  handleDeleteBook: (bookId: string) => Promise<void>
}) {

  const confirmDeleteBook = (id: string) => {
    Alert.alert('Delete Reccomendation', 'Are you sure you want to delete this Reccomendation?', [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Delete',
        onPress: () => handleDeleteBook(id),
        style: 'destructive'
      }
    ])
  }

  return (
    <View style={styles.bookItem}>
      <Image source={{ uri: item.image }} style={styles.bookImage} contentFit='cover' />

      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={`${item._id}-star-${star}`}
              name={star <= item.rating ? 'star' : 'star-outline'}
              size={15}
              color={star <= item.rating ? '#f4b400' : COLORS.textSecondary}
            />
          ))}
        </View>
        <Text style={styles.bookCaption} numberOfLines={2}>
          {item.caption}
        </Text>
        <Text style={styles.bookDate}>{formatPublishDate(item.createdAt)}</Text>
      </View>

      {/* delete button */}
      <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDeleteBook(item._id)}>
        <Ionicons name='trash-outline' size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </View>
  )
}
