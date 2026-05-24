'use client'

import { useEffect, useState } from 'react'

type Orientation = 'portrait' | 'landscape'

type ViewportState = {
  width: number
  height: number
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  orientation: Orientation
}

const initialState: ViewportState = {
  width: 0,
  height: 0,
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  orientation: 'landscape',
}

function getViewportState(): ViewportState {
  if (typeof window === 'undefined') return initialState

  const width = window.innerWidth
  const height = window.innerHeight

  return {
    width,
    height,
    isMobile: width <= 768,
    isTablet: width > 768 && width <= 1024,
    isDesktop: width > 1024,
    orientation: height >= width ? 'portrait' : 'landscape',
  }
}

export function useIsMobile() {
  const [state, setState] = useState<ViewportState>(initialState)

  useEffect(() => {
    const update = () => setState(getViewportState())
    update()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  return state
}
