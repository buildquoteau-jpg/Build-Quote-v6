'use client'
import { useState, useRef, useEffect } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { LineItem } from '@/lib/types'

interface UploadScreenProps {
  onNext: (items: LineItem[]) => void
  onSkip: () => void
}

const LOADING_MESSAGES = [
  { emoji: '🔍', text: 'Squinting at your handwriting...' },
  { emoji: '🧠', text: 'Teaching AI what a stud wall is...' },
  { emoji: '📐', text: 'Counting those 90x45s...' },
  { emoji: '☕', text: 'Making a quick cuppa while we read this...' },
  { emoji: '🏗️', text: 'Deciphering builder shorthand...' },
  { emoji: '🤔', text: 'Is that a 6 or a 0? Going with 6...' },
  { emoji: '📦', text: 'Sorting timber from the plasterboard...' },
  { emoji: '🦺', text: 'Putting on the high-vis before we start...' },
  { emoji: '📋', text: 'Cross-referencing with the spec sheet...' },
  { emoji: '⚡', text: 'Nearly there — just double-checking the LVLs...' },
]

export default function UploadScreen({ onNext, onSkip }: UploadScreenProps) {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [msgIndex, setMsgIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const MAX_FILES = 5

  useEffect(() => {
    if (loading) {
      setMsgIndex(0)
      intervalRef.current = setInterval(() => {
        setMsgIndex(i => (i + 1) % LOADING_MESSAGES.length)
      }, 2800)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [loading])

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return
    const newFiles = Array.from(incoming)
    setFiles(prev => {
      const combined = [...prev, ...newFiles]
      if (combined.length > MAX_FILES) {
        setError(`Maximum ${MAX_FILES} files at once.`)
        return prev
      }
      return combined
    })
  }

  const removeFile = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i))

  const handleParse = async () => {
    setLoading(true)
    setError('')
    try {
      const allItems: LineItem[] = []
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/parse', { method: 'POST', body: formData })
        const data = await res.json()
        if (data.items) allItems.push(...data.items)
      }
      onNext(allItems)
    } catch {
      setError('Something went wrong parsing your file. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const currentMsg = LOADING_MESSAGES[msgIndex]

  return (
    <div className="flex flex-col gap-4">

      {/* UPLOAD ZONE */}
      <Card
        className="border-2 border-dashed border-gray-600 hover:border-orange-500 transition-colors cursor-pointer text-center"
        // @ts-ignore
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files) }}
      >
        <div className="py-8">
          <p className="text-4xl mb-2">📄</p>
          <p className="text-gray-300 font-medium">Drop your BOM or materials list here</p>
          <p className="text-gray-500 text-sm mt-1">PDF, image, CSV, Excel, Word — anything works</p>
        </div>
        <input ref={inputRef} type="file" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
      </Card>

      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          {files.map((f, i) => (
            <Card key={i} className="flex items-center justify-between py-2">
              <div>
                <p className="text-white text-sm font-medium">{f.name}</p>
                <p className="text-gray-500 text-xs">{(f.size / 1024).toFixed(1)} KB</p>
              </div>
              <button onClick={() => removeFile(i)} className="text-gray-500 hover:text-red-400 text-lg px-2">✕</button>
            </Card>
          ))}
          <button onClick={() => inputRef.current?.click()} className="text-orange-500 text-sm underline text-left">+ Add another file</button>
        </div>
      )}

      {/* TIP */}
      <div className="flex gap-3 bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-3">
        <span className="text-xl flex-shrink-0">💡</span>
        <p className="text-gray-400 text-sm leading-relaxed">
          <span className="text-gray-200 font-medium">No fancy format needed.</span> We accept PDF, Excel, Word, CSV — or even a photo of a handwritten note. Just lay your list on a flat surface, snap a photo, and upload it. We'll read it and sort everything out for you.
        </p>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {loading && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-center px-8 max-w-xs">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-5"></div>
            <p className="text-4xl mb-3" key={msgIndex}>{currentMsg.emoji}</p>
            <p className="text-white font-medium text-base leading-snug" key={'txt-' + msgIndex}>
              {currentMsg.text}
            </p>
            <p className="text-gray-500 text-xs mt-3">This usually takes 15–30 seconds</p>
          </div>
        </div>
      )}

      <Button onClick={handleParse} disabled={files.length === 0 || loading} className="w-full py-3">
        Continue →
      </Button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-700" />
        <span className="text-gray-500 text-xs uppercase tracking-widest font-mono">or</span>
        <div className="flex-1 h-px bg-gray-700" />
      </div>

      <button
        onClick={onSkip}
        className="w-full py-3 rounded-lg border border-gray-700 text-gray-400 text-sm font-semibold hover:border-gray-500 hover:text-gray-300 transition-colors"
      >
        ✏️ I don&apos;t have a list yet — add items manually
      </button>
    </div>
  )
}
