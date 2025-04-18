import express from "express"
import "dotenv/config"
import authRoutes from "./routes/authRoutes.js"
import bookRoutes from "./routes/bookRoutes.js"
import { connectDb } from "./lib/db.js"
const app = express()
const PORT = process.env.PORT || 3000
import cors from 'cors'

// Connessione al database prima di avviare il server
connectDb()

// Permette il parsing di JSON data (come nella rotta register)
app.use(express.json())

// cors per le richieste da frontend
app.use(cors())

// Rotte
app.use("/api/auth", authRoutes)
app.use("/api/books", bookRoutes)

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 👽!!!`)
})
