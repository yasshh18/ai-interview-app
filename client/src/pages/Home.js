import React from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col">

      {/* Background Glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-cyan-500/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-[-120px] right-[-100px] w-[350px] h-[350px] bg-purple-600/20 blur-3xl rounded-full"></div>

      {/* Navbar */}
      <div className="relative z-10 px-8 py-5 flex justify-between items-center border-b border-white/10 backdrop-blur-md">
        <h1 className="text-2xl font-extrabold text-white tracking-wide">
          🎯 AI Interviewer
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2 text-sm text-gray-300 hover:text-cyan-400 transition duration-300">
            Sign In
          </button>

          <button
            onClick={() => navigate('/register')}
            className="px-5 py-2 text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:scale-105 transition duration-300 shadow-lg shadow-cyan-500/30">
            Sign Up
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-8">
        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-16">

          {/* Left Text */}
          <div className="flex-1 text-center md:text-left">

            <div className="inline-block px-4 py-2 mb-6 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm">
              🚀 AI Powered Mock Interviews
            </div>

            <h2 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              Crack Your Dream Job with{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Smart AI Interviews
              </span>
            </h2>

            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-xl">
              Practice real interview conversations with AI, improve communication,
              and get instant feedback to boost your confidence.
            </p>

            <div className="flex gap-5 justify-center md:justify-start flex-wrap">

              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-semibold hover:scale-105 transition duration-300 shadow-2xl shadow-cyan-500/30">
                🚀 Start Interview
              </button>

              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-white/5 backdrop-blur-md text-white rounded-2xl font-semibold hover:bg-white/10 transition duration-300 border border-white/10">
                🔐 Sign In
              </button>

            </div>
          </div>

          {/* Right Visual */}
          <div className="flex-1 flex justify-center">

            <div className="relative group">

              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition duration-500"></div>

              {/* Card */}
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl">

                <img
                  src="https://img.freepik.com/premium-photo/new-folderman-ai-robot-waiting-job-interview-ai-vs-human-competition_1072857-2398.jpg?semt=ais_hybrid&w=740&q=80"
                  alt="AI Interviewer"
                  className="w-[360px] rounded-2xl object-cover"
                />

              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-5 text-gray-500 text-sm border-t border-white/5">
        © 2026 AI Interviewer • Built with MERN + Groq AI
      </div>

    </div>
  )
}

export default Home