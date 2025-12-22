"use client";
import SEO from "@/components/data/seo";
import CustomCursor from "@/components/pages/common/cursor";
import SwitchTab from "@/components/pages/common/dark-light";
import HeaderFour from "@/components/layout/headers/header-four";
import BreadCrumb from "@/components/pages/common/breadcrumb";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "@/components/pages/common/scroll/scroll-to-top";
import { useAppContext } from "@/lib/app-context";

const PrivacyPolicyPage = () => {
  const { siteSettings } = useAppContext();
  const breadcrumbBgImage =
    siteSettings?.defaultBreadcrumbImageUrl || "/assets/img/breadcrumb.jpg";

  const sections = [
    {
      title: "Toplanan Bilgiler",
      body: "İletişim formları, teklif talepleri ve referans çalışmalarından yalnızca kimlik, iletişim ve proje kapsamı bilgileri alınır. Dosya ekleri ve teknik çizimler, talep ettiğiniz çözümü üretebilmek için geçici olarak saklanır.",
    },
    {
      title: "Veri Saklama Süreleri",
      body: "Teklif ve satış süreçlerine ilişkin veriler sözleşme süresince, mevzuattan doğan yükümlülükler gereği ise azami 10 yıl boyunca güvenli ortamlarda tutulur. Pazarlama izinleri 2 yılda bir yeniden teyit edilir.",
    },
    {
      title: "Güvenlik Yaklaşımı",
      body: "Sunucularımız erişim kontrol listeleri, TLS şifreleme ve düzenli yedekleme politikalarıyla korunur. Yetkisiz erişimleri engellemek için rol bazlı yetkilendirme uygulanır.",
    },
  ];

  const processors = [
    { title: "Barındırma Hizmeti", description: "İnternet sitesi ve dosya yüklemeleri Türkiye merkezli bulut altyapısı üzerinde tutulur." },
    { title: "E-posta Servisleri", description: "İletişim formlarındaki bildirimler kurumsal e-posta hesaplarına yönlendirilir ve yalnızca yetkili ekiplerce görülür." },
    { title: "Analitik Çözümleri", description: "Ziyaret deneyimini iyileştirmek için anonimleştirilmiş trafik ölçümleri yapılır; kişisel profilleme gerçekleştirilmez." },
  ];

  return (
    <>
      <SEO pageTitle="Gizlilik Politikası" />
      <CustomCursor />
      <SwitchTab />
      <HeaderFour />
      <BreadCrumb
        title="Gizlilik Politikası"
        innerTitle="Gizlilik Politikası"
        backgroundImage={breadcrumbBgImage}
      />

      <section className="section-padding" style={{ background: "var(--color-2)" }}>
        <div className="container">
          <div
            style={{
              background: "var(--bg-white)",
              borderRadius: "24px",
              border: "1px solid var(--border-color-1)",
              padding: "48px",
              boxShadow: "0 30px 70px rgba(6, 11, 31, 0.08)",
            }}
          >
            <h1 style={{ fontSize: "34px", marginBottom: "12px" }}>Veri Güvenliği Sözümüz</h1>
            <p style={{ color: "var(--body-color)", lineHeight: 1.8, marginBottom: "32px" }}>
              Alpdinamik, ürün ve hizmet taleplerinizi yanıtlarken paylaştığınız tüm bilgileri sadece gerekli süreçlerde kullanır.
              Bu politika; bilgilendirme, saklama, paylaşım ve güvenlik ilkelerimizi kısaca özetler.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
                gap: "20px",
                marginBottom: "36px",
              }}
            >
              {sections.map((section) => (
                <div
                  key={section.title}
                  style={{
                    border: "1px solid var(--border-color-1)",
                    borderRadius: "18px",
                    padding: "24px",
                    background: "var(--color-2)",
                  }}
                >
                  <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>{section.title}</h3>
                  <p style={{ margin: 0, color: "var(--body-color)", lineHeight: 1.6 }}>{section.body}</p>
                </div>
              ))}
            </div>

            <div
              style={{
                borderRadius: "20px",
                padding: "32px",
                background: "linear-gradient(135deg, rgba(0,123,255,0.08), rgba(255,255,255,0.95))",
              }}
            >
              <div className="row gy-4">
                <div className="col-lg-6">
                  <h2 style={{ fontSize: "24px", marginBottom: "12px" }}>Veri İşleyenler</h2>
                  <p style={{ color: "var(--body-color)", marginBottom: "18px" }}>
                    Aşağıdaki iş ortakları yalnızca ilgili hizmetin verilmesi ölçüsünde verilerinize erişir ve üçüncü kişilerle paylaşamaz.
                  </p>
                  <ul style={{ margin: 0, paddingLeft: "18px", color: "var(--body-color)" }}>
                    {processors.map((item) => (
                      <li key={item.title} style={{ marginBottom: "10px" }}>
                        <strong style={{ display: "block", color: "var(--text-heading-color)" }}>{item.title}</strong>
                        <span>{item.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-lg-6">
                  <h2 style={{ fontSize: "24px", marginBottom: "12px" }}>Paylaşım İlkeleri</h2>
                  <ul style={{ margin: 0, paddingLeft: "18px", color: "var(--body-color)" }}>
                    <li>Yasal zorunluluklar haricinde kişisel veriler üçüncü kişilerle paylaşılmaz.</li>
                    <li>Talebiniz üzerine kayıtlarınız silinebilir veya anonim hale getirilebilir.</li>
                    <li>Veriler Türkiye sınırları içindeki güvenli sunucularda saklanır.</li>
                    <li>Destek aldığımız tüm tedarikçiler sözleşmelerle gizlilik taahhüdü verir.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterTwo />
      <ScrollToTop />
    </>
  );
};

export default PrivacyPolicyPage;
