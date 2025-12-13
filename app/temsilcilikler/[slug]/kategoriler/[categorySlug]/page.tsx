"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import SEO from "@/components/data/seo";
import HeaderTwo from "@/components/layout/headers/header-two";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "@/components/pages/common/scroll/scroll-to-top";
import BreadCrumb from "@/components/pages/common/breadcrumb";
import CustomCursor from "@/components/pages/common/cursor";
import SwitchTab from "@/components/pages/common/dark-light";

interface Series {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  variants: Array<{
    id: string;
    name: string;
    slug: string;
    products: Array<{ id: string; slug: string; name?: string }>;
  }>;
  products: Array<{ id: string; slug: string; name?: string }>;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  breadcrumbImageUrl?: string;
  series: Series[];
}

export default function CategoryPage() {
  const params = useParams();
  const repSlug = params.slug as string;
  const categorySlug = params.categorySlug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [representative, setRepresentative] = useState<any>(null);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedSeries, setExpandedSeries] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoryRes, repRes, categoriesRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/representatives/${repSlug}/categories/${categorySlug}`
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/representatives/${repSlug}`
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/representatives/${repSlug}/categories`
          ),
        ]);

        if (categoryRes.ok) {
          const categoryData = await categoryRes.json();
          setCategory(categoryData);
          // Auto-expand current category
          setExpandedCategories(new Set([categoryData.id]));
        } else {
          setError("Kategori bulunamadı");
        }

        if (repRes.ok) {
          setRepresentative(await repRes.json());
        }

        if (categoriesRes.ok) {
          setAllCategories(await categoriesRes.json());
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Veri yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [repSlug, categorySlug]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const toggleSeries = (seriesId: string) => {
    setExpandedSeries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(seriesId)) {
        newSet.delete(seriesId);
      } else {
        newSet.add(seriesId);
      }
      return newSet;
    });
  };

  const getFirstProductUrl = (series: Series) => {
    // First try variants
    for (const variant of series.variants || []) {
      if (variant.products && variant.products.length > 0) {
        return `/temsilcilikler/${repSlug}/urunler/${variant.products[0].slug}`;
      }
    }
    // Then try direct products
    if (series.products && series.products.length > 0) {
      return `/temsilcilikler/${repSlug}/urunler/${series.products[0].slug}`;
    }
    return null;
  };

  if (loading) {
    return (
      <>
        <HeaderTwo />
        <div className="page-wrapper">
          <div className="section-padding">
            <div className="container">
              <div className="row">
                <div className="col-xl-12 text-center py-5">
                  <p>Yükleniyor...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterTwo />
        <ScrollToTop />
      </>
    );
  }

  if (error || !category || !representative) {
    return (
      <>
        <HeaderTwo />
        <div className="page-wrapper">
          <div className="section-padding">
            <div className="container">
              <div className="row">
                <div className="col-xl-12 text-center py-5">
                  <h2 style={{ fontSize: "2rem", marginBottom: "1rem", color: "var(--text-heading-color)" }}>
                    {error || "Kategori bulunamadı"}
                  </h2>
                  <p style={{ fontSize: "1.1rem", color: "var(--body-color)", marginBottom: "2rem" }}>
                    Aradığınız kategori mevcut değil veya silinmiş olabilir.
                  </p>
                  <Link
                    href={`/temsilcilikler/${repSlug}`}
                    className="btn btn-primary"
                    style={{
                      padding: "1rem 2rem",
                      fontSize: "1rem",
                      borderRadius: "8px",
                    }}
                  >
                    Temsilciliğe Dön
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterTwo />
        <ScrollToTop />
      </>
    );
  }

  // Priority: category breadcrumbImageUrl (kategori görseli) > representative breadcrumbImageUrl > default
  const breadcrumbBgImage = category.breadcrumbImageUrl 
    || representative?.breadcrumbImageUrl 
    || '/assets/img/breadcrumb.jpg';

  return (
    <>
      <SEO pageTitle={category.name} />
      <CustomCursor />
      <SwitchTab />
      <HeaderTwo />
      <BreadCrumb 
        title={category.name} 
        innerTitle={category.name}
        backgroundImage={breadcrumbBgImage}
      />
      <div className="page-wrapper">

        {/* Category Content */}
        <div className="section-padding">
          <div className="container">
            <div className="row">
              {/* Left Sidebar - Accordion Menu */}
              <div className="col-lg-3 columns_sticky">
                <div className="all__sidebar modern-sidebar">
                  <div className="all__sidebar-item">
                    <h4 className="modern-sidebar-title">Ürünler</h4>
                    <div className="product-accordion-menu modern-accordion-menu">
                      {allCategories.map((cat: any) => {
                        const isCategoryExpanded = expandedCategories.has(cat.id);
                        const hasSeries = cat.series && cat.series.length > 0;

                        return (
                          <div key={cat.id} className="accordion-item">
                            <div
                              className={`accordion-header ${isCategoryExpanded ? "expanded" : ""}`}
                              onClick={() => hasSeries && toggleCategory(cat.id)}
                            >
                              <Link
                                href={`/temsilcilikler/${repSlug}/kategoriler/${cat.slug}`}
                                onClick={(e) => {
                                  if (hasSeries) {
                                    e.preventDefault();
                                    toggleCategory(cat.id);
                                  }
                                }}
                                className={`accordion-link ${cat.slug === categorySlug ? "active" : ""}`}
                              >
                                {cat.name}
                              </Link>
                              {hasSeries && (
                                <span className={`accordion-arrow ${isCategoryExpanded ? "expanded" : ""}`}>
                                  ▶
                                </span>
                              )}
                            </div>

                            {isCategoryExpanded && hasSeries && (
                              <div className="accordion-content">
                                {cat.series.map((series: any) => {
                                  const isSeriesExpanded = expandedSeries.has(series.id);
                                  const hasVariants = series.variants && series.variants.length > 0;
                                  const hasProducts = series.products && series.products.length > 0;
                                  const hasChildren = hasVariants || hasProducts;

                                  return (
                                    <div key={series.id} className="accordion-item accordion-item-nested">
                                      <div
                                        className={`accordion-header accordion-header-nested ${isSeriesExpanded ? "expanded" : ""}`}
                                        onClick={() => hasChildren && toggleSeries(series.id)}
                                      >
                                        <span className="accordion-text">{series.name}</span>
                                        {hasChildren && (
                                          <span className={`accordion-arrow accordion-arrow-small ${isSeriesExpanded ? "expanded" : ""}`}>
                                            ▶
                                          </span>
                                        )}
                                      </div>

                                      {isSeriesExpanded && hasChildren && (
                                        <div className="accordion-content">
                                          {/* Variants */}
                                          {hasVariants &&
                                            series.variants.map((variant: any) => {
                                              const variantProducts = variant.products || [];
                                              return (
                                                <div
                                                  key={variant.id}
                                                  className="accordion-item accordion-item-variant"
                                                >
                                                  <div className="accordion-variant-header">
                                                    {variant.name}
                                                  </div>
                                                  {variantProducts.length > 0 && (
                                                    <div className="accordion-products-list">
                                                      {variantProducts.map((prod: any) => (
                                                        <Link
                                                          key={prod.id}
                                                          href={`/temsilcilikler/${repSlug}/urunler/${prod.slug}`}
                                                          className="accordion-product-link"
                                                        >
                                                          {prod.name || prod.slug}
                                                        </Link>
                                                      ))}
                                                    </div>
                                                  )}
                                                </div>
                                              );
                                            })}

                                          {/* Direct Products under Series */}
                                          {hasProducts &&
                                            !hasVariants &&
                                            series.products.map((prod: any) => (
                                              <Link
                                                key={prod.id}
                                                href={`/temsilcilikler/${repSlug}/urunler/${prod.slug}`}
                                                className="accordion-product-link accordion-product-link-direct"
                                              >
                                                {prod.name || prod.slug}
                                              </Link>
                                            ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content - Series Grid */}
              <div className="col-lg-9">
                <div className="mb-50">
                  <div className="t-center">
                    <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Kategori</span>
                    <h2 className="title_split_anim wow fadeInRight" data-wow-delay=".6s" style={{ marginBottom: category.description ? '1.5rem' : '0' }}>
                      {category.name}
                    </h2>
                    {category.description && (
                      <div 
                        className="wow fadeInUp" 
                        data-wow-delay=".8s"
                        style={{ 
                          fontSize: '1.05rem', 
                          lineHeight: '1.8', 
                          color: 'var(--body-color)',
                          maxWidth: '800px',
                          margin: '0 auto',
                          marginTop: '1.5rem'
                        }}
                        dangerouslySetInnerHTML={{ __html: category.description.replace(/\n/g, '<br />') }}
                      />
                    )}
                  </div>
                </div>

                {category.series && category.series.length > 0 ? (
                  <div className="three__columns">
                    <div className="row">
                      {category.series.map((series: Series) => {
                        const firstProductUrl = getFirstProductUrl(series);
                        const totalProducts = (series.variants?.reduce((acc: number, v: any) => acc + (v.products?.length || 0), 0) || 0) + (series.products?.length || 0);

                        return (
                          <div key={series.id} className="col-lg-4 col-md-6 mt-25">
                            <div className="portfolio__three-item">
                              {series.imageUrl ? (
                                <img src={series.imageUrl} alt={series.name} />
                              ) : (
                                <div style={{
                                  width: '100%',
                                  height: '480px',
                                  background: 'var(--color-2)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'var(--body-color)'
                                }}>
                                  <i className="flaticon-box" style={{ fontSize: '60px', opacity: 0.3 }}></i>
                                </div>
                              )}
                              <div className="portfolio__three-item-content">
                                {firstProductUrl ? (
                                  <Link href={firstProductUrl}>
                                    <i className="flaticon flaticon-right-up"></i>
                                  </Link>
                                ) : null}
                                <span>Seri</span>
                                {firstProductUrl ? (
                                  <h4>
                                    <Link href={firstProductUrl}>{series.name}</Link>
                                  </h4>
                                ) : (
                                  <h4>{series.name}</h4>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="t-center" style={{ padding: '3rem', background: 'var(--color-2)', borderRadius: '10px' }}>
                        <p style={{ fontSize: '1.1rem', color: 'var(--body-color)', marginBottom: '1.5rem' }}>
                          Bu kategoride henüz seri bulunmamaktadır.
                        </p>
                        <Link
                          href={`/temsilcilikler/${repSlug}`}
                          className="build_button"
                        >
                          Temsilciliğe Dön<i className="flaticon-right-up"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterTwo />
      <ScrollToTop />
    </>
  );
}
