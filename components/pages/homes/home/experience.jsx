import Link from "next/link";
import content from "../../../../public/assets/img/shape/content.png";
import image from "../../../../public/assets/img/page/image-1.jpg";

const Experience = () => {
    return (
        <>
            <div className="experience__area section-padding pt-0">
                <div className="container">
                    <div className="row al-end">
                        <div className="col-lg-9 pr-40 xl-pr-10 lg-mb-25">
                            <div className="experience__area-title section-padding pb-0">
                                <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Tecrübe Alanımız</span>
                                <h2 className="wow fadeInRight" data-wow-delay=".6s">Mühendislik Çözümlerinde Üstün Sonuçlar</h2>
                            </div>
                            <div className="row mt-60 al-center">
                                <div className="col-md-2 md-mb-25 wow fadeInLeft" data-wow-delay=".3s">
                                    <Link href="/contact-us"><img className="h_rotate" src={content.src} alt="image" /></Link>
                                </div>
                                <div className="col-md-5 md-mb-25 wow fadeInLeft" data-wow-delay=".6s">
                                    <div className="experience__area-list-item">
                                        <i className="flaticon-team"></i>
                                        <div className="experience__area-list-item-content">
                                            <h4>Proje Tasarımı</h4>
                                            <p>Her detayı dikkate alan mühendislik yaklaşımı</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-5 wow fadeInLeft" data-wow-delay=".9s">
                                    <div className="experience__area-list-item">
                                        <i className="flaticon-technology"></i>
                                        <div className="experience__area-list-item-content">
                                            <h4>CAD & Teknik Veri</h4>
                                            <p>Kaliteli teknik destek ve mühendislik hizmetleri</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="experience__area-image">
                                <img className="wow img_top_animation" src={image.src} alt="image" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Experience;