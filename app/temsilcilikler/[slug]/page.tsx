import { notFound } from "next/navigation";
import Link from "next/link";

async function getRepresentative(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/representatives/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function RepresentativePage({ params }: { params: { slug: string } }) {
  const representative = await getRepresentative(params.slug);

  if (!representative) {
    notFound();
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb__area" style={{ 
        backgroundImage: representative.breadcrumbImageUrl 
          ? `url(${representative.breadcrumbImageUrl})` 
          : `url('/assets/img/breadcrumb.jpg')`,
        padding: '120px 0',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="breadcrumb__area-content">
                <h2>{representative.name}</h2>
                <ul>
                  <li><Link href="/">Anasayfa</Link><i className="fa-regular fa-angle-right"></i></li>
                  <li><Link href="/temsilcilikler">Temsilcilikler</Link><i className="fa-regular fa-angle-right"></i></li>
                  <li>{representative.name}</li>
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
            <div className="col-xl-12">
              {representative.logoUrl && (
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                  <img 
                    src={representative.logoUrl} 
                    alt={representative.name}
                    style={{ maxWidth: '300px', height: 'auto' }}
                  />
                </div>
              )}

              <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{representative.name}</h1>
                {representative.description && (
                  <div 
                    style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#666' }}
                    dangerouslySetInnerHTML={{ __html: representative.description.replace(/\n/g, '<br />') }}
                  />
                )}
                {representative.websiteUrl && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <a 
                      href={representative.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      Web Sitesini Ziyaret Et
                    </a>
                  </div>
                )}
              </div>

              {/* Products */}
              {representative.products && representative.products.length > 0 && (
                <div>
                  <h2 style={{ fontSize: '2rem', marginBottom: '2rem', borderBottom: '2px solid #007bff', paddingBottom: '1rem' }}>
                    Ürünler
                  </h2>
                  <div className="row">
                    {representative.products.map((product: any) => (
                      <div key={product.id} className="col-xl-4 col-lg-4 col-md-6 mb-4">
                        <div className="card h-100" style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
                          {product.imageUrl && (
                            <img 
                              src={product.imageUrl} 
                              alt={product.name}
                              className="card-img-top"
                              style={{ height: '250px', objectFit: 'cover' }}
                            />
                          )}
                          <div className="card-body">
                            <h3 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
                              <Link href={`/temsilcilikler/${params.slug}/urunler/${product.slug}`}>
                                {product.name}
                              </Link>
                            </h3>
                            {product.description && (
                              <p className="card-text" style={{ color: '#666', fontSize: '0.95rem' }}>
                                {product.description.substring(0, 150)}...
                              </p>
                            )}
                          </div>
                          <div className="card-footer bg-transparent" style={{ borderTop: '1px solid #e0e0e0' }}>
                            <Link 
                              href={`/temsilcilikler/${params.slug}/urunler/${product.slug}`}
                              className="btn btn-sm btn-outline-primary"
                            >
                              Detaylı İncele
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(!representative.products || representative.products.length === 0) && (
                <div style={{ textAlign: 'center', padding: '3rem', background: '#f8f9fa', borderRadius: '8px' }}>
                  <p style={{ fontSize: '1.1rem', color: '#666' }}>Henüz ürün eklenmemiş.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

