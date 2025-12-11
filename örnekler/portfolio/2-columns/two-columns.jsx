import React, { useState } from 'react';
import Link from 'next/link';
import portfolioData from '@/components/data/portfolio-data';

const showPortfolioItem = 4;

const TwoColumns = () => {
    const portfolioItem = portfolioData;
    const [items, setItems] = useState(portfolioItem);
    const [next, setNext] = useState(showPortfolioItem);
    const handleLoadData = () => {
        setNext(value => value + 2)
    }
    return (
        <div className="two__columns section-padding-three">
            <div className="container">
                <div className="row">
                    {portfolioItem?.slice(0, next)?.map((data, id) => (
                        <div className="col-md-6 mt-25" key={id}>
                            <div className="portfolio__two-item">
                                <img src={data.image.src} alt="image" />
                                <div className="portfolio__two-item-content">
                                    <span>{data.subtitle}</span>
                                    <h4><Link href={`/portfolio/${data.id}`}>{data.title}</Link></h4>
                                    <Link href={`/portfolio/${data.id}`}><i className="flaticon-right-up"></i></Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {next < items.length && (
                    <div className="row mt-70">
                        <div className="col-xl-12 t-center">
                            <button onClick={handleLoadData} className="build_button">Load More <i className="flaticon-right-up"></i></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TwoColumns;