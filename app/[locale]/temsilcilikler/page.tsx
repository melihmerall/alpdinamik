import Link from "next/link";

async function getRepresentatives() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/representatives`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export default async function RepresentativesPage({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  const representatives = await getRepresentatives();

  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb__area" style={{ 
        backgroundImage: `url('/assets/img/breadcrumb.jpg')`,
        padding: '120px 0',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="breadcrumb__area-content">
                <h2>Temsilcilikler</h2>
                <ul>
                  <li><Link href={`/${locale}`}>Anasayfa</Link><i className="fa-regular fa-angle-right"></i></li>
                  <li>Temsilcilikler</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="section-padding">
        <div className="container">
          <div className="row mb-5">
            <div className="col-xl-12 text-center">
              <div className="section-title">
                <span className="subtitle">İş Ortaklarımız</span>
                <h2>Temsil Ettiğimiz Markalar</h2>
                <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.1rem', color: '#666' }}>
                  Dünya çapında tanınmış markaların Türkiye temsilciliğini yürütüyor, 
                  müşterilerimize en kaliteli ürün ve hizmetleri sunuyoruz.
                </p>
              </div>
            </div>
          </div>

          {representatives.length === 0 ? (
            <div className="row">
              <div className="col-xl-12">
                <div style={{ 
                  textAlign: 'center', 
                  padding: '4rem 2rem',
                  background: '#f8f9fa',
                  borderRadius: '12px'
                }}>
                  <i className="fas fa-info-circle" style={{ fontSize: '3rem', color: '#6c757d', marginBottom: '1rem' }}></i>
                  <h3 style={{ color: '#495057', marginBottom: '1rem' }}>Temsilcilik Bilgisi Bulunamadı</h3>
                  <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>
                    Şu anda görüntülenecek temsilcilik bulunmuyor.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="row">
              {representatives.map((rep: any) => (
                <div key={rep.id} className="col-xl-4 col-lg-4 col-md-6 mb-4">
                  <div 
                    className="card h-100" 
                    style={{ 
                      border: '1px solid #e0e0e0', 
                      borderRadius: '12px', 
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}
                  >
                    {rep.logoUrl && (
                      <div style={{ 
                        height: '200px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        padding: '2rem',
                        background: '#f8f9fa',
                        borderBottom: '1px solid #e0e0e0'
                      }}>
                        <img 
                          src={rep.logoUrl} 
                          alt={rep.name}
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: '100%', 
                            objectFit: 'contain' 
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="card-body" style={{ padding: '1.5rem' }}>
                      <h3 className="card-title" style={{ 
                        fontSize: '1.5rem', 
                        marginBottom: '1rem',
                        color: '#212529'
                      }}>
                        {rep.name}
                      </h3>
                      
                      {rep.description && (
                        <p 
                          className="card-text" 
                          style={{ 
                            color: '#6c757d', 
                            fontSize: '1rem',
                            lineHeight: '1.6',
                            marginBottom: '1rem'
                          }}
                        >
                          {rep.description.length > 150 
                            ? `${rep.description.substring(0, 150)}...` 
                            : rep.description
                          }
                        </p>
                      )}

                      {rep.products && rep.products.length > 0 && (
                        <div style={{ 
                          marginTop: '1rem',
                          padding: '0.75rem',
                          background: '#f8f9fa',
                          borderRadius: '6px'
                        }}>
                          <small style={{ color: '#495057', fontWeight: '600' }}>
                            <i className="fas fa-box" style={{ marginRight: '0.5rem' }}></i>
                            {rep.products.length} Ürün
                          </small>
                        </div>
                      )}

                      {rep.websiteUrl && (
                        <div style={{ marginTop: '1rem' }}>
                          <a 
                            href={rep.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ 
                              color: '#007bff',
                              textDecoration: 'none',
                              fontSize: '0.9rem'
                            }}
                          >
                            <i className="fas fa-external-link-alt" style={{ marginRight: '0.5rem' }}></i>
                            Web Sitesi
                          </a>
                        </div>
                      )}
                    </div>
                    
                    {rep.slug && (
                      <div className="card-footer bg-transparent" style={{ borderTop: '1px solid #e0e0e0' }}>
                        <Link 
                          href={`/${locale}/temsilcilikler/${rep.slug}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          Detaylı İncele
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

