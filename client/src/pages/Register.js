import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email || !password) {
      setError('Please fill all fields!')
      return
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    if (!passwordRegex.test(password)) {
      setError('Password must contain uppercase, lowercase, number & special character!')
      return
    }
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const data = await response.json()
      if (data.message === 'User registered succesfully') {
        setError('success')
        setTimeout(() => navigate('/'), 1500)
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError('Could not connect to server. Please try again!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-950 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">🎯 AI Interviewer</h1>
          <p className="text-gray-400 mt-2">Practice makes perfect</p>
        </div>

        <h2 className="text-xl font-semibold text-white mb-6">Create Account</h2>

        {error && (
          <div className={`p-3 rounded-xl mb-4 text-sm border ${
            error === 'success'
              ? 'bg-green-500/20 text-green-300 border-green-500/30'
              : 'bg-red-500/20 text-red-300 border-red-500/30'
          }`}>
            {error === 'success' ? '🎉 Registered successfully! Redirecting...' : '❌ ' + error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 font-medium">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 font-medium">Email</label>
            <input
              type="email"
              autoComplete="off"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 font-medium">Password</label>
            <input
              type="password"
              autoComplete="off"
              placeholder="Min 6 chars, uppercase, number & special char"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-500 transition duration-200">
            Register
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/')}
            className="text-indigo-400 font-medium cursor-pointer hover:underline">
            Login
          </span>
        </p>
      </div>
    </div>
  )
}

export default Register