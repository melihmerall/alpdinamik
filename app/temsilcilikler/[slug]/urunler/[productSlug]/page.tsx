"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import React from "react";
import HeaderTwo from "@/components/layout/headers/header-two";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "@/components/pages/common/scroll/scroll-to-top";
import { InteractiveSVGProduct } from "./InteractiveSVG";
import { ExplodedView } from "./ExplodedView";

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  body?: string;
  imageUrl?: string;
  breadcrumbImageUrl?: string;
  maxCapacity?: string;
  technicalPdfUrl?: string;
  file2dUrl?: string;
  file3dUrl?: string;
  externalProductUrl?: string;
  svgBaseImage?: string;
  svgComponents?: any;
  explodedViewBaseImage?: string;
  explodedViewComponents?: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    image: string;
    link?: string;
  }>;
  infoImageUrl?: string;
  representative?: {
    id: string;
    name: string;
    slug: string;
    breadcrumbImageUrl?: string;
  };
  series?: {
    id: string;
    name: string;
    slug: string;
    category: {
      id: string;
      name: string;
      slug: string;
    };
  };
  variant?: {
    id: string;
    name: string;
    slug: string;
  };
  images?: Array<{
    id: string;
    imageUrl: string;
    alt?: string;
    order: number;
  }>;
}

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
  variants?: VariantNode[];
  products?: ProductSummary[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  series?: SeriesNode[];
}

const getSeriesProductCount = (series: SeriesNode) => {
  // Sadece aktif ve gerçekten var olan ürünleri say
  const variantProductCount =
    series.variants?.reduce((acc, variant) => {
      const products = variant.products?.filter(p => p && p.id && p.slug) || [];
      return acc + products.length;
    }, 0) ?? 0;

  const directProducts = series.products?.filter(p => p && p.id && p.slug) || [];
  return variantProductCount + directProducts.length;
};

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

export default function ProductPage() {
  const params = useParams();
  const repSlug = params.slug as string;
  const productSlug = params.productSlug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedSeries, setExpandedSeries] = useState<Set<string>>(new Set());
  const [expandedVariants, setExpandedVariants] = useState<Set<string>>(new Set());
  const [defaultBreadcrumb, setDefaultBreadcrumb] = useState<string | null>(null);

  const syncExpandedState = useCallback((productData?: Product | null, categoryList?: Category[]) => {
    if (!productData || !categoryList || categoryList.length === 0) {
      setExpandedCategories(new Set());
      setExpandedSeries(new Set());
      setExpandedVariants(new Set());
      return;
    }

    const categorySet = new Set<string>();
    const seriesSet = new Set<string>();
    const variantSet = new Set<string>();

    if (productData.series?.category?.id) {
      categorySet.add(productData.series.category.id);
    }
    if (productData.series?.id) {
      seriesSet.add(productData.series.id);
    }
    if (productData.variant?.id) {
      variantSet.add(productData.variant.id);
    }

    setExpandedCategories(categorySet);
    setExpandedSeries(seriesSet);
    setExpandedVariants(variantSet);
  }, []);

  useEffect(() => {
    if (!repSlug || !productSlug) return;

    const controller = new AbortController();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const [settingsData, productData, categoriesData] = await Promise.all([
          (async () => {
            try {
              const res = await fetch(`${baseUrl}/api/site-settings`, { signal: controller.signal });
              if (!res.ok) return null;
              return res.json();
            } catch {
              return null;
            }
          })(),
          (async () => {
            const res = await fetch(
              `${baseUrl}/api/representatives/${repSlug}/products/${productSlug}`,
              { signal: controller.signal }
            );
            if (!res.ok) return null;
            return res.json();
          })(),
          (async () => {
            const res = await fetch(
              `${baseUrl}/api/representatives/${repSlug}/categories`,
              { signal: controller.signal }
            );
            if (!res.ok) return [];
            return res.json();
          })(),
        ]);

        if (controller.signal.aborted) return;

        setDefaultBreadcrumb(settingsData?.defaultBreadcrumbImageUrl || null);

        if (!productData) {
          setError("Ürün bulunamadı");
          setProduct(null);
          setCategories([]);
          syncExpandedState(null, []);
          setLoading(false);
          return;
        }

        setProduct(productData);
        const normalizedCategories = Array.isArray(categoriesData) ? categoriesData : [];
        setCategories(normalizedCategories);
        syncExpandedState(productData, normalizedCategories);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Error fetching data:", error);
        setError("Veri yüklenirken bir hata oluştu");
        setProduct(null);
        setCategories([]);
        syncExpandedState(null, []);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => controller.abort();
  }, [repSlug, productSlug, syncExpandedState]);

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

  if (error || !product) {
    return (
      <>
        <HeaderTwo />
        <div className="page-wrapper">
          <div className="section-padding">
            <div className="container">
              <div className="row">
                <div className="col-xl-12 text-center py-5">
                  <h2 style={{ fontSize: "2rem", marginBottom: "1rem", color: "var(--text-heading-color)" }}>
                    {error || "Ürün bulunamadı"}
                  </h2>
                  <p style={{ fontSize: "1.1rem", color: "var(--body-color)", marginBottom: "2rem" }}>
                    Aradığınız ürün mevcut değil veya silinmiş olabilir.
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
            backgroundImage: product.breadcrumbImageUrl
              ? `url(${product.breadcrumbImageUrl})`
              : product.representative?.breadcrumbImageUrl
              ? `url(${product.representative.breadcrumbImageUrl})`
              : defaultBreadcrumb
              ? `url(${defaultBreadcrumb})`
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
                  <h2>{product.name}</h2>
                  <ul>
                    <li>
                      <Link href="/">Anasayfa</Link>
                      <i className="fa-regular fa-angle-right"></i>
                    </li>
                    <li>
                      <Link href="/temsilcilikler">Temsilcilikler</Link>
                      <i className="fa-regular fa-angle-right"></i>
                    </li>
                    <li>
                      <Link href={`/temsilcilikler/${repSlug}`}>
                        {product.representative?.name}
                      </Link>
                      <i className="fa-regular fa-angle-right"></i>
                    </li>
                    {product.series?.category && (
                      <>
                        <li>
                          <Link
                            href={`/temsilcilikler/${repSlug}/kategoriler/${product.series.category.slug}`}
                          >
                            {product.series.category.name}
                          </Link>
                          <i className="fa-regular fa-angle-right"></i>
                        </li>
                      </>
                    )}
                    <li>{product.name}</li>
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
              {/* Left Sidebar - Modern Product Hierarchy */}
              <div className="col-lg-3 columns_sticky">
                <aside className="product-hierarchy-card">
                  <div className="product-hierarchy-card__header">
                    <p className="product-hierarchy-card__eyebrow">Ürün ağı</p>
                    <h4 className="product-hierarchy-card__title">Temsil edilen ürünler</h4>
                    <p className="product-hierarchy-card__meta">
                      {product.representative?.name} markasına ait tüm kategori, seri ve varyantlara buradan ulaşabilirsiniz.
                    </p>
                  </div>
                  <div className="product-hierarchy">
                    {categories.length === 0 ? (
                      <div className="product-hierarchy__empty">
                        <p>Bu temsilci için henüz kategori eklenmemiş.</p>
                      </div>
                    ) : (
                      categories.map((category) => {
                        const isCategoryExpanded = expandedCategories.has(category.id);
                        const hasSeries = category.series && category.series.length > 0;
                        const stats = getCategoryStats(category);

                        return (
                          <div
                            key={category.id}
                            className={`product-hierarchy__category ${isCategoryExpanded ? "is-open" : ""}`}
                          >
                            <div className="product-hierarchy__category-head">
                              <button
                                type="button"
                                className="product-hierarchy__category-toggle"
                                onClick={() => hasSeries && toggleCategory(category.id)}
                                aria-expanded={isCategoryExpanded}
                                disabled={!hasSeries}
                              >
                                <div className="product-hierarchy__category-info">
                                  <span className="product-hierarchy__category-name">{category.name}</span>
                                  <span className="product-hierarchy__meta">
                                    {stats.totalSeries} seri
                                  </span>
                                </div>
                                {hasSeries && <span className="product-hierarchy__chevron" aria-hidden="true" />}
                              </button>
                              <Link
                                href={`/temsilcilikler/${repSlug}/kategoriler/${category.slug}`}
                                className="product-hierarchy__pill"
                              >
                                Kategori Detayı
                              </Link>
                            </div>

                            {isCategoryExpanded && hasSeries && (
                              <div className="product-hierarchy__category-body">
                                {category.series?.map((series) => {
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
                                            <span className="product-hierarchy__meta">ürünler</span>
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
                                                          className={`product-hierarchy__product ${
                                                            prod.slug === productSlug ? "is-active" : ""
                                                          }`}
                                                          aria-current={prod.slug === productSlug ? "true" : undefined}
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
                                                  className={`product-hierarchy__product ${
                                                    prod.slug === productSlug ? "is-active" : ""
                                                  }`}
                                                  aria-current={prod.slug === productSlug ? "true" : undefined}
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

              {/* Right Content - Product Details */}
              <div className="col-lg-9">
                <div className="product-detail-layout">
                  {/* Product Header with Title and Buttons */}
                  <div className="product-header-section">
                    <div className="product-title-group">
                      <h1 className="product-main-title">{product.name}</h1>
                      {product.maxCapacity && (
                        <p className="product-subtitle">Max {product.maxCapacity}</p>
                      )}
                    </div>
                    <div className="product-view-buttons">
                      {product.file2dUrl && product.file2dUrl.trim() !== '' ? (
                        <a
                          href={product.file2dUrl}
                          className="view-btn view-btn-2d"
                          target="_blank"
                          rel="noopener noreferrer"
                          download={product.file2dUrl.match(/\.(pdf|zip|rar|7z|dwg|dxf|x_t)$/i) ? true : undefined}
                        >
                          2D
                        </a>
                      ) : (
                        <button className="view-btn view-btn-2d" disabled>2D</button>
                      )}
                      {product.file3dUrl && product.file3dUrl.trim() !== '' ? (
                        <a
                          href={product.file3dUrl}
                          className="view-btn view-btn-3d active"
                          target="_blank"
                          rel="noopener noreferrer"
                          download={product.file3dUrl.match(/\.(pdf|zip|rar|7z|dwg|dxf|x_t)$/i) ? true : undefined}
                        >
                          3D
                        </a>
                      ) : (
                        <button className="view-btn view-btn-3d active" disabled>3D</button>
                      )}

                    </div>
                  </div>

                  {/* 3D View and Exploded View */}
                  <div className="product-visual-section">
                    <div className="product-3d-view">
                      {product.svgBaseImage && product.svgComponents ? (
                        <InteractiveSVGProduct
                          baseImage={product.svgBaseImage}
                          components={product.svgComponents}
                        />
                      ) : product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="product-3d-image"
                        />
                      ) : (
                        <div className="product-placeholder">3D Görsel</div>
                      )}
                    </div>
                    <div className="product-exploded-view">
                      {product.explodedViewBaseImage && product.explodedViewComponents ? (
                        <ExplodedView
                          baseImage={product.explodedViewBaseImage}
                          components={product.explodedViewComponents}
                          svgWidth={405}
                          svgHeight={650}
                        />
                      ) : product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].imageUrl}
                          alt="Exploded View"
                          className="product-exploded-image"
                        />
                      ) : (
                        <div className="product-placeholder">Exploded View</div>
                      )}
                    </div>
                  </div>

                  {/* Product Description */}
                  {product.description && (
                    <div
                      className="product-description-section"
                      dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, "<br />") }}
                    />
                  )}

                  {/* Product Body - Table or Content */}
                  {(product.body || product.infoImageUrl) && (
                    <div className="product-info-section">
                      <h2 className="product-info-title">ÜRÜN BİLGİSİ</h2>
                      {product.infoImageUrl && (
                        <div className="product-info-image-wrapper">
                          <img
                            src={product.infoImageUrl}
                            alt={product.name}
                            className="product-info-image"
                          />
                        </div>
                      )}
                      {product.body && (
                        <div
                          className="product-info-content"
                          dangerouslySetInnerHTML={{ __html: product.body }}
                        />
                      )}
                    </div>
                  )}

                  {/* Technical PDF Download */}
                  {product.technicalPdfUrl && (
                    <div className="product-download-section">
                      <a
                        href={product.technicalPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="product-download-link"
                      >
                        <i className="fa-solid fa-file-pdf"></i>
                        Teknik Dökümanı İndir
                      </a>
                    </div>
                  )}
                </div>
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
