import { notFound } from "next/navigation";
import Link from "next/link";

async function getSector(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/sectors/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function SectorPage({ params }: { params: { slug: string } }) {
  const sector = await getSector(params.slug);

  if (!sector) {
    notFound();
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb__area" style={{ 
        backgroundImage: sector.breadcrumbImageUrl 
          ? `url(${sector.breadcrumbImageUrl})` 
          : sector.imageUrl 
          ? `url(${sector.imageUrl})` 
          : `url('/assets/img/breadcrumb.jpg')`,
        padding: '120px 0',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="breadcrumb__area-content">
                <h2>{sector.name}</h2>
                <ul>
                  <li><Link href="/">Anasayfa</Link><i className="fa-regular fa-angle-right"></i></li>
                  <li><Link href="/sektorler">Sektörler</Link><i className="fa-regular fa-angle-right"></i></li>
                  <li>{sector.name}</li>
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
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                  {sector.name}
                </h1>
                
                {sector.imageUrl && (
                  <div style={{ marginBottom: '2rem' }}>
                    <img 
                      src={sector.imageUrl} 
                      alt={sector.name}
                      style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                    />
                  </div>
                )}

                {sector.description && (
                  <div 
                    style={{ 
                      fontSize: '1.1rem', 
                      lineHeight: '1.8', 
                      color: '#666',
                      marginBottom: '2rem'
                    }}
                    dangerouslySetInnerHTML={{ __html: sector.description.replace(/\n/g, '<br />') }}
                  />
                )}

                <div style={{ 
                  marginTop: '3rem', 
                  padding: '2rem', 
                  background: '#f8f9fa', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                    Bu sektör için çözümlerimiz hakkında bilgi almak ister misiniz?
                  </h3>
                  <Link href="/contact-us" className="btn btn-primary btn-lg">
                    Bize Ulaşın
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

