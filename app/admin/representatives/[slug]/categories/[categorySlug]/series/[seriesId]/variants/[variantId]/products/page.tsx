"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VariantProductsPage() {
  const params = useParams();
  const router = useRouter();
  const repSlug = params.slug as string;
  const categorySlug = params.categorySlug as string;
  const seriesId = params.seriesId as string;
  const variantId = params.variantId as string;
  const [products, setProducts] = useState<any[]>([]);
  const [variant, setVariant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVariant();
  }, [variantId]);

  const fetchVariant = async () => {
    try {
      const res = await fetch(`/api/variants/${variantId}`);
      if (res.ok) {
        const data = await res.json();
        setVariant(data);
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching variant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productSlug: string, productName: string) => {
    if (!confirm(`"${productName}" ürününü silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/representatives/${repSlug}/products/${productSlug}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Ürün başarıyla silindi!');
        fetchVariant();
      } else {
        const error = await res.json();
        alert(error.error || 'Ürün silinemedi');
      }
    } catch (error: any) {
      console.error('Error deleting product:', error);
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
          <h1 className="admin-title">Ürün Yönetimi</h1>
          <p className="admin-subtitle">
            {variant?.series?.category?.name} → {variant?.series?.name} → {variant?.name}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link 
            href={`/admin/representatives/${repSlug}/categories/${categorySlug}/series/${seriesId}/variants`} 
            className="admin-btn-secondary"
          >
            ← Varyantlar
          </Link>
          <Link 
            href={`/admin/representatives/${repSlug}/products/new?variantId=${variantId}`} 
            className="admin-btn-primary"
          >
            + Yeni Ürün
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p className="text-muted">Bu varyantta henüz ürün yok</p>
          <Link 
            href={`/admin/representatives/${repSlug}/products/new?variantId=${variantId}`} 
            className="admin-btn-primary" 
            style={{ marginTop: '1rem', display: 'inline-block' }}
          >
            İlk Ürünü Ekle
          </Link>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ürün Adı</th>
                <th>Maksimum Kapasite</th>
                <th>Sıra</th>
                <th>Durum</th>
                <th className="text-end">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <strong>{product.name}</strong>
                    {product.description && (
                      <div style={{ fontSize: '0.875rem', color: '#6c757d', marginTop: '0.25rem' }}>
                        {product.description.substring(0, 60)}
                        {product.description.length > 60 && '...'}
                      </div>
                    )}
                  </td>
                  <td>{product.maxCapacity || '—'}</td>
                  <td>{product.order}</td>
                  <td>
                    <span className={`admin-badge ${product.isActive ? 'admin-badge-success' : 'admin-badge-secondary'}`}>
                      {product.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="text-end">
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <Link
                        href={`/admin/representatives/${repSlug}/products/${product.slug}/edit`}
                        className="admin-btn admin-btn-sm admin-btn-secondary"
                      >
                        ✏️ Düzenle
                      </Link>
                      <button
                        onClick={() => handleDelete(product.slug, product.name)}
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

