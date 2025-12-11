import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import HeaderTwo from "@/components/layout/headers/header-two";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "@/components/layout/scroll-to-top";

async function getProduct(repSlug: string, productSlug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/representatives/${repSlug}/products/${productSlug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

async function getProductImages(repSlug: string, productSlug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/representatives/${repSlug}/products/${productSlug}/images`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return [];
  }

  return res.json();
}

async function getRepresentative(repSlug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/representatives/${repSlug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function ProductDetailPage({
  params,
}: {
  params: { repSlug: string; productSlug: string };
}) {
  const [product, representative, productImages] = await Promise.all([
    getProduct(params.repSlug, params.productSlug),
    getRepresentative(params.repSlug),
    getProductImages(params.repSlug, params.productSlug),
  ]);

  if (!product || !representative) {
    notFound();
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
              ? `url('${product.breadcrumbImageUrl}')`
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
                      <Link href={`/temsilcilikler/${params.repSlug}`}>
                        {representative.name}
                      </Link>
                      <i className="fa-regular fa-angle-right"></i>
                    </li>
                    <li>{product.name}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Content */}
        <div className="section-padding">
          <div className="container">
            <div className="row">
              {/* Main Content */}
              <div className="col-xl-8 col-lg-7">
                <div className="product-details">
                  <h1 style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}>
                    {product.name}
                  </h1>

                  {product.maxCapacity && (
                    <div
                      style={{
                        display: "inline-block",
                        padding: "0.5rem 1.5rem",
                        background: "#f8f9fa",
                        borderRadius: "8px",
                        marginBottom: "2rem",
                        fontSize: "1.1rem",
                        fontWeight: "600",
                      }}
                    >
                      Maksimum Kapasite: {product.maxCapacity}
                    </div>
                  )}

                  {product.description && (
                    <div style={{ marginBottom: "2rem" }}>
                      <p style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
                        {product.description}
                      </p>
                    </div>
                  )}

                  {product.body && (
                    <div
                      style={{ marginBottom: "2rem" }}
                      dangerouslySetInnerHTML={{ __html: product.body }}
                    />
                  )}

                  {product.technicalPdfUrl && (
                    <div style={{ marginTop: "2rem" }}>
                      <a
                        href={product.technicalPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{
                          padding: "1rem 2rem",
                          fontSize: "1rem",
                          borderRadius: "8px",
                        }}
                      >
                        <i className="fas fa-file-pdf me-2"></i>
                        Teknik Döküman İndir
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Images Sidebar */}
              <div className="col-xl-4 col-lg-5">
                <div
                  style={{
                    position: "sticky",
                    top: "100px",
                    background: "#fff",
                    padding: "2rem",
                    borderRadius: "12px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  }}
                >
                  {/* Main Image or SVG */}
                  {product.svgBaseImage && product.svgComponents ? (
                    <InteractiveSVGProduct
                      baseImage={product.svgBaseImage}
                      components={product.svgComponents}
                    />
                  ) : product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      style={{
                        width: "100%",
                        borderRadius: "8px",
                        marginBottom: productImages.length > 0 ? "1.5rem" : "0",
                      }}
                    />
                  ) : null}

                  {/* Product Gallery */}
                  {productImages.length > 0 && (
                    <div>
                      <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>
                        Ürün Fotoğrafları
                      </h3>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, 1fr)",
                          gap: "0.75rem",
                        }}
                      >
                        {productImages.map((img: any) => (
                          <div
                            key={img.id}
                            style={{
                              position: "relative",
                              paddingTop: "100%",
                              borderRadius: "8px",
                              overflow: "hidden",
                              border: "1px solid #e5e7eb",
                              cursor: "pointer",
                            }}
                          >
                            <img
                              src={img.imageUrl}
                              alt={img.alt || product.name}
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        ))}
                      </div>
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

// Interactive SVG Component (Client Component)
function InteractiveSVGProduct({
  baseImage,
  components,
}: {
  baseImage: string;
  components: any;
}) {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <img
        src={baseImage}
        alt="Product"
        style={{ width: "100%", display: "block" }}
      />
      {/* SVG Overlay will be rendered client-side */}
      <InteractiveSVGOverlay components={components} />
    </div>
  );
}

// Client Component for SVG Interactivity
function InteractiveSVGOverlay({ components }: { components: any }) {
  "use client";
  
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  if (!components || !Array.isArray(components)) {
    return null;
  }

  return (
    <svg
      width="405"
      height="650"
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      {components.map((comp: any) => (
        <a
          key={comp.id}
          href={comp.link || "#"}
          target={comp.link ? "_blank" : undefined}
          rel={comp.link ? "noopener noreferrer" : undefined}
        >
          <image
            id={comp.id}
            x={comp.x}
            y={comp.y}
            width={comp.width}
            height={comp.height}
            href={hoveredId === comp.id ? comp.hoverImage : comp.image}
            onMouseEnter={() => setHoveredId(comp.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{ cursor: comp.link ? "pointer" : "default" }}
          />
        </a>
      ))}
    </svg>
  );
}

