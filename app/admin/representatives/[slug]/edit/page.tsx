"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditRepresentative() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    logoUrl: "",
    websiteUrl: "",
    breadcrumbImageUrl: "",
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    fetchRepresentative();
  }, [slug]);

  const fetchRepresentative = async () => {
    try {
      const response = await fetch(`/api/representatives/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.name || "",
          slug: data.slug || "",
          description: data.description || "",
          logoUrl: data.logoUrl || "",
          websiteUrl: data.websiteUrl || "",
          breadcrumbImageUrl: data.breadcrumbImageUrl || "",
          isActive: data.isActive !== undefined ? data.isActive : true,
          order: data.order || 0,
        });
      } else {
        setError("Temsilcilik bulunamadı");
      }
    } catch (error) {
      console.error("Error fetching representative:", error);
      setError("Veri yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("folder", "representatives");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({ ...prev, [fieldName]: data.url }));
      } else {
        const error = await response.json();
        alert(error.error || "Dosya yüklenirken hata oluştu");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Dosya yüklenirken hata oluştu");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      console.log('Updating representative:', slug, formData);
      const response = await fetch(`/api/representatives/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          order: parseInt(formData.order.toString()) || 0,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Temsilcilik başarıyla güncellendi!');
        router.push("/admin/representatives");
        router.refresh();
      } else {
        console.error('Update error:', data);
        setError(data.error || "Temsilcilik güncellenirken hata oluştu");
        alert(data.error || "Temsilcilik güncellenirken hata oluştu");
      }
    } catch (error: any) {
      console.error("Error updating representative:", error);
      setError("Temsilcilik güncellenirken hata oluştu: " + error.message);
      alert("Temsilcilik güncellenirken hata oluştu: " + error.message);
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
          <h1 className="admin-title">Temsilcilik Düzenle</h1>
          <p className="admin-subtitle">{formData.name || slug}</p>
        </div>
        <Link href="/admin/representatives" className="admin-btn-secondary">
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
                Firma Adı <span style={{ color: '#dc3545' }}>*</span>
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
              <label className="admin-label">
                Slug (URL) <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="text"
                className="admin-input"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
              <small className="admin-help-text">
                URL'de kullanılacak benzersiz tanımlayıcı
              </small>
            </div>

            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="admin-label">Açıklama</label>
              <textarea
                className="admin-textarea"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Logo</label>
              <input
                type="file"
                className="admin-input"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'logoUrl')}
                disabled={uploading}
              />
              {uploading && <p className="admin-help-text">Yükleniyor...</p>}
              {formData.logoUrl && (
                <div className="admin-image-preview" style={{ marginTop: '0.75rem' }}>
                  <img
                    src={formData.logoUrl}
                    alt="Logo Preview"
                  />
                </div>
              )}
              <small className="admin-help-text">
                Firma logosu (PNG, JPG, WebP - Maks. 5MB)
              </small>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Breadcrumb Arka Plan Görseli</label>
              <input
                type="file"
                className="admin-input"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'breadcrumbImageUrl')}
                disabled={uploading}
              />
              {formData.breadcrumbImageUrl && (
                <div className="admin-image-preview" style={{ marginTop: '0.75rem' }}>
                  <img
                    src={formData.breadcrumbImageUrl}
                    alt="Breadcrumb Preview"
                  />
                </div>
              )}
              <small className="admin-help-text">
                Temsilcilik sayfası breadcrumb arka plan görseli
              </small>
            </div>

            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="admin-label">Website URL</label>
              <input
                type="url"
                className="admin-input"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                placeholder="https://example.com"
              />
              <small className="admin-help-text">
                Firma web sitesi URL'i (opsiyonel)
              </small>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Sıralama</label>
              <input
                type="number"
                className="admin-input"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                min="0"
              />
              <small className="admin-help-text">
                Menüde görünme sırası (düşük sayı önce görünür)
              </small>
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
              <small className="admin-help-text">
                Pasif temsilcilikler menüde görünmez
              </small>
            </div>
          </div>

          <div className="admin-form-actions">
            <Link href="/admin/representatives" className="admin-btn-secondary">
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
