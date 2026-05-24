export type WeatherType = 'random' | 'sunny' | 'rain' | 'fog' | 'night' | 'storm'
export type ActiveWeatherType = Exclude<WeatherType, 'random'>

export const WEATHER_CONFIG: Record<ActiveWeatherType, {
  label: string
  timingSpeedModifier: number
  greenZoneModifier: number
  instability: number
  darkness: number
}> = {
  sunny: {
    label: 'Sunny',
    timingSpeedModifier: 1,
    greenZoneModifier: 1,
    instability: 0,
    darkness: 0,
  },
  rain: {
    label: 'Rain',
    timingSpeedModifier: 1.08,
    greenZoneModifier: 0.95,
    instability: 0.1,
    darkness: 0.08,
  },
  fog: {
    label: 'Fog',
    timingSpeedModifier: 1.02,
    greenZoneModifier: 0.92,
    instability: 0.04,
    darkness: 0.18,
  },
  night: {
    label: 'Night',
    timingSpeedModifier: 1.12,
    greenZoneModifier: 0.9,
    instability: 0.05,
    darkness: 0.36,
  },
  storm: {
    label: 'Storm',
    timingSpeedModifier: 1.22,
    greenZoneModifier: 0.84,
    instability: 0.22,
    darkness: 0.24,
  },
}

export function resolveWeather(weather: WeatherType): ActiveWeatherType {
  if (weather !== 'random') return weather
  const values: ActiveWeatherType[] = ['sunny', 'rain', 'fog', 'night', 'storm']
  return values[Math.floor(Math.random() * values.length)]
}
