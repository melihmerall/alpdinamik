import React from 'react';
import image1 from '../../../../public/assets/img/about/about-1.jpg';
import image2 from '../../../../public/assets/img/page/choose-us.jpg';

const PortfolioDetailsMain = ({singleData}) => {
    return (
        <div className="portfolio__details section-padding">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 columns_sticky lg-mb-25">
                        <div className="portfolio__details-overview">
                            <h4>Proje Özeti</h4>
                            <div className="portfolio__details-overview-item">
                                <span>Tarih :</span>
                                <h6>2024</h6>
                            </div>
                            <div className="portfolio__details-overview-item">
                                <span>Müşteri :</span>
                                <h6>Endüstriyel Tesis</h6>
                            </div>
                            <div className="portfolio__details-overview-item">
                                <span>Kategori :</span>
                                <h6>Lineer Hareket Sistemi</h6>
                            </div>
                            <div className="portfolio__details-overview-item">
                                <span>Konum :</span>
                                <h6><a href="https://www.google.com/maps">Türkiye</a></h6>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div className="portfolio__details-area">
                            <img src={singleData.image.src} alt="image" />
                            <h3 className="mt-25 mb-20">{singleData.title}</h3>
                            <p className="mb-25">Bu projede, uygulamanın yük ve strok gereksinimlerine göre uygun vidalı kriko ve yön değiştirici kombinasyonu seçildi. Mekanik entegrasyon tarafında mühendislik desteği verildi ve sistemin güvenli çalışması için gerekli tüm hesaplamalar yapıldı. CAD verileri ve teknik çizimlerle proje süreci hızlandırıldı. Devreye alma aşamasında saha desteği sağlandı ve sistem başarıyla çalışır hale getirildi.</p>
                            <div className="row mb-25">
                                <div className="col-md-6 md-mb-25">
                                    <ul className="portfolio__details-area-list">
                                        <li><i className="fas fa-check"></i>Uygulama Analizi ve Proje Tasarımı</li>
                                        <li><i className="fas fa-check"></i>Ürün Seçimi ve Boyutlandırma</li>
                                        <li><i className="fas fa-check"></i>CAD & Teknik Veri Hazırlığı</li>
                                    </ul>
                                </div>
                                <div className="col-md-6">
                                    <ul className="portfolio__details-area-list">
                                        <li><i className="fas fa-check"></i>Mekanik Entegrasyon Desteği</li>
                                        <li><i className="fas fa-check"></i>Devreye Alma ve Test</li>
                                        <li><i className="fas fa-check"></i>Satış Sonrası Teknik Destek</li>
                                    </ul>								
                                </div>
                            </div>
                            <h4 className="mb-20">Proje Sonuçları</h4>
                            <p>Proje başarıyla tamamlandı ve sistem müşterinin beklentilerini karşılayacak şekilde çalışmaktadır. Alp Dinamik olarak, her projede olduğu gibi bu projede de uçtan uca mühendislik çözümü sunarak müşteri memnuniyetini sağladık. Kalite ve güvenilirlik odaklı yaklaşımımız sayesinde sistemin uzun yıllar sorunsuz çalışması hedeflenmektedir.</p>
                            <div className="row mt-40 mb-40 portfolio__details-area-image">
                                <div className="col-sm-6 sm-mb-25">
                                    <img src={image1.src} alt="image" />
                                </div>
                                <div className="col-sm-6">
                                    <img src={image2.src} alt="image" />
                                </div>
                            </div>
                            <p>Lineer hareket sistemlerinde doğru ürün seçimi ve mühendislik desteği, projelerin başarısında kritik rol oynar. Alp Dinamik olarak, her uygulamanın kendine özgü gereksinimlerini analiz ederek en uygun çözümü sunuyoruz. Proje bazlı yaklaşımımız sayesinde müşterilerimizin ihtiyaçlarına tam uyum sağlıyor ve sistemlerin güvenli, verimli çalışmasını garanti ediyoruz.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioDetailsMain;