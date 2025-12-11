"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const params = useParams();
  const repSlug = params.slug as string;
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [availableSeries, setAvailableSeries] = useState<any[]>([]);
  const [availableVariants, setAvailableVariants] = useState<any[]>([]);
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
  });

  useEffect(() => {
    fetchCategories();
  }, [repSlug]);

  useEffect(() => {
    if (selectedCategoryId) {
      const category = categories.find((c) => c.id === selectedCategoryId);
      setAvailableSeries(category?.series || []);
      setFormData((prev) => ({ ...prev, seriesId: '', variantId: '' }));
      setAvailableVariants([]);
    } else {
      setAvailableSeries([]);
      setAvailableVariants([]);
    }
  }, [selectedCategoryId, categories]);

  useEffect(() => {
    if (formData.seriesId) {
      fetchVariants(formData.seriesId);
    } else {
      setAvailableVariants([]);
      setFormData((prev) => ({ ...prev, variantId: '' }));
    }
  }, [formData.seriesId]);

  const fetchVariants = async (seriesId: string) => {
    try {
      const res = await fetch(`/api/series/${seriesId}/variants`);
      if (res.ok) {
        const data = await res.json();
        setAvailableVariants(data);
      }
    } catch (error) {
      console.error('Error fetching variants:', error);
      setAvailableVariants([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`/api/representatives/${repSlug}/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (value: string) => {
    setFormData({
      ...formData,
      name: value,
      slug: generateSlug(value),
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('folder', 'products');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();

      if (response.ok) {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: data.url,
        }));
      } else {
        alert(data.error || 'Dosya yüklenirken hata oluştu');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Dosya yüklenirken hata oluştu');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/representatives/${repSlug}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          seriesId: formData.seriesId || null,
          variantId: formData.variantId || null,
        }),
      });

      if (res.ok) {
        const product = await res.json();
        
        // Upload selected images
        if (selectedImages.length > 0) {
          setUploadingImages(true);
          try {
            for (let i = 0; i < selectedImages.length; i++) {
              const file = selectedImages[i];
              const uploadFormData = new FormData();
              uploadFormData.append('file', file);
              uploadFormData.append('folder', 'products');

              const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: uploadFormData,
              });

              const uploadData = await uploadRes.json();

              if (uploadRes.ok) {
                await fetch(`/api/representatives/${repSlug}/products/${product.slug}/images`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    imageUrl: uploadData.url,
                    alt: formData.name,
                    order: i,
                  }),
                });
              }
            }
          } catch (error) {
            console.error('Error uploading images:', error);
          } finally {
            setUploadingImages(false);
          }
        }

        router.push(`/admin/representatives/${repSlug}/products`);
      } else {
        alert('Ürün eklenemedi');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-content">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Yeni Ürün Ekle</h1>
          <p className="admin-subtitle">{repSlug} - Yeni Ürün</p>
        </div>
        <Link href={`/admin/representatives/${repSlug}/products`} className="admin-btn-secondary">
          ← Geri Dön
        </Link>
      </div>

      <div className="admin-card">
        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="admin-label">
                Ürün Adı <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="text"
                className="admin-input"
                placeholder="Örn: VKT5-VH-S Vidalı Kriko"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
            </div>

            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="admin-label">Slug (URL)</label>
              <input
                type="text"
                className="admin-input"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
              <small className="admin-help-text">Otomatik oluşturulur</small>
            </div>

            {categories.length === 0 ? (
              <div className="admin-card" style={{ 
                gridColumn: '1 / -1', 
                background: '#fff3cd', 
                border: '1px solid #ffc107',
                padding: '1.5rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                  <strong>Kategori/Seri Bulunamadı</strong>
                </div>
                <p style={{ margin: '0.5rem 0', color: '#856404' }}>
                  Ürün eklemek için önce kategori ve seri oluşturmanız gerekiyor.
                </p>
                <Link
                  href={`/admin/representatives/${repSlug}/categories`}
                  className="admin-btn-primary"
                  style={{ marginTop: '1rem', display: 'inline-block' }}
                >
                  📁 Kategorileri Yönet
                </Link>
              </div>
            ) : (
              <>
                <div className="admin-form-group">
                  <label className="admin-label">Kategori</label>
                  <select
                    className="admin-select"
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                  >
                    <option value="">Kategori Seçiniz (Opsiyonel)</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <small className="admin-help-text">
                    Kategori seçtiğinizde seriler yüklenecektir
                  </small>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Seri</label>
                  <select
                    className="admin-select"
                    value={formData.seriesId}
                    onChange={(e) => setFormData({ ...formData, seriesId: e.target.value, variantId: '' })}
                    disabled={!selectedCategoryId || availableSeries.length === 0}
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
                    <small className="admin-help-text" style={{ color: '#dc3545' }}>
                      Bu kategoride seri yok. <Link href={`/admin/representatives/${repSlug}/categories`} style={{ textDecoration: 'underline' }}>Seri ekleyin</Link>
                    </small>
                  )}
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Varyant (Alt Seri)</label>
                  <select
                    className="admin-select"
                    value={formData.variantId}
                    onChange={(e) => setFormData({ ...formData, variantId: e.target.value })}
                    disabled={!formData.seriesId || availableVariants.length === 0}
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
                    <small className="admin-help-text" style={{ color: '#6c757d' }}>
                      Bu seride varyant yok. Varyant eklemek için <Link href={`/admin/representatives/${repSlug}/categories/${selectedCategoryId}/series/${formData.seriesId}/variants`} style={{ textDecoration: 'underline' }}>tıklayın</Link>
                    </small>
                  )}
                  <small className="admin-help-text">
                    Ürünü doğrudan seriye veya bir varyanta ekleyebilirsiniz
                  </small>
                </div>
              </>
            )}

            <div className="admin-form-group">
              <label className="admin-label">Maksimum Kapasite</label>
              <input
                type="text"
                className="admin-input"
                placeholder="Örn: 5 kN"
                value={formData.maxCapacity}
                onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Teknik PDF URL</label>
              <input
                type="url"
                className="admin-input"
                placeholder="https://..."
                value={formData.technicalPdfUrl}
                onChange={(e) => setFormData({ ...formData, technicalPdfUrl: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">2D Dosya/Fotoğraf</label>
              <input
                type="file"
                className="admin-input"
                onChange={(e) => handleFileUpload(e, 'file2dUrl')}
                accept=".pdf,.zip,.rar,.7z,.dwg,.dxf,.x_t,image/*"
                disabled={uploading}
              />
              <small className="admin-help-text">
                PDF, ZIP, RAR, DWG, DXF, X_T veya görsel dosyası yükleyebilirsiniz
              </small>
              {formData.file2dUrl && (
                <div style={{ marginTop: '0.5rem' }}>
                  <a href={formData.file2dUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'underline' }}>
                    Mevcut dosya: {formData.file2dUrl.split('/').pop()}
                  </a>
                  <input
                    type="text"
                    className="admin-input"
                    style={{ marginTop: '0.5rem' }}
                    placeholder="Veya URL girin"
                    value={formData.file2dUrl}
                    onChange={(e) => setFormData({ ...formData, file2dUrl: e.target.value })}
                  />
                </div>
              )}
            </div>

            <div className="admin-form-group">
              <label className="admin-label">3D Dosya/Fotoğraf</label>
              <input
                type="file"
                className="admin-input"
                onChange={(e) => handleFileUpload(e, 'file3dUrl')}
                accept=".pdf,.zip,.rar,.7z,.dwg,.dxf,.x_t,image/*"
                disabled={uploading}
              />
              <small className="admin-help-text">
                PDF, ZIP, RAR, DWG, DXF, X_T veya görsel dosyası yükleyebilirsiniz
              </small>
              {formData.file3dUrl && (
                <div style={{ marginTop: '0.5rem' }}>
                  <a href={formData.file3dUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'underline' }}>
                    Mevcut dosya: {formData.file3dUrl.split('/').pop()}
                  </a>
                  <input
                    type="text"
                    className="admin-input"
                    style={{ marginTop: '0.5rem' }}
                    placeholder="Veya URL girin"
                    value={formData.file3dUrl}
                    onChange={(e) => setFormData({ ...formData, file3dUrl: e.target.value })}
                  />
                </div>
              )}
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Üretici Sitesi URL</label>
              <input
                type="url"
                className="admin-input"
                value={formData.externalProductUrl}
                onChange={(e) => setFormData({ ...formData, externalProductUrl: e.target.value })}
                placeholder="https://www.manufacturer.com/product/..."
              />
              <small className="admin-help-text">
                Üretici firmanın resmi sitesindeki ürün sayfası URL'i. Doluysa "Üretici Sitesinde Gör" butonu görünecektir.
              </small>
            </div>

            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="admin-label">Kısa Açıklama</label>
              <textarea
                className="admin-textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="admin-label">Detaylı Açıklama (Body)</label>
              <textarea
                className="admin-textarea"
                rows={6}
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Ana Ürün Görseli</label>
              <input
                type="file"
                className="admin-input"
                onChange={(e) => handleFileUpload(e, 'imageUrl')}
                accept="image/*"
                disabled={uploading}
              />
              {formData.imageUrl && (
                <div style={{ marginTop: '0.5rem' }}>
                  <img src={formData.imageUrl} alt="Preview" style={{ maxWidth: '200px', borderRadius: '8px' }} />
                </div>
              )}
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Ürün Bilgisi Fotoğrafı</label>
              <input
                type="file"
                className="admin-input"
                onChange={(e) => handleFileUpload(e, 'infoImageUrl')}
                accept="image/*"
                disabled={uploading}
              />
              <small className="admin-help-text">
                "ÜRÜN BİLGİSİ" başlığı altında gösterilecek fotoğraf
              </small>
              {formData.infoImageUrl && (
                <div style={{ marginTop: '0.5rem' }}>
                  <img src={formData.infoImageUrl} alt="Preview" style={{ maxWidth: '200px', borderRadius: '8px' }} />
                </div>
              )}
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Breadcrumb Arka Plan Görseli</label>
              <input
                type="file"
                className="admin-input"
                onChange={(e) => handleFileUpload(e, 'breadcrumbImageUrl')}
                accept="image/*"
                disabled={uploading}
              />
              <small className="admin-help-text">
                Breadcrumb bölümünde arka plan olarak gösterilecek görsel
              </small>
              {formData.breadcrumbImageUrl && (
                <div style={{ marginTop: '0.5rem' }}>
                  <img src={formData.breadcrumbImageUrl} alt="Preview" style={{ maxWidth: '200px', borderRadius: '8px' }} />
                </div>
              )}
            </div>

            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="admin-label">Ürün Fotoğrafları (Galeri)</label>
              <div style={{ 
                border: '2px dashed #d1d5db', 
                borderRadius: '8px', 
                padding: '1.5rem',
                background: '#f9fafb'
              }}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    setSelectedImages(files)
                    const previews = files.map(file => URL.createObjectURL(file))
                    setImagePreviews(previews)
                  }}
                  disabled={uploadingImages}
                  style={{ display: 'none' }}
                  id="product-images-upload-new"
                />
                <label
                  htmlFor="product-images-upload-new"
                  style={{
                    display: 'inline-block',
                    padding: '0.75rem 1.5rem',
                    background: uploadingImages ? '#ccc' : '#007bff',
                    color: '#fff',
                    borderRadius: '8px',
                    cursor: uploadingImages ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    marginBottom: '1rem'
                  }}
                >
                  {uploadingImages ? 'Yükleniyor...' : '+ Fotoğraf Seç'}
                </label>
                <small style={{ display: 'block', marginTop: '0.5rem', color: '#6c757d', fontSize: '0.875rem' }}>
                  Birden fazla fotoğraf seçebilirsiniz. Ürün kaydedildikten sonra otomatik yüklenecektir.
                </small>

                {imagePreviews.length > 0 && (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
                    gap: '1rem',
                    marginTop: '1.5rem'
                  }}>
                    {imagePreviews.map((preview, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '120px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = selectedImages.filter((_, i) => i !== index)
                            const newPreviews = imagePreviews.filter((_, i) => i !== index)
                            setSelectedImages(newImages)
                            setImagePreviews(newPreviews)
                          }}
                          style={{
                            position: 'absolute',
                            top: '0.25rem',
                            right: '0.25rem',
                            background: '#dc3545',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Sıra</label>
              <input
                type="number"
                className="admin-input"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Durum</label>
              <select
                className="admin-select"
                value={formData.isActive ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
              >
                <option value="true">Aktif</option>
                <option value="false">Pasif</option>
              </select>
            </div>
          </div>

          <div className="admin-form-actions">
            <Link href={`/admin/representatives/${repSlug}/products`} className="admin-btn-secondary">
              İptal
            </Link>
            <button type="submit" className="admin-btn-primary" disabled={loading || uploading}>
              {loading ? 'Kaydediliyor...' : 'Ürün Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
