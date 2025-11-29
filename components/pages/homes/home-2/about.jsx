import Link from "next/link";
import Count from "../../common/count";
import image from "../../../../public/assets/img/page/who-we-are.jpg";

const AboutTwo = () => {
    return (
        <div className="about__two section-padding pt-0">
            <div className="container">
                <div className="row">
                    <div className="col-xl-5 col-lg-6 lg-mb-25">
                        <div className="about__two-left section-padding pb-0">
                            <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Hakkımızda</span>
                            <h2 className="wow fadeInRight" data-wow-delay=".6s">Lineer Hareket Sistemlerinde Güvenilir Çözüm Ortağınız</h2>
                            <p className="wow fadeInUp" data-wow-delay=".4s">Alp Dinamik, lineer hareket sistemleri konusunda projeci ve mühendislik odaklı bir firmadır. Temsil ettiğimiz Mecmot markasının ürünlerini sadece satış olarak değil; uygulama analizi, ürün seçimi ve boyutlandırma, CAD desteği, devreye alma ve satış sonrası hizmetlerle birlikte sunar.</p>
                            <div className="wow fadeInDown" data-wow-delay="1.2s">
                                <Link className="build_button mt-35" href="/services">Tüm Hizmetler<i className="flaticon-right-up"></i></Link>                        
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-7 col-lg-6">
                        <div className="about__two-right">
                            <img className="wow img_top_animation" src={image.src} alt="image" />
                            <div className="counter__one-area mt-35">
                                <div className="about__two-right-counter">
                                    <h2><Count number={25}/>+</h2>
                                    <p>Yıl Sektör Tecrübesi</p>
                                </div>
                                <div className="about__two-right-counter">
                                    <h2><Count number={500}/>+</h2>
                                    <p>Endüstriyel Proje</p>
                                </div>
                                <div className="about__two-right-counter">
                                    <h2><Count number={10}/>+</h2>
                                    <p>Farklı Uygulama Alanı</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutTwo;