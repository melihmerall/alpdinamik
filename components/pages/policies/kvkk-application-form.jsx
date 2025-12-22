"use client";
import { useMemo } from "react";
import SEO from "@/components/data/seo";
import CustomCursor from "@/components/pages/common/cursor";
import SwitchTab from "@/components/pages/common/dark-light";
import HeaderFour from "@/components/layout/headers/header-four";
import BreadCrumb from "@/components/pages/common/breadcrumb";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "@/components/pages/common/scroll/scroll-to-top";
import { useAppContext } from "@/lib/app-context";

const KvkkApplicationForm = () => {
  const { siteSettings } = useAppContext();
  const breadcrumbBgImage =
    siteSettings?.defaultBreadcrumbImageUrl || "/assets/img/breadcrumb.jpg";
  const contactEmail =
    siteSettings?.kvkkEmail ||
    siteSettings?.contactEmail ||
    siteSettings?.email ||
    "info@alpdinamik.com.tr";
  const contactAddress =
    siteSettings?.address || "İkitelli OSB, Başakşehir / İstanbul";

  const applicantFields = useMemo(
    () => [
      { label: "Ad Soyad" },
      { label: "T.C. Kimlik No / Pasaport No" },
      { label: "Telefon" },
      { label: "E-posta" },
      { label: "Adres" },
    ],
    []
  );

  const requestChannels = [
    "Elden teslim",
    "Kayıtlı elektronik posta",
    "İmza sahibi temsilci",
  ];

  const requestTypes = [
    "Kişisel verilerimin işlenip işlenmediğini öğrenmek istiyorum.",
    "Verilerimin işlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenmek istiyorum.",
    "Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilmek istiyorum.",
    "Eksik veya yanlış işlenmiş verilerimin düzeltilmesini talep ediyorum.",
    "İlgili mevzuata aykırı işleme nedeniyle zararımın giderilmesini talep ediyorum.",
  ];

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    const formNode = document.querySelector(".kvkk-print-area");
    if (!formNode) {
      window.print();
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const styles = `
      * { box-sizing: border-box; font-family: 'Inter', 'Segoe UI', sans-serif; }
      body { margin: 32px; color: #0b122f; }
      h1, h2 { margin-top: 0; }
      .kvkk-print-area { border: none; padding: 0; box-shadow: none; }
    `;

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      document.body.removeChild(iframe);
      window.print();
      return;
    }

    doc.open();
    doc.write(`
      <!doctype html>
      <html>
        <head>
          <title>KVKK Başvuru Formu</title>
          <style>${styles}</style>
        </head>
        <body>
          ${formNode.outerHTML}
        </body>
      </html>
    `);
    doc.close();

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 100);
    };
  };

  return (
    <>
      <SEO pageTitle="KVKK Başvuru Formu" />
      <CustomCursor />
      <SwitchTab />
      <HeaderFour />
      <BreadCrumb
        title="KVKK"
        innerTitle="KVKK Başvuru Formu"
        backgroundImage={breadcrumbBgImage}
      />

      <section className="section-padding" style={{ background: "var(--color-2)" }}>
        <div className="container">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              justifyContent: "flex-end",
              marginBottom: "16px",
            }}
          >
            <button
              type="button"
              className="build_button"
              onClick={handlePrint}
            >
              Formu Yazdır
            </button>
          </div>

          <article
            className="kvkk-print-area"
            style={{
              background: "var(--bg-white)",
              borderRadius: "24px",
              border: "1px solid var(--border-color-1)",
              padding: "40px",
              boxShadow: "0 20px 60px rgba(6, 11, 32, 0.08)",
              color: "var(--text-heading-color)",
            }}
          >
            <header style={{ marginBottom: "24px" }}>
              <h1 style={{ fontSize: "28px", margin: 0 }}>Veri Sahibi Başvuru Formu</h1>
              <p style={{ marginTop: "12px", color: "var(--body-color)" }}>
                Bu form, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamındaki
                haklarınıza ilişkin başvurularınız için kullanılır. Lütfen formu
                eksiksiz doldurup imzaladıktan sonra belirtilen iletişim kanallarından
                herhangi biriyle iletin.
              </p>
            </header>

            <section style={{ marginBottom: "28px" }}>
              <h2 style={{ fontSize: "20px", marginBottom: "16px" }}>1. Başvuran Bilgileri</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {applicantFields.map((field) => (
                  <div key={field.label}>
                    <span
                      style={{
                        display: "block",
                        fontSize: "13px",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "rgba(9,18,39,0.5)",
                      }}
                    >
                      {field.label}
                    </span>
                    <div
                      style={{
                        borderBottom: "1px solid rgba(9,18,39,0.2)",
                        minHeight: "32px",
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            </section>

            <section style={{ marginBottom: "28px" }}>
              <h2 style={{ fontSize: "20px", marginBottom: "16px" }}>
                2. Başvurunun İletilmesini İstediğiniz Kanal
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {requestChannels.map((channel) => (
                  <label key={channel} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        width: "18px",
                        height: "18px",
                        border: "1px solid rgba(9,18,39,0.4)",
                        borderRadius: "3px",
                        display: "inline-block",
                      }}
                    ></span>
                    <span>{channel}</span>
                  </label>
                ))}
              </div>
            </section>

            <section style={{ marginBottom: "28px" }}>
              <h2 style={{ fontSize: "20px", marginBottom: "16px" }}>
                3. Talep Konusu
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {requestTypes.map((type) => (
                  <label key={type} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        width: "18px",
                        height: "18px",
                        border: "1px solid rgba(9,18,39,0.4)",
                        borderRadius: "50%",
                        display: "inline-block",
                      }}
                    ></span>
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </section>

            <section style={{ marginBottom: "28px" }}>
              <h2 style={{ fontSize: "20px", marginBottom: "16px" }}>4. Talep Detayı</h2>
              <div
                style={{
                  border: "1px solid rgba(9,18,39,0.2)",
                  borderRadius: "12px",
                  minHeight: "160px",
                }}
              ></div>
            </section>

            <section>
              <h2 style={{ fontSize: "20px", marginBottom: "16px" }}>5. Tebliğ Bilgileri</h2>
              <p style={{ color: "var(--body-color)", marginBottom: "10px" }}>
                Başvurunuza ilişkin yanıt, seçtiğiniz kanaldan tarafınıza ulaştırılacaktır.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div>
                  <span style={{ fontWeight: 600 }}>Yazışma Adresi:</span>{" "}
                  <span>{contactAddress}</span>
                </div>
                <div>
                  <span style={{ fontWeight: 600 }}>E-posta / KE</span>
                  <span> {contactEmail}</span>
                </div>
              </div>
            </section>

            <div
              style={{
                marginTop: "32px",
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "24px",
              }}
            >
              <div style={{ flex: "1 1 220px" }}>
                <span
                  style={{
                    display: "block",
                    fontSize: "13px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(9,18,39,0.5)",
                  }}
                >
                  Tarih
                </span>
                <div
                  style={{
                    borderBottom: "1px solid rgba(9,18,39,0.2)",
                    minHeight: "28px",
                  }}
                ></div>
              </div>
              <div style={{ flex: "1 1 220px" }}>
                <span
                  style={{
                    display: "block",
                    fontSize: "13px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(9,18,39,0.5)",
                  }}
                >
                  İmza
                </span>
                <div
                  style={{
                    borderBottom: "1px solid rgba(9,18,39,0.2)",
                    minHeight: "60px",
                  }}
                ></div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <FooterTwo />
      <ScrollToTop />
    </>
  );
};

export default KvkkApplicationForm;
