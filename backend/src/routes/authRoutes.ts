import express from 'express'
import User, { IUser, IUserDocument, IUserModel } from '../models/User.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: '15d'
  })
}

router.post('/register', async (req, res) => {
  try {
    const { username, email, password }: { username: string, email: string, password: string } = req.body

    if (!username || !email || !password) {
      res.status(400).json({ message: 'Please fill all fields' })
      return
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters' })
      return
    }

    if (username.length < 3) {
      res.status(400).json({ message: 'Username must be at least 3 characters' })
      return
    }

    //check if user exists
    const existEmail = await User.findOne({ email })
    if (existEmail) {
      res.status(400).json({ message: 'Email already exists' })
      return
    }

    const existUsername = await User.findOne({ username })
    if (existUsername) {
      res.status(400).json({ message: 'Username already exists' })
      return
    }

    // get random avatar
    const profileImage = `https://api.dicebear.com/9.x/bottts/svg?seed=${username}`

    // create user instance
    const user: IUserDocument = new User({ username, email, password, profileImage })
    console.log('create user', user)

    // save user instance
    await user.save()

    // create jwt
    const token = generateToken(user._id as string)

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id as string,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage
      }
    })


  } catch (error) {
    console.error("Errore durante la registrazione:", error)
    res.status(500).json({ message: 'Errore durante la creazione dell utente' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password }: { email: string, password: string } = req.body

    if (!email || !password) {
      res.status(400).json({ message: 'Please fill all fields' })
      return
    }

    const user = await User.findOne({ email })

    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' })
      return
    }

    const isPasswordMatch = await user.matchPassword(password)
    if (!isPasswordMatch) {
      res.status(400).json({ message: 'Invalid credentials' })
      return
    }

    res.status(200).json({
      message: 'User logged in successfully',
      token: generateToken(user._id as string),
      user: {
        id: user._id as string,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage
      }
    })

  } catch (error) {

  }
})


export default router
