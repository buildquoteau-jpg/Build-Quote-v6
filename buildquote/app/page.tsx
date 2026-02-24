'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ACCESS_CODE = 'build2025'

export default function Home() {
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const router = useRouter()

  function checkCode() {
    if (code.trim().toLowerCase() === ACCESS_CODE) {
      router.push('/portfolio')
    } else {
      setError(true)
      setCode('')
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') checkCode()
    setError(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700;800&family=Barlow:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --navy: #1e3a4a;
          --teal: #2e6b7a;
          --teal-light: #4a8fa0;
          --accent: #8cb8c4;
          --white: #f5f2ed;
          --sand: #b8a98a;
        }
        html, body { height: 100%; }
        .landing {
          position: fixed; inset: 0;
          font-family: 'Barlow', sans-serif;
          color: var(--white);
          display: flex; flex-direction: column;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0;
          background:
            linear-gradient(160deg, rgba(30,58,74,0.95) 0%, rgba(46,107,122,0.88) 50%, rgba(30,58,74,0.97) 100%),
            repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(74,143,160,0.04) 60px, rgba(74,143,160,0.04) 61px),
            repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(74,143,160,0.04) 60px, rgba(74,143,160,0.04) 61px);
        }
        .hero-bg::after {
          content: ''; position: absolute; top: 0; right: 0;
          width: 45%; height: 100%;
          background: linear-gradient(135deg, transparent 40%, rgba(46,107,122,0.2) 100%);
          border-left: 1px solid rgba(74,143,160,0.15);
        }
        nav {
          position: relative; z-index: 10;
          display: flex; justify-content: space-between; align-items: flex-start;
          padding: 2.5rem 3rem 0;
        }
        .wordmark-main {
          display: block;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 800; letter-spacing: 0.15em; line-height: 1;
        }
        .wordmark-sub {
          display: block;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(0.55rem, 1.2vw, 0.72rem);
          font-weight: 300; letter-spacing: 0.4em;
          color: var(--accent); padding-top: 0.3rem;
          border-top: 1px solid rgba(140,184,196,0.35);
          margin-top: 0.3rem;
        }
        .hero-content {
          position: relative; z-index: 10;
          flex: 1; display: flex; align-items: flex-end;
          padding: 0 3rem 4rem;
        }
        .hero-text { max-width: 55%; }
        .hero-eyebrow {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(0.6rem, 1.2vw, 0.8rem);
          letter-spacing: 0.35em; color: var(--accent);
          text-transform: uppercase; margin-bottom: 1.2rem;
          animation: fadeUp 0.8s ease 0.2s both;
        }
        .hero-headline {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(3.5rem, 9vw, 7rem);
          font-weight: 800; line-height: 0.92;
          letter-spacing: 0.02em; text-transform: uppercase;
          animation: fadeUp 0.8s ease 0.4s both;
        }
        .hero-headline span { color: var(--accent); }
        .hero-sub {
          font-size: clamp(0.85rem, 1.5vw, 1rem);
          font-weight: 300; color: rgba(245,242,237,0.6);
          line-height: 1.6; margin-top: 1.5rem; max-width: 380px;
          animation: fadeUp 0.8s ease 0.6s both;
        }
        .access-block {
          position: absolute; right: 0; bottom: 4rem;
          width: clamp(260px, 32vw, 380px);
          background: var(--teal);
          padding: 2.5rem 2.5rem 2rem;
          z-index: 20;
          animation: slideIn 0.8s ease 0.8s both;
        }
        .access-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(1.4rem, 3.5vw, 2.2rem);
          font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; line-height: 1.1;
          margin-bottom: 1.5rem;
        }
        .access-input {
          width: 100%; background: transparent; border: none;
          border-bottom: 2px solid rgba(245,242,237,0.4);
          padding: 0.6rem 0;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.4rem; font-weight: 600;
          letter-spacing: 0.25em; color: var(--white);
          outline: none; text-transform: uppercase;
          transition: border-color 0.2s;
        }
        .access-input::placeholder { color: rgba(245,242,237,0.3); }
        .access-input:focus { border-bottom-color: var(--white); }
        .access-input.shake { animation: shake 0.3s ease; }
        .access-error {
          font-size: 0.75rem; color: #e88;
          margin-top: 0.6rem; min-height: 1rem;
          letter-spacing: 0.05em;
          opacity: 0; transition: opacity 0.3s;
        }
        .access-error.visible { opacity: 1; }
        .access-btn {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 2rem; background: none; border: none;
          cursor: pointer; padding: 0; width: 100%;
          color: var(--white);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.8rem; letter-spacing: 0.25em;
          text-transform: uppercase; opacity: 0.7; transition: opacity 0.2s;
        }
        .access-btn:hover { opacity: 1; }
        .access-btn .arrow {
          width: 36px; height: 36px;
          border: 1px solid rgba(245,242,237,0.4);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem; transition: background 0.2s, border-color 0.2s;
        }
        .access-btn:hover .arrow { background: rgba(245,242,237,0.15); border-color: var(--white); }
        .bottom-bar {
          position: relative; z-index: 10;
          display: flex; justify-content: space-between;
          padding: 1rem 3rem;
          border-top: 1px solid rgba(74,143,160,0.2);
          font-size: 0.65rem; letter-spacing: 0.2em;
          color: rgba(245,242,237,0.3); text-transform: uppercase;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        @media (max-width: 680px) {
          nav, .hero-content, .bottom-bar { padding-left: 1.5rem; padding-right: 1.5rem; }
          .hero-text { max-width: 100%; }
          .hero-content { align-items: flex-start; padding-top: 3rem; flex-direction: column; }
          .access-block { position: relative; right: auto; bottom: auto; width: 100%; margin-top: 2rem; }
        }
      `}</style>

      <div className="landing">
        <div className="hero-bg" />
        <nav>
          <div>
            <span className="wordmark-main">BUILDQUOTE</span>
            <span className="wordmark-sub">Southwest WA</span>
          </div>
        </nav>

        <div className="hero-content">
          <div className="hero-text">
            <p className="hero-eyebrow">Construction Technology</p>
            <h1 className="hero-headline">
              Built<br />for<br /><span>Builders</span>
            </h1>
            <p className="hero-sub">
              AI-native tools for the Australian construction industry. Smarter quoting,
              supplier connections, and material coordination — built from the ground up in Southwest WA.
            </p>
          </div>

          <div className="access-block">
            <p className="access-label">Enter<br />Access<br />Code</p>
            <input
              className={`access-input${error ? ' shake' : ''}`}
              type="password"
              placeholder="· · · · · ·"
              maxLength={20}
              autoComplete="off"
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <p className={`access-error${error ? ' visible' : ''}`}>Incorrect code. Try again.</p>
            <button className="access-btn" onClick={checkCode}>
              <span>Enter</span>
              <span className="arrow">→</span>
            </button>
          </div>
        </div>

        <div className="bottom-bar">
          <span>© 2025 BuildQuote</span>
          <span>Southwest WA · Australia</span>
          <span>Private Portfolio</span>
        </div>
      </div>
    </>
  )
}
