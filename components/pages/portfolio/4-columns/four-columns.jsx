import React from 'react';
import Link from 'next/link';
import portfolioData from '@/components/data/portfolio-data';

const FourColumns = () => {
    return (
        <div className="four__columns section-padding-three">
            <div className="container">
                <div className="row">
                    {portfolioData?.map((data, id) => (
                        <div className="col-lg-3 col-md-6 mt-25" key={id}>
                            <div className="portfolio__four-item">
                                <Link href={`/portfolio/${data.id}`}><i className="flaticon flaticon-right-up"></i></Link>
                                <img src={data.image.src} alt="image" />
                                <div className="portfolio__four-item-content">
                                    <span>{data.subtitle}</span>
                                    <h5><Link href={`/portfolio/${data.id}`}>{data.title}</Link></h5>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FourColumns;