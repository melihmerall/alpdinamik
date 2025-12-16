"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RepresentativesPage() {
  const router = useRouter();
  const [representatives, setRepresentatives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRepresentatives();
  }, []);

  const fetchRepresentatives = async () => {
    try {
      const res = await fetch('/api/representatives?all=true');
      if (res.ok) {
        const data = await res.json();
        setRepresentatives(data);
      }
    } catch (error) {
      console.error('Error fetching representatives:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`"${name}" temsilciliğini silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz ve tüm kategoriler, seriler ve ürünler de silinecektir.`)) {
      return;
    }

    try {
      console.log('Deleting representative:', slug);
      const res = await fetch(`/api/representatives/${slug}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (res.ok) {
        alert('Temsilcilik başarıyla silindi!');
        fetchRepresentatives();
      } else {
        console.error('Delete error:', data);
        alert(data.error || 'Temsilcilik silinemedi');
      }
    } catch (error: any) {
      console.error('Error deleting representative:', error);
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
          <h1 className="admin-title">Temsilcilikler</h1>
          <p className="admin-subtitle">
            Temsil ettiğiniz markaları ve ürünlerini yönetin
          </p>
        </div>
        <Link
          href="/admin/representatives/new"
          className="admin-btn-primary"
        >
          + Yeni Temsilcilik
        </Link>
      </div>

      <div className="admin-card">
        {representatives.length > 0 ? (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>İsim</th>
                  <th>Slug</th>
                  <th>Ürün Sayısı</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {representatives.map((rep) => (
                  <tr key={rep.id}>
                    <td style={{ fontWeight: '500' }}>{rep.name}</td>
                    <td style={{ color: 'var(--admin-gray-500)', fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                      {rep.slug}
                    </td>
                    <td>
                      <span className="admin-badge admin-badge-info">
                        {rep.categories?.reduce((acc: number, cat: any) => 
                          acc + (cat.series?.reduce((acc2: number, ser: any) => 
                            acc2 + (ser.products?.length || 0), 0) || 0), 0) || rep.products?.length || 0} Ürün
                      </span>
                      <div style={{ fontSize: '0.75rem', color: '#6c757d', marginTop: '0.25rem' }}>
                        {rep.categories?.length || 0} Kategori
                      </div>
                    </td>
                    <td>
                      {rep.isActive ? (
                        <span className="admin-badge admin-badge-success">Aktif</span>
                      ) : (
                        <span className="admin-badge admin-badge-warning">Pasif</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <Link
                          href={`/admin/representatives/${rep.slug}/edit`}
                          className="admin-btn admin-btn-sm admin-btn-secondary"
                        >
                          ✏️ Düzenle
                        </Link>
                        <Link
                          href={`/admin/representatives/${rep.slug}/categories`}
                          className="admin-btn admin-btn-sm admin-btn-info"
                        >
                          📁 Kategoriler
                        </Link>
                        <Link
                          href={`/admin/representatives/${rep.slug}/products`}
                          className="admin-btn admin-btn-sm admin-btn-primary"
                        >
                          📦 Ürünler
                        </Link>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(rep.slug, rep.name);
                          }}
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
        ) : (
          <div className="admin-empty-state">
            <div className="admin-empty-state-icon">🤝</div>
            <h3 className="admin-empty-state-title">Henüz temsilcilik eklenmemiş</h3>
            <p className="admin-empty-state-description">
              İlk temsilciliğinizi ekleyerek başlayın
            </p>
            <Link href="/admin/representatives/new" className="admin-btn admin-btn-primary">
              Yeni Temsilcilik Ekle
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
