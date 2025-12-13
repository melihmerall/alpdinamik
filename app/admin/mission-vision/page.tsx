"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function MissionVisionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    breadcrumbImageUrl: '',
    // Mission Section
    missionSubtitle: '',
    missionTitle: '',
    missionBody: '',
    missionImageUrl: '',
    // Vision Section
    visionSubtitle: '',
    visionTitle: '',
    visionBody: '',
    visionImageUrl: '',
  })
  const [pageExists, setPageExists] = useState(false)

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await fetch('/api/company-pages/misyon-vizyon')
        const data = await response.json()

        if (response.ok && data) {
          setPageExists(true)
          setFormData({
            title: data.title || '',
            breadcrumbImageUrl: data.breadcrumbImageUrl || '',
            missionSubtitle: data.missionSubtitle || '',
            missionTitle: data.missionTitle || '',
            missionBody: data.missionBody || '',
            missionImageUrl: data.missionImageUrl || '',
            visionSubtitle: data.visionSubtitle || '',
            visionTitle: data.visionTitle || '',
            visionBody: data.visionBody || '',
            visionImageUrl: data.visionImageUrl || '',
          })
        }
      } catch (err) {
        console.error('Error fetching page:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPage()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileUpload = async (fieldName, file) => {
    if (!file) return

    setUploading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Dosya yüklenemedi')
      }

      const data = await response.json()
      const fileUrl = data.url

      setFormData(prev => ({
        ...prev,
        [fieldName]: fileUrl
      }))

      // Auto-save after upload
      await handleSubmit(null, { [fieldName]: fileUrl })
    } catch (err) {
      setError(err.message || 'Dosya yüklenirken bir hata oluştu')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e, additionalData = {}) => {
    if (e) e.preventDefault()

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const submitData = {
        slug: 'misyon-vizyon',
        title: formData.title.trim() || 'Misyon ve Vizyon',
        ...formData,
        ...additionalData,
      }

      // Remove empty strings and set to null for optional fields
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '') {
          submitData[key] = null
        }
      })

      const url = pageExists
        ? '/api/company-pages/misyon-vizyon'
        : '/api/company-pages'

      const method = pageExists ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Sayfa kaydedilemedi')
      }

      setPageExists(true)
      setSuccess('Sayfa başarıyla kaydedildi!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'Sayfa kaydedilirken bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <p>Yükleniyor...</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem' 
      }}>
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            color: 'var(--admin-gray-900)', 
            margin: '0 0 0.5rem' 
          }}>
            Misyon ve Vizyon Sayfası
          </h1>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'var(--admin-gray-600)', 
            margin: 0 
          }}>
            /misyon-vizyon sayfasının içeriğini yönetin
          </p>
        </div>
        <Link
          href="/misyon-vizyon"
          target="_blank"
          className="admin-btn admin-btn-secondary"
        >
          Sayfayı Görüntüle
        </Link>
      </div>

      <div className="admin-card">
        <form onSubmit={handleSubmit}>
          {(error || success) && (
            <div style={{
              padding: '1rem',
              background: error ? '#fee' : '#efe',
              color: error ? '#c33' : '#3c3',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              {error || success}
            </div>
          )}

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Page Title */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: 'var(--admin-gray-900)'
              }}>
                Sayfa Başlığı <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Misyon ve Vizyon"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--admin-gray-300)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Breadcrumb Image */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: 'var(--admin-gray-900)'
              }}>
                Breadcrumb Arka Plan Görseli
              </label>
              {formData.breadcrumbImageUrl && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <img 
                    src={formData.breadcrumbImageUrl} 
                    alt="Breadcrumb" 
                    style={{ 
                      maxWidth: '200px', 
                      height: 'auto', 
                      borderRadius: '8px',
                      border: '1px solid var(--admin-gray-300)'
                    }} 
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload('breadcrumbImageUrl', file)
                }}
                disabled={uploading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--admin-gray-300)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }}
              />
              {uploading && <p style={{ marginTop: '0.5rem', color: '#666' }}>Yükleniyor...</p>}
            </div>

            {/* Mission Section */}
            <div style={{ 
              padding: '1.5rem', 
              background: '#f9fafb', 
              borderRadius: '8px',
              border: '1px solid var(--admin-gray-200)'
            }}>
              <h2 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                marginBottom: '1.5rem',
                color: 'var(--admin-gray-900)'
              }}>
                Misyon Bölümü
              </h2>

              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: 'var(--admin-gray-900)'
                  }}>
                    Misyon Alt Başlık
                  </label>
                  <input
                    type="text"
                    name="missionSubtitle"
                    value={formData.missionSubtitle}
                    onChange={handleChange}
                    placeholder="Misyonumuz"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--admin-gray-300)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: 'var(--admin-gray-900)'
                  }}>
                    Misyon Başlık
                  </label>
                  <input
                    type="text"
                    name="missionTitle"
                    value={formData.missionTitle}
                    onChange={handleChange}
                    placeholder="Doğru Ürün + Doğru Mühendislik + Sürdürülebilir Hizmet"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--admin-gray-300)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: 'var(--admin-gray-900)'
                  }}>
                    Misyon Açıklaması
                  </label>
                  <textarea
                    name="missionBody"
                    value={formData.missionBody}
                    onChange={handleChange}
                    placeholder="Misyon açıklaması..."
                    rows={5}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--admin-gray-300)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: 'var(--admin-gray-900)'
                  }}>
                    Misyon Görseli
                  </label>
                  {formData.missionImageUrl && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <img 
                        src={formData.missionImageUrl} 
                        alt="Misyon" 
                        style={{ 
                          maxWidth: '200px', 
                          height: 'auto', 
                          borderRadius: '8px',
                          border: '1px solid var(--admin-gray-300)'
                        }} 
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload('missionImageUrl', file)
                    }}
                    disabled={uploading}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--admin-gray-300)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Vision Section */}
            <div style={{ 
              padding: '1.5rem', 
              background: '#f9fafb', 
              borderRadius: '8px',
              border: '1px solid var(--admin-gray-200)'
            }}>
              <h2 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                marginBottom: '1.5rem',
                color: 'var(--admin-gray-900)'
              }}>
                Vizyon Bölümü
              </h2>

              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: 'var(--admin-gray-900)'
                  }}>
                    Vizyon Alt Başlık
                  </label>
                  <input
                    type="text"
                    name="visionSubtitle"
                    value={formData.visionSubtitle}
                    onChange={handleChange}
                    placeholder="Vizyonumuz"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--admin-gray-300)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: 'var(--admin-gray-900)'
                  }}>
                    Vizyon Başlık
                  </label>
                  <input
                    type="text"
                    name="visionTitle"
                    value={formData.visionTitle}
                    onChange={handleChange}
                    placeholder="Lineer Hareket Sistemlerinde Lider Çözüm Ortağı"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--admin-gray-300)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: 'var(--admin-gray-900)'
                  }}>
                    Vizyon Açıklaması
                  </label>
                  <textarea
                    name="visionBody"
                    value={formData.visionBody}
                    onChange={handleChange}
                    placeholder="Vizyon açıklaması..."
                    rows={5}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--admin-gray-300)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: 'var(--admin-gray-900)'
                  }}>
                    Vizyon Görseli
                  </label>
                  {formData.visionImageUrl && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <img 
                        src={formData.visionImageUrl} 
                        alt="Vizyon" 
                        style={{ 
                          maxWidth: '200px', 
                          height: 'auto', 
                          borderRadius: '8px',
                          border: '1px solid var(--admin-gray-300)'
                        }} 
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload('visionImageUrl', file)
                    }}
                    disabled={uploading}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--admin-gray-300)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'flex-end',
              paddingTop: '1rem',
              borderTop: '1px solid var(--admin-gray-200)'
            }}>
              <button
                type="submit"
                disabled={saving}
                className="admin-btn admin-btn-primary"
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

