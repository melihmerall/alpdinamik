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

interface ProductSummary {
  id: string;
  slug: string;
  name?: string;
  maxCapacity?: string;
}

interface VariantNode {
  id: string;
  name: string;
  slug: string;
  products?: ProductSummary[];
}

interface SeriesNode {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  variants?: VariantNode[];
  products?: ProductSummary[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  breadcrumbImageUrl?: string;
  series?: SeriesNode[];
}

const collectSeriesProducts = (series: SeriesNode) => {
  const uniqueProducts = new Map<string, ProductSummary>();

  const pushProducts = (products?: ProductSummary[]) => {
    products
      ?.filter((product) => product && product.id && product.slug)
      .forEach((product) => {
        if (product.id) {
          uniqueProducts.set(product.id, product);
        }
      });
  };

  pushProducts(series.products);
  series.variants?.forEach((variant) => pushProducts(variant.products));

  return Array.from(uniqueProducts.values());
};

const getSeriesProductCount = (series: SeriesNode) => collectSeriesProducts(series).length;

const getCategoryStats = (category: Category) => {
  // Sadece aktif serileri say
  const activeSeries = category.series?.filter(s => s && s.id) || [];
  const totalSeries = activeSeries.length;
  
  // Her seri için ürün sayısını hesapla
  const totalProducts = activeSeries.reduce((count, series) => {
    return count + getSeriesProductCount(series);
  }, 0);

  return { totalSeries, totalProducts };
};

const buildSeriesHighlights = (series: SeriesNode) => {
  const highlights: string[] = [];
  const uniqueProducts = collectSeriesProducts(series);
  const variantCount =
    series.variants?.filter((variant) => (variant.products?.length ?? 0) > 0).length ?? 0;
  const directProductCount = series.products?.length ?? 0;
  const totalProducts = uniqueProducts.length;

  if (variantCount > 0) {
    highlights.push(`${variantCount} farklı varyant seçeneği`);
  }

  if (directProductCount > 0) {
    highlights.push(`${directProductCount} doğrudan ürün`);
  }

  if (totalProducts > 0) {
    highlights.push(`${totalProducts} ürün konfigürasyonu`);
  }

  return highlights.slice(0, 3);
};

export default function CategoryPage() {
  const params = useParams();
  const repSlug = params.slug as string;
  const categorySlug = params.categorySlug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [representative, setRepresentative] = useState<any>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedSeries, setExpandedSeries] = useState<Set<string>>(new Set());
  const [expandedVariants, setExpandedVariants] = useState<Set<string>>(new Set());

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
          // Auto-expand current category and its series
          setExpandedCategories(new Set([categoryData.id]));
          setExpandedSeries(new Set(categoryData.series?.map((series: SeriesNode) => series.id) || []));
          setExpandedVariants(new Set());
        } else {
          setError("Kategori bulunamadı");
        }

        if (repRes.ok) {
          setRepresentative(await repRes.json());
        }

        if (categoriesRes.ok) {
          const categoriesList: Category[] = await categoriesRes.json();
          setAllCategories(categoriesList || []);
        } else {
          setAllCategories([]);
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
      const newSet = new Set<string>();
      if (!prev.has(categoryId)) {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const toggleSeries = (seriesId: string) => {
    setExpandedSeries((prev) => {
      const newSet = new Set<string>();
      if (!prev.has(seriesId)) {
        newSet.add(seriesId);
      }
      return newSet;
    });
  };

  const toggleVariant = (variantId: string) => {
    setExpandedVariants((prev) => {
      const newSet = new Set<string>();
      if (!prev.has(variantId)) {
        newSet.add(variantId);
      }
      return newSet;
    });
  };

  const getFirstProductUrl = (series: SeriesNode) => {
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

  const categoryStats = getCategoryStats(category);

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

        <div className="category-selection-band section-padding pt-0">
          <div className="container">
            <div className="category-selection-shell">
              <div className="category-selection-hero">
                <div className="category-selection-hero__content">
                  <span>Temsilci · {representative?.name}</span>
                  <h3>{category.name}</h3>
                  <p>
                    {category.description
                      ? category.description.replace(/<[^>]+>/g, '').slice(0, 180)
                      : `${representative?.name} ürün ailesindeki tüm kategorileri kısa yoldan keşfedin.`}
                  </p>
                  <div className="category-selection-stats">
                    <div>
                      <span>Toplam Seri</span>
                      <strong>{categoryStats.totalSeries}</strong>
                    </div>
                    <div>
                      <span>Ürün Kombinasyonu</span>
                      <strong>{categoryStats.totalProducts}</strong>
                    </div>
                    <div>
                      <span>Temsilci</span>
                      <strong>{representative?.name}</strong>
                    </div>
                  </div>
                </div>
                <div className="category-selection-hero__visual">
                  {category.breadcrumbImageUrl ? (
                    <img 
                      src={category.breadcrumbImageUrl} 
                      alt={category.name} 
                      loading="lazy"
                    />
                  ) : (
                    <div className="category-selection-hero__placeholder">
                      <i className="flaticon flaticon-right-up"></i>
                    </div>
                  )}
                </div>
              </div>

              <div className="category-selection-head">
                <div>
                  <span className="subtitle">Ürün Ağacı</span>
                  <h3>Tüm kategoriler bir arada</h3>
                </div>
                <p>
                  {representative?.name} markasına ait tüm kategorileri kısa yoldan ziyaret edin ve seri detaylarına
                  tek dokunuşla ulaşın.
                </p>
              </div>
              <div className="category-selection-grid">
                {allCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/temsilcilikler/${repSlug}/kategoriler/${cat.slug}`}
                    className={`category-selection-card ${cat.slug === categorySlug ? "is-active" : ""}`}
                  >
                    <div className="category-selection-card__image">
                      {cat.breadcrumbImageUrl ? (
                        <img 
                          src={cat.breadcrumbImageUrl} 
                          alt={cat.name} 
                          loading="lazy" 
                        />
                      ) : (
                        <div className="category-selection-card__placeholder">
                          <i className="flaticon-box" aria-hidden="true"></i>
                        </div>
                      )}
                    </div>
                    <div className="category-selection-card__content">
                      <h4>{cat.name}</h4>
                      <span>{cat.series?.length ?? 0} seri</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Category Content */}
        <div className="section-padding">
          <div className="container">
            <div className="row">
              {/* Left Sidebar - Modern Product Hierarchy */}
              <div className="col-lg-3 columns_sticky">
                <aside className="product-hierarchy-card">
                  <div className="product-hierarchy-card__header">
                    <p className="product-hierarchy-card__eyebrow">Ürün ağı</p>
                    <h4 className="product-hierarchy-card__title">
                      {representative?.name} ürünleri
                    </h4>
                    <p className="product-hierarchy-card__meta">
                      Tüm kategori, seri ve ürün kombinasyonlarını buradan keşfedin.
                    </p>
                  </div>
                  <div className="product-hierarchy">
                    {allCategories.length === 0 ? (
                      <div className="product-hierarchy__empty">
                        <p>Bu temsilciye ait kategori bulunamadı.</p>
                      </div>
                    ) : (
                      allCategories.map((cat) => {
                        const isCategoryExpanded = expandedCategories.has(cat.id);
                        const hasSeries = cat.series && cat.series.length > 0;
                        const stats = getCategoryStats(cat);

                        return (
                          <div
                            key={cat.id}
                            className={`product-hierarchy__category ${isCategoryExpanded ? "is-open" : ""}`}
                          >
                            <div className="product-hierarchy__category-head">
                              <button
                                type="button"
                                className="product-hierarchy__category-toggle"
                                onClick={() => hasSeries && toggleCategory(cat.id)}
                                aria-expanded={isCategoryExpanded}
                                disabled={!hasSeries}
                              >
                                <div className="product-hierarchy__category-info">
                                  <span className="product-hierarchy__category-name">{cat.name}</span>
                                  <span className="product-hierarchy__meta">
                                    {stats.totalSeries} seri
                                    {stats.totalProducts ? ` · ${stats.totalProducts} ürün` : ""}
                                  </span>
                                </div>
                                {hasSeries && <span className="product-hierarchy__chevron" aria-hidden="true" />}
                              </button>
                              <Link
                                href={`/temsilcilikler/${repSlug}/kategoriler/${cat.slug}`}
                                className={`product-hierarchy__pill ${cat.slug === categorySlug ? "is-active" : ""}`}
                              >
                                İncele
                              </Link>
                            </div>

                            {isCategoryExpanded && hasSeries && (
                              <div className="product-hierarchy__category-body">
                                {cat.series?.map((series) => {
                                  const isSeriesExpanded = expandedSeries.has(series.id);
                                  const hasVariants = series.variants && series.variants.length > 0;
                                  const directProducts = series.products || [];
                                  const hasDirectProducts = directProducts.length > 0;
                                  const hasChildren = hasVariants || hasDirectProducts;
                                  const seriesProductCount = getSeriesProductCount(series);

                                  return (
                                    <div
                                      key={series.id}
                                      className={`product-hierarchy__series ${isSeriesExpanded ? "is-open" : ""}`}
                                    >
                                      <button
                                        type="button"
                                        className="product-hierarchy__series-toggle"
                                        onClick={() => hasChildren && toggleSeries(series.id)}
                                        aria-expanded={isSeriesExpanded}
                                        disabled={!hasChildren}
                                      >
                                        <div>
                                          <span className="product-hierarchy__series-name">{series.name}</span>
                                          {hasChildren && (
                                            <span className="product-hierarchy__meta">{seriesProductCount} ürün</span>
                                          )}
                                        </div>
                                        {hasChildren && <span className="product-hierarchy__chevron" aria-hidden="true" />}
                                      </button>

                                      {isSeriesExpanded && hasChildren && (
                                        <div className="product-hierarchy__series-body">
                                          {hasVariants &&
                                            series.variants?.map((variant) => {
                                              const variantProducts = variant.products || [];
                                              const isVariantExpanded = expandedVariants.has(variant.id);
                                              const hasVariantProducts = variantProducts.length > 0;

                                              return (
                                                <div
                                                  key={variant.id}
                                                  className={`product-hierarchy__variant ${isVariantExpanded ? "is-open" : ""}`}
                                                >
                                                  <button
                                                    type="button"
                                                    className="product-hierarchy__variant-toggle"
                                                    onClick={() => hasVariantProducts && toggleVariant(variant.id)}
                                                    aria-expanded={isVariantExpanded}
                                                    disabled={!hasVariantProducts}
                                                  >
                                                    <span>{variant.name}</span>
                                                    {hasVariantProducts && (
                                                      <span className="product-hierarchy__chevron" aria-hidden="true" />
                                                    )}
                                                  </button>
                                                  {isVariantExpanded && hasVariantProducts && (
                                                    <div className="product-hierarchy__products">
                                                      {variantProducts.map((prod) => (
                                                        <Link
                                                          key={prod.id}
                                                          href={`/temsilcilikler/${repSlug}/urunler/${prod.slug}`}
                                                          className="product-hierarchy__product"
                                                        >
                                                          <span className="product-hierarchy__product-name">
                                                            {prod.name || prod.slug}
                                                          </span>
                                                          {prod.maxCapacity && (
                                                            <span className="product-hierarchy__product-meta">
                                                              Max. {prod.maxCapacity}
                                                            </span>
                                                          )}
                                                        </Link>
                                                      ))}
                                                    </div>
                                                  )}
                                                </div>
                                              );
                                            })}

                                          {hasDirectProducts && !hasVariants && (
                                            <div className="product-hierarchy__products is-direct">
                                              {directProducts.map((prod) => (
                                                <Link
                                                  key={prod.id}
                                                  href={`/temsilcilikler/${repSlug}/urunler/${prod.slug}`}
                                                  className="product-hierarchy__product"
                                                >
                                                  <span className="product-hierarchy__product-name">
                                                    {prod.name || prod.slug}
                                                  </span>
                                                  {prod.maxCapacity && (
                                                    <span className="product-hierarchy__product-meta">
                                                      Max. {prod.maxCapacity}
                                                    </span>
                                                  )}
                                                </Link>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </aside>
              </div>

              {/* Right Content - Series Grid */}
              <div className="col-lg-9">
                <div className="category-detail-head">
                  <div>
                    <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Kategori</span>
                    <h2 className="title_split_anim wow fadeInRight" data-wow-delay=".6s">
                      {category.name}
                    </h2>
                  </div>
                  {category.description && (
                    <div
                      className="wow fadeInUp category-detail-description"
                      data-wow-delay=".8s"
                      dangerouslySetInnerHTML={{ __html: category.description.replace(/\n/g, '<br />') }}
                    />
                  )}
                </div>

                {category.series && category.series.length > 0 ? (
                  <div className="category-series-grid">
                    {category.series.map((series) => {
                      const highlights = buildSeriesHighlights(series);
                      const firstProductUrl = getFirstProductUrl(series);

                      return (
                        <div key={series.id} className="category-feature-card">
                          <div className="category-feature-card__media">
                            {series.imageUrl ? (
                              <img 
                                src={series.imageUrl} 
                                alt={series.name} 
                                loading="lazy"
                              />
                            ) : (
                              <div className="category-feature-card__placeholder">
                                <i className="flaticon-box"></i>
                              </div>
                            )}
                          </div>
                          <div className="category-feature-card__content">
                            <div className="category-feature-card__header">
                              <span>Seri</span>
                              <h3>
                                {firstProductUrl ? (
                                  <Link href={firstProductUrl}>{series.name}</Link>
                                ) : (
                                  series.name
                                )}
                              </h3>
                            </div>
                            {highlights.length > 0 && (
                              <ul>
                                {highlights.map((item, idx) => (
                                  <li key={idx}>{item}</li>
                                ))}
                              </ul>
                            )}
                            <div className="category-feature-card__actions">
                              {firstProductUrl && (
                                <Link href={firstProductUrl} className="build_button">
                                  Ürünleri İncele<i className="flaticon-right-up"></i>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
