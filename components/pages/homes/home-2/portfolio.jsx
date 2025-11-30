"use client"
import Link from "next/link";
import { useState, useEffect } from 'react';

const PortfolioTwo = () => {
    const [portfolioItem, setPortfolioItem] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPortfolio() {
            try {
                const response = await fetch('/api/portfolio?limit=4');
                if (response.ok) {
                    const data = await response.json();
                    setPortfolioItem(data.data || []);
                }
            } catch (error) {
                console.error('Error loading portfolio:', error);
            } finally {
                setLoading(false);
            }
        }
        loadPortfolio();
    }, []);
    return (
        <div className="portfolio__two section-padding">
            <div className="container">
                <div className="row">
                    <div className="col-lg-5 columns_sticky lg-mb-25">
                        <div className="portfolio__two-left mr-40 xl-mr-0">
                            <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Portföyümüz</span>
                            <h2 className="wow fadeInRight" data-wow-delay=".6s">Tamamladığımız Projeleri Keşfedin</h2>
                            <div className="wow fadeInDown" data-wow-delay="1.2s">
                                <Link className="build_button mt-35" href="/portfolio/3-columns">Tüm Projeler<i className="flaticon-right-up"></i></Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-7">
                        <div className="portfolio__two-right">
                            {portfolioItem?.map((data, id) => (
                                <div className="portfolio__two-item mt-25 card_sticky" key={id}>
                                    <img src={data.imageUrl || '/assets/img/portfolio/portfolio-1.jpg'} alt="image" />
                                    <div className="portfolio__two-item-content">
                                        <span>{data.sector?.name || data.summary}</span>
                                        <h4><Link href={`/portfolio/${data.slug}`}>{data.title}</Link></h4>
                                        <Link href={`/portfolio/${data.slug}`}><i className="flaticon-right-up"></i></Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioTwo;