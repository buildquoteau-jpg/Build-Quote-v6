'use client'
import { useState, useRef } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { LineItem } from '@/lib/types'

interface UploadScreenProps {
  onNext: (items: LineItem[]) => void
}

export default function UploadScreen({ onNext }: UploadScreenProps) {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const MAX_FILES = 5

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

  return (
    <div className="flex flex-col gap-4">
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

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {loading && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-white">Reading your file...</p>
          </div>
        </div>
      )}

      <Button onClick={handleParse} disabled={files.length === 0} className="w-full py-3">
        Continue →
      </Button>
    </div>
  )
}