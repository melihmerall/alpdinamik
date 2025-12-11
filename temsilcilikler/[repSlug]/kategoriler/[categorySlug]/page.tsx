import Link from "next/link";
import { notFound } from "next/navigation";
import HeaderTwo from "@/components/layout/headers/header-two";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "@/components/layout/scroll-to-top";

async function getCategory(repSlug: string, categorySlug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/representatives/${repSlug}/categories/${categorySlug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return null;
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

async function getAllCategories(repSlug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/representatives/${repSlug}/categories`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return [];
  }

  return res.json();
}

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
    products: Array<{ id: string; slug: string }>;
  }>;
  products: Array<{ id: string; slug: string }>;
}

export default async function CategoryPage({
  params,
}: {
  params: { repSlug: string; categorySlug: string };
}) {
  const [category, representative, allCategories] = await Promise.all([
    getCategory(params.repSlug, params.categorySlug),
    getRepresentative(params.repSlug),
    getAllCategories(params.repSlug),
  ]);

  if (!category || !representative) {
    notFound();
  }

  const getFirstProductUrl = (series: Series) => {
    // First try variants
    for (const variant of series.variants || []) {
      if (variant.products && variant.products.length > 0) {
        return `/temsilcilikler/${params.repSlug}/urunler/${variant.products[0].slug}`;
      }
    }
    // Then try direct products
    if (series.products && series.products.length > 0) {
      return `/temsilcilikler/${params.repSlug}/urunler/${series.products[0].slug}`;
    }
    return null;
  };

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
                      <Link href={`/temsilcilikler/${params.repSlug}`}>
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
              {/* Left Sidebar - Category List */}
              <div className="col-lg-3 columns_sticky">
                <div className="all__sidebar">
                  <div className="all__sidebar-item">
                    <h4>Kategoriler</h4>
                    <div className="all__sidebar-item-category">
                      <ul>
                        {allCategories.map((cat: any) => (
                          <li key={cat.id}>
                            <Link
                              href={`/temsilcilikler/${params.repSlug}/kategoriler/${cat.slug}`}
                              className={cat.slug === params.categorySlug ? "active" : ""}
                            >
                              {cat.name}
                              <i className="flaticon-right-up"></i>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content - Series Grid */}
              <div className="col-lg-9">
                {category.description && (
                  <div className="mb-5">
                    <div className="section-title">
                      <h2>{category.name}</h2>
                      <p
                        style={{
                          fontSize: "1.1rem",
                          lineHeight: "1.8",
                          maxWidth: "800px",
                          margin: "1rem 0 0",
                        }}
                      >
                        {category.description}
                      </p>
                    </div>
                  </div>
                )}

                {category.series && category.series.length > 0 ? (
                  <div className="row">
                    {category.series.map((series: Series) => {
                      const firstProductUrl = getFirstProductUrl(series);
                      const seriesFeatures = series.description
                        ? series.description
                            .split("\n")
                            .filter((line: string) => line.trim())
                            .map((line: string) => line.replace(/^[-•]\s*/, "").trim())
                        : [];

                      return (
                        <div key={series.id} className="col-lg-6 col-md-6 mb-4">
                          <div
                            className="series-card"
                            style={{
                              background: "#fff",
                              borderRadius: "12px",
                              padding: "2rem",
                              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              transition: "all 0.3s ease",
                            }}
                          >
                            {series.imageUrl && firstProductUrl ? (
                              <Link
                                href={firstProductUrl}
                                style={{
                                  display: "block",
                                  marginBottom: "1.5rem",
                                  textAlign: "center",
                                }}
                              >
                                <img
                                  src={series.imageUrl}
                                  alt={series.name}
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: "300px",
                                    objectFit: "contain",
                                    borderRadius: "8px",
                                  }}
                                />
                              </Link>
                            ) : series.imageUrl ? (
                              <div
                                style={{
                                  marginBottom: "1.5rem",
                                  textAlign: "center",
                                }}
                              >
                                <img
                                  src={series.imageUrl}
                                  alt={series.name}
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: "300px",
                                    objectFit: "contain",
                                    borderRadius: "8px",
                                  }}
                                />
                              </div>
                            ) : null}

                            {firstProductUrl ? (
                              <h3
                                style={{
                                  fontSize: "1.5rem",
                                  fontWeight: "700",
                                  marginBottom: "1rem",
                                  lineHeight: "1.3",
                                }}
                              >
                                <Link
                                  href={firstProductUrl}
                                  style={{
                                    color: "#2277bb",
                                    textDecoration: "none",
                                  }}
                                  className="productTitle"
                                >
                                  {series.name}
                                </Link>
                              </h3>
                            ) : (
                              <h3
                                style={{
                                  fontSize: "1.5rem",
                                  fontWeight: "700",
                                  marginBottom: "1rem",
                                  lineHeight: "1.3",
                                  color: "#333",
                                }}
                              >
                                {series.name}
                              </h3>
                            )}

                            {seriesFeatures.length > 0 && (
                              <ul
                                style={{
                                  listStyle: "none",
                                  padding: 0,
                                  margin: "1rem 0",
                                  flexGrow: 1,
                                }}
                              >
                                {seriesFeatures.map((feature: string, idx: number) => (
                                  <li
                                    key={idx}
                                    style={{
                                      padding: "0.5rem 0",
                                      fontSize: "0.95rem",
                                      lineHeight: "1.6",
                                      color: "#666",
                                      position: "relative",
                                      paddingLeft: "1.5rem",
                                    }}
                                  >
                                    <span
                                      style={{
                                        position: "absolute",
                                        left: 0,
                                        color: "#2277bb",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      •
                                    </span>
                                    {feature}
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
                        href={`/temsilcilikler/${params.repSlug}`}
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
