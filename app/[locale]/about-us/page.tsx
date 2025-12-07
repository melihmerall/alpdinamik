import Link from "next/link";

async function getAboutData() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/company-pages/hakkimizda`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function AboutPage({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  const aboutData = await getAboutData();

  // Fallback if page doesn't exist
  if (!aboutData) {
    return (
      <div>
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
                  <h2>Hakkımızda</h2>
                  <ul>
                    <li><Link href={`/${locale}`}>Anasayfa</Link><i className="fa-regular fa-angle-right"></i></li>
                    <li>Hakkımızda</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section-padding">
          <div className="container">
            <div className="row">
              <div className="col-xl-12">
                <h1>Hakkımızda</h1>
                <p>İçerik eklenmemiş. Lütfen admin panelden "hakkimizda" slug'ı ile bir kurumsal sayfa oluşturun.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb__area" style={{ 
        backgroundImage: aboutData.breadcrumbImageUrl 
          ? `url(${aboutData.breadcrumbImageUrl})` 
          : aboutData.imageUrl 
          ? `url(${aboutData.imageUrl})` 
          : `url('/assets/img/breadcrumb.jpg')`,
        padding: '120px 0',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="breadcrumb__area-content">
                <h2>{aboutData.title}</h2>
                <ul>
                  <li><Link href={`/${locale}`}>Anasayfa</Link><i className="fa-regular fa-angle-right"></i></li>
                  <li>{aboutData.title}</li>
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
            <div className="col-xl-8 offset-xl-2">
              {aboutData.subtitle && (
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <span className="subtitle" style={{ fontSize: '1.125rem', color: '#007bff', fontWeight: '600' }}>
                    {aboutData.subtitle}
                  </span>
                </div>
              )}

              <div 
                style={{ 
                  fontSize: '1.1rem', 
                  lineHeight: '1.8', 
                  color: '#666',
                  marginBottom: '3rem'
                }}
                dangerouslySetInnerHTML={{ __html: aboutData.body.replace(/\n/g, '<br />') }}
              />

              {/* Statistics */}
              {(aboutData.stat1Number || aboutData.stat2Number || aboutData.stat3Number) && (
                <div className="row" style={{ marginTop: '3rem', marginBottom: '3rem' }}>
                  {aboutData.stat1Number && (
                    <div className="col-xl-4 col-md-4 text-center">
                      <div style={{ 
                        padding: '2rem 1rem', 
                        background: '#f8f9fa', 
                        borderRadius: '8px',
                        marginBottom: '1rem'
                      }}>
                        <h3 style={{ fontSize: '3rem', fontWeight: '700', color: '#007bff', marginBottom: '0.5rem' }}>
                          {aboutData.stat1Number}+
                        </h3>
                        <p style={{ fontSize: '1rem', color: '#666', margin: 0 }}>
                          {aboutData.stat1Label}
                        </p>
                      </div>
                    </div>
                  )}
                  {aboutData.stat2Number && (
                    <div className="col-xl-4 col-md-4 text-center">
                      <div style={{ 
                        padding: '2rem 1rem', 
                        background: '#f8f9fa', 
                        borderRadius: '8px',
                        marginBottom: '1rem'
                      }}>
                        <h3 style={{ fontSize: '3rem', fontWeight: '700', color: '#007bff', marginBottom: '0.5rem' }}>
                          {aboutData.stat2Number}+
                        </h3>
                        <p style={{ fontSize: '1rem', color: '#666', margin: 0 }}>
                          {aboutData.stat2Label}
                        </p>
                      </div>
                    </div>
                  )}
                  {aboutData.stat3Number && (
                    <div className="col-xl-4 col-md-4 text-center">
                      <div style={{ 
                        padding: '2rem 1rem', 
                        background: '#f8f9fa', 
                        borderRadius: '8px',
                        marginBottom: '1rem'
                      }}>
                        <h3 style={{ fontSize: '3rem', fontWeight: '700', color: '#007bff', marginBottom: '0.5rem' }}>
                          {aboutData.stat3Number}+
                        </h3>
                        <p style={{ fontSize: '1rem', color: '#666', margin: 0 }}>
                          {aboutData.stat3Label}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CTA */}
              {aboutData.ctaLabel && aboutData.ctaUrl && (
                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                  <Link href={aboutData.ctaUrl} className="btn btn-primary btn-lg">
                    {aboutData.ctaLabel}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

