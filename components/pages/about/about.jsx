import Link from "next/link";
import image from "../../../public/assets/img/about/about-4.jpg";
import bgImage from "../../../public/assets/img/portfolio/portfolio-8.jpg";


const AboutMain = ({ aboutData }) => {
    // Use admin data if available, otherwise use default content
    const subtitle = aboutData?.subtitle || "Hakkımızda";
    const title = aboutData?.title || "Lineer Hareket Sistemlerinde Mühendislik Ortağınız";
    const body = aboutData?.body || "Alp Dinamik, lineer hareket sistemleri konusunda projeci ve mühendislik odaklı bir firmadır. Temsil ettiğimiz markaların ürünlerini sadece satış olarak değil, uygulama analizi, ürün seçimi, CAD desteği ve devreye alma hizmetleriyle birlikte sunuyoruz. Makine imalatçıları, çelik endüstrisi, güneş enerjisi ve savunma sanayi gibi sektörlerde güvenilir çözüm ortağıyız.";
    const imageUrl = aboutData?.imageUrl || image.src;
    const ctaLabel = aboutData?.ctaLabel || "Projelerimizi İnceleyin";
    const ctaUrl = aboutData?.ctaUrl || "/portfolio/3-columns";
    const stat1Number = aboutData?.stat1Number || 25;
    const stat1Label = aboutData?.stat1Label || "Yıl Sektör Tecrübesi";
    const stat2Number = aboutData?.stat2Number || 500;
    const stat2Label = aboutData?.stat2Label || "Endüstriyel Proje";
    const stat3Number = aboutData?.stat3Number || 10;
    const stat3Label = aboutData?.stat3Label || "Farklı Uygulama Alanı";
    const missionSubtitle = aboutData?.missionSubtitle || "Misyonumuz";
    const missionTitle = aboutData?.missionTitle || "Doğru Ürün + Doğru Mühendislik + Sürdürülebilir Hizmet";

    return (
        <>
            <div className="mission__area section-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 lg-mb-25">
                            <div className="mission__area-left mr-40 xl-mr-0">
                                <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">{missionSubtitle}</span>
                                <h2 className="title_split_anim">{missionTitle}</h2>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="mission__area-right">
                                <div className="row">
                                    <div className="col-md-6 md-mb-25 wow fadeInUp" data-wow-delay=".6s">
                                        <div className="experience__area-list-item">
                                            <i className="flaticon-team"></i>
                                            <div className="experience__area-list-item-content">
                                                <h4>Proje Tasarımı</h4>
                                                <p>Uygulama analizi ve mühendislik danışmanlığı ile her detayı planlıyoruz</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 wow fadeInUp" data-wow-delay=".9s">
                                        <div className="experience__area-list-item">
                                            <i className="flaticon-technology"></i>
                                            <div className="experience__area-list-item-content">
                                                <h4>CAD & Teknik Veri</h4>
                                                <p>2D/3D CAD desteği ve teknik veri hazırlığında kalite odaklıyız</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="about__five section-padding pt-0">
                <div className="container">
                    <div className="row al-center">
                        <div className="col-lg-5 lg-mb-25">
                            <div className="about__five-image wow img_left_animation">
                                <img src={imageUrl} alt="image" />
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="about__five-right ml-70 xl-ml-0">
                                <div className="about__five-right-title">
                                    <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">{subtitle}</span>
                                    <h2 className="title_split_anim">{title}</h2>
                                </div>
                                <div className="features wow fadeInUp" data-wow-delay=".3s" style={{backgroundImage: `url(${bgImage.src})`}}>
                                    <h3>Güven İnşa Ediyoruz<br/>{stat1Number}+ {stat1Label}</h3>
                                </div>
                                <div 
                                    className="wow fadeInUp" 
                                    data-wow-delay=".6s"
                                    dangerouslySetInnerHTML={{ __html: body.replace(/\n/g, '<br />') }}
                                />
                                {ctaLabel && ctaUrl && (
                                    <div className="item_bounce">
                                        <Link className="build_button mt-20" href={ctaUrl}>
                                            {ctaLabel}
                                            <i className="flaticon-right-up"></i>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AboutMain;