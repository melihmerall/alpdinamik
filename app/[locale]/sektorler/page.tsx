import Link from "next/link";

async function getSectors() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/sectors`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export default async function SectorsPage() {
  const sectors = await getSectors();

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
                <h2>Sektörler</h2>
                <ul>
                  <li><Link href="/">Anasayfa</Link><i className="fa-regular fa-angle-right"></i></li>
                  <li>Sektörler</li>
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
                <span className="subtitle">Uygulama Alanlarımız</span>
                <h2>Hizmet Verdiğimiz Sektörler</h2>
                <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.1rem', color: '#666' }}>
                  Farklı sektörlerdeki müşterilerimize özel çözümler sunuyoruz.
                </p>
              </div>
            </div>
          </div>

          {sectors.length > 0 ? (
            <div className="row">
              {sectors.map((sector: any) => (
                <div key={sector.id} className="col-xl-4 col-lg-4 col-md-6 mb-4">
                  <div 
                    className="card h-100" 
                    style={{ 
                      border: '1px solid #e0e0e0', 
                      borderRadius: '8px', 
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                      e.currentTarget.style.transform = 'translateY(-5px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {sector.imageUrl && (
                      <img 
                        src={sector.imageUrl} 
                        alt={sector.name}
                        className="card-img-top"
                        style={{ height: '250px', objectFit: 'cover' }}
                      />
                    )}
                    <div className="card-body">
                      <h3 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '0.75rem', fontWeight: '600' }}>
                        {sector.name}
                      </h3>
                      {sector.description && (
                        <p className="card-text" style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>
                          {sector.description.length > 150 
                            ? sector.description.substring(0, 150) + '...' 
                            : sector.description
                          }
                        </p>
                      )}
                    </div>
                    {sector.slug && (
                      <div className="card-footer bg-transparent" style={{ borderTop: '1px solid #e0e0e0' }}>
                        <Link 
                          href={`/sektorler/${sector.slug}`}
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
          ) : (
            <div className="row">
              <div className="col-xl-12">
                <div style={{ 
                  textAlign: 'center', 
                  padding: '4rem 2rem', 
                  background: '#f8f9fa', 
                  borderRadius: '8px' 
                }}>
                  <p style={{ fontSize: '1.2rem', color: '#666' }}>Henüz sektör eklenmemiş.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

