import { useEffect } from 'react'

export default function Toast({ message, onDone }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onDone, 2500)
    return () => clearTimeout(t)
  }, [message, onDone])

  if (!message) return null
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-[#111] dark:bg-[#F0EDE8] text-white dark:text-[#111] text-xs font-sans font-medium tracking-wide px-4 py-2 rounded-full shadow-lg whitespace-nowrap"
      style={{ maxWidth: 320 }}>
      {message}
    </div>
  )
}
