"use client"
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const repSlug = params.slug as string
  const productSlug = params.productSlug as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState('')
  const [productImages, setProductImages] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [availableSeries, setAvailableSeries] = useState<any[]>([])
  const [availableVariants, setAvailableVariants] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    body: '',
    imageUrl: '',
    infoImageUrl: '',
    breadcrumbImageUrl: '',
    seriesId: '',
    variantId: '',
    maxCapacity: '',
    technicalPdfUrl: '',
    file2dUrl: '',
    file3dUrl: '',
    externalProductUrl: '',
    order: 0,
    isActive: true,
  })

  useEffect(() => {
    fetchCategories()
  }, [repSlug])

  useEffect(() => {
    if (selectedCategoryId) {
      const category = categories.find((c) => c.id === selectedCategoryId)
      setAvailableSeries(category?.series || [])
    } else {
      setAvailableSeries([])
      setAvailableVariants([])
    }
  }, [selectedCategoryId, categories])

  useEffect(() => {
    if (formData.seriesId) {
      fetchVariants(formData.seriesId)
    } else {
      setAvailableVariants([])
    }
  }, [formData.seriesId])

  const fetchVariants = async (seriesId: string) => {
    try {
      const res = await fetch(`/api/series/${seriesId}/variants`)
      if (res.ok) {
        const data = await res.json()
        setAvailableVariants(data)
      }
    } catch (error) {
      console.error('Error fetching variants:', error)
      setAvailableVariants([])
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch(`/api/representatives/${repSlug}/categories`)
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  useEffect(() => {
    async function fetchProduct() {
      if (categories.length === 0) return // Wait for categories to load
      
      try {
        const [productRes, imagesRes] = await Promise.all([
          fetch(`/api/representatives/${repSlug}/products/${productSlug}`),
          fetch(`/api/representatives/${repSlug}/products/${productSlug}/images`),
        ])
        
        if (productRes.ok) {
          const product = await productRes.json()
          
          // Find category from series
          let categoryId = ''
          if (product.series?.categoryId) {
            categoryId = product.series.categoryId
          } else if (product.series?.category?.id) {
            categoryId = product.series.category.id
          }
          
          setFormData({
            name: product.name || '',
            slug: product.slug || '',
            description: product.description || '',
            body: product.body || '',
            imageUrl: product.imageUrl || '',
            infoImageUrl: product.infoImageUrl || '',
            breadcrumbImageUrl: product.breadcrumbImageUrl || '',
            seriesId: product.seriesId || '',
            variantId: product.variantId || '',
            maxCapacity: product.maxCapacity || '',
            technicalPdfUrl: product.technicalPdfUrl || '',
            file2dUrl: product.file2dUrl || '',
            file3dUrl: product.file3dUrl || '',
            externalProductUrl: product.externalProductUrl || '',
            order: product.order || 0,
            isActive: product.isActive !== undefined ? product.isActive : true,
          })
          
          // Set category and load series/variants
          if (categoryId) {
            setSelectedCategoryId(categoryId)
            const category = categories.find((c) => c.id === categoryId)
            if (category) {
              setAvailableSeries(category.series || [])
              // If product has seriesId, load variants
              if (product.seriesId) {
                setTimeout(() => {
                  fetchVariants(product.seriesId)
                }, 100)
              }
            }
          }
        } else {
          setError('Ürün bulunamadı')
        }

        if (imagesRes.ok) {
          const images = await imagesRes.json()
          setProductImages(images)
        }
      } catch (err) {
        setError('Ürün yüklenirken bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }
    if (repSlug && productSlug && categories.length > 0) {
      fetchProduct()
    }
  }, [repSlug, productSlug, categories])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              name === 'order' ? parseInt(value) || 0 : value
    }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string = 'imageUrl') => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'products')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setFormData(prev => ({
          ...prev,
          [fieldName]: data.url,
        }))
        console.log(`File uploaded successfully to ${fieldName}:`, data.url)
      } else {
        const errorMsg = data.error || 'Dosya yüklenirken bir hata oluştu'
        console.error('Upload error:', errorMsg)
        setError(errorMsg)
        alert(errorMsg) // Kullanıcıya göster
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
      const response = await fetch(`/api/representatives/${repSlug}/products/${productSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          seriesId: formData.seriesId || null,
          variantId: formData.variantId || null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push(`/admin/representatives/${repSlug}/products`)
        router.refresh()
      } else {
        setError(data.error || 'Ürün güncellenirken bir hata oluştu')
      }
    } catch (err) {
      setError('Sunucuya bağlanırken bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p>Yükleniyor...</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <Link 
            href={`/admin/representatives/${repSlug}/products`} 
            className="admin-btn admin-btn-secondary admin-btn-sm"
          >
            ← Geri
          </Link>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--admin-gray-900)', margin: 0 }}>
            Ürün Düzenle
          </h1>
        </div>
      </div>

      <div className="admin-card">
        {error && (
          <div style={{
            padding: '1rem',
            background: '#fee2e2',
            color: '#991b1b',
            borderRadius: '8px',
            marginBottom: '1.5rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--admin-gray-700)' }}>
                Ürün Adı *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--admin-gray-300)',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--admin-gray-700)' }}>
                Slug *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--admin-gray-300)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'monospace'
                }}
              />
            </div>

            {categories.length > 0 && (
              <>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--admin-gray-700)' }}>
                    Kategori
                  </label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => {
                      setSelectedCategoryId(e.target.value)
                      setFormData(prev => ({ ...prev, seriesId: '', variantId: '' }))
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--admin-gray-300)',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="">Kategori Seçiniz (Opsiyonel)</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--admin-gray-500)', fontSize: '0.875rem' }}>
                    Kategori seçtiğinizde seriler yüklenecektir
                  </small>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--admin-gray-700)' }}>
                    Seri
                  </label>
                  <select
                    value={formData.seriesId}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, seriesId: e.target.value, variantId: '' }))
                    }}
                    disabled={!selectedCategoryId || availableSeries.length === 0}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--admin-gray-300)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      opacity: (!selectedCategoryId || availableSeries.length === 0) ? 0.6 : 1
                    }}
                  >
                    <option value="">
                      {!selectedCategoryId
                        ? 'Önce kategori seçiniz'
                        : availableSeries.length === 0
                        ? 'Bu kategoride seri yok'
                        : 'Seri Seçiniz (Opsiyonel)'}
                    </option>
                    {availableSeries.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {selectedCategoryId && availableSeries.length === 0 && (
                    <small style={{ display: 'block', marginTop: '0.5rem', color: '#dc3545', fontSize: '0.875rem' }}>
                      Bu kategoride seri yok. <Link href={`/admin/representatives/${repSlug}/categories`} style={{ textDecoration: 'underline' }}>Seri ekleyin</Link>
                    </small>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--admin-gray-700)' }}>
                    Varyant (Alt Seri)
                  </label>
                  <select
                    value={formData.variantId}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, variantId: e.target.value }))
                    }}
                    disabled={!formData.seriesId || availableVariants.length === 0}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--admin-gray-300)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      opacity: (!formData.seriesId || availableVariants.length === 0) ? 0.6 : 1
                    }}
                  >
                    <option value="">
                      {!formData.seriesId
                        ? 'Önce seri seçiniz'
                        : availableVariants.length === 0
                        ? 'Bu seride varyant yok'
                        : 'Varyant Seçiniz (Opsiyonel)'}
                    </option>
                    {availableVariants.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                  {formData.seriesId && availableVariants.length === 0 && (
                    <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--admin-gray-500)', fontSize: '0.875rem' }}>
                      Bu seride varyant yok. Varyant eklemek için <Link href={`/admin/representatives/${repSlug}/categories/${selectedCategoryId}/series/${formData.seriesId}/variants`} style={{ textDecoration: 'underline' }}>tıklayın</Link>
                    </small>
                  )}
                  <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--admin-gray-500)', fontSize: '0.875rem' }}>
                    Ürünü doğrudan seriye veya bir varyanta ekleyebilirsiniz
                  </small>
                </div>
              </>
            )}

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--admin-gray-700)' }}>
                Kısa Açıklama
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--admin-gray-300)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--admin-gray-700)' }}>
                Detay Açıklama
              </label>
              <textarea
                name="body"
                value={formData.body}
                onChange={handleChange}
                rows={6}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--admin-gray-300)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--admin-gray-700)' }}>
                Ürün Görseli
              </label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
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
                      fontSize: '1rem'
                    }}
                  />
                  {uploading && (
                    <p style={{ marginTop: '0.5rem', color: 'var(--admin-gray-600)', fontSize: '0.875rem' }}>
                      Yükleniyor...
                    </p>
                  )}
                  <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--admin-gray-500)', fontSize: '0.875rem' }}>
                    Maksimum 5MB, JPG, PNG, GIF, WebP formatları desteklenir
                  </small>
                </div>
                {formData.imageUrl && (
                  <div style={{ width: '150px', height: '150px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--admin-gray-300)' }}>
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}
              </div>
              {formData.imageUrl && (
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
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
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--admin-gray-700)' }}>
                Ürün Bilgisi Fotoğrafı
              </label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'infoImageUrl')}
                    disabled={uploading}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--admin-gray-300)',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                  {uploading && (
                    <p style={{ marginTop: '0.5rem', color: 'var(--admin-gray-600)', fontSize: '0.875rem' }}>
                      Yükleniyor...
                    </p>
                  )}
                  <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--admin-gray-500)', fontSize: '0.875rem' }}>
                    "ÜRÜN BİLGİSİ" başlığı altında gösterilecek fotoğraf. Maksimum 5MB, JPG, PNG, GIF, WebP formatları desteklenir
                  </small>
                </div>
                {formData.infoImageUrl && (
                  <div style={{ width: '150px', height: '150px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--admin-gray-300)' }}>
                    <img 
                      src={formData.infoImageUrl} 
                      alt="Preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}
              </div>
              {formData.infoImageUrl && (
                <input
                  type="text"
                  name="infoImageUrl"
                  value={formData.infoImageUrl}
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
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--admin-gray-700)' }}>
                Breadcrumb Arka Plan Görseli
              </label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
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
                      fontSize: '1rem'
                    }}
                  />
                  {uploading && (
                    <p style={{ marginTop: '0.5rem', color: 'var(--admin-gray-600)', fontSize: '0.875rem' }}>
                      Yükleniyor...
                    </p>
                  )}
                  <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--admin-gray-500)', fontSize: '0.875rem' }}>
                    Breadcrumb bölümünde arka plan olarak gösterilecek görsel. Maksimum 5MB, JPG, PNG, GIF, WebP formatları desteklenir
                  </small>
                </div>
                {formData.breadcrumbImageUrl && (
                  <div style={{ width: '150px', height: '150px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--admin-gray-300)' }}>
                    <img 
                      src={formData.breadcrumbImageUrl} 
                      alt="Preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}
              </div>
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
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--admin-gray-700)' }}>
                  Maksimum Kapasite
                </label>
                <input
                  type="text"
                  name="maxCapacity"
                  value={formData.maxCapacity}
                  onChange={handleChange}
                  placeholder="Örn: 5 kN"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--admin-gray-300)',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--admin-gray-700)' }}>
                  Teknik PDF URL
                </label>
                <input
                  type="url"
                  name="technicalPdfUrl"
                  value={formData.technicalPdfUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--admin-gray-300)',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--admin-gray-700)' }}>
                  2D Dosya/Fotoğraf
                </label>
                <input
                  type="file"
                  accept=".pdf,.zip,.rar,.7z,.dwg,.dxf,.x_t,image/*"
                  onChange={(e) => handleFileUpload(e, 'file2dUrl')}
                  disabled={uploading}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--admin-gray-300)',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
                <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--admin-gray-500)', fontSize: '0.875rem' }}>
                  PDF, ZIP, RAR, DWG, DXF, X_T veya görsel dosyası
                </small>
                {formData.file2dUrl && (
                  <input
                    type="text"
                    name="file2dUrl"
                    value={formData.file2dUrl}
                    onChange={handleChange}
                    placeholder="Veya URL girin"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--admin-gray-300)',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      marginTop: '0.5rem',
                      fontFamily: 'monospace'
                    }}
                  />
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--admin-gray-700)' }}>
                  3D Dosya/Fotoğraf
                </label>
                <input
                  type="file"
                  accept=".pdf,.zip,.rar,.7z,.dwg,.dxf,.x_t,image/*"
                  onChange={(e) => handleFileUpload(e, 'file3dUrl')}
                  disabled={uploading}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--admin-gray-300)',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
                <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--admin-gray-500)', fontSize: '0.875rem' }}>
                  PDF, ZIP, RAR, DWG, DXF, X_T veya görsel dosyası
                </small>
                {formData.file3dUrl && (
                  <input
                    type="text"
                    name="file3dUrl"
                    value={formData.file3dUrl}
                    onChange={handleChange}
                    placeholder="Veya URL girin"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--admin-gray-300)',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      marginTop: '0.5rem',
                      fontFamily: 'monospace'
                    }}
                  />
                )}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--admin-gray-700)' }}>
                Üretici Sitesi URL
              </label>
              <input
                type="url"
                name="externalProductUrl"
                value={formData.externalProductUrl}
                onChange={handleChange}
                placeholder="https://www.manufacturer.com/product/..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--admin-gray-300)',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
              <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--admin-gray-500)', fontSize: '0.875rem' }}>
                Üretici firmanın resmi sitesindeki ürün sayfası URL'i. Doluysa "Üretici Sitesinde Gör" butonu görünecektir.
              </small>
            </div>

            {/* Product Images Gallery */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--admin-gray-700)' }}>
                Ürün Fotoğrafları (Galeri)
              </label>
              <div style={{ 
                border: '2px dashed var(--admin-gray-300)', 
                borderRadius: '8px', 
                padding: '1.5rem',
                background: '#f9fafb'
              }}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || [])
                    if (files.length === 0) return

                    setUploadingImage(true)
                    try {
                      for (const file of files) {
                        const uploadFormData = new FormData()
                        uploadFormData.append('file', file)
                        uploadFormData.append('folder', 'products')

                        const uploadRes = await fetch('/api/upload', {
                          method: 'POST',
                          body: uploadFormData,
                        })

                        const uploadData = await uploadRes.json()

                        if (uploadRes.ok) {
                          const imageRes = await fetch(`/api/representatives/${repSlug}/products/${productSlug}/images`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              imageUrl: uploadData.url,
                              alt: formData.name,
                              order: productImages.length,
                            }),
                          })

                          if (imageRes.ok) {
                            const newImage = await imageRes.json()
                            setProductImages([...productImages, newImage])
                          }
                        }
                      }
                    } catch (err) {
                      setError('Fotoğraf yüklenirken hata oluştu')
                    } finally {
                      setUploadingImage(false)
                    }
                  }}
                  disabled={uploadingImage}
                  style={{ display: 'none' }}
                  id="product-images-upload"
                />
                <label
                  htmlFor="product-images-upload"
                  style={{
                    display: 'inline-block',
                    padding: '0.75rem 1.5rem',
                    background: uploadingImage ? '#ccc' : '#007bff',
                    color: '#fff',
                    borderRadius: '8px',
                    cursor: uploadingImage ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    marginBottom: '1rem'
                  }}
                >
                  {uploadingImage ? 'Yükleniyor...' : '+ Fotoğraf Ekle'}
                </label>
                <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--admin-gray-500)', fontSize: '0.875rem' }}>
                  Birden fazla fotoğraf seçebilirsiniz
                </small>

                {productImages.length > 0 && (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                    gap: '1rem',
                    marginTop: '1.5rem'
                  }}>
                    {productImages.map((img, index) => (
                      <div key={img.id} style={{ position: 'relative' }}>
                        <img
                          src={img.imageUrl}
                          alt={img.alt || formData.name}
                          style={{
                            width: '100%',
                            height: '150px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '1px solid var(--admin-gray-300)'
                          }}
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            if (confirm('Bu fotoğrafı silmek istediğinizden emin misiniz?')) {
                              try {
                                const res = await fetch(`/api/product-images/${img.id}`, {
                                  method: 'DELETE',
                                })
                                if (res.ok) {
                                  setProductImages(productImages.filter((i) => i.id !== img.id))
                                }
                              } catch (err) {
                                setError('Fotoğraf silinirken hata oluştu')
                              }
                            }
                          }}
                          style={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '0.5rem',
                            background: '#dc3545',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          ×
                        </button>
                        <div style={{ 
                          fontSize: '0.75rem', 
                          color: 'var(--admin-gray-500)', 
                          marginTop: '0.25rem',
                          textAlign: 'center'
                        }}>
                          Sıra: {img.order}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--admin-gray-700)' }}>
                  Sıra
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  min="0"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--admin-gray-300)',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: '500', color: 'var(--admin-gray-700)' }}>
                    Aktif
                  </span>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                type="submit"
                disabled={saving}
                className="admin-btn admin-btn-primary"
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              <Link 
                href={`/admin/representatives/${repSlug}/products`} 
                className="admin-btn admin-btn-secondary"
              >
                İptal
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

