"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
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

interface Category {
  id: string;
  name: string;
  slug: string;
  series: Array<{
    id: string;
    name: string;
    slug: string;
    variants: Array<{
      id: string;
      name: string;
      slug: string;
      products: Array<{ id: string; slug: string }>;
    }>;
    products: Array<{ id: string; slug: string }>;
  }>;
}

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

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch default breadcrumb from site settings
        const settingsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/site-settings`);
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setDefaultBreadcrumb(settingsData.defaultBreadcrumbImageUrl || null);
        }

        const [productRes, categoriesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/representatives/${repSlug}/products/${productSlug}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/representatives/${repSlug}/categories`),
        ]);

        if (productRes.ok) {
          const productData = await productRes.json();
          setProduct(productData);
          
          // Auto-expand current category, series and variant
          if (productData.series?.category) {
            setExpandedCategories(new Set([productData.series.category.id]));
            if (productData.series) {
              setExpandedSeries(new Set([productData.series.id]));
            }
            if (productData.variantId) {
              setExpandedVariants(new Set([productData.variantId]));
            }
          }
        } else {
          setError("Ürün bulunamadı");
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          // Fetch full category data with series and variants
          const fullCategories = await Promise.all(
            categoriesData.map(async (cat: any) => {
              const catRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/representatives/${repSlug}/categories/${cat.slug}`
              );
              if (catRes.ok) {
                const categoryData = await catRes.json();
                // Debug: Check if products are included
                    if (categoryData.series && categoryData.series.length > 0) {
                      categoryData.series.forEach((series: any) => {
                        if (series.variants && series.variants.length > 0) {
                          series.variants.forEach((variant: any) => {
                            // Variant products are available in variant.products
                          });
                        }
                      });
                    }
                return categoryData;
              }
              return cat;
            })
          );
          setCategories(fullCategories);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Veri yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [repSlug, productSlug]);

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

  const toggleVariant = (variantId: string) => {
    setExpandedVariants((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(variantId)) {
        newSet.delete(variantId);
      } else {
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
              {/* Left Sidebar - Accordion Menu */}
              <div className="col-lg-3 columns_sticky">
                <div className="all__sidebar modern-sidebar">
                  <div className="all__sidebar-item">
                    <h4 className="modern-sidebar-title">Ürünler</h4>
                    <div className="product-accordion-menu modern-accordion-menu">
                      {categories.map((category) => {
                        const isCategoryExpanded = expandedCategories.has(category.id);
                        const hasSeries = category.series && category.series.length > 0;

                        return (
                          <div key={category.id} className="accordion-item">
                            <div
                              className={`accordion-header ${isCategoryExpanded ? "expanded" : ""}`}
                              onClick={() => hasSeries && toggleCategory(category.id)}
                            >
                              <Link
                                href={`/temsilcilikler/${repSlug}/kategoriler/${category.slug}`}
                                onClick={(e) => {
                                  if (hasSeries) {
                                    e.preventDefault();
                                    toggleCategory(category.id);
                                  }
                                }}
                                className="accordion-link"
                              >
                                {category.name}
                              </Link>
                              {hasSeries && (
                                <span className={`accordion-arrow ${isCategoryExpanded ? "expanded" : ""}`}>
                                  ▶
                                </span>
                              )}
                            </div>

                            {isCategoryExpanded && hasSeries && (
                              <div className="accordion-content">
                                {category.series.map((series) => {
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
                                            series.variants.map((variant) => {
                                              const variantProducts = variant.products || [];
                                              const isVariantExpanded = expandedVariants.has(variant.id);
                                              const hasProducts = variantProducts.length > 0;
                                              
                                              return (
                                                <div
                                                  key={variant.id}
                                                  className="accordion-item accordion-item-variant"
                                                >
                                                  <div 
                                                    className={`accordion-variant-header ${isVariantExpanded ? "expanded" : ""}`}
                                                    onClick={() => hasProducts && toggleVariant(variant.id)}
                                                    style={{ cursor: hasProducts ? "pointer" : "default" }}
                                                  >
                                                    <span className="accordion-variant-text">{variant.name}</span>
                                                    {hasProducts && (
                                                      <span className={`accordion-arrow accordion-arrow-variant ${isVariantExpanded ? "expanded" : ""}`}>
                                                        ▶
                                                      </span>
                                                    )}
                                                  </div>
                                                  {isVariantExpanded && hasProducts && (
                                                    <div className="accordion-products-list">
                                                      {variantProducts.map((prod: any) => (
                                                        <Link
                                                          key={prod.id}
                                                          href={`/temsilcilikler/${repSlug}/urunler/${prod.slug}`}
                                                          className={`accordion-product-link ${prod.slug === productSlug ? "active-product" : ""}`}
                                                        >
                                                          <span className="accordion-product-name">
                                                            {prod.name || prod.slug}
                                                          </span>
                                                          {prod.maxCapacity && (
                                                            <span className="accordion-product-capacity">
                                                              (Max. {prod.maxCapacity})
                                                            </span>
                                                          )}
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
                                                className={`accordion-product-link accordion-product-link-direct ${prod.slug === productSlug ? "active-product" : ""}`}
                                              >
                                                <span className="accordion-product-name">
                                                  {prod.name || prod.slug}
                                                </span>
                                                {prod.maxCapacity && (
                                                  <span className="accordion-product-capacity">
                                                    (Max. {prod.maxCapacity})
                                                  </span>
                                                )}
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
                      {product.externalProductUrl && (
                        <a
                          href={product.externalProductUrl}
                          className="view-btn view-btn-config"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Üretici Sitesinde Gör
                        </a>
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
