'use client'

import { dictionary } from './dictionary'
import { Locale } from './types'
import { useGameStore } from '@/lib/store/gameStore'

type Dictionary = typeof dictionary

function resolvePath(locale: Locale, key: string): string | undefined {
  const parts = key.split('.')
  let value: unknown = dictionary[locale]

  for (const part of parts) {
    if (!value || typeof value !== 'object' || !(part in value)) return undefined
    value = (value as Record<string, unknown>)[part]
  }

  return typeof value === 'string' ? value : undefined
}

export function useTranslation() {
  const locale = useGameStore((state) => state.locale)
  const setLocale = useGameStore((state) => state.setLocale)

  const t = (key: string): string => {
    const value = resolvePath(locale, key)
    if (value) return value

    console.warn(`Missing translation: ${key}`)
    return key
  }

  return { t, locale, setLocale, dictionary: dictionary as Dictionary }
}
