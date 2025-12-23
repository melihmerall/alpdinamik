"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Document = {
  id: string;
  title: string;
  imageUrl?: string | null;
  pdfUrl: string;
  order: number;
  isActive: boolean;
};

const emptyForm: Omit<Document, "id"> & {
  order: string;
} = {
  title: "",
  imageUrl: "",
  pdfUrl: "",
  order: "0",
  isActive: true,
};

export default function AdminDocumentsPage() {
  const [items, setItems] = useState<Document[]>([]);
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
        const res = await fetch("/api/documents?all=true");
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'imageUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('folder', 'documents');

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

  const handleEdit = (item: Document) => {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      imageUrl: item.imageUrl || "",
      pdfUrl: item.pdfUrl || "",
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
        imageUrl: form.imageUrl?.trim() || null,
        pdfUrl: form.pdfUrl?.trim(),
        order: parseInt(form.order, 10) || 0,
        isActive: form.isActive,
      };

      const res = await fetch(
        editingId ? `/api/documents/${editingId}` : "/api/documents",
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
    if (!confirm("Bu dökümanı silmek istediğinize emin misiniz?")) {
      return;
    }
    setError(null);
    try {
      const res = await fetch(`/api/documents/${id}`, {
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
            Dökümanlar
          </h1>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'var(--admin-gray-600)', 
            margin: 0 
          }}>
            PDF dökümanlarını ve katalogları yönetin
          </p>
        </div>
        <Link href="/" className="admin-btn admin-btn-secondary">
          Siteye dön
        </Link>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <h2>{editingId ? "Döküman Güncelle" : "Yeni Döküman Ekle"}</h2>
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
                  placeholder="Örn: Teknik Katalog"
                />
              </label>
            </div>

            <div>
              <label>
                Kapak Görseli
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                  <input
                    type="text"
                    name="imageUrl"
                    value={form.imageUrl || ""}
                    onChange={handleChange}
                    placeholder="/uploads/documents/katalog-kapak.jpg"
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
                PDF URL *
                <input
                  type="url"
                  name="pdfUrl"
                  value={form.pdfUrl}
                  onChange={handleChange}
                  required
                  placeholder="https://example.com/katalog.pdf veya /uploads/documents/katalog.pdf"
                />
                <small style={{ color: 'var(--admin-gray-500)', fontSize: '0.875rem' }}>
                  PDF dosyasının tam URL'sini girin. Dosya yükleme için önce dosyayı sunucuya yükleyin.
                </small>
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
            <h2>Mevcut Dökümanlar</h2>
            {loading && <span className="admin-badge">Yükleniyor</span>}
          </div>
          {items.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-state-icon">📄</div>
              <h3 className="admin-empty-state-title">Henüz döküman eklenmemiş</h3>
              <p className="admin-empty-state-description">
                İlk dökümanınızı ekleyerek başlayın
              </p>
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Başlık</th>
                    <th>PDF URL</th>
                    <th>Durum</th>
                    <th>Sıra</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: '500' }}>{item.title}</td>
                      <td style={{ color: 'var(--admin-gray-600)', fontFamily: 'monospace', fontSize: '0.8125rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.pdfUrl}
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
