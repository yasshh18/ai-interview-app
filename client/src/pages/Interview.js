import React, { useState, useRef } from 'react'

function Interview() {
  const [role, setRole] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [started, setStarted] = useState(false)
  const [language, setLanguage] = useState('English')
  const recognitionRef = useRef(null)

  const speakText = (audioBase64) => {
    if (!audioBase64) return
    setIsSpeaking(true)
    const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`)
    audio.onended = () => setIsSpeaking(false)
    audio.play()
  }

  const sendMessage = async (userText) => {
    const userMessage = { role: 'user', content: userText }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('https://ai-interview-app-3bi2.onrender.com/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ role, language, messages: newMessages })
      })
      const data = await response.json()
      const aiMessage = { role: 'assistant', content: data.reply }
      setMessages(prev => [...prev, aiMessage])
      setLoading(false)
      speakText(data.audio)
    } catch (error) {
      alert('Could not connect to server. Please try again!')
      setLoading(false)
    }
  }

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.lang = language === 'Hindi' ? 'hi-IN' : 'en-US'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      sendMessage(transcript)
    }
    recognition.start()
  }

  const startInterview = async () => {
    if (!role) return
    setStarted(true)
    setLoading(true)
    setMessages([])
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('https://ai-interview-app-3bi2.onrender.com/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ role, language, messages: [{ role: 'user', content: 'Start the interview' }] })
      })
      const data = await response.json()
      const aiMessage = { role: 'assistant', content: data.reply }
      setMessages([aiMessage])
      setLoading(false)
      speakText(data.audio)
    } catch (error) {
      alert('Could not connect to server. Please try again!')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-950 flex flex-col">

      {/* Navbar */}
      <div className="px-6 py-4 flex justify-between items-center border-b border-white/10">
        <h1 className="text-xl font-bold text-white">🎯 AI Interviewer</h1>
        <button
          onClick={() => { localStorage.removeItem('token'); window.location.href = '/' }}
          className="text-sm text-gray-400 hover:text-red-400 transition">
          Logout
        </button>
      </div>

      {!started ? (
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-8 w-full max-w-md border border-white/20">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white">Select Your Role</h2>
              <p className="text-gray-400 mt-2">Choose position & language</p>
            </div>

            <label className="text-sm font-semibold text-gray-300 mb-2 block">Role</label>
            <div className="space-y-3 mb-5">
              {['SWE', 'DevOps Engineer', 'Cloud Engineer'].map((r) => (
                <button key={r} onClick={() => setRole(r)}
                  className={`w-full py-4 rounded-xl font-medium transition text-left px-5 ${
                    role === r ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/10 text-gray-200 hover:bg-white/20 border border-white/10'
                  }`}>
                  {r === 'SWE' && '💻 Software Engineer'}
                  {r === 'DevOps Engineer' && '⚙️ DevOps Engineer'}
                  {r === 'Cloud Engineer' && '☁️ Cloud Engineer'}
                </button>
              ))}
            </div>

            <label className="text-sm font-semibold text-gray-300 mb-2 block">Language</label>
            <div className="flex gap-2 mb-6">
              {['English', 'Hindi'].map((l) => (
                <button key={l} onClick={() => setLanguage(l)}
                  className={`flex-1 py-3 rounded-xl font-medium transition ${
                    language === l ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}>
                  {l === 'English' ? '🇬🇧 English' : '🇮🇳 Hindi'}
                </button>
              ))}
            </div>

            <button onClick={startInterview} disabled={!role || loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-500 transition disabled:opacity-50">
              {loading ? '⏳ Starting...' : '🚀 Start Interview'}
            </button>
          </div>
        </div>

      ) : (
        <div className="flex-1 flex flex-col">

          <div className="flex-1 flex items-center justify-between px-16 py-8">

            {/* AI Interviewer - Left */}
            <div className="flex flex-col items-center">
              <div className={`w-48 h-48 rounded-full flex items-center justify-center text-8xl transition-all duration-500 ${
                isSpeaking
                  ? 'bg-gradient-to-br from-indigo-400 to-purple-600 shadow-2xl shadow-indigo-500/70 scale-110'
                  : 'bg-gradient-to-br from-indigo-900 to-purple-900 border-4 border-indigo-500/50'
              }`}>
                🧑‍💼
              </div>

              {isSpeaking && (
                <div className="flex gap-1.5 mt-5">
                  {[...Array(6)].map((_, i) => (
                    <span key={i}
                      className="w-2 bg-indigo-400 rounded-full animate-bounce"
                      style={{ height: `${(i % 3 + 1) * 10}px`, animationDelay: `${i * 80}ms` }}>
                    </span>
                  ))}
                </div>
              )}

              <p className="text-white font-bold text-lg mt-4">AI Interviewer</p>
              <p className="text-indigo-300 text-sm mt-1">{role}</p>
              {isSpeaking && (
                <span className="mt-3 text-xs bg-indigo-600 text-white px-4 py-1.5 rounded-full animate-pulse font-medium">
                  🔊 Speaking...
                </span>
              )}
            </div>

            {/* Center */}
            <div className="flex flex-col items-center gap-4">
              {loading && (
                <div className="bg-white/10 rounded-2xl px-6 py-3 border border-white/20">
                  <p className="text-gray-300 text-sm animate-pulse">⏳ Thinking...</p>
                </div>
              )}
              {!loading && !isSpeaking && !isListening && messages.length > 0 && (
                <button
                  onClick={startListening}
                  className="bg-green-500 text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-green-400 transition shadow-lg shadow-green-500/30">
                  🎤 Tap to Speak
                </button>
              )}
              {isListening && (
                <div className="bg-white/10 rounded-2xl px-6 py-3 border border-white/20">
                  <p className="text-green-300 text-sm animate-pulse">🎙️ Listening...</p>
                </div>
              )}
            </div>

            {/* User - Right */}
            <div className="flex flex-col items-center">
              <div className={`w-48 h-48 rounded-full flex items-center justify-center text-8xl transition-all duration-500 ${
                isListening
                  ? 'bg-gradient-to-br from-green-400 to-emerald-600 shadow-2xl shadow-green-500/70 scale-110'
                  : 'bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-gray-600/50'
              }`}>
                🧑‍💻
              </div>

              {isListening && (
                <div className="flex gap-1.5 mt-5">
                  {[...Array(6)].map((_, i) => (
                    <span key={i}
                      className="w-2 bg-green-400 rounded-full animate-bounce"
                      style={{ height: `${(i % 3 + 1) * 10}px`, animationDelay: `${i * 80}ms` }}>
                    </span>
                  ))}
                </div>
              )}

              <p className="text-white font-bold text-lg mt-4">You</p>
              <p className="text-green-300 text-sm mt-1">{language}</p>
              {isListening && (
                <span className="mt-3 text-xs bg-green-600 text-white px-4 py-1.5 rounded-full animate-pulse font-medium">
                  🎙️ Listening...
                </span>
              )}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex justify-center pb-8">
            <button
              onClick={() => { setStarted(false); setMessages([]); setRole(''); window.speechSynthesis.cancel() }}
              className="bg-red-500/20 text-red-400 border border-red-500/30 px-8 py-3 rounded-full text-sm font-medium hover:bg-red-500/40 transition">
              🔴 End Interview
            </button>
          </div>

        </div>
      )}
    </div>
  )
}

export default Interview