import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './routes/App.jsx'
import './client/styles.css'

// The build prerenders every page (prerender: true in basicben.config.js), so
// in production #root already holds this page's markup: hydrate it rather
// than draw it again. The dev server's shell is empty.
const root = document.getElementById('root')
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

if (root.hasChildNodes()) ReactDOM.hydrateRoot(root, app)
else ReactDOM.createRoot(root).render(app)
