import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import '../style.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('[TaskSphere] SW registered:', reg.scope))
      .catch(err => console.warn('[TaskSphere] SW failed:', err))
  })
}

/* ── PWA Install Prompt ── */
let deferredPrompt = null

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing
  e.preventDefault()
  // Store the event for later use
  deferredPrompt = e
  console.log('[TaskSphere] Install prompt available')
  
  // Optionally show a custom install button
  const installButton = document.getElementById('install-button')
  if (installButton) {
    installButton.style.display = 'block'
    installButton.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        console.log(`[TaskSphere] User response to install prompt: ${outcome}`)
        deferredPrompt = null
        installButton.style.display = 'none'
      }
    })
  }
})

window.addEventListener('appinstalled', () => {
  console.log('[TaskSphere] PWA installed successfully')
  deferredPrompt = null
})
