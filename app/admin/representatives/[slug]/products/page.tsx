"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  order: number;
  isActive: boolean;
  series: {
    id: string;
    name: string;
    category: {
      id: string;
      name: string;
    };
  } | null;
}

export default function RepresentativeProductsPage() {
  const params = useParams();
  const router = useRouter();
  const repSlug = params.slug as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [representative, setRepresentative] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [repSlug]);

  const fetchData = async () => {
    try {
      const [repRes, productsRes] = await Promise.all([
        fetch(`/api/representatives/${repSlug}`),
        fetch(`/api/representatives/${repSlug}/products`),
      ]);

      if (repRes.ok) {
        const repData = await repRes.json();
        setRepresentative(repData);
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        // Include series info
        const productsWithSeries = await Promise.all(
          productsData.map(async (product: any) => {
            if (product.seriesId) {
              const seriesRes = await fetch(`/api/series/${product.seriesId}`);
              if (seriesRes.ok) {
                const seriesData = await seriesRes.json();
                return { ...product, series: seriesData };
              }
            }
            return { ...product, series: null };
          })
        );
        setProducts(productsWithSeries);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productSlug: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }

    try {
      const res = await fetch(`/api/representatives/${repSlug}/products/${productSlug}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchData();
      } else {
        alert('Ürün silinemedi');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
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
          <h1 className="admin-title">{representative?.name || repSlug} - Ürünler</h1>
          <p className="admin-subtitle">
            {representative?.name || repSlug} markasına ait ürünleri yönetin
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href={`/admin/representatives/${repSlug}/categories`} className="admin-btn-secondary">
            📁 Kategoriler
          </Link>
          <Link href={`/admin/representatives/${repSlug}/products/new`} className="admin-btn-primary">
            + Yeni Ürün
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
          <h3 style={{ marginBottom: '0.5rem' }}>Henüz ürün eklenmemiş</h3>
          <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>
            İlk ürününüzü ekleyerek başlayın
          </p>
          <Link
            href={`/admin/representatives/${repSlug}/products/new`}
            className="admin-btn-primary"
          >
            Yeni Ürün Ekle
          </Link>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ürün Adı</th>
                <th>Kategori / Seri</th>
                <th>Slug</th>
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
                  <td>
                    {product.series ? (
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                          {product.series.category.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                          {product.series.name}
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: '#6c757d', fontStyle: 'italic' }}>Seri yok</span>
                    )}
                  </td>
                  <td>
                    <code style={{ fontSize: '0.8125rem', color: '#6c757d' }}>
                      {product.slug}
                    </code>
                  </td>
                  <td>{product.order}</td>
                  <td>
                    <span className={`admin-badge ${product.isActive ? 'admin-badge-success' : 'admin-badge-secondary'}`}>
                      {product.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="text-end">
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <Link
                        href={`/admin/representatives/${repSlug}/products/${product.slug}/edit`}
                        className="admin-btn-sm admin-btn-primary"
                      >
                        Düzenle
                      </Link>
                      <button
                        onClick={() => handleDelete(product.slug)}
                        className="admin-btn-sm admin-btn-danger"
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
  );
}
