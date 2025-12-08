'use client'

import { useState } from 'react'

export default function LanguageSwitcher() {
  const [language, setLanguage] = useState<'en' | 'ur'>('en')

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLanguage('en')}
        className={`px-4 py-2 rounded-lg font-semibold transition ${
          language === 'en'
            ? 'bg-quantum-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('ur')}
        className={`px-4 py-2 rounded-lg font-semibold transition ${
          language === 'ur'
            ? 'bg-quantum-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        اردو
      </button>
    </div>
  )
}
