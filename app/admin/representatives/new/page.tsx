"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function generateSlug(text: string): string {
  const trMap: { [key: string]: string } = {
    'ç': 'c', 'Ç': 'c',
    'ğ': 'g', 'Ğ': 'g',
    'ı': 'i', 'İ': 'i',
    'ö': 'o', 'Ö': 'o',
    'ş': 's', 'Ş': 's',
    'ü': 'u', 'Ü': 'u'
  };

  return text
    .split('')
    .map(char => trMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function NewRepresentative() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    logoUrl: "",
    heroImageUrl: "",
    websiteUrl: "",
    breadcrumbImageUrl: "",
    isActive: true,
    order: 0,
  });

  const handleNameChange = (value: string) => {
    setFormData({
      ...formData,
      name: value,
      slug: generateSlug(value),
    });
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: 'logoUrl' | 'breadcrumbImageUrl' | 'heroImageUrl'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
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
      const response = await fetch("/api/representatives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          order: parseInt(formData.order.toString()) || 0,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Temsilcilik başarıyla oluşturuldu!');
        router.push("/admin/representatives");
        router.refresh();
      } else {
        setError(data.error || "Temsil edilen firma eklenirken hata oluştu");
        alert(data.error || "Temsil edilen firma eklenirken hata oluştu");
      }
    } catch (error: any) {
      console.error("Error creating representative:", error);
      setError("Temsil edilen firma eklenirken hata oluştu: " + error.message);
      alert("Temsil edilen firma eklenirken hata oluştu: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-content">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Yeni Temsilcilik Ekle</h1>
          <p className="admin-subtitle">
            Yeni bir temsil edilen firma ekleyin
          </p>
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
                onChange={(e) => handleNameChange(e.target.value)}
                required
                placeholder="Örn: Mecmot"
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
                placeholder="mecmot"
              />
              <small className="admin-help-text">
                URL'de kullanılacak benzersiz tanımlayıcı. Firma adından otomatik oluşturulur.
              </small>
            </div>

            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="admin-label">Açıklama</label>
              <textarea
                className="admin-textarea"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Firma hakkında açıklama..."
              />
              <small className="admin-help-text">
                Bu alan temel HTML (ör. &lt;p&gt;, &lt;strong&gt;) destekler.
              </small>
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
                <div className="admin-image-preview" style={{ marginTop: '1rem' }}>
                  <img
                    src={formData.logoUrl}
                    alt="Logo Preview"
                    style={{ maxWidth: '200px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                </div>
              )}
              <small className="admin-help-text">
                Firma logosu (PNG, JPG, WebP - Maks. 5MB)
              </small>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Hero Görseli</label>
              <input
                type="file"
                className="admin-input"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'heroImageUrl')}
                disabled={uploading}
              />
              {formData.heroImageUrl && (
                <div className="admin-image-preview" style={{ marginTop: '1rem' }}>
                  <img
                    src={formData.heroImageUrl}
                    alt="Hero Preview"
                    style={{ maxWidth: '100%', borderRadius: '12px', border: '1px solid #e5e7eb' }}
                  />
                </div>
              )}
              <small className="admin-help-text">
                Temsilcilik kahraman alanında gösterilecek görsel (1920x1080 önerilir)
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
                <div className="admin-image-preview" style={{ marginTop: '1rem' }}>
                  <img
                    src={formData.breadcrumbImageUrl}
                    alt="Breadcrumb Preview"
                    style={{ maxWidth: '200px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
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
              {saving ? 'Kaydediliyor...' : 'Temsilcilik Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
