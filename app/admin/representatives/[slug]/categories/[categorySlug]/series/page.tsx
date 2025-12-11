"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Series {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  order: number;
  isActive: boolean;
  products: any[];
}

export default function SeriesListPage() {
  const params = useParams();
  const router = useRouter();
  const repSlug = params.slug as string;
  const categorySlug = params.categorySlug as string;
  const [series, setSeries] = useState<Series[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategory();
  }, [repSlug, categorySlug]);

  const fetchCategory = async () => {
    try {
      const res = await fetch(`/api/representatives/${repSlug}/categories/${categorySlug}`);
      if (res.ok) {
        const data = await res.json();
        setCategory(data);
        setSeries(data.series || []);
      }
    } catch (error) {
      console.error('Error fetching category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (seriesId: string) => {
    if (!confirm('Bu seriyi silmek istediğinizden emin misiniz?')) return;

    try {
      const res = await fetch(`/api/series/${seriesId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchCategory();
      } else {
        alert('Silme işlemi başarısız oldu');
      }
    } catch (error) {
      console.error('Error deleting series:', error);
      alert('Bir hata oluştu');
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
          <h1 className="admin-title">Seri Yönetimi</h1>
          <p className="admin-subtitle">{category?.name} - Ürün Serileri</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href={`/admin/representatives/${repSlug}/categories`} className="admin-btn-secondary">
            ← Kategoriler
          </Link>
          <Link href={`/admin/representatives/${repSlug}/categories/${categorySlug}/series/new`} className="admin-btn-primary">
            + Yeni Seri
          </Link>
        </div>
      </div>

      {series.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p className="text-muted">Henüz seri eklenmemiş</p>
          <Link href={`/admin/representatives/${repSlug}/categories/${categorySlug}/series/new`} className="admin-btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
            İlk Seriyi Ekle
          </Link>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Seri Adı</th>
                <th>Ürün Sayısı</th>
                <th>Sıra</th>
                <th>Durum</th>
                <th className="text-end">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {series.map((s) => (
                <tr key={s.id}>
                  <td>
                    <strong>{s.name}</strong>
                    {s.description && (
                      <div style={{ fontSize: '0.875rem', color: '#6c757d', marginTop: '0.25rem' }}>
                        {s.description.substring(0, 60)}
                        {s.description.length > 60 && '...'}
                      </div>
                    )}
                  </td>
                  <td>{s.products.length}</td>
                  <td>{s.order}</td>
                  <td>
                    <span className={`admin-badge ${s.isActive ? 'admin-badge-success' : 'admin-badge-secondary'}`}>
                      {s.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="text-end">
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <Link
                        href={`/admin/representatives/${repSlug}/categories/${categorySlug}/series/${s.id}/variants`}
                        className="admin-btn admin-btn-sm admin-btn-info"
                      >
                        📦 Varyantlar
                      </Link>
                      <Link
                        href={`/admin/representatives/${repSlug}/categories/${categorySlug}/series/${s.id}/edit`}
                        className="admin-btn admin-btn-sm admin-btn-secondary"
                      >
                        ✏️ Düzenle
                      </Link>
                      <button
                        onClick={() => handleDelete(s.id)}
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

