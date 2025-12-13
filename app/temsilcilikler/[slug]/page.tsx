import { notFound } from "next/navigation";
import Link from "next/link";
import SEO from "@/components/data/seo";
import HeaderTwo from "@/components/layout/headers/header-two";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "@/components/pages/common/scroll/scroll-to-top";
import BreadCrumb from "@/components/pages/common/breadcrumb";
import CustomCursor from "@/components/pages/common/cursor";
import SwitchTab from "@/components/pages/common/dark-light";

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

  const breadcrumbBgImage = representative.breadcrumbImageUrl || '/assets/img/breadcrumb.jpg';

  return (
    <>
      <SEO pageTitle={representative.name} />
      <CustomCursor />
      <SwitchTab />
      <HeaderTwo />
      <BreadCrumb 
        title="Temsilcilikler" 
        innerTitle={representative.name}
        backgroundImage={breadcrumbBgImage}
      />

      {/* Representative Info Section - Modern Layout */}
      <div className="about__five section-padding">
        <div className="container">
          <div className="row al-center">
            {representative.logoUrl && (
              <div className="col-lg-5 lg-mb-25">
                <div className="about__five-image wow img_left_animation">
                  <img src={representative.logoUrl} alt={representative.name} />
                </div>
              </div>
            )}
            <div className={representative.logoUrl ? "col-lg-7" : "col-lg-12"}>
              <div className={representative.logoUrl ? "about__five-right ml-70 xl-ml-0" : "t-center"}>
                <div className="about__five-right-title">
                  <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Temsilcilik</span>
                  <h2 className="title_split_anim">{representative.name}</h2>
                </div>
                {representative.description && (
                  <div 
                    className="wow fadeInUp" 
                    data-wow-delay=".6s"
                    style={{ 
                      fontSize: '1.05rem', 
                      lineHeight: '1.8', 
                      color: 'var(--body-color)',
                      marginTop: '1.5rem'
                    }}
                    dangerouslySetInnerHTML={{ __html: representative.description.replace(/\n/g, '<br />') }}
                  />
                )}
                {representative.websiteUrl && (
                  <div className="item_bounce wow fadeInUp" data-wow-delay=".9s">
                    <a 
                      href={representative.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="build_button mt-20"
                    >
                      Web Sitesini Ziyaret Et<i className="flaticon-right-up"></i>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      {categories.length > 0 && (
        <div className="services__one section-padding-three">
          <div className="container">
            <div className="row mb-50">
              <div className="col-xl-12">
                <div className="t-center">
                  <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Kategoriler</span>
                  <h2 className="title_split_anim wow fadeInRight" data-wow-delay=".6s">
                    Ürün Kategorilerimiz
                  </h2>
                </div>
              </div>
            </div>
            
            <div className="row">
              {categories.map((category: any, index: number) => {
                const totalProducts = category.series?.reduce((acc: number, s: any) => acc + (s.products?.length || 0), 0) || 0;
                
                // Get first product URL from first series
                const getFirstProductFromCategory = () => {
                  if (category.series && category.series.length > 0) {
                    const firstSeries = category.series[0];
                    // Try variants first
                    for (const variant of firstSeries.variants || []) {
                      if (variant.products && variant.products.length > 0) {
                        return `/temsilcilikler/${params.slug}/urunler/${variant.products[0].slug}`;
                      }
                    }
                    // Then try direct products
                    if (firstSeries.products && firstSeries.products.length > 0) {
                      return `/temsilcilikler/${params.slug}/urunler/${firstSeries.products[0].slug}`;
                    }
                  }
                  return null;
                };

                const firstProductUrl = getFirstProductFromCategory();
                
                return (
                  <div key={category.id} className="col-lg-4 col-md-6 mt-25">
                    <div className="portfolio__three-item category-card">
                      {category.breadcrumbImageUrl ? (
                        firstProductUrl ? (
                          <Link href={firstProductUrl} className="category-image-link">
                            <img 
                              src={category.breadcrumbImageUrl} 
                              alt={category.name}
                              className="category-image"
                            />
                          </Link>
                        ) : (
                          <div className="category-image-link">
                            <img 
                              src={category.breadcrumbImageUrl} 
                              alt={category.name}
                              className="category-image"
                            />
                          </div>
                        )
                      ) : (
                        <div className="category-placeholder">
                          <i className="flaticon-box"></i>
                        </div>
                      )}
                      <div className="portfolio__three-item-content">
                        {firstProductUrl && (
                          <Link href={firstProductUrl}>
                            <i className="flaticon flaticon-right-up"></i>
                          </Link>
                        )}
                        <span>Kategori</span>
                        {firstProductUrl ? (
                          <h4>
                            <Link href={firstProductUrl}>
                              {category.name}
                            </Link>
                          </h4>
                        ) : (
                          <h4>{category.name}</h4>
                        )}
                        {category.description && (
                          <p style={{ 
                            fontSize: '0.9rem', 
                            color: 'var(--text-white)', 
                            marginTop: '0.5rem',
                            lineHeight: '1.5',
                            minHeight: '40px'
                          }}>
                            {category.description.length > 80 
                              ? category.description.substring(0, 80) + '...' 
                              : category.description}
                          </p>
                        )}
                        <div style={{ 
                          display: 'flex', 
                          gap: '1rem',
                          marginTop: '1rem',
                          paddingTop: '1rem',
                          borderTop: '1px solid rgba(255,255,255,0.1)',
                          fontSize: '0.875rem',
                          color: 'var(--text-white)'
                        }}>
                          <span>
                            <i className="flaticon-list" style={{ marginRight: '5px' }}></i>
                            {category.series?.length || 0} Seri
                          </span>
                          <span>
                            <i className="flaticon-box" style={{ marginRight: '5px' }}></i>
                            {totalProducts} Ürün
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {categories.length === 0 && (
        <div className="section-padding">
          <div className="container">
            <div className="row">
              <div className="col-xl-12">
                <div className="t-center" style={{ padding: '3rem', background: 'var(--color-2)', borderRadius: '10px' }}>
                  <p style={{ fontSize: '1.1rem', color: 'var(--body-color)' }}>
                    Henüz kategori eklenmemiş.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <FooterTwo />
      <ScrollToTop />
    </>
  );
}
