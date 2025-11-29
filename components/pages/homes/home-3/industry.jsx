import React from 'react';
import image from "../../../../public/assets/img/page/who-we-are.jpg";
import user1 from "../../../../public/assets/img/avatar/video.png";
import user2 from "../../../../public/assets/img/avatar/video-dark.png";

const Industry = () => {
    return (
        <div className="industry__area section-padding pt-0">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 lg-mb-25">
                        <div className="industry__area-left section-padding pb-0">
                            <div className="title">
                                <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Sektörlerimiz</span>
                                <h2 className="wow fadeInRight" data-wow-delay=".6s">Başarı İçin Çözüm Odaklı Yaklaşım</h2>
                            </div>
                            <div className="image wow fadeInDown" data-wow-delay="1.2s">
                                <img className="dark-n" src={user1.src} alt="image" />
                                <img className="light-n" src={user2.src} alt="image" />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div className="industry__area-right">
                            <img className="wow img_top_animation" src={image.src} alt="image" />
                            <div className="industry__area-right-list mt-50">
                                <div className="row">
                                    <div className="col-md-6 md-mb-25 wow fadeInLeft" data-wow-delay=".4s">
                                        <div className="industry__area-right-list-item">
                                            <i className="flaticon-creative"></i>
                                            <div className="industry__area-right-list-item-content">
                                                <h4>Çelik Endüstrisi</h4>
                                                <p>Ağır yük kaldırma ve hassas konumlandırma için özel lineer hareket çözümleri</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 wow fadeInLeft" data-wow-delay=".8s">
                                        <div className="industry__area-right-list-item">
                                            <i className="flaticon-search-analysis"></i>
                                            <div className="industry__area-right-list-item-content">
                                                <h4>Güneş Enerjisi Sistemleri</h4>
                                                <p>Güneş paneli takip sistemleri ve CSP uygulamaları için güvenilir çözümler</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Industry;