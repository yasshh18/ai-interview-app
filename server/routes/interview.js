require('dotenv').config()
const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const { Groq } = require('groq-sdk')
const { ElevenLabsClient } = require('elevenlabs')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const elevenlabs = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY })

router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { role, messages, language } = req.body

    const systemPrompt = `You are a friendly but professional ${role} interviewer at a top tech company.

${language === 'Hindi' ? 'IMPORTANT: Conduct the ENTIRE interview in Hindi language only.' : 'Conduct the interview in English.'}

Your interview style:
- Start with warm greeting and small talk (ask about their day, how they are feeling)
- After 1-2 small talk exchanges, naturally transition to the interview
- Ask role-specific technical questions one at a time
- After each answer, ask a follow-up or cross question
- Be conversational, not robotic
- Give encouraging short responses like "Interesting!", "Good point!", "Let me dig deeper..."
- After 4-5 technical questions, wrap up naturally and give overall feedback

For ${role} role, focus on:
${role === 'SWE' ? '- Data structures, algorithms, system design, coding concepts, OOP' : ''}
${role === 'DevOps Engineer' ? '- CI/CD, Docker, Kubernetes, Linux, monitoring, infrastructure as code' : ''}
${role === 'Cloud Engineer' ? '- AWS/GCP/Azure services, cloud architecture, security, scalability' : ''}

Keep responses SHORT and conversational. Max 2-3 sentences per response.`

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      model: 'llama-3.3-70b-versatile'
    })

    const reply = completion.choices[0].message.content

    const audioStream = await elevenlabs.textToSpeech.convert('JBFqnCBsd6RMkjVDRZzb', {
      text: reply,
      model_id: 'eleven_multilingual_v2',
      output_format: 'mp3_44100_128'
    })

    const chunks = []
    for await (const chunk of audioStream) {
      chunks.push(chunk)
    }
    const audioBuffer = Buffer.concat(chunks)
    const audioBase64 = audioBuffer.toString('base64')

    res.json({ reply, audio: audioBase64 })

  } catch (error) {
    console.log('ERROR:', error.message)
    res.status(500).json({ message: 'Error', error: error.message })
  }
})

module.exports = router