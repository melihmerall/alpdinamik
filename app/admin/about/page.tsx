"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AboutPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    body: '',
    imageUrl: '',
    breadcrumbImageUrl: '',
    stat1Number: 0,
    stat1Label: '',
    stat2Number: 0,
    stat2Label: '',
    stat3Number: 0,
    stat3Label: '',
    ctaLabel: '',
    ctaUrl: '',
    // Mission Section
    missionSubtitle: '',
    missionTitle: '',
    // Video Section
    videoUrl: '',
    videoBackgroundImageUrl: '',
    // Certification Section
    certificationSubtitle: '',
    certificationTitle: '',
    certificationImageUrl: '',
    certificationStat1Number: 0,
    certificationStat1Label: '',
    certificationStat2Number: 0,
    certificationStat2Label: '',
    certificationStat3Number: 0,
    certificationStat3Label: '',
    certificationStat4Number: 0,
    certificationStat4Label: '',
    // Team Section
    teamSubtitle: '',
    teamTitle: '',
  })
  const [pageExists, setPageExists] = useState(false)

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await fetch('/api/company-pages/hakkimizda')
        const data = await response.json()

        if (response.ok && data) {
          setPageExists(true)
          setFormData({
            title: data.title || '',
            subtitle: data.subtitle || '',
            body: data.body || '',
            imageUrl: data.imageUrl || '',
            breadcrumbImageUrl: data.breadcrumbImageUrl || '',
            stat1Number: data.stat1Number || 0,
            stat1Label: data.stat1Label || '',
            stat2Number: data.stat2Number || 0,
            stat2Label: data.stat2Label || '',
            stat3Number: data.stat3Number || 0,
            stat3Label: data.stat3Label || '',
            ctaLabel: data.ctaLabel || '',
            ctaUrl: data.ctaUrl || '',
            missionSubtitle: data.missionSubtitle || '',
            missionTitle: data.missionTitle || '',
            videoUrl: data.videoUrl || '',
            videoBackgroundImageUrl: data.videoBackgroundImageUrl || '',
            certificationSubtitle: data.certificationSubtitle || '',
            certificationTitle: data.certificationTitle || '',
            certificationImageUrl: data.certificationImageUrl || '',
            certificationStat1Number: data.certificationStat1Number || 0,
            certificationStat1Label: data.certificationStat1Label || '',
            certificationStat2Number: data.certificationStat2Number || 0,
            certificationStat2Label: data.certificationStat2Label || '',
            certificationStat3Number: data.certificationStat3Number || 0,
            certificationStat3Label: data.certificationStat3Label || '',
            certificationStat4Number: data.certificationStat4Number || 0,
            certificationStat4Label: data.certificationStat4Label || '',
            teamSubtitle: data.teamSubtitle || '',
            teamTitle: data.teamTitle || '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'imageUrl' | 'breadcrumbImageUrl' | 'videoBackgroundImageUrl' | 'certificationImageUrl' = 'imageUrl') => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')
    setSuccess('')

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('folder', 'company-pages')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      const data = await response.json()

      if (response.ok) {
        setFormData(prev => ({
          ...prev,
          [field]: data.url,
        }))
        setSuccess('Görsel başarıyla yüklendi!')
        // Auto-save after upload
        setTimeout(() => {
          handleSubmit({ preventDefault: () => {} } as React.FormEvent, true)
        }, 500)
      } else {
        setError(data.error || 'Dosya yüklenirken bir hata oluştu')
      }
    } catch (err) {
      setError('Dosya yüklenirken bir hata oluştu')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent, autoSave = false) => {
    if (!autoSave) {
      e.preventDefault()
    }
    
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const url = pageExists 
        ? `/api/company-pages/hakkimizda`
        : '/api/company-pages'
      
      const method = pageExists ? 'PUT' : 'POST'
      
      const payload = {
        ...formData,
        slug: 'hakkimizda',
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        setPageExists(true)
        if (autoSave) {
          setSuccess('Otomatik kaydedildi!')
        } else {
          setSuccess('Sayfa başarıyla kaydedildi!')
        }
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error || 'Sayfa kaydedilirken bir hata oluştu')
      }
    } catch (err) {
      setError('Sayfa kaydedilirken bir hata oluştu')
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
            Hakkımızda Sayfası
          </h1>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'var(--admin-gray-600)', 
            margin: 0 
          }}>
            /hakkimizda sayfasının içeriğini yönetin
          </p>
        </div>
        <Link
          href="/hakkimizda"
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
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: 'var(--admin-gray-900)'
              }}>
                Başlık <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Hakkımızda"
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
                Alt Başlık
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="Hakkımızda"
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
                İçerik <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                name="body"
                value={formData.body}
                onChange={handleChange}
                required
                rows={8}
                placeholder="Sayfa içeriğini buraya yazın..."
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
              <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--admin-gray-500)', fontSize: '0.875rem' }}>
                HTML etiketleri kullanabilirsiniz
              </small>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: 'var(--admin-gray-900)'
              }}>
                Ana Görsel
              </label>
              {formData.imageUrl && (
                <div style={{ marginBottom: '1rem' }}>
                  <img 
                    src={formData.imageUrl} 
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
                onChange={(e) => handleFileUpload(e, 'imageUrl')}
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
            </div>

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
                <div style={{ marginBottom: '1rem' }}>
                  <img 
                    src={formData.breadcrumbImageUrl} 
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
                onChange={(e) => handleFileUpload(e, 'breadcrumbImageUrl')}
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
            </div>

            <div style={{ 
              padding: '1.5rem', 
              background: 'var(--admin-gray-50)', 
              borderRadius: '8px',
              border: '1px solid var(--admin-gray-200)'
            }}>
              <h3 style={{ 
                marginBottom: '1rem', 
                fontSize: '1.125rem', 
                fontWeight: '600',
                color: 'var(--admin-gray-900)'
              }}>
                İstatistikler
              </h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '1rem', alignItems: 'end' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      color: 'var(--admin-gray-700)'
                    }}>
                      Sayı 1
                    </label>
                    <input
                      type="number"
                      name="stat1Number"
                      value={formData.stat1Number}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
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
                      fontSize: '0.875rem',
                      color: 'var(--admin-gray-700)'
                    }}>
                      Etiket 1
                    </label>
                    <input
                      type="text"
                      name="stat1Label"
                      value={formData.stat1Label}
                      onChange={handleChange}
                      placeholder="Yıl Sektör Tecrübesi"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid var(--admin-gray-300)',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '1rem', alignItems: 'end' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      color: 'var(--admin-gray-700)'
                    }}>
                      Sayı 2
                    </label>
                    <input
                      type="number"
                      name="stat2Number"
                      value={formData.stat2Number}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
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
                      fontSize: '0.875rem',
                      color: 'var(--admin-gray-700)'
                    }}>
                      Etiket 2
                    </label>
                    <input
                      type="text"
                      name="stat2Label"
                      value={formData.stat2Label}
                      onChange={handleChange}
                      placeholder="Endüstriyel Proje"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid var(--admin-gray-300)',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '1rem', alignItems: 'end' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      color: 'var(--admin-gray-700)'
                    }}>
                      Sayı 3
                    </label>
                    <input
                      type="number"
                      name="stat3Number"
                      value={formData.stat3Number}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
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
                      fontSize: '0.875rem',
                      color: 'var(--admin-gray-700)'
                    }}>
                      Etiket 3
                    </label>
                    <input
                      type="text"
                      name="stat3Label"
                      value={formData.stat3Label}
                      onChange={handleChange}
                      placeholder="Farklı Uygulama Alanı"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid var(--admin-gray-300)',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  color: 'var(--admin-gray-900)'
                }}>
                  CTA Etiketi
                </label>
                <input
                  type="text"
                  name="ctaLabel"
                  value={formData.ctaLabel}
                  onChange={handleChange}
                  placeholder="Tüm Hizmetler"
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
                  CTA URL
                </label>
                <input
                  type="text"
                  name="ctaUrl"
                  value={formData.ctaUrl}
                  onChange={handleChange}
                  placeholder="/services"
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

            {/* Mission Section */}
            <div style={{ 
              padding: '1.5rem', 
              background: 'var(--admin-gray-50)', 
              borderRadius: '8px',
              border: '1px solid var(--admin-gray-200)',
              marginTop: '2rem'
            }}>
              <h3 style={{ 
                marginBottom: '1.5rem', 
                fontSize: '1.125rem', 
                fontWeight: '600',
                color: 'var(--admin-gray-900)'
              }}>
                Misyon Bölümü
              </h3>
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
              </div>
            </div>

            {/* Video Section */}
            <div style={{ 
              padding: '1.5rem', 
              background: 'var(--admin-gray-50)', 
              borderRadius: '8px',
              border: '1px solid var(--admin-gray-200)',
              marginTop: '2rem'
            }}>
              <h3 style={{ 
                marginBottom: '1.5rem', 
                fontSize: '1.125rem', 
                fontWeight: '600',
                color: 'var(--admin-gray-900)'
              }}>
                Video Bölümü
              </h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: 'var(--admin-gray-900)'
                  }}>
                    YouTube Video ID
                  </label>
                  <input
                    type="text"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    placeholder="SZEflIVnhH8"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--admin-gray-300)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'inherit'
                    }}
                  />
                  <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--admin-gray-500)', fontSize: '0.875rem' }}>
                    YouTube video URL'inden video ID'yi girin (örn: https://www.youtube.com/watch?v=SZEflIVnhH8 → SZEflIVnhH8)
                  </small>
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: 'var(--admin-gray-900)'
                  }}>
                    Video Arka Plan Görseli
                  </label>
                  {formData.videoBackgroundImageUrl && (
                    <div style={{ marginBottom: '1rem' }}>
                      <img 
                        src={formData.videoBackgroundImageUrl} 
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
                    onChange={(e) => handleFileUpload(e, 'videoBackgroundImageUrl')}
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

            {/* Certification Section */}
            <div style={{ 
              padding: '1.5rem', 
              background: 'var(--admin-gray-50)', 
              borderRadius: '8px',
              border: '1px solid var(--admin-gray-200)',
              marginTop: '2rem'
            }}>
              <h3 style={{ 
                marginBottom: '1.5rem', 
                fontSize: '1.125rem', 
                fontWeight: '600',
                color: 'var(--admin-gray-900)'
              }}>
                Sertifikasyon / Başarılar Bölümü
              </h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: 'var(--admin-gray-900)'
                  }}>
                    Alt Başlık
                  </label>
                  <input
                    type="text"
                    name="certificationSubtitle"
                    value={formData.certificationSubtitle}
                    onChange={handleChange}
                    placeholder="Industry Certifications"
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
                    Başlık
                  </label>
                  <input
                    type="text"
                    name="certificationTitle"
                    value={formData.certificationTitle}
                    onChange={handleChange}
                    placeholder="Our Key Achievements Over the Years"
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
                    Görsel
                  </label>
                  {formData.certificationImageUrl && (
                    <div style={{ marginBottom: '1rem' }}>
                      <img 
                        src={formData.certificationImageUrl} 
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
                    onChange={(e) => handleFileUpload(e, 'certificationImageUrl')}
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
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0.5rem', alignItems: 'end' }}>
                    <div>
                      <label style={{ fontSize: '0.875rem', color: 'var(--admin-gray-700)' }}>Sayı 1</label>
                      <input
                        type="number"
                        name="certificationStat1Number"
                        value={formData.certificationStat1Number}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--admin-gray-300)', borderRadius: '8px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.875rem', color: 'var(--admin-gray-700)' }}>Etiket 1</label>
                      <input
                        type="text"
                        name="certificationStat1Label"
                        value={formData.certificationStat1Label}
                        onChange={handleChange}
                        placeholder="Complete Projects"
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--admin-gray-300)', borderRadius: '8px' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0.5rem', alignItems: 'end' }}>
                    <div>
                      <label style={{ fontSize: '0.875rem', color: 'var(--admin-gray-700)' }}>Sayı 2</label>
                      <input
                        type="number"
                        name="certificationStat2Number"
                        value={formData.certificationStat2Number}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--admin-gray-300)', borderRadius: '8px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.875rem', color: 'var(--admin-gray-700)' }}>Etiket 2</label>
                      <input
                        type="text"
                        name="certificationStat2Label"
                        value={formData.certificationStat2Label}
                        onChange={handleChange}
                        placeholder="Team Members"
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--admin-gray-300)', borderRadius: '8px' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0.5rem', alignItems: 'end' }}>
                    <div>
                      <label style={{ fontSize: '0.875rem', color: 'var(--admin-gray-700)' }}>Sayı 3</label>
                      <input
                        type="number"
                        name="certificationStat3Number"
                        value={formData.certificationStat3Number}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--admin-gray-300)', borderRadius: '8px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.875rem', color: 'var(--admin-gray-700)' }}>Etiket 3</label>
                      <input
                        type="text"
                        name="certificationStat3Label"
                        value={formData.certificationStat3Label}
                        onChange={handleChange}
                        placeholder="Client Reviews"
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--admin-gray-300)', borderRadius: '8px' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0.5rem', alignItems: 'end' }}>
                    <div>
                      <label style={{ fontSize: '0.875rem', color: 'var(--admin-gray-700)' }}>Sayı 4</label>
                      <input
                        type="number"
                        name="certificationStat4Number"
                        value={formData.certificationStat4Number}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--admin-gray-300)', borderRadius: '8px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.875rem', color: 'var(--admin-gray-700)' }}>Etiket 4</label>
                      <input
                        type="text"
                        name="certificationStat4Label"
                        value={formData.certificationStat4Label}
                        onChange={handleChange}
                        placeholder="Winning Awards"
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--admin-gray-300)', borderRadius: '8px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Section */}
            <div style={{ 
              padding: '1.5rem', 
              background: 'var(--admin-gray-50)', 
              borderRadius: '8px',
              border: '1px solid var(--admin-gray-200)',
              marginTop: '2rem'
            }}>
              <h3 style={{ 
                marginBottom: '1.5rem', 
                fontSize: '1.125rem', 
                fontWeight: '600',
                color: 'var(--admin-gray-900)'
              }}>
                Ekip Bölümü
              </h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: 'var(--admin-gray-900)'
                  }}>
                    Alt Başlık
                  </label>
                  <input
                    type="text"
                    name="teamSubtitle"
                    value={formData.teamSubtitle}
                    onChange={handleChange}
                    placeholder="Meet Our Experts"
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
                    Başlık
                  </label>
                  <input
                    type="text"
                    name="teamTitle"
                    value={formData.teamTitle}
                    onChange={handleChange}
                    placeholder="Dedicated Professionals"
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
              style={{ opacity: saving || uploading ? 0.6 : 1 }}
            >
              {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
            <Link
              href="/admin"
              className="admin-btn admin-btn-secondary"
            >
              İptal
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

