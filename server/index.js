require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const interviewRoutes = require('./routes/interview')

const app = express()

app.use(cors({
  origin: ['https://ai-interview-app-self.vercel.app', 'http://localhost:3000','https://ai-interview-app-3bi2.onrender.com'],
  credentials: true
}))
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.log('Error:', err))

app.get('/', (req, res) => {
  res.send('Server chal raha hai!')
})

app.use('/api/auth', authRoutes)
app.use('/api/interview', interviewRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`)
})
