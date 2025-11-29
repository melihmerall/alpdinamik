import React from 'react';

const FaqArea = () => {

    return (
        <div className="faq__page section-padding">
            <div className="container">
                <div className="row jc-center">
                    <div className="col-xl-10">
                        <div className="wow fadeInUp" data-wow-delay=".4s" id="accordionExample">
                            <div className="faq-item">
                                <h5 className="icon" data-bs-toggle="collapse" data-bs-target="#collapseOne">Lineer hareket sistemlerinde ürün seçimi nasıl yapılır?</h5>
                                <div id="collapseOne" className="faq-item-body collapse show" data-bs-parent="#accordionExample">
                                    <p>Doğru ürün seçimi için aşağıdaki parametrelerin analiz edilmesi gerekir:</p>
                                    <ul>
                                        <li><strong>Yük Kapasitesi:</strong> Uygulamanızın taşıması gereken maksimum yük miktarı.</li>
                                        <li><strong>Strok Mesafesi:</strong> Lineer hareket sisteminin hareket edeceği mesafe.</li>
                                        <li><strong>Hız Gereksinimleri:</strong> Sistemin çalışma hızı ve ivme/decelerasyon değerleri.</li>
                                        <li><strong>Çalışma Çevrimi (Duty Cycle):</strong> Sistemin ne kadar süre çalışacağı ve dinlenme süreleri.</li>
                                        <li><strong>Çalışma Ortamı:</strong> Sıcaklık, nem, toz, kimyasal ortam gibi çevresel faktörler.</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="faq-item">
                                <h5 className="icon collapsed" data-bs-toggle="collapse" data-bs-target="#collapseTwo">CAD verileri ve teknik çizimler nasıl temin edilir?</h5>
                                <div id="collapseTwo" className="faq-item-body collapse" data-bs-parent="#accordionExample">
                                    <p>Alp Dinamik olarak müşterilerimize kapsamlı CAD desteği sağlıyoruz:</p>
                                    <ul>
                                        <li><strong>2D Teknik Çizimler:</strong> Ürünlerin teknik ölçüleri ve montaj detayları.</li>
                                        <li><strong>3D CAD Modelleri:</strong> SolidWorks, AutoCAD, Inventor gibi programlarda kullanılabilir 3D modeller.</li>
                                        <li><strong>Ürün Katalogları:</strong> Detaylı teknik özellikler ve boyutlandırma tabloları.</li>
                                        <li><strong>Mekanik Entegrasyon Desteği:</strong> Projenize özel entegrasyon çizimleri ve önerileri.</li>
                                        <li><strong>Hızlı Teslimat:</strong> İhtiyacınız olan CAD verilerini kısa sürede sağlıyoruz.</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="faq-item">
                                <h5 className="icon collapsed" data-bs-toggle="collapse" data-bs-target="#collapseThree">Devreye alma ve saha desteği hizmetleriniz nelerdir?</h5>
                                <div id="collapseThree" className="faq-item-body collapse" data-bs-parent="#accordionExample">
                                    <p>Devreye alma sürecinde aşağıdaki hizmetleri sunuyoruz:</p>
                                    <ul>
                                        <li><strong>Saha Kurulum Desteği:</strong> Sistemlerinizin montaj ve kurulum süreçlerinde teknik destek.</li>
                                        <li><strong>Devreye Alma Testleri:</strong> Sistemin doğru çalıştığından emin olmak için test ve kalibrasyon.</li>
                                        <li><strong>Eğitim:</strong> Operatör ve bakım personeline sistem kullanımı konusunda eğitim.</li>
                                        <li><strong>Teknik Dokümantasyon:</strong> Kurulum ve bakım kılavuzları, teknik veri sayfaları.</li>
                                        <li><strong>Uzaktan Destek:</strong> Gerekli durumlarda uzaktan teknik destek hizmeti.</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="faq-item">
                                <h5 className="icon collapsed" data-bs-toggle="collapse" data-bs-target="#collapseFour">Satış sonrası hizmetleriniz nelerdir?</h5>
                                <div id="collapseFour" className="faq-item-body collapse" data-bs-parent="#accordionExample">
                                    <p>Satış sonrası sürekli destek sağlıyoruz:</p>
                                    <ul>
                                        <li><strong>Teknik Destek:</strong> Sistemlerinizle ilgili teknik sorularınız için uzman ekibimiz yanınızda.</li>
                                        <li><strong>Yedek Parça Tedariki:</strong> Orijinal yedek parça temini ve hızlı teslimat.</li>
                                        <li><strong>Bakım Hizmetleri:</strong> Periyodik bakım ve kontrol hizmetleri.</li>
                                        <li><strong>Arıza Giderme:</strong> Sistem arızalarında hızlı müdahale ve çözüm desteği.</li>
                                        <li><strong>Güncelleme ve İyileştirme:</strong> Sistem performansını artırmaya yönelik öneriler.</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="faq-item">
                                <h5 className="icon collapsed" data-bs-toggle="collapse" data-bs-target="#collapseFive">Hangi sektörlerde hizmet veriyorsunuz?</h5>
                                <div id="collapseFive" className="faq-item-body collapse" data-bs-parent="#accordionExample">
                                    <p>Alp Dinamik olarak aşağıdaki sektörlerde lineer hareket çözümleri sunuyoruz:</p>
                                    <ul>
                                        <li><strong>Çelik Endüstrisi:</strong> Levha taşıma, konumlandırma ve seviye ayarlama sistemleri.</li>
                                        <li><strong>Güneş Enerjisi:</strong> Güneş takip mekanizmaları ve panel konumlandırma sistemleri.</li>
                                        <li><strong>Savunma Sanayi:</strong> Hareketli platformlar ve hassas konumlandırma sistemleri.</li>
                                        <li><strong>Makina İmalatı:</strong> Endüstriyel pres hatları, otomasyon sistemleri.</li>
                                        <li><strong>Enerji Sektörü:</strong> Hidroelektrik kapak sistemleri, enerji uygulamaları.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FaqArea;