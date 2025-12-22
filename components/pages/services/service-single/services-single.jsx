import React from 'react';
import Link from "next/link";
import ctaImage from '../../../../public/assets/img/page/cta-1.jpg';
import image1 from '../../../../public/assets/img/portfolio/portfolio-5.jpg';
import image2 from '../../../../public/assets/img/portfolio/portfolio-8.jpg';
import servicesData from '@/components/data/services-data';

const ServicesSingleMain = ({singleData}) => {
    return (
        <>
            <div className="services__details section-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 columns_sticky">
                            <div className="all__sidebar">                        
                                <div className="all__sidebar-item">
                                    <h4>Hizmetlerimiz</h4>
                                    <div className="all__sidebar-item-category">
                                        <ul>
                                            {servicesData.slice(0, 5).map((data, id) => (
                                                <li key={id}><Link href={`/services/${data.id}`}>{data.title}<i className="flaticon-right-up"></i></Link></li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="all__sidebar-item-help mb-25" style={{backgroundImage: `url(${ctaImage.src})`}}>
                                    <h3>Projeniz İçin Hazır mısınız?</h3>
                                    <Link className="build_button mt-20" href="/iletisim">Teklif Alın<i className="flaticon-right-up"></i></Link>
                                </div>
                                <div className="all__sidebar-item">
                                    <h4>İndir</h4>
                                    <div className="all__sidebar-item-download">
                                        <ul>
                                            <li><Link href="#">Firma Detayları<span className="fal fa-arrow-to-bottom"></span></Link></li>
                                            <li><Link href="#">Ürün Katalogları<span className="fal fa-arrow-to-bottom"></span></Link></li>
                                        </ul>                            
                                    </div>
                                </div>
                            </div>  
                        </div>
                        <div className="col-lg-8">
                            <div className="services__details-area">
                                <img src={singleData.image.src} alt="image" />
                                <h3 className="mt-25 mb-20">{singleData.title}</h3>
                                <p className="mb-20">Alpdinamik olarak, lineer hareket sistemlerinde müşterilerimizin özel ihtiyaçlarına uygun yüksek kaliteli mühendislik hizmetleri sunuyoruz. Sektördeki yılların verdiği deneyimle, uzman ekibimiz projelerinizi hayata geçirmek için çalışıyor. Yeni bir sistem kurulumu, mevcut sistem iyileştirmesi veya özel uygulama gereksinimleriniz için yanınızdayız.</p>
                                <p className="mb-25">Sektördeki deneyimimizle, ekibimiz proje sürecinin her aşamasını yönetir ve projenizin sorunsuz ve verimli ilerlemesini sağlar. Açık iletişim, zamanında teslimat ve kaliteli işçilik ile beklentilerinizi aşmayı hedefliyoruz. Yenilikçi çözümler sunarak güvenilir bir mühendislik ortağı olmaya devam ediyoruz.</p>
                                <h4 className="mb-20">Mühendislik Çözümlerinde Üstün Kalite</h4>
                                <p>Lineer hareket sistemlerinizi Alpdinamik'in uzman desteğiyle geliştirin. Uygulamanızın gereksinimlerine göre en uygun vidalı kriko, yön değiştirici veya lineer aktüatör çözümünü sunuyoruz. Ekibimiz, çelik endüstrisi, güneş enerjisi, savunma sanayi ve genel makina imalatı gibi farklı sektörlerde kapsamlı deneyime sahiptir. Projenizin başarısı için sizinle yakın işbirliği içinde çalışıyoruz.</p>
                                <div className="row mt-40 mb-40">
                                    <div className="col-sm-6 sm-mb-25">
                                        <img className="img_full" src={image1.src} alt="image" />
                                    </div>
                                    <div className="col-sm-6">
                                        <img className="img_full" src={image2.src} alt="image" />
                                    </div>
                                </div>
                                <p>Yılların deneyimiyle olağanüstü mühendislik hizmetleri sunuyoruz. Uzman ekibimiz kalite, şeffaflık ve müşteri memnuniyetini ön planda tutuyor. Yenilikçi teknikler ve sürdürülebilir uygulamalar kullanarak, projelerin zamanında tamamlanmasını sağlıyoruz. Üstün mühendislik çözümlerimizle projelerinizi hayata geçirmenize güvenin.</p>
                                <ul className="services__details-area-list">
                                    <li><i className="flaticon-check-mark"></i>Deneyimli mühendislerimiz yılların birikimini projelerinize aktarır</li>
                                    <li><i className="flaticon-check-mark"></i>Lineer hareket sistemlerinde sektörün önde gelen mühendislik firmasıyız</li>
                                    <li><i className="flaticon-check-mark"></i>Şeffaf fiyatlandırma ile gizli maliyet yok, net teklifler sunuyoruz</li>
                                    <li><i className="flaticon-check-mark"></i>Tüm projelerimizde güvenlik standartlarına sıkı sıkıya bağlıyız</li>
                                </ul>
                                <h3>Sıkça Sorulan Sorular</h3>
                                <div className="mt-30" id="accordionExample">
                                    <div className="faq-item">
                                        <h5 className="icon" data-bs-toggle="collapse" data-bs-target="#collapseOne">1. Hangi hizmetleri sunuyorsunuz?</h5>
                                        <div id="collapseOne" className="faq-item-body collapse show" data-bs-parent="#accordionExample">
                                            <p>Proje tasarımı ve mühendislik, ürün seçimi ve boyutlandırma, 2D/3D CAD ve teknik veri desteği, devreye alma ve saha desteği, satış sonrası teknik destek hizmetlerini sunuyoruz</p>
                                        </div>
                                    </div>
                                    <div className="faq-item">
                                        <h5 className="icon collapsed" data-bs-toggle="collapse" data-bs-target="#collapseTwo">2. Ücretsiz teklif veriyor musunuz?</h5>
                                        <div id="collapseTwo" className="faq-item-body collapse" data-bs-parent="#accordionExample">
                                            <p>Evet, tüm potansiyel projeler için ücretsiz teklif sunuyoruz. Gereksinimlerinizi değerlendirip, herhangi bir yükümlülük olmadan detaylı bir teklif hazırlıyoruz</p>
                                        </div>
                                    </div>
                                    <div className="faq-item">
                                        <h5 className="icon collapsed" data-bs-toggle="collapse" data-bs-target="#collapseThree">3. CAD verileri ne kadar sürede temin edilir?</h5>
                                        <div id="collapseThree" className="faq-item-body collapse" data-bs-parent="#accordionExample">
                                            <p>2D ve 3D CAD verileri, teknik çizimler ve ürün katalogları genellikle 24-48 saat içinde sağlanır. Acil durumlarda daha hızlı teslimat yapılabilir</p>
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

export default ServicesSingleMain;