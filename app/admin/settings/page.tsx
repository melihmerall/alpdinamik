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
    mapEmbedUrl: '',
    siteName: '',
    siteDescription: '',
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPassword: '',
    smtpSecure: true,
    contactEmail: '',
    kvkkText: '',
    contactFormTitle: '',
    contactFormSubtitle: '',
    contactFormNote: '',
    faviconUrl: '',
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
          mapEmbedUrl: data.mapEmbedUrl || '',
          siteName: data.siteName || '',
          siteDescription: data.siteDescription || '',
          smtpHost: data.smtpHost || '',
          smtpPort: data.smtpPort?.toString() || '',
          smtpUser: data.smtpUser || '',
          smtpPassword: data.smtpPassword || '',
          smtpSecure: data.smtpSecure !== false,
          contactEmail: data.contactEmail || '',
          kvkkText: data.kvkkText || '',
          contactFormTitle: data.contactFormTitle || '',
          contactFormSubtitle: data.contactFormSubtitle || '',
          contactFormNote: data.contactFormNote || '',
          faviconUrl: data.faviconUrl || '',
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
      
      // Extract URL from iframe if user pasted full iframe code
      let mapEmbedUrl = formData.mapEmbedUrl || null;
      if (mapEmbedUrl && mapEmbedUrl.includes('<iframe')) {
        // Extract src from iframe tag
        const srcMatch = mapEmbedUrl.match(/src=["']([^"']+)["']/);
        if (srcMatch) {
          mapEmbedUrl = srcMatch[1];
          console.log('Extracted map URL from iframe:', mapEmbedUrl);
        }
      }
      
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
        mapEmbedUrl: mapEmbedUrl,
        siteName: formData.siteName || null,
        siteDescription: formData.siteDescription || null,
        smtpHost: formData.smtpHost || null,
        smtpPort: formData.smtpPort ? parseInt(formData.smtpPort.toString()) : null,
        smtpUser: formData.smtpUser || null,
        smtpPassword: formData.smtpPassword || null,
        smtpSecure: formData.smtpSecure,
        contactEmail: formData.contactEmail || null,
        kvkkText: formData.kvkkText || null,
        contactFormTitle: formData.contactFormTitle || null,
        contactFormSubtitle: formData.contactFormSubtitle || null,
        contactFormNote: formData.contactFormNote || null,
        faviconUrl: formData.faviconUrl || null,
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
            {/* Favicon */}
            <div>
              <h2 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: 'var(--admin-gray-900)',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid var(--admin-gray-200)'
              }}>
                Favicon
              </h2>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  color: 'var(--admin-gray-900)'
                }}>
                  Favicon Görseli
                </label>
                {formData.faviconUrl && (
                  <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img 
                      src={formData.faviconUrl} 
                      alt="Favicon Preview" 
                      style={{ 
                        width: '32px', 
                        height: '32px',
                        borderRadius: '4px',
                        objectFit: 'contain'
                      }} 
                    />
                    <span style={{ fontSize: '0.875rem', color: 'var(--admin-gray-600)' }}>
                      Tarayıcı sekmesinde görünecek ikon
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'faviconUrl')}
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
                {formData.faviconUrl && (
                  <input
                    type="text"
                    name="faviconUrl"
                    value={formData.faviconUrl}
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
                  Site favicon'u. Önerilen boyut: 32x32px veya 16x16px. Maksimum 1MB, ICO, PNG formatları desteklenir
                </small>
              </div>
            </div>

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
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: 'var(--admin-gray-900)'
                  }}>
                    Google Maps Embed URL
                  </label>
                  <textarea
                    name="mapEmbedUrl"
                    value={formData.mapEmbedUrl}
                    onChange={handleChange}
                    rows={3}
                    placeholder="https://www.google.com/maps/embed?pb=..."
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
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: 'var(--admin-gray-600)', 
                    marginTop: '0.5rem' 
                  }}>
                    Google Maps'ten "Haritayı paylaş" > "Haritayı yerleştir" seçeneğinden embed URL'ini kopyalayın.<br/>
                    <strong>Not:</strong> Eğer iframe kodunun tamamını yapıştırdıysanız, sadece src="..." içindeki URL'yi kullanın.
                  </p>
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

            {/* SMTP Settings */}
            <div>
              <h2 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: 'var(--admin-gray-900)',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid var(--admin-gray-200)'
              }}>
                SMTP Ayarları (E-posta Gönderimi)
              </h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: 'var(--admin-gray-900)'
                  }}>
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    name="smtpHost"
                    value={formData.smtpHost}
                    onChange={handleChange}
                    placeholder="melihmeral.dev"
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '500',
                      color: 'var(--admin-gray-900)'
                    }}>
                      SMTP Port
                    </label>
                    <input
                      type="number"
                      name="smtpPort"
                      value={formData.smtpPort}
                      onChange={handleChange}
                      placeholder="465"
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
                  <div style={{ display: 'flex', alignItems: 'center', paddingTop: '2rem' }}>
                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={formData.smtpSecure}
                        onChange={(e) => setFormData(prev => ({ ...prev, smtpSecure: e.target.checked }))}
                      />
                      <span>SSL/TLS Kullan</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: 'var(--admin-gray-900)'
                  }}>
                    SMTP Kullanıcı Adı
                  </label>
                  <input
                    type="text"
                    name="smtpUser"
                    value={formData.smtpUser}
                    onChange={handleChange}
                    placeholder="coder@melihmeral.dev"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--admin-gray-300)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'inherit'
                    }}
                  />
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: 'var(--admin-gray-600)', 
                    marginTop: '0.5rem' 
                  }}>
                    SMTP sunucusuna bağlanmak için kullanılacak e-posta adresi (örn: coder@melihmeral.dev)
                  </p>
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: 'var(--admin-gray-900)'
                  }}>
                    SMTP Şifre
                  </label>
                  <input
                    type="password"
                    name="smtpPassword"
                    value={formData.smtpPassword}
                    onChange={handleChange}
                    placeholder="SMTP şifresi"
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
                    İletişim Formu E-posta Adresi
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="alpdinamik@alpdinamik.com.tr"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--admin-gray-300)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'inherit'
                    }}
                  />
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: 'var(--admin-gray-600)', 
                    marginTop: '0.5rem' 
                  }}>
                    İletişim formundan gelen mesajlar bu adrese gönderilecektir.
                  </p>
                </div>
              </div>
            </div>

            {/* KVKK Settings */}
            <div>
              <h2 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: 'var(--admin-gray-900)',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid var(--admin-gray-200)'
              }}>
                KVKK Metni
              </h2>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  color: 'var(--admin-gray-900)'
                }}>
                  KVKK Aydınlatma Metni
                </label>
                <textarea
                  name="kvkkText"
                  value={formData.kvkkText}
                  onChange={handleChange}
                  rows={15}
                  placeholder="KVKK aydınlatma metnini buraya yazın..."
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
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: 'var(--admin-gray-600)', 
                  marginTop: '0.5rem' 
                }}>
                  Bu metin iletişim formunda KVKK modalında gösterilecektir. Boş bırakılırsa varsayılan metin gösterilir.
                </p>
              </div>
            </div>

            {/* İletişim Formu Metinleri */}
            <div style={{
              background: 'var(--admin-white)',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: 'var(--admin-gray-900)',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid var(--admin-gray-200)'
              }}>
                İletişim Formu Metinleri
              </h2>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: 'var(--admin-gray-900)'
                  }}>
                    Form Başlığı
                  </label>
                  <input
                    type="text"
                    name="contactFormTitle"
                    value={formData.contactFormTitle}
                    onChange={handleChange}
                    placeholder="Projenizi paylaşın"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--admin-gray-300)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'inherit'
                    }}
                  />
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--admin-gray-600)',
                    marginTop: '0.5rem'
                  }}>
                    Footer üstündeki iletişim formunun başlığı
                  </p>
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: 'var(--admin-gray-900)'
                  }}>
                    Form Alt Başlığı
                  </label>
                  <textarea
                    name="contactFormSubtitle"
                    value={formData.contactFormSubtitle}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Kısa formu doldurun; en geç 2 iş saati içinde CAD veya teklif dosya paylaşımı için dönüş."
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
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--admin-gray-600)',
                    marginTop: '0.5rem'
                  }}>
                    Form başlığının altında gösterilecek açıklama metni
                  </p>
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: 'var(--admin-gray-900)'
                  }}>
                    Form Notu
                  </label>
                  <textarea
                    name="contactFormNote"
                    value={formData.contactFormNote}
                    onChange={handleChange}
                    rows={2}
                    placeholder="CAD & FEM doğrulama gerektiren taleplerde örnek çizim eklemek süreci hızlandırır."
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
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--admin-gray-600)',
                    marginTop: '0.5rem'
                  }}>
                    Form altında gösterilecek bilgilendirme notu
                  </p>
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

