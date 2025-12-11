"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  order: number;
  isActive: boolean;
  series: any[];
}

export default function CategoriesListPage() {
  const params = useParams();
  const router = useRouter();
  const repSlug = params.slug as string;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [representative, setRepresentative] = useState<any>(null);

  useEffect(() => {
    fetchRepresentative();
    fetchCategories();
  }, [repSlug]);

  const fetchRepresentative = async () => {
    const res = await fetch(`/api/representatives/${repSlug}`);
    if (res.ok) {
      const data = await res.json();
      setRepresentative(data);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`/api/representatives/${repSlug}/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categorySlug: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) return;

    try {
      const res = await fetch(`/api/representatives/${repSlug}/categories/${categorySlug}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchCategories();
      } else {
        alert('Silme işlemi başarısız oldu');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
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
          <h1 className="admin-title">Ürün Kategorileri</h1>
          <p className="admin-subtitle">
            {representative?.name || repSlug} - Kategori Yönetimi
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href={`/admin/representatives/${repSlug}/products`} className="admin-btn-secondary">
            ← Ürünler
          </Link>
          <Link href={`/admin/representatives/${repSlug}/categories/new`} className="admin-btn-primary">
            + Yeni Kategori
          </Link>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p className="text-muted">Henüz kategori eklenmemiş</p>
          <Link href={`/admin/representatives/${repSlug}/categories/new`} className="admin-btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
            İlk Kategoriyi Ekle
          </Link>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Kategori Adı</th>
                <th>Seri Sayısı</th>
                <th>Ürün Sayısı</th>
                <th>Sıra</th>
                <th>Durum</th>
                <th className="text-end">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => {
                const productCount = category.series.reduce((acc, s) => acc + s.products.length, 0);
                return (
                  <tr key={category.id}>
                    <td>
                      <strong>{category.name}</strong>
                      {category.description && (
                        <div style={{ fontSize: '0.875rem', color: '#6c757d', marginTop: '0.25rem' }}>
                          {category.description.substring(0, 60)}
                          {category.description.length > 60 && '...'}
                        </div>
                      )}
                    </td>
                    <td>{category.series.length}</td>
                    <td>{productCount}</td>
                    <td>{category.order}</td>
                    <td>
                      <span className={`admin-badge ${category.isActive ? 'admin-badge-success' : 'admin-badge-secondary'}`}>
                        {category.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="text-end">
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Link
                          href={`/admin/representatives/${repSlug}/categories/${category.slug}/series`}
                          className="admin-btn-sm admin-btn-info"
                        >
                          Seriler
                        </Link>
                        <Link
                          href={`/admin/representatives/${repSlug}/categories/${category.slug}/edit`}
                          className="admin-btn-sm admin-btn-primary"
                        >
                          Düzenle
                        </Link>
                        <button
                          onClick={() => handleDelete(category.slug)}
                          className="admin-btn-sm admin-btn-danger"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

