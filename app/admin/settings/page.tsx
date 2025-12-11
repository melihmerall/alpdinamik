"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SiteSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    defaultBreadcrumbImageUrl: '',
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    youtubeUrl: '',
    behanceUrl: '',
    email: '',
    phone: '',
    address: '',
    siteName: '',
    siteDescription: '',
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/site-settings')
      if (response.ok) {
        const data = await response.json()
        setFormData({
          defaultBreadcrumbImageUrl: data.defaultBreadcrumbImageUrl || '',
          facebookUrl: data.facebookUrl || '',
          twitterUrl: data.twitterUrl || '',
          instagramUrl: data.instagramUrl || '',
          linkedinUrl: data.linkedinUrl || '',
          youtubeUrl: data.youtubeUrl || '',
          behanceUrl: data.behanceUrl || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          siteName: data.siteName || '',
          siteDescription: data.siteDescription || '',
        })
      }
    } catch (err) {
      setError('Ayarlar yüklenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('folder', 'settings')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      const data = await response.json()

      if (response.ok) {
        const updatedFormData = {
          ...formData,
          [field]: data.url,
        }
        setFormData(updatedFormData)
        
        // Auto-save after image upload
        try {
          const saveResponse = await fetch('/api/site-settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedFormData),
          })

          const saveData = await saveResponse.json()

          if (saveResponse.ok) {
            setSuccess('Görsel başarıyla yüklendi ve kaydedildi!')
            setTimeout(() => setSuccess(''), 3000)
          } else {
            setError('Görsel yüklendi ancak kaydedilirken bir hata oluştu. Lütfen "Ayarları Kaydet" butonuna tıklayın.')
          }
        } catch (saveErr) {
          setError('Görsel yüklendi ancak kaydedilirken bir hata oluştu. Lütfen "Ayarları Kaydet" butonuna tıklayın.')
        }
      } else {
        setError(data.error || 'Dosya yüklenirken bir hata oluştu')
      }
    } catch (err) {
      setError('Dosya yüklenirken bir hata oluştu')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      console.log('Saving formData:', formData) // Debug log
      
      // Prepare data - ensure all fields are sent
      const dataToSave = {
        defaultBreadcrumbImageUrl: formData.defaultBreadcrumbImageUrl || null,
        facebookUrl: formData.facebookUrl || null,
        twitterUrl: formData.twitterUrl || null,
        instagramUrl: formData.instagramUrl || null,
        linkedinUrl: formData.linkedinUrl || null,
        youtubeUrl: formData.youtubeUrl || null,
        behanceUrl: formData.behanceUrl || null,
        email: formData.email || null,
        phone: formData.phone || null,
        address: formData.address || null,
        siteName: formData.siteName || null,
        siteDescription: formData.siteDescription || null,
      }
      
      console.log('Data to save:', dataToSave) // Debug log
      
      const response = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'API hatası')
      }

      const data = await response.json()
      console.log('API Response:', data) // Debug log

      setSuccess('Ayarlar başarıyla kaydedildi!')
      setTimeout(() => setSuccess(''), 3000)
      
      // Reload settings to show updated data
      await fetchSettings()
    } catch (err: any) {
      console.error('Submit Error:', err) // Debug log
      setError(err.message || 'Ayarlar kaydedilirken bir hata oluştu')
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
            Site Ayarları
          </h1>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'var(--admin-gray-600)', 
            margin: 0 
          }}>
            Site genel ayarlarını, sosyal medya linklerini ve varsayılan görselleri yönetin
          </p>
        </div>
      </div>

      <div className="admin-card">
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              padding: '1rem',
              background: '#fee',
              color: '#c33',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              padding: '1rem',
              background: '#efe',
              color: '#3c3',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              {success}
            </div>
          )}

          <div style={{ display: 'grid', gap: '2rem' }}>
            {/* Default Breadcrumb Image */}
            <div>
              <h2 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: 'var(--admin-gray-900)',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid var(--admin-gray-200)'
              }}>
                Varsayılan Breadcrumb Görseli
              </h2>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  color: 'var(--admin-gray-900)'
                }}>
                  Breadcrumb Arka Plan Görseli
                </label>
                {formData.defaultBreadcrumbImageUrl && (
                  <div style={{ marginBottom: '1rem' }}>
                    <img 
                      src={formData.defaultBreadcrumbImageUrl} 
                      alt="Preview" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '300px', 
                        borderRadius: '8px',
                        objectFit: 'cover'
                      }} 
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'defaultBreadcrumbImageUrl')}
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
                {uploading && (
                  <p style={{ marginTop: '0.5rem', color: 'var(--admin-gray-600)' }}>
                    Yükleniyor...
                  </p>
                )}
                {formData.defaultBreadcrumbImageUrl && (
                  <input
                    type="text"
                    name="defaultBreadcrumbImageUrl"
                    value={formData.defaultBreadcrumbImageUrl}
                    onChange={handleChange}
                    placeholder="Veya URL girin"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--admin-gray-300)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      marginTop: '0.5rem',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem'
                    }}
                  />
                )}
                <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--admin-gray-500)', fontSize: '0.875rem' }}>
                  Sayfalarda breadcrumb görseli belirtilmemişse bu görsel kullanılacak. Maksimum 5MB, JPG, PNG, GIF, WebP formatları desteklenir
                </small>
              </div>
            </div>

            {/* Social Media Links */}
            <div>
              <h2 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: 'var(--admin-gray-900)',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid var(--admin-gray-200)'
              }}>
                Sosyal Medya Hesapları
              </h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: 'var(--admin-gray-900)'
                  }}>
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    name="facebookUrl"
                    value={formData.facebookUrl}
                    onChange={handleChange}
                    placeholder="https://www.facebook.com/..."
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
                    Twitter/X URL
                  </label>
                  <input
                    type="url"
                    name="twitterUrl"
                    value={formData.twitterUrl}
                    onChange={handleChange}
                    placeholder="https://twitter.com/..."
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
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    name="instagramUrl"
                    value={formData.instagramUrl}
                    onChange={handleChange}
                    placeholder="https://www.instagram.com/..."
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
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    placeholder="https://www.linkedin.com/..."
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
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={handleChange}
                    placeholder="https://www.youtube.com/..."
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
                    Behance URL
                  </label>
                  <input
                    type="url"
                    name="behanceUrl"
                    value={formData.behanceUrl}
                    onChange={handleChange}
                    placeholder="https://www.behance.net/..."
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

            {/* Contact Info */}
            <div>
              <h2 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: 'var(--admin-gray-900)',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid var(--admin-gray-200)'
              }}>
                İletişim Bilgileri
              </h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: 'var(--admin-gray-900)'
                  }}>
                    E-posta
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="info@example.com"
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
                    Telefon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+90 (212) 123 45 67"
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
                    Adres
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Şirket adresi..."
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
              </div>
            </div>

            {/* SEO Settings */}
            <div>
              <h2 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: 'var(--admin-gray-900)',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid var(--admin-gray-200)'
              }}>
                SEO Ayarları
              </h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: 'var(--admin-gray-900)'
                  }}>
                    Site Adı
                  </label>
                  <input
                    type="text"
                    name="siteName"
                    value={formData.siteName}
                    onChange={handleChange}
                    placeholder="Alp Dinamik"
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
                    Site Açıklaması
                  </label>
                  <textarea
                    name="siteDescription"
                    value={formData.siteDescription}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Site hakkında kısa açıklama..."
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
              </div>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--admin-gray-200)'
          }}>
            <button
              type="submit"
              disabled={saving || uploading}
              className="admin-btn admin-btn-primary"
              style={{ 
                opacity: saving || uploading ? 0.6 : 1,
                cursor: saving || uploading ? 'not-allowed' : 'pointer'
              }}
              onClick={(e) => {
                console.log('Submit button clicked') // Debug
                // Form submit will be handled by form onSubmit
              }}
            >
              {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

