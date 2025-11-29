import React from 'react';

const WorkProcess = () => {
    return (
        <>
            <div className="process__area section-padding">
                <div className="container">
                    <div className="row mb-75">
                        <div className="col-xl-12">
                            <div className="process__area-title t-center">
                                <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Çalışma Sürecimiz</span>
                                <h2 className="wow fadeInRight" data-wow-delay=".6s">Projenizin Bizimle Yolculuğu</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row g-0">
                        <div className="col-lg-3 col-md-6 lg-mb-40 wow fadeInLeft" data-wow-delay=".3s">
                            <div className="process__area-item">
                                <h6>01</h6>
                                <h4>İlk Görüşme</h4>
                                <p>Uzman ekibimizle proje hedefleri, gereksinimler ve zaman çizelgesini görüşüyoruz</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 md-mb-40 wow fadeInLeft" data-wow-delay=".6s">
                            <div className="process__area-item pl-20 xl-pl-0">
                                <h6>02</h6>
                                <h4>Proje Planlama</h4>
                                <p>Tasarım, ürün seçimi ve zaman çizelgesini içeren kapsamlı plan hazırlıyoruz</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 md-mb-40 wow fadeInLeft" data-wow-delay=".9s">
                            <div className="process__area-item pl-40 xl-pl-0">
                                <h6>03</h6>
                                <h4>Uygulama Aşaması</h4>
                                <p>Kaliteli işçilik ve mühendislik ile planı uyguluyoruz</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 wow fadeInLeft" data-wow-delay="1.2s">
                            <div className="process__area-item pl-40 xl-pl-0">
                                <h6>04</h6>
                                <h4>Devreye Alma</h4>
                                <p>Proje tamamlanmadan önce tüm endişeleri ele alıyoruz</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>            
        </>
    );
};

export default WorkProcess;