import React from 'react'
import ReactDOM from 'react-dom/client'
import ImageMailMerge from './ImageMailMerge'
import Header from './header'
import './style.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden
      font-sans antialiased
      [&_canvas]:[image-rendering:crisp-edges]
      [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-gray-400"
    >
      <Header />
      <div className="flex-1 min-h-0">
        <ImageMailMerge />
      </div>
    </div>
  </React.StrictMode>,
) 