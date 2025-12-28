import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import Image from "next/image";
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

const convertDescriptionToHtml = (value?: string) => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const htmlTagPattern = /<\/?[a-z][\s\S]*>/i;
  return htmlTagPattern.test(trimmed)
    ? trimmed
    : trimmed.replace(/\n/g, "<br />");
};

function getBaseUrl(): string {
  // Environment variable varsa onu kullan
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Server-side'da headers'dan hostname al
  try {
    const headersList = headers();
    const host = headersList.get('host');
    const protocol = headersList.get('x-forwarded-proto') || 'https';
    if (host) {
      return `${protocol}://${host}`;
    }
  } catch {
    // headers() çağrılamazsa (örneğin build zamanında)
  }
  
  // Fallback
  return 'http://localhost:3000';
}

async function getRepresentative(slug: string): Promise<Representative | null> {
  const baseUrl = getBaseUrl();
  const res = await fetch(
    `${baseUrl}/api/representatives/${slug}`,
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
  const baseUrl = getBaseUrl();
  const res = await fetch(
    `${baseUrl}/api/representatives/${repSlug}/categories`,
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

  const descriptionHtml = convertDescriptionToHtml(representative.description);

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
              {representative.logoUrl ? (
                <div className="representative-hero__logo-title">
                  <Image
                    src={representative.logoUrl}
                    alt={representative.name}
                    width={200}
                    height={80}
                    style={{ 
                      width: 'auto', 
                      height: 'auto', 
                      maxWidth: '280px', 
                      maxHeight: '100px',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              ) : (
                <h1>{representative.name}</h1>
              )}
              {descriptionHtml ? (
                <div
                  className="representative-hero__description"
                  dangerouslySetInnerHTML={{
                    __html: descriptionHtml,
                  }}
                />
              ) : (
                <p className="representative-hero__description">
                  {representative.name} markasına ait tüm ürün ailesini keşfedin. Aktif
                  kategoriler ve seri detayları bu sayfada sizi bekliyor.
                </p>
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
              <Link 
                href={params.slug === 'mecmot' 
                  ? 'https://mecmot.com/wp-content/uploads/2025/11/2025-10Kasim_Katalog.pdf'
                  : '#'}
                target={params.slug === 'mecmot' ? '_blank' : undefined}
                rel={params.slug === 'mecmot' ? 'noopener noreferrer' : undefined}
                className="representative-hero__visual-card"
                style={{ display: 'block', cursor: params.slug === 'mecmot' ? 'pointer' : 'default' }}
              >
                <Image
                  src={heroVisual}
                  alt={representative.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  style={{ objectFit: "contain" }}
                  priority
                />
                {representative.logoUrl && (
                  <div className="representative-hero__logo">
                    <img src={representative.logoUrl} alt={`${representative.name} logo`} />
                  </div>
                )}
              </Link>
            </div>
          </div>

        </div>
      </div>

      {categories.length > 0 ? (
        <section className="representative-category-section">
          <div className="container">
            <div className="representative-category-head">
              <div>
                <span className="subtitle">Ürünler</span>
              </div>

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
                        <Image
                          src={category.breadcrumbImageUrl}
                          alt={category.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 320px"
                          style={{ objectFit: "contain" }}
                        />
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
