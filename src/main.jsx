import React from 'react'
import { createRoot } from 'react-dom/client'
import AppShell from './Shell/AppShell.jsx'
import './site-theme.css'

createRoot(document.getElementById('react-root')).render(<AppShell />)
