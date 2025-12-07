import { notFound } from "next/navigation";
import Link from "next/link";

async function getProduct(repSlug: string, productSlug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/representatives/${repSlug}/products/${productSlug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function ProductPage({ 
  params 
}: { 
  params: { slug: string; productSlug: string } 
}) {
  const product = await getProduct(params.slug, params.productSlug);

  if (!product) {
    notFound();
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb__area" style={{ 
        backgroundImage: product.breadcrumbImageUrl 
          ? `url(${product.breadcrumbImageUrl})` 
          : product.representative?.breadcrumbImageUrl
          ? `url(${product.representative.breadcrumbImageUrl})`
          : `url('/assets/img/breadcrumb.jpg')`,
        padding: '120px 0',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="breadcrumb__area-content">
                <h2>{product.name}</h2>
                <ul>
                  <li><Link href="/">Anasayfa</Link><i className="fa-regular fa-angle-right"></i></li>
                  <li><Link href="/temsilcilikler">Temsilcilikler</Link><i className="fa-regular fa-angle-right"></i></li>
                  <li><Link href={`/temsilcilikler/${params.slug}`}>{product.representative?.name}</Link><i className="fa-regular fa-angle-right"></i></li>
                  <li>{product.name}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="section-padding">
        <div className="container">
          <div className="row">
            <div className="col-xl-8">
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{product.name}</h1>
                
                {product.imageUrl && (
                  <div style={{ marginBottom: '2rem' }}>
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                    />
                  </div>
                )}

                {product.description && (
                  <div 
                    style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#666' }}
                    dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }}
                  />
                )}

                {product.specifications && (
                  <div style={{ marginTop: '2rem' }}>
                    <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Teknik Özellikler</h3>
                    <div 
                      style={{ fontSize: '1rem', lineHeight: '1.8', color: '#666' }}
                      dangerouslySetInnerHTML={{ __html: product.specifications.replace(/\n/g, '<br />') }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="col-xl-4">
              <div className="sidebar" style={{ 
                padding: '2rem', 
                background: '#f8f9fa', 
                borderRadius: '8px',
                position: 'sticky',
                top: '100px'
              }}>
                <h4 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Ürün Bilgileri</h4>
                
                {product.representative && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '0.875rem', color: '#888', marginBottom: '0.5rem' }}>Temsil Eden</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{product.representative.name}</p>
                  </div>
                )}

                {product.categoryId && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '0.875rem', color: '#888', marginBottom: '0.5rem' }}>Kategori</p>
                    <p style={{ fontSize: '1rem' }}>{product.category?.name || 'Genel'}</p>
                  </div>
                )}

                <div style={{ marginTop: '2rem' }}>
                  <Link 
                    href="/contact-us" 
                    className="btn btn-primary btn-block"
                    style={{ width: '100%', textAlign: 'center' }}
                  >
                    Fiyat Teklifi Al
                  </Link>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <Link 
                    href={`/temsilcilikler/${params.slug}`}
                    className="btn btn-outline-secondary btn-block"
                    style={{ width: '100%', textAlign: 'center' }}
                  >
                    Tüm Ürünleri Gör
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

