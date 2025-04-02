import express from 'express'

const router = express.Router()

router.post('/login', async (req, res) => {
  res.send('login')
})

router.post('/register', async (req, res) => {
  res.send('register')
})

export default router
