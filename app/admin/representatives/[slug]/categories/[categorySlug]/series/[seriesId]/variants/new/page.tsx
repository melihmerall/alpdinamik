"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewVariantPage() {
  const params = useParams();
  const router = useRouter();
  const repSlug = params.slug as string;
  const categorySlug = params.categorySlug as string;
  const seriesId = params.seriesId as string;
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
    order: 0,
    isActive: true,
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("folder", "variants");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Dosya yüklenirken hata oluştu");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Dosya yüklenirken bir hata oluştu");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/series/${seriesId}/variants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          order: parseInt(formData.order.toString()) || 0,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Varyant başarıyla oluşturuldu!');
        router.push(`/admin/representatives/${repSlug}/categories/${categorySlug}/series/${seriesId}/variants`);
        router.refresh();
      } else {
        setError(data.error || "Varyant oluşturulurken hata oluştu");
        alert(data.error || "Varyant oluşturulurken hata oluştu");
      }
    } catch (error: any) {
      console.error("Error creating variant:", error);
      setError("Varyant oluşturulurken hata oluştu: " + error.message);
      alert("Varyant oluşturulurken hata oluştu: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-content">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Yeni Varyant Ekle</h1>
          <p className="admin-subtitle">Seri altına yeni bir varyant ekleyin</p>
        </div>
        <Link
          href={`/admin/representatives/${repSlug}/categories/${categorySlug}/series/${seriesId}/variants`}
          className="admin-btn-secondary"
        >
          ← Geri Dön
        </Link>
      </div>

      {error && (
        <div className="admin-card" style={{ 
          background: "#fee2e2", 
          border: "1px solid #fecaca",
          color: "#991b1b",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1.5rem"
        }}>
          {error}
        </div>
      )}

      <div className="admin-card">
        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="admin-label">
                Varyant Adı <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="text"
                className="admin-input"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData({ 
                    ...formData, 
                    name,
                    slug: formData.slug || name
                      .toLowerCase()
                      .replace(/ğ/g, 'g')
                      .replace(/ü/g, 'u')
                      .replace(/ş/g, 's')
                      .replace(/ı/g, 'i')
                      .replace(/ö/g, 'o')
                      .replace(/ç/g, 'c')
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/^-+|-+$/g, '')
                  });
                }}
                required
                placeholder="Örn: VKT-VH-S (Mil Hareketli)"
              />
            </div>

            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="admin-label">Slug</label>
              <input
                type="text"
                className="admin-input"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="vkt-vh-s"
              />
              <p className="admin-help-text">URL için kullanılacak benzersiz tanımlayıcı</p>
            </div>

            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="admin-label">Açıklama</label>
              <textarea
                className="admin-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="Varyant hakkında açıklama..."
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Görsel</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="admin-input"
              />
              {uploading && <p className="admin-help-text">Yükleniyor...</p>}
              {formData.imageUrl && (
                <div className="admin-image-preview" style={{ marginTop: '1rem' }}>
                  <img src={formData.imageUrl} alt="Preview" style={{ maxWidth: '200px', borderRadius: '8px' }} />
                </div>
              )}
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Sıralama</label>
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
            <Link
              href={`/admin/representatives/${repSlug}/categories/${categorySlug}/series/${seriesId}/variants`}
              className="admin-btn-secondary"
            >
              İptal
            </Link>
            <button
              type="submit"
              className="admin-btn-primary"
              disabled={saving || uploading}
            >
              {saving ? 'Kaydediliyor...' : 'Varyant Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
