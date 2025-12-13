import React from 'react';
import Link from 'next/link';

const SectorDetailsMain = ({singleData}) => {
    if (!singleData) {
        return (
            <div className="portfolio__details section-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-12">
                            <p>Sektör bulunamadı.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="portfolio__details section-padding">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 columns_sticky lg-mb-25">
                        <div className="portfolio__details-overview">
                            <h4>Sektör Bilgileri</h4>
                            <div className="portfolio__details-overview-item">
                                <span>Sektör :</span>
                                <h6>{singleData.name}</h6>
                            </div>
                            {singleData.description && (
                                <div className="portfolio__details-overview-item">
                                    <span>Özet :</span>
                                    <h6 style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                                        {singleData.description.length > 100 
                                            ? singleData.description.substring(0, 100) + '...' 
                                            : singleData.description}
                                    </h6>
                                </div>
                            )}
                        </div>
                        <div style={{ marginTop: '2rem' }}>
                            <Link href="/iletisim" className="build_button">
                                Bize Ulaşın <i className="flaticon-right-up"></i>
                            </Link>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div className="portfolio__details-area">
                            {singleData.imageUrl && (
                                <img src={singleData.imageUrl} alt={singleData.name} style={{ marginBottom: '2rem' }} />
                            )}
                            <h3 className="mt-25 mb-20">{singleData.name}</h3>
                            {singleData.description && (
                                <div 
                                    className="mb-25"
                                    dangerouslySetInnerHTML={{ __html: singleData.description.replace(/\n/g, '<br />') }}
                                />
                            )}
                            <div style={{ 
                                marginTop: '3rem', 
                                padding: '2rem', 
                                background: '#f8f9fa', 
                                borderRadius: '8px',
                                textAlign: 'center'
                            }}>
                                <h4 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                                    Bu sektör için çözümlerimiz hakkında bilgi almak ister misiniz?
                                </h4>
                                <Link href="/iletisim" className="build_button">
                                    İletişime Geçin <i className="flaticon-right-up"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SectorDetailsMain;

