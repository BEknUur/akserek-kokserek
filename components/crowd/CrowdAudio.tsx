'use client'

import { useEffect, useRef } from 'react'
import { useGameStore } from '@/lib/store/gameStore'

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext
  }
}

function playCrowdBurst(type: 'cheer' | 'disappointed' | 'hype', volume: number) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  if (!AudioContextClass) return

  const ctx = new AudioContextClass()
  const duration = type === 'hype' ? 1.2 : 0.65
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate)
  const data = buffer.getChannelData(0)

  for (let i = 0; i < data.length; i++) {
    const t = i / data.length
    const envelope = Math.sin(Math.PI * t)
    const noise = Math.random() * 2 - 1
    const tone = Math.sin(i * (type === 'disappointed' ? 0.018 : 0.035))
    data[i] = (noise * 0.45 + tone * 0.12) * envelope
  }

  const source = ctx.createBufferSource()
  const gain = ctx.createGain()
  gain.gain.value = volume * (type === 'disappointed' ? 0.12 : 0.18)
  source.buffer = buffer
  source.connect(gain)
  gain.connect(ctx.destination)
  source.start()
  source.onended = () => ctx.close()
}

export default function CrowdAudio() {
  const { phase, lastResult, difficulty, volume, isVoiceEnabled } = useGameStore()
  const lastKeyRef = useRef('')

  useEffect(() => {
    if (!isVoiceEnabled) return

    const key = `${phase}-${lastResult?.message ?? ''}-${lastResult?.success ?? ''}`
    if (key === lastKeyRef.current) return
    lastKeyRef.current = key

    if (phase === 'RESULT' && lastResult?.success) playCrowdBurst('cheer', volume)
    if (phase === 'RESULT' && lastResult && !lastResult.success) playCrowdBurst('disappointed', volume)
    if (phase === 'GAME_OVER') playCrowdBurst('hype', volume)
    if (difficulty === 'impossible' && (phase === 'PLAYER_RUNS' || phase === 'ENEMY_RUNS')) {
      playCrowdBurst('hype', volume * 0.45)
    }
  }, [phase, lastResult, difficulty, volume, isVoiceEnabled])

  return null
}
