import mongoose from "mongoose"

interface IBook {
  title: string,
  caption: string,
  image: string,
  rating: number,
  user: mongoose.Schema.Types.ObjectId
}

interface IBookDocument extends IBook, mongoose.Document {
  // You can add custom instance methods here
}

interface IBookModel extends mongoose.Model<IBookDocument> {
  // You can add custom static methods here
}

const bookSchema = new mongoose.Schema<IBookDocument>({
  title: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
})

const Book = mongoose.model<IBookDocument, IBookModel>('Book', bookSchema)

export default Book

export type { IBook, IBookDocument, IBookModel }
