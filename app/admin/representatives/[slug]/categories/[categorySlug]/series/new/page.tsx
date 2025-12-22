"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewSeriesPage() {
  const params = useParams();
  const router = useRouter();
  const repSlug = params.slug as string;
  const categorySlug = params.categorySlug as string;
  const [category, setCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    order: 0,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchCategory();
  }, [repSlug, categorySlug]);

  const fetchCategory = async () => {
    const res = await fetch(`/api/representatives/${repSlug}/categories/${categorySlug}`);
    if (res.ok) {
      const data = await res.json();
      setCategory(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/categories/${category.id}/series`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push(`/admin/representatives/${repSlug}/categories/${categorySlug}/series`);
      } else {
        alert('Seri eklenemedi');
      }
    } catch (error) {
      console.error('Error creating series:', error);
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (value: string) => {
    setFormData({
      ...formData,
      name: value,
      slug: value
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''),
    });
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('folder', 'series');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (res.ok && result.url) {
        setFormData((prev) => ({ ...prev, imageUrl: result.url }));
      } else {
        alert(result.error || 'Görsel yüklenemedi');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Görsel yüklenemedi');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="admin-content">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Yeni Seri Ekle</h1>
          <p className="admin-subtitle">{category?.name} - Yeni Ürün Serisi</p>
        </div>
        <Link href={`/admin/representatives/${repSlug}/categories/${categorySlug}/series`} className="admin-btn-secondary">
          ← Geri Dön
        </Link>
      </div>

      <div className="admin-card">
        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="admin-label">
                Seri Adı <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="text"
                className="admin-input"
                placeholder="Örn: VKT Serisi"
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
                placeholder="vkt-serisi"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
              <small className="admin-help-text">
                Otomatik oluşturulur. Özel bir URL istiyorsanız değiştirebilirsiniz.
              </small>
            </div>

            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="admin-label">Açıklama</label>
              <textarea
                className="admin-textarea"
                rows={4}
                placeholder="Seri açıklaması..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="admin-label">Seri Görseli</label>
              {formData.imageUrl && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <img
                    src={formData.imageUrl}
                    alt={formData.name || 'Seri görseli'}
                    style={{
                      width: '240px',
                      height: 'auto',
                      borderRadius: '12px',
                      border: '1px solid rgba(0,0,0,0.1)',
                    }}
                  />
                  <button
                    type="button"
                    className="admin-btn-secondary admin-btn-sm"
                    style={{ marginLeft: '1rem' }}
                    onClick={() => setFormData({ ...formData, imageUrl: '' })}
                  >
                    Görseli Kaldır
                  </button>
                </div>
              )}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <label className="admin-upload-input">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(file);
                      }
                    }}
                    disabled={uploadingImage}
                  />
                  {uploadingImage ? 'Yükleniyor…' : 'Görsel Yükle'}
                </label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Veya doğrudan görsel URL girin"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  style={{ flex: '1 1 260px' }}
                />
              </div>
              <small className="admin-help-text">
                Bu görsel kategori detayında seri kartında gösterilir. 540x400 px önerilir.
              </small>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Sıra</label>
              <input
                type="number"
                className="admin-input"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
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
            <Link href={`/admin/representatives/${repSlug}/categories/${categorySlug}/series`} className="admin-btn-secondary">
              İptal
            </Link>
            <button type="submit" className="admin-btn-primary" disabled={loading}>
              {loading ? 'Kaydediliyor...' : 'Seri Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
