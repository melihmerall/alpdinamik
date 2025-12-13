"use client"
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function EditCompanyPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    body: '',
    imageUrl: '',
    image2Url: '',
    breadcrumbImageUrl: '',
    stat1Number: 0,
    stat1Label: '',
    stat2Number: 0,
    stat2Label: '',
    stat3Number: 0,
    stat3Label: '',
    ctaLabel: '',
    ctaUrl: '',
  })

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await fetch(`/api/company-pages/${slug}`)
        const data = await response.json()

        if (response.ok) {
          setFormData({
            title: data.title || '',
            subtitle: data.subtitle || '',
            body: data.body || '',
            imageUrl: data.imageUrl || '',
            image2Url: data.image2Url || '',
            breadcrumbImageUrl: data.breadcrumbImageUrl || '',
            stat1Number: data.stat1Number || 0,
            stat1Label: data.stat1Label || '',
            stat2Number: data.stat2Number || 0,
            stat2Label: data.stat2Label || '',
            stat3Number: data.stat3Number || 0,
            stat3Label: data.stat3Label || '',
            ctaLabel: data.ctaLabel || '',
            ctaUrl: data.ctaUrl || '',
          })
        } else {
          setError('Sayfa bulunamadı')
        }
      } catch (err) {
        setError('Sayfa yüklenirken bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchPage()
    }
  }, [slug])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'imageUrl' | 'image2Url' | 'breadcrumbImageUrl' = 'imageUrl') => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

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
    setSaving(true)

    try {
      const response = await fetch(`/api/company-pages/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/admin/company-pages')
      } else {
        setError(data.error || 'Sayfa güncellenirken bir hata oluştu')
        setSaving(false)
      }
    } catch (err) {
      setError('Sayfa güncellenirken bir hata oluştu')
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
            {slug === 'home-about' ? 'Ana Sayfa Hakkımızda Bölümü' : 'Kurumsal Sayfa Düzenle'}
          </h1>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'var(--admin-gray-600)', 
            margin: 0 
          }}>
            Sayfa bilgilerini güncelleyin
          </p>
        </div>
        <Link
          href="/admin/company-pages"
          className="admin-btn admin-btn-secondary"
        >
          Geri Dön
        </Link>
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
                rows={6}
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
              {formData.breadcrumbImageUrl && (
                <input
                  type="text"
                  name="breadcrumbImageUrl"
                  value={formData.breadcrumbImageUrl}
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
                Breadcrumb bölümünde arka plan olarak gösterilecek görsel. Maksimum 5MB, JPG, PNG, GIF, WebP formatları desteklenir
              </small>
            </div>

            {(slug === 'home-about' || slug === 'hakkimizda') && (
              <>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: 'var(--admin-gray-900)'
                  }}>
                    Görsel
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
                    İkinci Görsel (Sağ Alt)
                  </label>
                  {formData.image2Url && (
                    <div style={{ marginBottom: '1rem' }}>
                      <img 
                        src={formData.image2Url} 
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
                    onChange={(e) => handleFileUpload(e, 'image2Url')}
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
                  {formData.image2Url && (
                    <input
                      type="text"
                      name="image2Url"
                      value={formData.image2Url}
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
                    About-four bölümünde sağ altta gösterilecek ikinci görsel. Maksimum 5MB, JPG, PNG, GIF, WebP formatları desteklenir
                  </small>
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
              </>
            )}
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
              href="/admin/company-pages"
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

