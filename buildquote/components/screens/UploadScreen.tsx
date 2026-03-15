'use client'
import { useState, useRef, useEffect } from 'react'
import { getOrCreateDraft } from '@/lib/rfqDraft'
import Button from '../ui/Button'
import { LineItem } from '@/lib/types'

interface UploadScreenProps {
  onNext: (items: LineItem[]) => void
  onSkip: () => void
}

const LOADING_MESSAGES = [
  'Reading your list...',
  'Identifying the items...',
  'Organising your lines...',
  'Checking quantities...',
  'Almost done...',
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
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
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
      setError('')
      return combined
    })
  }

  const removeFile = (i: number) => {
    setFiles(prev => prev.filter((_, idx) => idx !== i))
    setError('')
  }

  const handleParse = async () => {
    if (files.length === 0) return

    setLoading(true)
    setError('')

    try {
      const draftId = await getOrCreateDraft()
      const allItems: LineItem[] = []

      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/parse', { method: 'POST', body: formData })
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data?.error || 'Parse failed')
        }

        if (data.items) allItems.push(...data.items)
      }

      if (allItems.length > 0) {
        const saveRes = await fetch('/api/save-draft-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ draftId, items: allItems }),
        })

        const saveData = await saveRes.json().catch(() => ({}))

        if (!saveRes.ok) {
          throw new Error(saveData?.error || 'Failed to save draft items')
        }
      }

      onNext(allItems)
    } catch (err: any) {
      setError(err?.message || 'Something went wrong reading your file. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleBrowseManufacturerComponents = async () => {
    try {
      setError('')
      const draft = await getOrCreateDraft()
      const url = 'https://mfp.buildquote.com.au/?draft=' + draft
      window.open(url, '_blank')
    } catch (err: any) {
      setError(err?.message || 'Could not open Manufacturer Components.')
    }
  }

  const hasFiles = files.length > 0

  const baseCardClass =
    'group rounded-2xl border-2 bg-white p-5 sm:p-5 text-left transition-all duration-200 shadow-[0_8px_20px_rgba(24,93,122,0.06)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(24,93,122,0.10)] focus:outline-none focus:ring-2 focus:ring-[rgba(24,93,122,0.18)]'

  const iconClass =
    'mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[rgba(24,93,122,0.16)] bg-[rgba(24,93,122,0.03)] text-heading text-xl font-bold shadow-[0_6px_14px_rgba(24,93,122,0.06)]'

  return (
    <div className="flex flex-col gap-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-heading text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
          Create your RFQ
        </h2>
        <p className="text-text-secondary text-base sm:text-lg mt-3 font-semibold leading-relaxed">
          Choose how you want to start
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border-2 border-error-border bg-error-bg px-4 py-3">
          <p className="text-error text-sm font-semibold">{error}</p>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className={`${baseCardClass} border-border shadow-[0_10px_24px_rgba(24,93,122,0.10)] hover:border-heading`}>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault()
              addFiles(e.dataTransfer.files)
            }}
            className="block w-full text-left"
          >
            <div className="text-[10px] tracking-[0.2em] font-semibold text-[var(--color-accent)] mb-1.5">
              OPTION 1
            </div>

            <h3 className="text-heading text-xl font-extrabold tracking-tight leading-tight">
              Upload a materials list
            </h3>

            
<img src="/rfq/handwritten-roof-note.jpeg" alt="Example handwritten materials list" className="mt-6 mb-6 block w-full h-52 sm:h-48 object-contain rounded-lg shadow-[0_10px_18px_rgba(0,0,0,0.08)]" />

            <p className="text-text-secondary text-sm mt-3 font-semibold leading-relaxed">
              A photo of your handwritten list · A PDF of your BOM · A takeoff CSV
            </p>

            <p className="text-text-muted text-sm mt-2 font-medium leading-relaxed">
              BuildQuote can read and organise any format.
            </p>
          </button>

          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={e => addFiles(e.target.files)}
          />

          {hasFiles && (
            <div className="mt-4 flex flex-col gap-2">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border-2 border-border bg-surface-subtle px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="text-text-primary text-sm font-semibold truncate">{f.name}</p>
                    <p className="text-text-muted text-xs mt-0.5 font-medium">
                      {(f.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="ml-3 shrink-0 rounded-lg px-2 py-1 text-text-muted hover:text-error text-lg leading-none"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <Button onClick={handleParse} disabled={loading} className="w-full py-3 text-sm mt-1">
                {loading ? 'Reading your list...' : 'Continue with upload →'}
              </Button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleBrowseManufacturerComponents}
          className={`${baseCardClass} border-border hover:border-heading`}
        >

          <div className="text-[10px] tracking-[0.2em] font-semibold text-[var(--color-accent)] mb-1.5">OPTION 2</div>
<h3 className="text-heading text-xl font-extrabold tracking-tight leading-tight ">
            Browse manufacturer systems
          </h3>

          <img src="/rfq/system_components.jpeg" alt="External cladding system example" className="mt-6 mb-6 block w-full h-52 sm:h-48 object-contain rounded-lg shadow-[0_10px_18px_rgba(0,0,0,0.08)]" />

          <p className="text-text-secondary text-sm mt-3 font-semibold leading-relaxed">
            Select complete product systems and components
          </p>

          <p className="text-text-muted text-sm mt-4 font-medium leading-relaxed">
            Best when you want structured systems.
          </p>
        </button>

        <button
          type="button"
          onClick={onSkip}
          className={`${baseCardClass} border-border hover:border-heading`}
        >

          <div className="text-[10px] tracking-[0.2em] font-semibold text-[var(--color-accent)] mb-1.5">OPTION 3</div>
<h3 className="text-heading text-xl font-extrabold tracking-tight leading-tight max-w-[13ch]">
            Add items manually
          </h3>

          <p className="text-text-secondary text-sm mt-3 font-semibold leading-relaxed">
            Type or outline the materials you need
          </p>

          <p className="text-text-muted text-sm mt-4 font-medium leading-relaxed">
            Good for quick RFQs without a file.
          </p>
        </button>
      </div>

      <style jsx global>{`
        .bq-note-demo {
          position: relative;
        }

        .bq-note-line {
          display: inline-block;
          font-family: "Comic Sans MS", "Bradley Hand", "Marker Felt", cursive;
          font-weight: 700;
          letter-spacing: 0.01em;
          transform: rotate(-1.2deg);
          transform-origin: left center;
          animation: bqHandLine 3.6s ease-in-out infinite;
        }

        .bq-camera {
          animation: bqCameraPulse 3.6s ease-in-out infinite;
        }

        .bq-flash {
          background:
            radial-gradient(circle at 84% 20%, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.72) 12%, rgba(255,255,255,0.18) 24%, rgba(255,255,255,0) 42%);
          opacity: 0;
          animation: bqCameraFlash 3.6s ease-in-out infinite;
        }

        @keyframes bqHandLine {
          0% { opacity: 0.82; transform: rotate(-1.2deg) translateY(0px); }
          18% { opacity: 1; transform: rotate(-1.2deg) translateY(0px); }
          50% { opacity: 1; transform: rotate(-1.2deg) translateY(0px); }
          62% { opacity: 1; transform: rotate(-1.2deg) translateY(-0.5px); }
          100% { opacity: 0.82; transform: rotate(-1.2deg) translateY(0px); }
        }

        @keyframes bqCameraPulse {
          0% { transform: scale(1); }
          52% { transform: scale(1); }
          58% { transform: scale(0.92); }
          66% { transform: scale(1); }
          100% { transform: scale(1); }
        }

        @keyframes bqCameraFlash {
          0% { opacity: 0; }
          54% { opacity: 0; }
          60% { opacity: 0.95; }
          68% { opacity: 0; }
          100% { opacity: 0; }
        }
      `}</style>

      {loading && (
        <div className="fixed inset-0 bg-[rgba(255,255,255,0.92)] backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="w-full max-w-sm rounded-2xl border-2 border-border bg-white px-6 py-8 text-center shadow-[0_18px_40px_rgba(24,93,122,0.16)]">
            <div className="w-12 h-12 border-4 border-heading border-t-transparent rounded-full animate-spin mx-auto mb-5"></div>
            <p className="text-heading font-bold text-lg tracking-tight" key={msgIndex}>
              {LOADING_MESSAGES[msgIndex]}
            </p>
            <p className="text-text-secondary text-sm mt-3 font-medium">
              This usually takes 15–30 seconds
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
