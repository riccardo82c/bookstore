import { View, Text } from 'react-native'
import React from 'react'
import styles from '~/assets/styles/home.styles'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import COLORS from '~/constants/colors'
import { formatPublishDate } from '~/lib/utils'
import { IBook } from '~/types'

export default function BookCard({item} : {item: IBook}) {
  return (
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: item.user.profileImage }} style={styles.avatar} />
          <Text style={styles.username}>Posted by: {item.user.username}</Text>
        </View>
      </View>
      <View style={styles.bookImageContainer}>
        <Image source={{ uri: item.image }} style={styles.bookImage} contentFit='cover' />
      </View>

      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={`${item._id}-star-${star}`}
              name={star <= item.rating ? 'star' : 'star-outline'}
              size={20}
              color={star <= item.rating ? '#f4b400' : COLORS.textSecondary}
            />
          ))}
        </View>
        <Text style={styles.caption}>{item.caption}</Text>
        <Text style={styles.date}>Shared on {formatPublishDate(item.createdAt)}</Text>
      </View>
    </View>
  )
}
