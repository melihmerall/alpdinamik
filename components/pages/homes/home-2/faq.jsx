import React from 'react';
import image from "../../../../public/assets/img/service/services-1.jpg";

const FaqArea = () => {
    return (
        <>            
            <div className="faq__area section-padding">
                <div className="container">
                    <div className="row al-center">
                        <div className="col-xl-6 col-lg-5 lg-mb-25">
                            <div className="faq__area-image mr-50 xl-mr-0">
                                <img className="wow img_right_animation" src={image.src} alt="image" />
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-7">
                            <div className="faq__area-right">
                                <div className="faq__area-right-title mb-40">
                                    <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Sıkça Sorulan Sorular</span>
                                    <h2 className="wow fadeInRight" data-wow-delay=".6s">Lineer Hareket Sistemleri Hakkında Sorularınız</h2>
                                </div>
                                <div className="wow fadeInUp" data-wow-delay=".9s" id="accordionExample">
                                    <div className="faq-item">
                                        <h5 className="icon" data-bs-toggle="collapse" data-bs-target="#collapseOne">1. Hangi ürünleri temsil ediyorsunuz?</h5>
                                        <div id="collapseOne" className="faq-item-body collapse show" data-bs-parent="#accordionExample">
                                            <p>Alp Dinamik olarak Mecmot markasının Türkiye temsilciliğini yapıyoruz. Mecmot Vidalı Krikolar, Yön Değiştiriciler ve Lineer Aktuatörler ürün portföyümüzü oluşturmaktadır.</p>
                                        </div>
                                    </div>
                                    <div className="faq-item">
                                        <h5 className="icon collapsed" data-bs-toggle="collapse" data-bs-target="#collapseTwo">2. Mühendislik desteği sağlıyor musunuz?</h5>
                                        <div id="collapseTwo" className="faq-item-body collapse" data-bs-parent="#accordionExample">
                                            <p>Evet, sadece ürün tedarik etmekle kalmıyoruz. Uygulama analizi, ürün seçimi ve boyutlandırma, 2D/3D CAD desteği, devreye alma ve satış sonrası teknik destek hizmetleri sunuyoruz.</p>
                                        </div>
                                    </div>
                                    <div className="faq-item">
                                        <h5 className="icon collapsed" data-bs-toggle="collapse" data-bs-target="#collapseThree">3. Hangi sektörlere hizmet veriyorsunuz?</h5>
                                        <div id="collapseThree" className="faq-item-body collapse" data-bs-parent="#accordionExample">
                                            <p>Çelik endüstrisi, güneş enerjisi sistemleri, savunma sanayi, hareketli platformlar, havacılık, hidroelektrik sistemler ve genel makina imalatı gibi geniş bir yelpazede endüstriyel sektörlere hizmet veriyoruz.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FaqArea;