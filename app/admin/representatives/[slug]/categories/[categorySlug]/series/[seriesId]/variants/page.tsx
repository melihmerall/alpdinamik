"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Variant {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  order: number;
  isActive: boolean;
  products: any[];
}

export default function VariantsListPage() {
  const params = useParams();
  const router = useRouter();
  const repSlug = params.slug as string;
  const categorySlug = params.categorySlug as string;
  const seriesId = params.seriesId as string;
  const [variants, setVariants] = useState<Variant[]>([]);
  const [series, setSeries] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeries();
    fetchVariants();
  }, [seriesId]);

  const fetchSeries = async () => {
    try {
      const res = await fetch(`/api/series/${seriesId}`);
      if (res.ok) {
        const data = await res.json();
        setSeries(data);
      }
    } catch (error) {
      console.error('Error fetching series:', error);
    }
  };

  const fetchVariants = async () => {
    try {
      const res = await fetch(`/api/series/${seriesId}/variants`);
      if (res.ok) {
        const data = await res.json();
        setVariants(data);
      }
    } catch (error) {
      console.error('Error fetching variants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (variantId: string, variantName: string) => {
    if (!confirm(`"${variantName}" varyantını silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz ve tüm ürünler de silinecektir.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/variants/${variantId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Varyant başarıyla silindi!');
        fetchVariants();
      } else {
        const error = await res.json();
        alert(error.error || 'Varyant silinemedi');
      }
    } catch (error: any) {
      console.error('Error deleting variant:', error);
      alert('Bir hata oluştu: ' + error.message);
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
          <h1 className="admin-title">Varyant Yönetimi</h1>
          <p className="admin-subtitle">
            {series?.category?.name} → {series?.name}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link 
            href={`/admin/representatives/${repSlug}/categories/${categorySlug}/series`} 
            className="admin-btn-secondary"
          >
            ← Seriler
          </Link>
          <Link 
            href={`/admin/representatives/${repSlug}/categories/${categorySlug}/series/${seriesId}/variants/new`} 
            className="admin-btn-primary"
          >
            + Yeni Varyant
          </Link>
        </div>
      </div>

      {variants.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p className="text-muted">Henüz varyant eklenmemiş</p>
          <Link 
            href={`/admin/representatives/${repSlug}/categories/${categorySlug}/series/${seriesId}/variants/new`} 
            className="admin-btn-primary" 
            style={{ marginTop: '1rem', display: 'inline-block' }}
          >
            İlk Varyantı Ekle
          </Link>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Varyant Adı</th>
                <th>Görsel</th>
                <th>Ürün Sayısı</th>
                <th>Sıra</th>
                <th>Durum</th>
                <th className="text-end">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((variant) => (
                <tr key={variant.id}>
                  <td>
                    <strong>{variant.name}</strong>
                    {variant.description && (
                      <div style={{ fontSize: '0.875rem', color: '#6c757d', marginTop: '0.25rem' }}>
                        {variant.description.substring(0, 60)}
                        {variant.description.length > 60 && '...'}
                      </div>
                    )}
                  </td>
                  <td>
                    {variant.imageUrl ? (
                      <img 
                        src={variant.imageUrl} 
                        alt={variant.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ) : (
                      <span style={{ color: '#6c757d' }}>—</span>
                    )}
                  </td>
                  <td>
                    <span className="admin-badge admin-badge-info">
                      {variant.products.length} Ürün
                    </span>
                  </td>
                  <td>{variant.order}</td>
                  <td>
                    <span className={`admin-badge ${variant.isActive ? 'admin-badge-success' : 'admin-badge-secondary'}`}>
                      {variant.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="text-end">
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <Link
                        href={`/admin/representatives/${repSlug}/categories/${categorySlug}/series/${seriesId}/variants/${variant.id}/products`}
                        className="admin-btn admin-btn-sm admin-btn-primary"
                      >
                        📦 Ürünler
                      </Link>
                      <Link
                        href={`/admin/representatives/${repSlug}/categories/${categorySlug}/series/${seriesId}/variants/${variant.id}/edit`}
                        className="admin-btn admin-btn-sm admin-btn-secondary"
                      >
                        ✏️ Düzenle
                      </Link>
                      <button
                        onClick={() => handleDelete(variant.id, variant.name)}
                        className="admin-btn admin-btn-sm admin-btn-danger"
                      >
                        🗑️ Sil
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
  );
}
