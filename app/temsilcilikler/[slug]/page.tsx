import { notFound } from "next/navigation";
import Link from "next/link";
import SEO from "@/components/data/seo";
import HeaderTwo from "@/components/layout/headers/header-two";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "@/components/pages/common/scroll/scroll-to-top";
import BreadCrumb from "@/components/pages/common/breadcrumb";
import CustomCursor from "@/components/pages/common/cursor";
import SwitchTab from "@/components/pages/common/dark-light";

type Representative = {
  name: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  breadcrumbImageUrl?: string;
  heroImageUrl?: string;
  products?: ProductNode[];
};

type ProductNode = {
  id: string;
  slug: string;
  name?: string;
  maxCapacity?: string;
};

type VariantNode = {
  id: string;
  name: string;
  products?: ProductNode[];
};

type SeriesNode = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  variants?: VariantNode[];
  products?: ProductNode[];
};

type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  breadcrumbImageUrl?: string;
  series?: SeriesNode[];
};

async function getRepresentative(slug: string): Promise<Representative | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/representatives/${slug}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

async function getCategories(repSlug: string): Promise<CategoryNode[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/representatives/${repSlug}/categories`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return [];
  }

  return res.json();
}

const collectSeriesProducts = (series: SeriesNode) => {
  const uniqueProducts = new Map<string, ProductNode>();
  const pushProducts = (products?: ProductNode[]) => {
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

const getSeriesProductCount = (seriesList?: SeriesNode[]) =>
  seriesList?.reduce((total, series) => total + collectSeriesProducts(series).length, 0) || 0;

const getCategoryProductCount = (category: CategoryNode) =>
  getSeriesProductCount(category.series);

const getFirstProductUrl = (category: CategoryNode, repSlug: string) => {
  if (category.series && category.series.length > 0) {
    const firstSeries = category.series[0];

    for (const variant of firstSeries.variants || []) {
      if (variant.products && variant.products.length > 0) {
        return `/temsilcilikler/${repSlug}/urunler/${variant.products[0].slug}`;
      }
    }

    if (firstSeries.products && firstSeries.products.length > 0) {
      return `/temsilcilikler/${repSlug}/urunler/${firstSeries.products[0].slug}`;
    }
  }

  return null;
};

const truncateText = (value?: string, limit = 140) => {
  if (!value) return null;
  return value.length > limit ? `${value.substring(0, limit - 3)}...` : value;
};

export default async function RepresentativePage({
  params,
}: {
  params: { slug: string };
}) {
  const [representative, categories] = await Promise.all([
    getRepresentative(params.slug),
    getCategories(params.slug),
  ]);

  if (!representative) {
    notFound();
  }

  const breadcrumbBgImage =
    representative.breadcrumbImageUrl || "/assets/img/breadcrumb.jpg";

  const totalCategories = categories.length;
  const totalSeries = categories.reduce(
    (acc: number, category: CategoryNode) => acc + (category.series?.length || 0),
    0
  );
  const totalProductsFromCategories = categories.reduce(
    (acc: number, category: CategoryNode) => acc + getCategoryProductCount(category),
    0
  );
  const totalProducts =
    totalProductsFromCategories || representative.products?.length || 0;

  const heroVisual =
    representative.heroImageUrl ||
    representative.breadcrumbImageUrl ||
    categories[0]?.breadcrumbImageUrl ||
    "/assets/img/breadcrumb.jpg";

  const highlightedCategory = categories[0];
  const highlightedCategoryUrl = highlightedCategory
    ? `/temsilcilikler/${params.slug}/kategoriler/${highlightedCategory.slug}`
    : null;

  const categoryPreview =
    totalCategories > 0
      ? "Aktif kategoriler yayında"
      : "Kategoriler hazırlandığında burada görünecek";

  const seriesPreview =
    totalSeries > 0
      ? "Güncel seri bilgisi"
      : "Aktif seriler eklendiğinde listelenecek";

  const productPreview =
    totalProducts > 0
      ? "Kayıtlı ürün kombinasyonları"
      : "Ürünler yakında yayında";

  const quickFacts = [
    representative.websiteUrl
      ? {
          label: "Resmi Web Sitesi",
          value: representative.websiteUrl,
          href: representative.websiteUrl,
        }
      : null,
    highlightedCategory && highlightedCategoryUrl
      ? {
          label: "Öne Çıkan Kategori",
          value: highlightedCategory.name,
          href: highlightedCategoryUrl,
        }
      : null,
    representative.logoUrl
      ? {
          label: "Marka Logosu",
          value: "Logoyu görüntüle",
          href: representative.logoUrl,
        }
      : null,
  ].filter(Boolean) as { label: string; value: string; href?: string }[];

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

      <div className="representative-hero section-padding pt-0">
        <div className="container">
          <div className="representative-hero__shell">
            <div className="representative-hero__content">
              <span className="representative-hero__eyebrow">Temsilcilik</span>
              <h1>{representative.name}</h1>
              {representative.description ? (
                <div
                  className="representative-hero__description"
                  dangerouslySetInnerHTML={{
                    __html: representative.description.replace(/\n/g, "<br />"),
                  }}
                />
              ) : (
                <p className="representative-hero__description">
                  {representative.name} markasına ait tüm ürün ailesini keşfedin. Aktif
                  kategoriler ve seri detayları bu sayfada sizi bekliyor.
                </p>
              )}

              <div className="representative-hero__stats">
                <div>
                  <span>Toplam Kategori</span>
                  <strong>{totalCategories}</strong>
                  <p>{categoryPreview}</p>
                </div>
                <div>
                  <span>Toplam Seri</span>
                  <strong>{totalSeries}</strong>
                  <p>{seriesPreview}</p>
                </div>
                <div>
                  <span>Ürün Kombinasyonu</span>
                  <strong>{totalProducts}</strong>
                  <p>{productPreview}</p>
                </div>
              </div>

              {quickFacts.length > 0 && (
                <div className="representative-hero__facts">
                  {quickFacts.map((fact) => (
                    <div key={fact.label} className="representative-hero__fact">
                      <span>{fact.label}</span>
                      {fact.href ? (
                        <Link
                          href={fact.href}
                          target={fact.href.startsWith("http") ? "_blank" : "_self"}
                          rel={fact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        >
                          {fact.value}
                        </Link>
                      ) : (
                        <p>{fact.value}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="representative-hero__actions">
                {highlightedCategoryUrl && (
                  <Link href={highlightedCategoryUrl} className="build_button">
                    Kategorileri incele <i className="flaticon-right-up"></i>
                  </Link>
                )}
                {representative.websiteUrl && (
                  <Link
                    href={representative.websiteUrl}
                    className="build_button build_button--ghost"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Resmi Site
                  </Link>
                )}
              </div>
            </div>

            <div className="representative-hero__visual">
              <div className="representative-hero__visual-card">
                <img src={heroVisual} alt={representative.name} />
                {representative.logoUrl && (
                  <div className="representative-hero__logo">
                    <img src={representative.logoUrl} alt={`${representative.name} logo`} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {categories.length > 0 ? (
        <section className="representative-category-section" id="categories">
          <div className="container">
            <div className="representative-category-head">
              <div>
                <span className="subtitle">Ürün ağacı</span>
                <h3>Tüm kategoriler bir arada</h3>
              </div>
              <p>
                {representative.name} markasına ait tüm kategorileri kısa yoldan ziyaret edin
                ve seri detaylarına tek dokunuşla ulaşın.
              </p>
            </div>

            <div className="representative-category-grid">
              {categories.map((category: CategoryNode) => {
                const categoryDetailUrl = `/temsilcilikler/${params.slug}/kategoriler/${category.slug}`;
                const firstProductUrl = getFirstProductUrl(category, params.slug);
                const productCount = getCategoryProductCount(category);
                const summary = truncateText(category.description);

                return (
                  <article key={category.id} className="representative-category-card">
                    <div className="representative-category-card__media">
                      {category.breadcrumbImageUrl ? (
                        <img src={category.breadcrumbImageUrl} alt={category.name} />
                      ) : (
                        <div className="representative-category-card__placeholder">
                          <i className="flaticon-box" aria-hidden="true"></i>
                        </div>
                      )}
                      <span className="representative-category-card__badge">
                        {category.series?.length || 0} seri
                      </span>
                    </div>

                    <div className="representative-category-card__body">
                      <div className="representative-category-card__title">
                        <Link href={categoryDetailUrl}>
                          <h4>{category.name}</h4>
                        </Link>
                        <span>Kategori</span>
                      </div>

                      {summary && <p>{summary}</p>}

                      <div className="representative-category-card__stats">
                        <div>
                          <span>Seri</span>
                          <strong>{category.series?.length || 0}</strong>
                        </div>
                        <div>
                          <span>Ürün</span>
                          <strong>{productCount}</strong>
                        </div>
                      </div>

                      <div className="representative-category-card__actions">
                        <Link href={categoryDetailUrl} className="build_button">
                          Kategori Detayı <i className="flaticon-right-up"></i>
                        </Link>
                        {firstProductUrl && (
                          <Link href={firstProductUrl} className="build_button build_button--ghost">
                            Ürünleri incele
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ) : (
        <div className="section-padding">
          <div className="container">
            <div className="representative-empty">
              <p>Bu temsilciliğe ait kategori henüz oluşturulmamış.</p>
            </div>
          </div>
        </div>
      )}

      <FooterTwo />
      <ScrollToTop />
    </>
  );
}
