const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')

router.post('/register',async(req, res) =>{
    try{
        const{name ,email, password} = req.body
    const existingUser = await User.findOne({email})
if (existingUser){
    return res.status(400).json({message: 'Email already exists'})
}

const hashedPassword = await bcrypt.hash(password, 10)
const user = new User({name, email, password: hashedPassword})
await user.save()

res.status(201).json({message:'User registered succesfully'})

    }catch(error){
        res.status(500).json({message:'Server error'})
    }
})
// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // User dhundho
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Email not found' })
    }

    // Password check karo
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong password' })
    }

    // JWT token banao
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ token, message: 'Login successful' })

  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})
const authMiddleware = require('../middleware/auth')

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password')
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})
module.exports = router