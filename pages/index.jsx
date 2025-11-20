import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { me } from '../src/api'

export default function Homepage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const userData = await me(token)
          setUser(userData)
        }
      } catch (err) {
        console.error('Error checking authentication:', err)
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  return (
    <div style={{
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      margin: 0,
      padding: 0,
      background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflowX: 'hidden',
      overflowY: 'auto',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <header style={{
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
          MoWeList
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '16px', opacity: 0.9 }}>Hello, {user.username}</span>
              <button
                onClick={() => {
                  localStorage.removeItem('token')
                  setUser(null)
                  router.reload()
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => router.push('/login')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
              >
                Login
              </button>

              <button
                onClick={() => router.push('/register')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#ffffff',
                  color: '#1e40af',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f0f9ff';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#ffffff';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Create Account
              </button>
            </>
          )}
        </div>
      </header>

      <main style={{
        padding: '60px 40px',
        textAlign: 'center',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 'bold',
          marginBottom: '20px',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
        }}>
          {user ? `Welcome back, ${user.username}!` : 'Welcome to MoWeList'}
        </h1>

        <p style={{
          fontSize: '1.2rem',
          marginBottom: '40px',
          opacity: 0.9,
          maxWidth: '600px',
          margin: '0 auto 40px'
        }}>
          {user ? 'Explore your personalized content and manage your watchlists' : 'Your ultimate destination for movies, web series, and personalized watchlists.'}
        </p>

        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '20px',
          maxWidth: '700px',
          margin: '0 auto',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5rem' }}>Explore Content</h3>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            flexWrap: 'nowrap'
          }}>
            <div style={{
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              minWidth: '120px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => {
              router.push('/movies');
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              e.target.style.transform = 'translateY(0)';
            }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎬</div>
              <div style={{ fontWeight: '600' }}>Movies</div>
            </div>

            <div style={{
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              minWidth: '120px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => {
              router.push('/webseries');
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              e.target.style.transform = 'translateY(0)';
            }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📺</div>
              <div style={{ fontWeight: '600' }}>Web Series</div>
            </div>

            <div style={{
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              minWidth: '120px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => {
              if (user) {
                router.push('/mylist');
              } else {
                alert('Please log in to access your list.');
              }
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              e.target.style.transform = 'translateY(0)';
            }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⭐</div>
              <div style={{ fontWeight: '600' }}>MyList</div>
            </div>
          </div>

          {!user && (
            <p style={{
              marginTop: '20px',
              fontSize: '0.9rem',
              opacity: 0.7,
              fontStyle: 'italic'
            }}>
              Sign in to access your personalized content
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
