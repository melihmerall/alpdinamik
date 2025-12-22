"use client";
import { useMemo } from "react";
import Link from "next/link";
import SEO from "@/components/data/seo";
import CustomCursor from "@/components/pages/common/cursor";
import SwitchTab from "@/components/pages/common/dark-light";
import HeaderFour from "@/components/layout/headers/header-four";
import BreadCrumb from "@/components/pages/common/breadcrumb";
import FooterTwo from "@/components/layout/footers/footer-two";
import ScrollToTop from "@/components/pages/common/scroll/scroll-to-top";
import { useAppContext } from "@/lib/app-context";

const CookiePolicyPage = () => {
    const { siteSettings } = useAppContext();

    const sections = useMemo(
        () => [
            {
                title: "Çerezler Nedir?",
                body: "Çerezler, ziyaret ettiğiniz internet siteleri tarafından tarayıcınıza kaydedilen küçük metin dosyalarıdır. Bu dosyalar, site deneyiminizi kişiselleştirmek, tercihlerinizi hatırlamak ve güvenliği sağlamak için düzenlenmiştir."
            },
            {
                title: "Neden Çerez Kullanıyoruz?",
                body: "Alpdinamik web sitesi; form süreçlerinin sorunsuz ilerlemesi, içeriklerin performans takibi ve hizmetlerimizin geliştirilmesi için çerezlerden yararlanır. Her çerez türü belirli bir amaç doğrultusunda çalışır ve verimliliği artırır."
            },
            {
                title: "Çerez Tercihleri Nasıl Yönetilir?",
                body: "Tarayıcı ayarlarınızı kullanarak tüm çerezleri kabul edebilir, reddedebilir veya belirli çerezler için izin verebilirsiniz. Çerezlerin kapatılması durumunda bazı hizmetler sınırlı çalışabilir; ancak dilediğiniz an tercihinizi değiştirebilirsiniz."
            }
        ],
        []
    );

    const cookieTypes = [
        {
            title: "Zorunlu Çerezler",
            description: "Güvenlik, kimlik doğrulama ve formların hatasız çalışması için gereklidir. Bu çerezler olmadan sitede gezinmek veya temel fonksiyonlardan yararlanmak mümkün değildir.",
            duration: "Oturum süresince veya güvenlik amacıyla maksimum 1 yıl"
        },
        {
            title: "Performans Çerezleri",
            description: "Site performansını ölçmek, içeriklerin etkinliğini görmek ve iyileştirmeler yapmak için anonim veriler toplar. Ziyaret trendlerini anlayarak deneyimi geliştirir.",
            duration: "6 ay - 2 yıl"
        },
        {
            title: "Fonksiyonel Çerezler",
            description: "Dil tercihi, iletişim bilgileri ve kullanıcıya özel kişiselleştirmeleri hatırlayarak tekrar eden işlemleri hızlandırır, ziyaretleri daha keyifli hale getirir.",
            duration: "Oturum süresince veya tercihe bağlı en fazla 1 yıl"
        }
    ];

    const rights = [
        "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
        "İşlendiyse buna ilişkin bilgi talep etme",
        "İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme",
        "Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme",
        "Eksik veya yanlış işlendi ise düzeltilmesini isteme",
        "KVKK’ya aykırı işlenmesi nedeniyle zarara uğrarsanız tazminat talep etme"
    ];

    const policyHighlights = [
        {
            title: "Şeffaf Süreç",
            description: "Her çerez türü, kullanılmadan önce amacıyla birlikte açıklanır.",
            icon: "fas fa-eye"
        },
        {
            title: "Kolay Yönetim",
            description: "Tercihlerinizi banner üzerinden dilediğiniz an değiştirebilirsiniz.",
            icon: "fas fa-sliders-h"
        },
        {
            title: "KVKK Uyumu",
            description: "Tüm süreçler 6698 sayılı KVKK ve ilgili mevzuatla uyumludur.",
            icon: "fas fa-balance-scale"
        }
    ];

    const breadcrumbBgImage =
        siteSettings?.defaultBreadcrumbImageUrl || "/assets/img/breadcrumb.jpg";

    return (
        <>
            <SEO pageTitle="Çerez Politikası" />
            <CustomCursor />
            <SwitchTab />
            <HeaderFour />
            <BreadCrumb
                title="Çerez Politikası"
                innerTitle="Çerez Politikası"
                backgroundImage={breadcrumbBgImage}
            />

            <section
                className="section-padding"
                style={{
                    background: "var(--color-2)",
                    position: "relative",
                    overflow: "hidden"
                }}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div
                                style={{
                                    background: "var(--bg-white)",
                                    borderRadius: "18px",
                                    padding: "48px",
                                    boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                                    border: "1px solid var(--border-color-1)"
                                }}
                            >
                                <span
                                    className="subtitle"
                                    style={{
                                        display: "inline-flex",
                                        padding: "8px 16px",
                                        background: "rgba(0,123,255,0.1)",
                                        color: "var(--primary-color-1)",
                                        borderRadius: "40px",
                                        fontWeight: 600,
                                        marginBottom: "20px",
                                        fontSize: "13px",
                                        letterSpacing: "0.5px"
                                    }}
                                    >
                                        Şeffaflık İlkesi
                                </span>
                                <h2
                                    className="title_split_anim"
                                    style={{ 
                                        marginBottom: "28px",
                                        fontSize: "32px",
                                        lineHeight: "1.3",
                                        fontWeight: 700,
                                        color: "var(--text-heading-color)"
                                    }}
                                >
                                    Çerezleri Nasıl Kullanıyoruz?
                                </h2>
                                <p style={{ 
                                    color: "var(--body-color)", 
                                    lineHeight: 1.8,
                                    fontSize: "16px",
                                    marginBottom: "32px"
                                }}>
                                    Bu politika, 6698 sayılı KVKK ve ilgili mevzuat kapsamında
                                    çerezlerin kullanımına ilişkin olarak sizleri bilgilendirmek
                                    amacıyla hazırlanmıştır. Tercihlerinizi dilediğiniz zaman
                                    tarayıcınız üzerinden veya sayfanın alt kısmında yer alan çerez
                                    panelinden güncelleyebilirsiniz.
                                </p>

                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
                                        gap: "16px",
                                        marginTop: "24px"
                                    }}
                                >
                                    {policyHighlights.map((item) => (
                                        <div
                                            key={item.title}
                                            style={{
                                                borderRadius: "12px",
                                                border: "1px solid var(--border-color-1)",
                                                padding: "18px",
                                                background: "var(--color-2)",
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "6px",
                                                minHeight: "130px"
                                            }}
                                        >
                                            <i
                                                className={item.icon}
                                                style={{
                                                    color: "var(--primary-color-1)",
                                                    fontSize: "20px"
                                                }}
                                            />
                                            <strong
                                                style={{
                                                    color: "var(--text-heading-color)",
                                                    fontSize: "15px"
                                                }}
                                            >
                                                {item.title}
                                            </strong>
                                            <p
                                                style={{
                                                    margin: 0,
                                                    color: "var(--body-color)",
                                                    lineHeight: 1.5,
                                                    fontSize: "14px"
                                                }}
                                            >
                                                {item.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ marginTop: "32px" }}>
                                    {sections.map((section, index) => (
                                        <div
                                            key={section.title}
                                            style={{
                                                borderTop:
                                                    index === 0
                                                        ? "none"
                                                        : "1px solid var(--border-color-1)",
                                                paddingTop: index === 0 ? 0 : "24px",
                                                marginTop: index === 0 ? 0 : "24px"
                                            }}
                                        >
                                            <h4
                                                style={{
                                                    marginBottom: "16px",
                                                    color: "var(--text-heading-color)",
                                                    fontSize: "20px",
                                                    fontWeight: 600,
                                                    lineHeight: "1.4"
                                                }}
                                            >
                                                {section.title}
                                            </h4>
                                            <p
                                                style={{
                                                    color: "var(--body-color)",
                                                    margin: 0,
                                                    lineHeight: 1.8,
                                                    fontSize: "15px"
                                                }}
                                            >
                                                {section.body}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 lg-mt-30">
                            <div
                                style={{
                                    background: "linear-gradient(135deg,#007bff,#0056b3)",
                                    borderRadius: "18px",
                                    padding: "32px",
                                    color: "#fff",
                                    height: "100%",
                                    boxShadow: "0 20px 50px rgba(0,0,0,0.2)"
                                }}
                            >
                                <h4 style={{ 
                                    marginBottom: "20px",
                                    fontSize: "20px",
                                    fontWeight: 600,
                                    lineHeight: "1.3"
                                }}>Önemli Bilgiler</h4>
                                <ul
                                    style={{
                                        listStyle: "none",
                                        padding: 0,
                                        margin: 0,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "18px"
                                    }}
                                >
                                    <li
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: "14px",
                                            lineHeight: "1.6"
                                        }}
                                    >
                                        <i className="fas fa-shield-alt" style={{ 
                                            fontSize: "18px",
                                            marginTop: "2px",
                                            flexShrink: 0
                                        }} />
                                        <span style={{ fontSize: "14px" }}>
                                            Kullanıcı güvenliği ve sistem performansı için zorunlu
                                            çerezler aktif olarak çalışır.
                                        </span>
                                    </li>
                                    <li
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: "14px",
                                            lineHeight: "1.6"
                                        }}
                                    >
                                        <i className="fas fa-history" style={{ 
                                            fontSize: "18px",
                                            marginTop: "2px",
                                            flexShrink: 0
                                        }} />
                                        <span style={{ fontSize: "14px" }}>
                                            Tercihleriniz en fazla 6 ay boyunca saklanır, süre dolduğunda
                                            yeniden izin istenir.
                                        </span>
                                    </li>
                                    <li
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: "14px",
                                            lineHeight: "1.6"
                                        }}
                                    >
                                        <i className="fas fa-envelope" style={{ 
                                            fontSize: "18px",
                                            marginTop: "2px",
                                            flexShrink: 0
                                        }} />
                                        <span style={{ fontSize: "14px" }}>
                                            Haklarınızı kullanmak için{" "}
                                            <Link
                                                href="/iletisim"
                                                style={{ color: "#fff", textDecoration: "underline", fontWeight: 600 }}
                                            >
                                                iletişim sayfamızı
                                            </Link>{" "}
                                            ziyaret edebilirsiniz.
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="row section-padding" style={{ paddingBottom: 0 }}>
                        {cookieTypes.map((cookie) => (
                            <div className="col-lg-4 col-md-6 mb-30" key={cookie.title}>
                                <div
                                    style={{
                                        background: "var(--bg-white)",
                                        borderRadius: "16px",
                                        height: "100%",
                                        padding: "28px",
                                        border: "1px solid var(--border-color-1)",
                                        boxShadow: "0 12px 30px rgba(0,0,0,0.05)",
                                        transition: "transform 0.3s ease, box-shadow 0.3s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateY(-4px)";
                                        e.currentTarget.style.boxShadow =
                                            "0 18px 40px rgba(0,0,0,0.08)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow =
                                            "0 12px 30px rgba(0,0,0,0.05)";
                                    }}
                                >
                                    <h4
                                        style={{
                                            marginBottom: "16px",
                                            color: "var(--text-heading-color)",
                                            fontSize: "20px",
                                            fontWeight: 600,
                                            lineHeight: "1.3"
                                        }}
                                    >
                                        {cookie.title}
                                    </h4>
                                    <p
                                        style={{
                                            color: "var(--body-color)",
                                            lineHeight: 1.75,
                                            marginBottom: "16px",
                                            fontSize: "15px"
                                        }}
                                    >
                                        {cookie.description}
                                    </p>
                                    <div
                                        style={{
                                            padding: "14px 16px",
                                            borderRadius: "10px",
                                            background: "var(--color-2)",
                                            fontSize: "14px",
                                            color: "var(--body-color)",
                                            lineHeight: "1.6"
                                        }}
                                    >
                                        <strong style={{ color: "var(--text-heading-color)" }}>Saklama Süresi:</strong> {cookie.duration}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="row section-padding" style={{ paddingTop: 0 }}>
                        <div className="col-lg-7">
                            <div
                                style={{
                                    background: "var(--bg-white)",
                                    borderRadius: "18px",
                                    padding: "40px",
                                    border: "1px solid var(--border-color-1)"
                                }}
                            >
                                <h3 style={{ 
                                    marginBottom: "20px",
                                    fontSize: "24px",
                                    fontWeight: 700,
                                    color: "var(--text-heading-color)",
                                    lineHeight: "1.3"
                                }}>Haklarınız ve Talepler</h3>
                                <p style={{ 
                                    color: "var(--body-color)", 
                                    marginBottom: "24px",
                                    fontSize: "15px",
                                    lineHeight: 1.8
                                }}>
                                    KVKK’nin 11. maddesi kapsamında aşağıdaki haklara sahipsiniz.
                                    Taleplerinizi iletmek için{" "}
                                    <Link href="/iletisim" style={{ color: "var(--primary-color-1)", fontWeight: 600 }}>
                                        iletişim formunu
                                    </Link>{" "}
                                    kullanabilir veya{" "}
                                    {siteSettings?.email ? (
                                        <Link
                                            href={`mailto:${siteSettings.email}`}
                                            style={{ color: "var(--primary-color-1)", fontWeight: 600 }}
                                        >
                                            {siteSettings.email}
                                        </Link>
                                    ) : (
                                        "destek kanallarımız"
                                    )}{" "}
                                    üzerinden bize ulaşabilirsiniz.
                                </p>
                                <ul
                                    style={{
                                        margin: 0,
                                        paddingLeft: "24px",
                                        color: "var(--body-color)",
                                        lineHeight: 1.8,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "12px",
                                        fontSize: "15px"
                                    }}
                                >
                                    {rights.map((item) => (
                                        <li key={item} style={{ paddingLeft: "8px", position: "relative" }}>
                                            <span style={{ 
                                                position: "absolute",
                                                left: "-12px",
                                                color: "var(--primary-color-1)"
                                            }}>•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-5 lg-mt-30">
                            <div
                                style={{
                                    background: "linear-gradient(135deg,#1a2332,#2d3748)",
                                    borderRadius: "18px",
                                    padding: "36px",
                                    color: "#ffffff",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "20px",
                                    boxShadow: "0 20px 50px rgba(0,0,0,0.2)"
                                }}
                            >
                                <h4 style={{ 
                                    marginBottom: "18px",
                                    fontSize: "22px",
                                    fontWeight: 600,
                                    lineHeight: "1.3",
                                    color: "#ffffff"
                                }}>Çerez Tercihlerinizi Yönetme</h4>
                                <p style={{ 
                                    margin: "0 0 22px 0", 
                                    color: "#e8e8e8",
                                    fontSize: "15px",
                                    lineHeight: "1.8"
                                }}>
                                    Tarayıcılarınızda çerezleri engelleyebilir, silerek yeniden
                                    ayarlanmasını sağlayabilirsiniz. Her cihaz için aşağıdaki
                                    yönergeleri takip edebilirsiniz:
                                </p>
                                <ul
                                    style={{
                                        margin: "0 0 22px 0",
                                        padding: 0,
                                        listStyle: "none",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "16px"
                                    }}
                                >
                                    <li style={{ 
                                        fontSize: "15px", 
                                        lineHeight: "1.7",
                                        color: "#e8e8e8"
                                    }}>
                                        <strong style={{ 
                                            display: "block", 
                                            marginBottom: "6px",
                                            color: "#ffffff",
                                            fontSize: "16px",
                                            fontWeight: 600
                                        }}>Chrome:</strong>
                                        Ayarlar &gt; Gizlilik ve Güvenlik &gt;
                                        Çerezler ve Diğer Site Verileri
                                    </li>
                                    <li style={{ 
                                        fontSize: "15px", 
                                        lineHeight: "1.7",
                                        color: "#e8e8e8"
                                    }}>
                                        <strong style={{ 
                                            display: "block", 
                                            marginBottom: "6px",
                                            color: "#ffffff",
                                            fontSize: "16px",
                                            fontWeight: 600
                                        }}>Safari:</strong>
                                        Ayarlar &gt; Safari &gt; Gizlilik ve
                                        Güvenlik
                                    </li>
                                    <li style={{ 
                                        fontSize: "15px", 
                                        lineHeight: "1.7",
                                        color: "#e8e8e8"
                                    }}>
                                        <strong style={{ 
                                            display: "block", 
                                            marginBottom: "6px",
                                            color: "#ffffff",
                                            fontSize: "16px",
                                            fontWeight: 600
                                        }}>Edge:</strong>
                                        Ayarlar &gt; Çerezler ve site izinleri
                                    </li>
                                </ul>
                                <p style={{ 
                                    margin: 0, 
                                    color: "#e8e8e8",
                                    fontSize: "15px",
                                    lineHeight: "1.8"
                                }}>
                                    Mobil cihazlarda ise reklam takip izinlerini ayarlar menünüzden
                                    düzenleyebilirsiniz.
                                </p>
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

export default CookiePolicyPage;
