import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import 'dotenv/config'
import { Request, Response, NextFunction } from 'express'

interface DecodedToken {
  userId: string
}

// get token from headers, extract user from jwt token, and pass to request
const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
  console.log('verify auth token')
  try {
    // get token from headers
    // const token = req.headers('Authorization'.replace('Bearer ', ''))
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      res.status(401).json({ message: 'No token provided access denied' })
      return
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken


    // find user by id extracted from token and select all User object without password fiedl
    const user = await User.findById(decoded.userId!).select('-password')


    if (!user) {
      res.status(404).json({ message: 'Token is invalid' })
      return
    }

    // add user to request and procede
    req.user = user


    next()
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export default protectRoute
