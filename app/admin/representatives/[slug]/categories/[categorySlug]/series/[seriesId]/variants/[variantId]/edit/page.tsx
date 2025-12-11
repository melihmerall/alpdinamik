"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditVariantPage() {
  const params = useParams();
  const router = useRouter();
  const repSlug = params.slug as string;
  const categorySlug = params.categorySlug as string;
  const seriesId = params.seriesId as string;
  const variantId = params.variantId as string;
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchVariant();
  }, [variantId]);

  const fetchVariant = async () => {
    try {
      const response = await fetch(`/api/variants/${variantId}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.name || "",
          slug: data.slug || "",
          description: data.description || "",
          imageUrl: data.imageUrl || "",
          order: data.order || 0,
          isActive: data.isActive !== undefined ? data.isActive : true,
        });
      } else {
        setError("Varyant bulunamadı");
      }
    } catch (error) {
      console.error("Error fetching variant:", error);
      setError("Veri yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

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
      const response = await fetch(`/api/variants/${variantId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          order: parseInt(formData.order.toString()) || 0,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Varyant başarıyla güncellendi!');
        router.push(`/admin/representatives/${repSlug}/categories/${categorySlug}/series/${seriesId}/variants`);
        router.refresh();
      } else {
        setError(data.error || "Varyant güncellenirken hata oluştu");
        alert(data.error || "Varyant güncellenirken hata oluştu");
      }
    } catch (error: any) {
      console.error("Error updating variant:", error);
      setError("Varyant güncellenirken hata oluştu: " + error.message);
      alert("Varyant güncellenirken hata oluştu: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-content">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-content">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Varyant Düzenle</h1>
          <p className="admin-subtitle">{formData.name || variantId}</p>
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
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="admin-label">Slug</label>
              <input
                type="text"
                className="admin-input"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>

            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="admin-label">Açıklama</label>
              <textarea
                className="admin-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
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
              {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

