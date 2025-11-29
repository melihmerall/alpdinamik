import React from 'react';
import Link from "next/link";

const PricingPlan = () => {
    return (
        <div className="price__area section-padding">
            <div className="container">
                <div className="row mb-50">
                    <div className="col-xl-12">
                        <div className="price__area-title t-center">
                            <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Ürünlerimiz</span>
                            <h2 className="wow fadeInRight" data-wow-delay=".6s">Mecmot Ürün Portföyü</h2>                        
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-4 col-md-6 xl-mb-25 wow fadeInUp" data-wow-delay=".4s">
                        <div className="price__area-item">
                            <div className="price__area-item-price">
                                <span>Mecmot</span>
                                <h3>Vidalı Krikolar</h3>
                                <h2>Yüksek <span>Hassasiyet</span></h2>
                            </div>
                            <div className="price__area-item-list">
                                <ul>
                                    <li><i className="flaticon-checked"></i>Seviye ayarı uygulamaları</li>
                                    <li><i className="flaticon-checked"></i>Presleme sistemleri</li>
                                    <li><i className="flaticon-checked"></i>Yüksek yük kapasitesi</li>
                                    <li><i className="flaticon-checked"></i>Hassas konumlandırma</li>
                                    <li><i className="flaticon-checked"></i>Çelik endüstrisi uygulamaları</li>
                                </ul>
                            </div>
                            <div className="price__area-item-btn">
                                <Link className="build_button" href="/portfolio/3-columns">Ürünleri İncele<i className="flaticon-right-up"></i></Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-md-6 md-mb-25 wow fadeInUp" data-wow-delay=".7s">
                        <div className="price__area-item active">
                            <div className="price__area-item-price">
                                <span>Mecmot</span>
                                <h3>Yön Değiştiriciler</h3>
                                <h2>Güç <span>Aktarımı</span></h2>
                            </div>
                            <div className="price__area-item-list">
                                <ul>
                                    <li><i className="flaticon-checked"></i>Güç aktarımında esneklik</li>
                                    <li><i className="flaticon-checked"></i>Yüksek verimlilik</li>
                                    <li><i className="flaticon-checked"></i>Kompakt tasarım</li>
                                    <li><i className="flaticon-checked"></i>Otomasyon sistemleri</li>
                                    <li><i className="flaticon-checked"></i>Tarım makinaları uygulamaları</li>
                                </ul>
                                
                            </div>
                            <div className="price__area-item-btn">
                                <Link className="build_button" href="/portfolio/3-columns">Ürünleri İncele<i className="flaticon-right-up"></i></Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-md-6 wow fadeInUp" data-wow-delay="1s">
                        <div className="price__area-item">
                            <div className="price__area-item-price">
                                <span>Mecmot</span>
                                <h3>Lineer Aktuatörler</h3>
                                <h2>Hassas <span>Hareket</span></h2>
                            </div>
                            <div className="price__area-item-list">
                                <ul>
                                    <li><i className="flaticon-checked"></i>Otomatik hareket kontrolü</li>
                                    <li><i className="flaticon-checked"></i>Güneş takip sistemleri</li>
                                    <li><i className="flaticon-checked"></i>Hareketli platformlar</li>
                                    <li><i className="flaticon-checked"></i>Hassas konumlandırma</li>
                                    <li><i className="flaticon-checked"></i>Savunma sanayi uygulamaları</li>
                                </ul>                            
                            </div>
                            <div className="price__area-item-btn">
                                <Link className="build_button" href="/portfolio/3-columns">Ürünleri İncele<i className="flaticon-right-up"></i></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingPlan;