'use client'
import { useState, useRef, useEffect } from 'react'
import Button from '../ui/Button'
import { LineItem } from '@/lib/types'

interface UploadScreenProps {
  onNext: (items: LineItem[]) => void
  onSkip: () => void
}

const LOADING_MESSAGES = [
  'Reading your list...',
  'Identifying the items...',
  'Counting those 90x45s...',
  'Sorting timber from the plasterboard...',
  'Checking the LVLs...',
  'Nearly there...',
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
      setError('Something went wrong reading your file. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">

      {/* HEADING */}
      <div>
        <h2 className="text-white text-xl font-bold">Upload your materials list</h2>
        <p className="text-gray-400 text-sm mt-1 leading-relaxed">
          Drop your file below and BuildQuote will organise the items ready for a supplier quote request.
        </p>
      </div>

      {/* UPLOAD ZONE */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files) }}
        className="bg-gray-100 border-2 border-dashed border-gray-300 hover:border-orange-400 hover:bg-orange-50 transition-colors cursor-pointer rounded-2xl px-6 py-10 text-center"
      >
        <p className="text-gray-800 font-semibold text-base">Upload your list</p>
        <p className="text-gray-500 text-sm mt-1">or drag and drop your file here</p>
        <p className="text-gray-400 text-xs mt-3 tracking-wide">PDF · Excel · Word · CSV · Photo</p>
        <input ref={inputRef} type="file" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
      </div>

      {/* FILE LIST */}
      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
              <div>
                <p className="text-white text-sm font-medium">{f.name}</p>
                <p className="text-gray-500 text-xs">{(f.size / 1024).toFixed(1)} KB</p>
              </div>
              <button onClick={() => removeFile(i)} className="text-gray-500 hover:text-red-400 text-lg px-2">✕</button>
            </div>
          ))}
          <button
            onClick={() => inputRef.current?.click()}
            className="text-orange-500 text-sm underline text-left px-1"
          >
            + Add another file
          </button>
        </div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {/* EXAMPLES SECTION */}
      <div className="flex flex-col gap-4">

        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-300 text-xs font-bold uppercase tracking-widest mb-3">Examples of what you can upload</p>
          <ul className="flex flex-col gap-1.5">
            {[
              "A builder's materials list",
              "A Bunnings shopping list",
              "A spreadsheet of building items",
              "A photo of handwritten notes",
            ].map(item => (
              <li key={item} className="text-gray-400 text-sm flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">–</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-300 text-xs font-bold uppercase tracking-widest mb-3">Example list</p>
          <div className="bg-gray-900 rounded-lg px-4 py-3 font-mono text-xs text-gray-400 leading-relaxed mb-4">
            <p>3 LVL beams 200x45</p>
            <p>90x45 MGP10 framing timber – 24 lengths</p>
            <p>8 sheets fibre cement 2400x1200x6 JH Flexsheet</p>
            <p>2 boxes 14g x 100 GALV deck screws</p>
            <p className="text-gray-600">...</p>
          </div>

          <p className="text-gray-300 text-xs font-bold uppercase tracking-widest mb-3">Organised for quoting</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-orange-500 font-semibold pb-2 pr-3">Item</th>
                  <th className="text-orange-500 font-semibold pb-2 pr-3">Size / Spec</th>
                  <th className="text-orange-500 font-semibold pb-2 pr-3">Unit</th>
                  <th className="text-orange-500 font-semibold pb-2">Qty</th>
                </tr>
              </thead>
              <tbody className="text-gray-400">
                {[
                  ['LVL Beam', '200 x 45', 'length', '3'],
                  ['Framing Timber', '90 x 45 MGP10', 'length', '24'],
                  ['Fibre Cement Sheet', '2400 x 1200 x 6 JH Flexsheet', 'sheet', '8'],
                  ['Deck Screws', '14g x 100 GALV', 'box', '2'],
                  ['…', '', '', ''],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-800 last:border-0">
                    <td className="py-1.5 pr-3 text-gray-300">{row[0]}</td>
                    <td className="py-1.5 pr-3">{row[1]}</td>
                    <td className="py-1.5 pr-3">{row[2]}</td>
                    <td className="py-1.5">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* LOADING OVERLAY */}
      {loading && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-center px-8 max-w-xs">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-5"></div>
            <p className="text-white font-medium text-base leading-snug" key={msgIndex}>
              {LOADING_MESSAGES[msgIndex]}
            </p>
            <p className="text-gray-500 text-xs mt-3">This usually takes 15–30 seconds</p>
          </div>
        </div>
      )}

      {/* ACTIONS */}
      <Button onClick={handleParse} disabled={files.length === 0 || loading} className="w-full py-3">
        Continue
      </Button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-700" />
        <span className="text-gray-500 text-xs uppercase tracking-widest">or</span>
        <div className="flex-1 h-px bg-gray-700" />
      </div>

      <button
        onClick={onSkip}
        className="w-full py-3 rounded-xl border border-gray-700 text-gray-400 text-sm font-medium hover:border-gray-500 hover:text-gray-300 transition-colors"
      >
        I don&apos;t have a list yet — add items manually
      </button>

    </div>
  )
}
