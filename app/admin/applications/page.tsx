"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Application = {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  body?: string | null;
  imageUrl?: string | null;
  breadcrumbImageUrl?: string | null;
  order: number;
  isActive: boolean;
};

const emptyForm: Omit<Application, "id" | "order" | "isActive"> & {
  order: string;
  isActive: boolean;
} = {
  title: "",
  slug: "",
  summary: "",
  body: "",
  imageUrl: "",
  breadcrumbImageUrl: "",
  order: "0",
  isActive: true,
};

export default function AdminApplicationsPage() {
  const [items, setItems] = useState<Application[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useMemo(
    () => async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/applications?all=true");
        if (!res.ok) {
          throw new Error("Liste alınamadı");
        }
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err?.message || "Bilinmeyen bir hata oluştu");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const generateSlug = (title: string) => {
    return title
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setForm((prev) => {
      const newForm = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      
      // Auto-generate slug from title if slug is empty or title changed
      if (name === "title" && (!prev.slug || prev.slug === generateSlug(prev.title))) {
        newForm.slug = generateSlug(value);
      }
      
      return newForm;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'imageUrl' | 'breadcrumbImageUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('folder', 'applications');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error('Dosya yüklenemedi');
      }

      const data = await response.json();
      setForm((prev) => ({
        ...prev,
        [field]: data.url,
      }));
    } catch (err: any) {
      setError(err?.message || 'Dosya yüklenirken bir hata oluştu');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item: Application) => {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      slug: item.slug || "",
      summary: item.summary || "",
      body: item.body || "",
      imageUrl: item.imageUrl || "",
      breadcrumbImageUrl: item.breadcrumbImageUrl || "",
      order: String(item.order ?? 0),
      isActive: item.isActive,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: form.title?.trim(),
        slug: form.slug?.trim() || generateSlug(form.title),
        summary: form.summary?.trim() || null,
        body: form.body?.trim() || null,
        imageUrl: form.imageUrl?.trim() || null,
        breadcrumbImageUrl: form.breadcrumbImageUrl?.trim() || null,
        order: parseInt(form.order, 10) || 0,
        isActive: form.isActive,
      };

      const res = await fetch(
        editingId ? `/api/applications/${editingId}` : "/api/applications",
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Kaydetme işlemi başarısız");
      }

      await fetchItems();
      resetForm();
    } catch (err: any) {
      setError(err?.message || "Kaydetme işlemi başarısız");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu uygulama bloğunu silmek istediğinize emin misiniz?")) {
      return;
    }
    setError(null);
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Silme işlemi başarısız");
      }
      await fetchItems();
      if (editingId === id) {
        resetForm();
      }
    } catch (err: any) {
      setError(err?.message || "Silme işlemi başarısız");
    }
  };

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
            Uygulamalar
          </h1>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'var(--admin-gray-600)', 
            margin: 0 
          }}>
            Uygulama örneklerini yönetin
          </p>
        </div>
        <Link href="/" className="admin-btn admin-btn-secondary">
          Siteye dön
        </Link>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <h2>{editingId ? "Uygulama Güncelle" : "Yeni Uygulama Ekle"}</h2>
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
          <form onSubmit={handleSubmit} className="admin-form">
            <div>
              <label>
                Başlık *
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="Örn: İki noktadan tek tahrikli kaldırma sistemi"
                />
              </label>
            </div>

            <div>
              <label>
                Slug (URL)
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="Otomatik oluşturulur"
                />
                <small style={{ color: 'var(--admin-gray-500)', fontSize: '0.875rem' }}>
                  Başlıktan otomatik oluşturulur. Özel slug girebilirsiniz.
                </small>
              </label>
            </div>

            <div>
              <label>
                Özet
                <textarea
                  name="summary"
                  value={form.summary || ""}
                  onChange={handleChange}
                  placeholder="Kısa açıklama"
                  rows={3}
                />
              </label>
            </div>

            <div>
              <label>
                Detay (HTML destekler)
                <textarea
                  name="body"
                  value={form.body || ""}
                  onChange={handleChange}
                  placeholder="Detaylı açıklama"
                  rows={6}
                />
              </label>
            </div>

            <div>
              <label>
                Ana Görsel
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                  <input
                    type="text"
                    name="imageUrl"
                    value={form.imageUrl || ""}
                    onChange={handleChange}
                    placeholder="/uploads/applications/lift.png"
                    style={{ flex: 1 }}
                  />
                  <label className="admin-btn admin-btn-secondary" style={{ margin: 0, cursor: 'pointer' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'imageUrl')}
                      style={{ display: 'none' }}
                      disabled={uploading}
                    />
                    {uploading ? 'Yükleniyor...' : 'Yükle'}
                  </label>
                </div>
                {form.imageUrl && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <img 
                      src={form.imageUrl} 
                      alt="Preview" 
                      style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '8px', border: '1px solid var(--admin-gray-200)' }}
                    />
                  </div>
                )}
              </label>
            </div>

            <div>
              <label>
                Breadcrumb Görseli
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                  <input
                    type="text"
                    name="breadcrumbImageUrl"
                    value={form.breadcrumbImageUrl || ""}
                    onChange={handleChange}
                    placeholder="/uploads/applications/breadcrumb.jpg"
                    style={{ flex: 1 }}
                  />
                  <label className="admin-btn admin-btn-secondary" style={{ margin: 0, cursor: 'pointer' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'breadcrumbImageUrl')}
                      style={{ display: 'none' }}
                      disabled={uploading}
                    />
                    {uploading ? 'Yükleniyor...' : 'Yükle'}
                  </label>
                </div>
                {form.breadcrumbImageUrl && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <img 
                      src={form.breadcrumbImageUrl} 
                      alt="Preview" 
                      style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '8px', border: '1px solid var(--admin-gray-200)' }}
                    />
                  </div>
                )}
              </label>
            </div>

            <div className="admin-form__row">
              <label>
                Sıra
                <input
                  type="number"
                  name="order"
                  value={form.order}
                  onChange={handleChange}
                />
              </label>
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                />
                Aktif
              </label>
            </div>

            <div className="admin-form__actions">
              <button type="submit" className="admin-btn admin-btn-primary" disabled={saving || uploading}>
                {saving ? "Kaydediliyor..." : editingId ? "Güncelle" : "Ekle"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={resetForm}
                  disabled={saving || uploading}
                >
                  İptal
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-card">
          <div className="admin-card__header">
            <h2>Mevcut Uygulamalar</h2>
            {loading && <span className="admin-badge">Yükleniyor</span>}
          </div>
          {items.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-state-icon">📱</div>
              <h3 className="admin-empty-state-title">Henüz uygulama eklenmemiş</h3>
              <p className="admin-empty-state-description">
                İlk uygulamanızı ekleyerek başlayın
              </p>
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Başlık</th>
                    <th>Slug</th>
                    <th>Durum</th>
                    <th>Sıra</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: '500' }}>{item.title}</td>
                      <td style={{ color: 'var(--admin-gray-600)', fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                        {item.slug || '-'}
                      </td>
                      <td>
                        {item.isActive ? (
                          <span className="admin-badge admin-badge-success">Aktif</span>
                        ) : (
                          <span className="admin-badge admin-badge-warning">Pasif</span>
                        )}
                      </td>
                      <td>{item.order}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            className="admin-btn admin-btn-secondary admin-btn-sm" 
                            onClick={() => handleEdit(item)}
                          >
                            Düzenle
                          </button>
                          <button
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            onClick={() => handleDelete(item.id)}
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
