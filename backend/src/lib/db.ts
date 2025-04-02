import mongoose from "mongoose"

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!)
    console.log(`MongoDB connect to DB: ${conn.connection.host}`)
  } catch (error) {
    console.log('error connecting db', error)
    process.exit(1)
  }
}
