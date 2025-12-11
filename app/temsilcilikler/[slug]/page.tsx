import { notFound } from "next/navigation";
import Link from "next/link";
import HeaderTwo from "@/components/layout/headers/header-two";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "@/components/pages/common/scroll/scroll-to-top";

async function getRepresentative(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/representatives/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

async function getCategories(repSlug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/representatives/${repSlug}/categories`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export default async function RepresentativePage({ params }: { params: { slug: string } }) {
  const [representative, categories] = await Promise.all([
    getRepresentative(params.slug),
    getCategories(params.slug),
  ]);

  if (!representative) {
    notFound();
  }

  return (
    <>
      <HeaderTwo />
      <div className="page-wrapper">
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
            <div className="row mb-5">
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

                <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                  <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{representative.name}</h1>
                  {representative.description && (
                    <div 
                      style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#666', maxWidth: '800px', margin: '0 auto' }}
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
              </div>
            </div>

            {/* Categories - Mecmot Style */}
            {categories.length > 0 ? (
              <div className="row">
                {categories.map((category: any) => {
                  const totalProducts = category.series?.reduce((acc: number, s: any) => acc + (s.products?.length || 0), 0) || 0;
                  
                  return (
                    <div key={category.id} className="col-xl-4 col-lg-4 col-md-6 mb-4">
                      <Link
                        href={`/temsilcilikler/${params.slug}/kategoriler/${category.slug}`}
                        className="category-card-link"
                        style={{
                          display: 'block',
                          background: '#fff',
                          borderRadius: '12px',
                          padding: '2rem',
                          textDecoration: 'none',
                          color: 'inherit',
                          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                          transition: 'all 0.3s ease',
                          height: '100%',
                        }}
                      >
                        <h3 style={{ 
                          fontSize: '1.5rem', 
                          fontWeight: '700', 
                          marginBottom: '1rem',
                          color: '#333'
                        }}>
                          {category.name}
                        </h3>
                        
                        {category.description && (
                          <p style={{ 
                            fontSize: '0.95rem', 
                            color: '#666', 
                            marginBottom: '1.5rem',
                            lineHeight: '1.6'
                          }}>
                            {category.description.length > 120 
                              ? category.description.substring(0, 120) + '...' 
                              : category.description}
                          </p>
                        )}

                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          paddingTop: '1rem',
                          borderTop: '1px solid #f0f0f0'
                        }}>
                          <div>
                            <div style={{ fontSize: '0.875rem', color: '#999', marginBottom: '0.25rem' }}>
                              {category.series?.length || 0} Seri
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#999' }}>
                              {totalProducts} Ürün
                            </div>
                          </div>
                          <div style={{ 
                            fontSize: '1.25rem', 
                            color: '#007bff',
                            fontWeight: '600'
                          }}>
                            →
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', background: '#f8f9fa', borderRadius: '8px' }}>
                <p style={{ fontSize: '1.1rem', color: '#666' }}>Henüz kategori eklenmemiş.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <FooterTwo />
      <ScrollToTop />
    </>
  );
}
