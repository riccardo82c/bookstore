import express from 'express'
import Book, { IBookDocument } from '../models/Book.js'
import cloudinary from '../lib/cloudinary.js'
import protectRoute from '../middleware/auth.middleware.js'

const router = express.Router()

// create a new book
router.post('/', protectRoute, async (req: any, res) => {

  try {
    const { title, caption, image, rating } = req.body

    if (!title || !caption || !image || !rating) {
      res.status(400).json({ message: 'Please fill all fields' })
      return
    }

    // upload image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image)
    const imageUrl = uploadResponse.secure_url

    // save to db
    const book: IBookDocument = new Book({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user._id
    })

    await book.save()

    res.status(201).json({ message: 'Book created successfully', book })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error })
  }
})

// delete a book
// router.delete('/:id', (req, res) => {
//   res.send('delete a book')
// })

// update a book
// router.put('/:id', (req, res) => {
//   res.send('update a book')
// })

// get a book
// router.get('/:id', (req, res) => {
//   res.send('get a book')
// })


export default router
