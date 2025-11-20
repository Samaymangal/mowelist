import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { register } from '../src/api'

export default function Register() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate passwords match
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      await register(email, username, name, dob, password)
      setMessage('Registration successful! You can now login.')

      setEmail('')
      setUsername('')
      setName('')
      setDob('')
      setPassword('')
      setConfirmPassword('')

      setTimeout(() => router.push('/login'), 2000)
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f8fafc',
      padding: '20px'
    }}>
      <div style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width:'100%',
        maxWidth: 380,
        background:'#ffffff',
        borderRadius: 16,
        padding: 24,
        boxShadow:'0 10px 25px rgba(0,0,0,0.08)'
      }}>
        <h2 style={{marginTop:0, marginBottom:16, textAlign:'center'}}>Create Account</h2>
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
            Username
            <input
              type="text"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
              required
              minLength={3}
              style={{width:'100%', padding:10, marginTop:6, borderRadius:8, border:'1px solid #e2e8f0'}}
            />
          </label>
          <label style={{display:'block', marginBottom:8}}>
            Full Name
            <input
              type="text"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              required
              style={{width:'100%', padding:10, marginTop:6, borderRadius:8, border:'1px solid #e2e8f0'}}
            />
          </label>
          <label style={{display:'block', marginBottom:8}}>
            Date of Birth
            <input
              type="date"
              value={dob}
              onChange={(e)=>setDob(e.target.value)}
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
              minLength={6}
              style={{width:'100%', padding:10, marginTop:6, borderRadius:8, border:'1px solid #e2e8f0'}}
            />
          </label>
          <label style={{display:'block', marginBottom:16}}>
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
              required
              minLength={6}
              style={{width:'100%', padding:10, marginTop:6, borderRadius:8, border:'1px solid #e2e8f0'}}
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            style={{width:'100%', padding:12, borderRadius:8, border:'none', background:'#2563eb', color:'#fff', fontWeight:600, cursor:'pointer'}}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        {message && (
          <div style={{marginTop:12, fontSize:14, color: message.includes('successful') ? '#059669' : '#dc2626'}}>
            {message}
          </div>
        )}
        <p style={{marginTop:16, fontSize:14, textAlign:'center', color:'#64748b'}}>
          Already have an account?{' '}
          <Link href="/login" style={{color:'#2563eb', textDecoration:'none', fontWeight:500}}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
