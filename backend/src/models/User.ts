import bcrypt from 'bcryptjs'
import mongoose, { Document, Model } from 'mongoose'

// Interfaccia base: definisce SOLO LA STRUTTURA dei dati di un utente
interface IUser {
  username: string
  email: string
  password: string
  profileImage: string
}

// Rappresenta un documento utente nel database con tutti i METODI DI ISTANZA (come matchPassword).
// cioè metodi chiamati sull'istanza stessa di User creato
interface IUserDocument extends IUser, Document {
  matchPassword(enteredPassword: string): Promise<boolean>;
  // You can add custom instance methods here
}

// Estende Model e rappresenta il modello stesso, non un singolo documento.
// È utile quando vuoi aggiungere METODI STATICI al modello User.
// cioè metodi sulla collezione nel loro complesso
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

// Middleware prima dell'evento evento save:
// esegue Hash pwd prima di salvarla nel db
// (in Mongoose i middleware sono sempre definiti a partire dallo Schema)
userSchema.pre('save', async function (next) {

  if (!this.isModified('password')) return next()

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)

  next()
})


userSchema.methods.matchPassword = async function (password: string) : Promise<boolean>{
  return await bcrypt.compare(password, this.password)
}

// model:
// è una funzione costruttore creata da uno Schema che:
//  Rappresenta una collezione MongoDB
//  Fornisce un'interfaccia per interagire con il database (create, read, update, delete)
//  Istanzia oggetti documento basati sullo schema
//  Implementa la logica di business attraverso metodi statici e di istanza
const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema)

export default User

export type { IUser, IUserDocument, IUserModel }
