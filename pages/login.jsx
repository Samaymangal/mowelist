import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { login, me } from '../src/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const data = await login(email, password)
      const token = data.access_token
      localStorage.setItem('token', token)
      await me(token)
      router.push('/')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f8fafc',
      padding: '20px'
    }}>
      <div style={{
        width:'100%',
        maxWidth: 380,
        background:'#ffffff',
        borderRadius: 16,
        padding: 24,
        boxShadow:'0 10px 25px rgba(0,0,0,0.08)'
      }}>
        <h2 style={{marginTop:0, marginBottom:16, textAlign:'center'}}>Sign in</h2>
        <form onSubmit={handleSubmit}>
          <label style={{display:'block', marginBottom:8}}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
              style={{width:'100%', padding:10, marginTop:6, borderRadius:8, border:'1px solid #e2e8f0'}}
            />
          </label>
          <label style={{display:'block', marginBottom:8}}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
              style={{width:'100%', padding:10, marginTop:6, borderRadius:8, border:'1px solid #e2e8f0'}}
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            style={{width:'100%', padding:12, borderRadius:8, border:'none', background:'#2563eb', color:'#fff', fontWeight:600, cursor:'pointer'}}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        {message && (
          <div style={{marginTop:12, fontSize:14}}>{message}</div>
        )}
        <div style={{marginTop:16, textAlign:'center'}}>
          <Link
            href="/register"
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #2563eb',
              color: '#2563eb',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#2563eb';
              e.target.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#2563eb';
            }}
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}
