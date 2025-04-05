import bcrypt from 'bcryptjs'
import mongoose, { Document, Model } from 'mongoose'

interface IUser {
  username: string
  email: string
  password: string
  profileImage: string
}

interface IUserDocument extends IUser, Document {
  // You can add custom instance methods here
}

interface IUserModel extends Model<IUserDocument> {
  // You can add custom static methods here
}

// Schema mongoose:
// Uno schema in Mongoose è un oggetto di configurazione che definisce la struttura, le validazioni
// e il comportamento dei documenti in una collezione MongoDB
const userSchema = new mongoose.Schema<IUserDocument>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profileImage: {
    type: String,
    default: ''
  }
})

// Middleware per evento save esegue Hash pwd prima di salvarla nel db
userSchema.pre('save', async function (next) {

  if(!this.isModified('password')) return next()

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// model:
// è una funzione costruttore creata da uno Schema che:
//  Rappresenta una collezione MongoDB
//  Fornisce un'interfaccia per interagire con il database (create, read, update, delete)
//  Istanzia oggetti documento basati sullo schema
//  Implementa la logica di business attraverso metodi statici e di istanza
const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema)

export default User

export type { IUser, IUserDocument, IUserModel }
