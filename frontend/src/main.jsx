import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './App.css'
import App from './App.jsx'

const redirect = new URLSearchParams(window.location.search).get('redirect')
if (redirect?.startsWith('/') && !redirect.startsWith('//')) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  window.history.replaceState(null, '', `${base}${redirect}`)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
