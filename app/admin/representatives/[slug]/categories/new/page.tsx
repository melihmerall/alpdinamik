"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const repSlug = params.slug as string;
  const [representative, setRepresentative] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    breadcrumbImageUrl: '',
    order: 0,
    isActive: true,
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRepresentative();
  }, [repSlug]);

  const fetchRepresentative = async () => {
    const res = await fetch(`/api/representatives/${repSlug}`);
    if (res.ok) {
      const data = await res.json();
      setRepresentative(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/representatives/${repSlug}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push(`/admin/representatives/${repSlug}/categories`);
      } else {
        alert('Kategori eklenemedi');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate slug from name
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

  return (
    <div className="admin-content">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Yeni Kategori Ekle</h1>
          <p className="admin-subtitle">
            {representative?.name || repSlug} - Yeni Ürün Kategorisi
          </p>
        </div>
        <Link href={`/admin/representatives/${repSlug}/categories`} className="admin-btn-secondary">
          ← Geri Dön
        </Link>
      </div>

      <div className="admin-card">
        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="admin-label">
                Kategori Adı <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="text"
                className="admin-input"
                placeholder="Örn: Vidalı Krikolar"
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
                placeholder="vidali-krikolar"
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
                placeholder="Kategori açıklaması..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="admin-label">Breadcrumb Arka Plan Görseli</label>
              <input
                type="file"
                className="admin-input"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploading(true);
                  try {
                    const uploadFormData = new FormData();
                    uploadFormData.append('file', file);
                    uploadFormData.append('folder', 'categories');
                    const res = await fetch('/api/upload', {
                      method: 'POST',
                      body: uploadFormData,
                    });
                    const data = await res.json();
                    if (res.ok) {
                      setFormData({ ...formData, breadcrumbImageUrl: data.url });
                    }
                  } catch (error) {
                    console.error('Upload error:', error);
                  } finally {
                    setUploading(false);
                  }
                }}
                disabled={uploading}
              />
              {formData.breadcrumbImageUrl && (
                <div style={{ marginTop: '0.5rem' }}>
                  <img src={formData.breadcrumbImageUrl} alt="Preview" style={{ maxWidth: '200px', borderRadius: '8px' }} />
                </div>
              )}
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
            <Link href={`/admin/representatives/${repSlug}/categories`} className="admin-btn-secondary">
              İptal
            </Link>
            <button type="submit" className="admin-btn-primary" disabled={loading || uploading}>
              {loading || uploading ? 'Kaydediliyor...' : 'Kategori Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

