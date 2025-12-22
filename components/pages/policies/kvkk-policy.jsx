"use client";
import Link from "next/link";
import SEO from "@/components/data/seo";
import CustomCursor from "@/components/pages/common/cursor";
import SwitchTab from "@/components/pages/common/dark-light";
import HeaderFour from "@/components/layout/headers/header-four";
import BreadCrumb from "@/components/pages/common/breadcrumb";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "@/components/pages/common/scroll/scroll-to-top";
import { useAppContext } from "@/lib/app-context";

const KvkkPolicyPage = () => {
  const { siteSettings } = useAppContext();
  const breadcrumbBgImage =
    siteSettings?.defaultBreadcrumbImageUrl || "/assets/img/breadcrumb.jpg";
  const kvkkApplicationUrl = "/kvkk/basvuru-formu";

  const legalBases = [
    {
      title: "Sözleşmenin Kurulması",
      description:
        "Teklif talepleri, sipariş süreçleri ve satış sonrası destek adımlarında kimlik, iletişim ve finans bilgileri sözleşmenin kurulması veya ifası için işlenir.",
    },
    {
      title: "Meşru Menfaat",
      description:
        "Sunulan çözümlere dair iyileştirmeler, müşteri ilişkilerinin güçlendirilmesi ve güvenlik kontrolleri için anonimleştirilmiş kullanım verileri tutulur.",
    },
    {
      title: "Açık Rıza",
      description:
        "Bülten aboneliği, etkinlik bildirimi veya pazarlama iletişimi tercihleri yalnızca açık rızanız alınarak kaydedilir ve dilediğiniz an güncellenebilir.",
    },
  ];

  const rights = [
    "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
    "İşlenmişse buna ilişkin bilgi talep etme",
    "Verilerin işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme",
    "Yurt içinde veya dışında aktarıldığı üçüncü kişileri bilme",
    "Eksik veya yanlış işlenmişse düzeltilmesini isteme",
    "Kanuna aykırı işlenme nedeniyle zarara uğrarsanız tazminat talep etme",
  ];


  return (
    <>
      <SEO pageTitle="KVKK Aydınlatma Metni" />
      <CustomCursor />
      <SwitchTab />
      <HeaderFour />
      <BreadCrumb
        title="KVKK"
        innerTitle="KVKK Aydınlatma Metni"
        backgroundImage={breadcrumbBgImage}
      />

      <section
        className="section-padding"
        style={{ background: "var(--color-2)", position: "relative", zIndex: 1 }}
      >
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-8">
              <article
                style={{
                  background: "var(--bg-white)",
                  borderRadius: "22px",
                  padding: "40px",
                  border: "1px solid var(--border-color-1)",
                  boxShadow: "0 25px 60px rgba(6, 11, 30, 0.08)",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    padding: "8px 18px",
                    borderRadius: "999px",
                    background: "rgba(0, 123, 255, 0.12)",
                    color: "var(--primary-color-1)",
                    fontWeight: 600,
                    letterSpacing: "0.3em",
                    fontSize: "11px",
                    marginBottom: "18px",
                    textTransform: "uppercase",
                  }}
                >
                  6698 Sayılı Kanun
                </span>

                <h1
                  style={{
                    fontSize: "32px",
                    marginBottom: "16px",
                    color: "var(--text-heading-color)",
                  }}
                >
                  Kişisel Verilerin Korunması
                </h1>
                <p
                  style={{
                    color: "var(--body-color)",
                    lineHeight: 1.7,
                    marginBottom: "24px",
                  }}
                >
                  Bu metin, Alpdinamik'in veri sorumlusu sıfatıyla işlediği kişisel
                  verilerin türlerini, amaçlarını ve haklarınızı KVKK md.10 kapsamında
                  açıklamak için hazırlanmıştır. Web sitesi formları, teklif süreçleri
                  ve müşteri hizmetleri kanallarından paylaştığınız bilgiler yalnızca
                  ilgili mevzuat çerçevesinde işlenir.
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                    gap: "16px",
                    marginBottom: "32px",
                  }}
                >
                  {legalBases.map((item) => (
                    <div
                      key={item.title}
                      style={{
                        border: "1px solid var(--border-color-1)",
                        borderRadius: "16px",
                        padding: "18px",
                        background: "var(--color-2)",
                        minHeight: "170px",
                      }}
                    >
                      <strong
                        style={{
                          display: "block",
                          fontSize: "16px",
                          marginBottom: "10px",
                          color: "var(--text-heading-color)",
                        }}
                      >
                        {item.title}
                      </strong>
                      <p
                        style={{
                          margin: 0,
                          color: "var(--body-color)",
                          fontSize: "14px",
                          lineHeight: 1.6,
                        }}
                      >
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    borderRadius: "18px",
                    border: "1px solid var(--border-color-1)",
                    padding: "28px",
                    marginBottom: "32px",
                    background: "linear-gradient(135deg, rgba(0,123,255,0.08), rgba(255,255,255,0.9))",
                  }}
                >
                  <h3 style={{ fontSize: "22px", marginBottom: "16px" }}>
                    Hangi Verileri İşliyoruz?
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: "18px", color: "var(--body-color)" }}>
                    <li>Kimlik ve iletişim bilgileri (ad, soyad, e-posta, telefon)</li>
                    <li>Şirket ve görev bilgisi, teklif ve proje detayları</li>
                    <li>Form mesajları, dosya ekleri ve müşteri ilişkisi kayıtları</li>
                    <li>IP adresi ve işlemler için gerekli teknik log kayıtları</li>
                  </ul>
                </div>

                <div>
                  <h3 style={{ fontSize: "22px", marginBottom: "16px" }}>
                    KVKK Md.11 Kapsamındaki Haklarınız
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
                      gap: "16px",
                    }}
                  >
                    {rights.map((right) => (
                      <div
                        key={right}
                        style={{
                          border: "1px solid var(--border-color-1)",
                          borderRadius: "14px",
                          padding: "16px",
                          background: "var(--bg-white)",
                          minHeight: "120px",
                        }}
                      >
                        <p style={{ margin: 0, color: "var(--body-color)", lineHeight: 1.5 }}>
                          {right}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            </div>

            <div className="col-lg-4">
              <aside style={{ position: "sticky", top: "120px" }}>
                <div
                  style={{
                    background: "#0b122f",
                    color: "#fff",
                    borderRadius: "20px",
                    padding: "30px",
                    marginBottom: "24px",
                  }}
                >
                  <h4 style={{ marginBottom: "16px", color: "#fff" }}>
                    Veri Sahibi Başvuruları
                  </h4>
                  <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>
                    Talep formunuzu imzalı olarak elden teslim edebilir veya kayıtlı
                    elektronik posta aracılığıyla iletebilirsiniz. Başvurular 30 gün
                    içinde sonuçlandırılır.
                  </p>
                  <Link
                    href={kvkkApplicationUrl}
                    className="build_button"
                    style={{ display: "inline-flex", marginTop: "12px" }}
                  >
                    Başvuru Formu
                  </Link>
                </div>

                <Link
                  href="/iletisim"
                  className="build_button build_button--ghost"
                  style={{
                    marginTop: "16px",
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  İletişim Formuna Git
                </Link>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <FooterTwo />
      <ScrollToTop />
    </>
  );
};

export default KvkkPolicyPage;
