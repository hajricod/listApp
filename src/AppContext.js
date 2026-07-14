import { createContext, useContext } from 'react'
import { t } from './translations.js'

export const AppContext = createContext(null)

export function useApp() {
  return useContext(AppContext)
}

/** Returns a t() function bound to the current language from context */
export function useT() {
  const { state } = useApp()
  return (key, vars = {}) => t(key, state.language, vars)
}
