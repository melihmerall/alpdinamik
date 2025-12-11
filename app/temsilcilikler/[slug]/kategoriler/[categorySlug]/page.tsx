"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import HeaderTwo from "@/components/layout/headers/header-two";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "@/components/pages/common/scroll/scroll-to-top";

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
                  <h2 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#333" }}>
                    {error || "Kategori bulunamadı"}
                  </h2>
                  <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "2rem" }}>
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

  return (
    <>
      <HeaderTwo />
      <div className="page-wrapper">
        {/* Breadcrumb */}
        <div
          className="breadcrumb__area"
          style={{
            backgroundImage: category.breadcrumbImageUrl
              ? `url('${category.breadcrumbImageUrl}')`
              : `url('/assets/img/breadcrumb.jpg')`,
            padding: "120px 0",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="container">
            <div className="row">
              <div className="col-xl-12">
                <div className="breadcrumb__area-content">
                  <h2>{category.name}</h2>
                  <ul>
                    <li>
                      <Link href="/">Anasayfa</Link>
                      <i className="fa-regular fa-angle-right"></i>
                    </li>
                    <li>
                      <Link href={`/temsilcilikler/${repSlug}`}>
                        {representative.name}
                      </Link>
                      <i className="fa-regular fa-angle-right"></i>
                    </li>
                    <li>{category.name}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                {category.description && (
                  <div className="modern-category-intro">
                    <div className="section-title">
                      <h2 className="modern-category-title">{category.name}</h2>
                      <p className="modern-category-description">
                        {category.description}
                      </p>
                    </div>
                  </div>
                )}

                {category.series && category.series.length > 0 ? (
                  <div className="modern-series-layout">
                    {category.series.map((series: Series) => {
                      const firstProductUrl = getFirstProductUrl(series);
                      const seriesFeatures = series.description
                        ? series.description
                            .split("\n")
                            .filter((line: string) => line.trim())
                            .map((line: string) => line.replace(/^[-•]\s*/, "").trim())
                        : [];

                      return (
                        <div key={series.id} className="modern-series-card">
                          {series.imageUrl && firstProductUrl ? (
                            <Link href={firstProductUrl} className="modern-series-image-wrapper">
                              <div className="modern-series-image-overlay">
                                <span className="modern-view-details">Detayları Gör</span>
                              </div>
                              <img
                                src={series.imageUrl}
                                alt={series.name}
                                loading="lazy"
                                decoding="async"
                                className="modern-series-image"
                              />
                            </Link>
                          ) : series.imageUrl ? (
                            <div className="modern-series-image-wrapper">
                              <img
                                src={series.imageUrl}
                                alt={series.name}
                                loading="lazy"
                                decoding="async"
                                className="modern-series-image"
                              />
                            </div>
                          ) : null}

                          <div className="modern-series-content">
                            {firstProductUrl ? (
                              <h2 className="modern-series-title">
                                <Link href={firstProductUrl} className="modern-series-title-link">
                                  {series.name}
                                </Link>
                              </h2>
                            ) : (
                              <h2 className="modern-series-title">{series.name}</h2>
                            )}

                            {seriesFeatures.length > 0 && (
                              <ul className="modern-series-features">
                                {seriesFeatures.map((feature: string, idx: number) => (
                                  <li key={idx} className="modern-feature-item">
                                    <span className="modern-feature-icon">✓</span>
                                    <span className="modern-feature-text">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="row">
                    <div className="col-xl-12 text-center py-5">
                      <p className="lead">Bu kategoride henüz seri bulunmamaktadır.</p>
                      <Link
                        href={`/temsilcilikler/${repSlug}`}
                        className="btn btn-primary mt-3"
                      >
                        Temsilciliğe Dön
                      </Link>
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
