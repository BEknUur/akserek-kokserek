'use client'

import { useEffect, useRef } from 'react'
import { Howl } from 'howler'
import { generateSpeech } from '@/lib/ai/elevenlabs'
import { useGameStore } from '@/lib/store/gameStore'

function shouldSpeak(text: string): boolean {
  const normalized = text.trim()
  return normalized.length > 0 && normalized.length <= 900
}

export default function VoiceNarrator() {
  const {
    phase,
    lastResult,
    commentaryText,
    aiCommentary,
    enemyTeam,
    isVoiceEnabled,
    volume,
    setSpeaking,
  } = useGameStore()
  const lastSpokenRef = useRef('')
  const activeSoundRef = useRef<Howl | null>(null)

  useEffect(() => {
    activeSoundRef.current?.volume(volume)
  }, [volume])

  useEffect(() => {
    if (!isVoiceEnabled) {
      activeSoundRef.current?.stop()
      setSpeaking(false)
    }
  }, [isVoiceEnabled, setSpeaking])

  useEffect(() => {
    let cancelled = false
    const text = commentaryText || aiCommentary

    async function speak() {
      if (!isVoiceEnabled || !shouldSpeak(text) || lastSpokenRef.current === text) return

      lastSpokenRef.current = text

      try {
        const audioUrl = await generateSpeech(text)
        if (cancelled || !isVoiceEnabled) return

        activeSoundRef.current?.stop()
        const sound = new Howl({
          src: [audioUrl],
          html5: true,
          volume,
          onplay: () => setSpeaking(true),
          onend: () => setSpeaking(false),
          onstop: () => setSpeaking(false),
          onloaderror: () => setSpeaking(false),
          onplayerror: () => setSpeaking(false),
        })

        activeSoundRef.current = sound
        sound.play()
      } catch (error) {
        console.warn('Voice narration failed; continuing with text only', error)
        setSpeaking(false)
      }
    }

    speak()

    return () => {
      cancelled = true
    }
  }, [commentaryText, aiCommentary, isVoiceEnabled, volume, setSpeaking])

  useEffect(() => {
    let cancelled = false
    let text = ''

    if (phase === 'RESULT' && lastResult) {
      text = `${lastResult.message} ${lastResult.subMessage}`
    }

    if (phase === 'GAME_OVER') {
      text = enemyTeam.players.length <= 1
        ? 'Жеңіс! Ақсерек бүгін дала төсінде мерейін асырды!'
        : 'Жеңіліс. Бірақ шеп қайта құрылады, рух сынбайды.'
    }

    async function speakResult() {
      if (!isVoiceEnabled || !shouldSpeak(text) || lastSpokenRef.current === text) return

      lastSpokenRef.current = text

      try {
        const audioUrl = await generateSpeech(text)
        if (cancelled || !isVoiceEnabled) return

        activeSoundRef.current?.stop()
        const sound = new Howl({
          src: [audioUrl],
          html5: true,
          volume,
          onplay: () => setSpeaking(true),
          onend: () => setSpeaking(false),
          onstop: () => setSpeaking(false),
          onloaderror: () => setSpeaking(false),
          onplayerror: () => setSpeaking(false),
        })

        activeSoundRef.current = sound
        sound.play()
      } catch (error) {
        console.warn('Voice result narration failed; continuing with text only', error)
        setSpeaking(false)
      }
    }

    speakResult()

    return () => {
      cancelled = true
    }
  }, [phase, lastResult, enemyTeam.players.length, isVoiceEnabled, volume, setSpeaking])

  return null
}
