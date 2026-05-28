import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()
      if (data.token) {
        localStorage.setItem('token', data.token)
        navigate('/interview')
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

        <h2 className="text-xl font-semibold text-white mb-6">Welcome Back</h2>

        {error && (
          <div className="bg-red-500/20 text-red-300 border border-red-500/30 p-3 rounded-xl mb-4 text-sm">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 font-medium">Email</label>
            <input
              type="email"
              autoComplete="new-password"
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
              autoComplete="new-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-500 transition duration-200">
            Login
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/register')}
            className="text-indigo-400 font-medium cursor-pointer hover:underline">
            Register
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login