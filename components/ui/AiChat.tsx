'use client'

import { FormEvent, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toOpenAiSafeGameState } from '@/lib/ai/openaiOpponent'
import { useGameStore } from '@/lib/store/gameStore'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

export default function AiChat() {
  const { round, playerTeam, enemyTeam, lastResult } = useGameStore()
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Көксерек тыңдап тұр. Не айтасың?',
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const safeGameState = useMemo(() => {
    return toOpenAiSafeGameState({
      round,
      playerTeam,
      enemyTeam,
      lastResult,
      difficulty: 'normal',
    })
  }, [round, playerTeam, enemyTeam, lastResult])

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const message = input.trim()
    if (!message || isLoading) return

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: message }]
    setMessages(nextMessages)
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: messages,
          gameState: safeGameState,
        }),
      })
      const data: unknown = await response.json()
      const reply = data && typeof data === 'object' && 'reply' in data && typeof data.reply === 'string'
        ? data.reply
        : 'Көксерек жауап бере алмады.'

      setMessages([...nextMessages, { role: 'assistant', content: reply }])
    } catch (error) {
      console.warn('AI chat request failed', error)
      setMessages([...nextMessages, { role: 'assistant', content: 'Байланыс жоқ. Кейін қайта сөйлесеміз.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="absolute bottom-24 right-4 z-40 pointer-events-auto">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            className="mb-3 flex h-[360px] w-80 max-w-[calc(100vw-2rem)] flex-col rounded-lg border border-[var(--steppe-gold)]/45 bg-black/82 shadow-2xl backdrop-blur"
          >
            <div className="border-b border-[var(--steppe-gold)]/25 px-4 py-3">
              <p className="font-title text-xs uppercase tracking-widest text-[var(--steppe-gold)]">AI Chat</p>
              <p className="font-body text-[11px] text-white/55">Көксерек қарсыласымен сөйлесу</p>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`rounded-md px-3 py-2 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'ml-8 bg-blue-500/20 text-blue-50'
                      : 'mr-8 bg-white/10 text-white/88'
                  }`}
                >
                  {message.content}
                </div>
              ))}
              {isLoading && (
                <div className="mr-8 rounded-md bg-white/10 px-3 py-2 text-sm text-white/60">
                  AI жазып жатыр...
                </div>
              )}
            </div>

            <form onSubmit={sendMessage} className="flex gap-2 border-t border-[var(--steppe-gold)]/25 p-3">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                maxLength={500}
                placeholder="Жауап жаз..."
                className="min-w-0 flex-1 rounded border border-white/15 bg-white/10 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-[var(--steppe-gold)]/70"
              />
              <button
                type="submit"
                disabled={isLoading || input.trim().length === 0}
                className="rounded border border-[var(--steppe-gold)]/55 px-3 py-2 font-body text-xs text-[var(--steppe-gold)] transition-colors hover:bg-[var(--steppe-gold)]/10 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Жіберу
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="ml-auto block rounded-lg border border-[var(--steppe-gold)]/55 bg-black/70 px-4 py-2 font-title text-xs uppercase tracking-widest text-[var(--steppe-gold)] shadow-xl transition-colors hover:bg-black/85"
      >
        AI Chat
      </button>
    </div>
  )
}
