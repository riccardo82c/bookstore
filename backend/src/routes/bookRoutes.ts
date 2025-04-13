import express from 'express'
import Book, { IBookDocument } from '../models/Book.js'
import cloudinary from '../lib/cloudinary.js'
import protectRoute from '../middleware/auth.middleware.js'
import { Request } from 'express'

const router = express.Router()

// create a new book
router.post('/', protectRoute, async (req: Request, res) => {

  try {
    const { title, caption, image, rating } = req.body

    if (!title || !caption || !image || !rating) {
      res.status(400).json({ message: 'Please fill all fields' })
      return
    }

    // upload image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image)
    const imageUrl = uploadResponse.secure_url

    // save to db, ADD THE USER._ID RETRIEVE FROM JWT
    const book: IBookDocument = new Book({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user!._id
    })

    await book.save()
    res.status(201).json({ message: 'Book created successfully', book })

  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error })
  }
})

// get all books with pagination for infinite scroll
router.get('/', protectRoute, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 5

    const skip = (page - 1) * limit
    // estract books by pages number and whit limit number of record
    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username profileImage')

    const totalBooks = await Book.countDocuments()

    res.status(200).json({
      books,
      currentPage: page,
      totalBooks,
      totalPage: Math.ceil(totalBooks / limit)
    })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error })
  }
})

// get all books
router.get('/all', protectRoute, async (req, res) => {
  try {
    const books = await Book.find()
    res.status(200).json(books)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error })
  }
})

// delete a book
router.delete('/:id', protectRoute, async (req: Request, res) => {

  try {
    const book = await Book.findById(req.params.id)

    if (!book) {
      res.status(404).json({ message: 'Book not found' })
      return
    }

    // check if user is the creator
    const bookUserId = book.user
    const loggedUserId = req.user!._id

    // if not exit
    if (bookUserId.toString() !== loggedUserId!.toString()) {
      res.status(401).json({ message: 'Unauthorized to delete this content' })
      return
    }

    console.log('the logged user is the creator of the searched book')


    // delete image from cloudinary
    // check if the image is from cloudinary
    if (book.image && book.image.includes('cloudinary')) {
      try {
        // extract the public id from the image url
        const imagePublicId = book.image.split('/').pop()?.split('.')[0]
        // delete the image from cloudinary
        cloudinary.uploader.destroy(imagePublicId!)
          .then(result => console.log('result image delete', result))
      } catch (error) {
        res.status(500).json({ message: 'Error deleting image from cloudinary', error })
        return
      }
    }

    // delete book from db
    await book.deleteOne()

    res.status(200).json({ message: 'book deleted successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong', error })
  }
})

// get raccomended books by the logged user
router.get('/user', protectRoute, async (req: Request, res) => {
  try {
    const loggedUserId = req.user!._id
    const books = await Book.find({ user: loggedUserId })
      .sort({ createdAt: -1 })
      .populate('user', 'username profileImage')

    if (!books) {
      res.status(404).json({ message: 'No books found' })
      return
    }
    res.status(200).json(books)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error })
  }
})

// update a book
router.put('/:id', protectRoute, async (req: Request, res) => {
  try {
    const { title, caption, image, rating } = req.body
    const bookId = req.params.id
    const result = await Book.findByIdAndUpdate(bookId, { title, caption, image, rating }, { new: true })
    if (!result) {
      res.status(404).json({ message: 'Book not found' })
      return
    } else {
      res.status(200).json({ message: 'Book updated successfully', book: result })
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error })
  }
})

// get a book by id
router.get('/:id', protectRoute, async (req: Request, res) => {
  try {
    const bookId = req.params.id
    const book = await Book.findById(bookId)
    if (!book) {
      res.status(400).json({ message: 'Book id is required' })
      return
    } else {
      res.status(200).json({ message: 'Book found', book })
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error })
  }
})

export default router
