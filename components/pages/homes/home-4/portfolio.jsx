import React, { useState } from 'react';
import portfolioData from "../../../data/portfolio-data";
import Link from "next/link";

const PortfolioFour = () => {
    const [active, setActive] = useState();
    const handelActive = (index) => {
        setActive(index);
    };
    return (
        <div className="portfolio__four">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="portfolio__four-area">
                            {portfolioData.slice(0, 4)?.map((data, index) => (
                                <div onMouseEnter={() => handelActive(index)} className={`portfolio__four-area-item ${ active === index ? "active" : "" }`} key={index} >
                                    <img src={data.image.src} alt="image" />
                                    <div className="portfolio__four-area-item-area">
                                        <div className="portfolio__one-item-content">
                                            <span>{data.subtitle}</span>
                                            <h4><Link href={`/portfolio/${data.id}`}>{data.title}</Link></h4>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mt-60">
                <div className="row al-center">
                    <div className="col-xl-5 col-md-7 md-mb-25 lg-t-center title_split_anim">
                        <h3>Get Expert Construction Advice and a Free Quote</h3>
                    </div>
                    <div className="col-xl-7 col-md-5 t-right lg-t-center">
                        <div className="wow fadeInDown" data-wow-delay="1.2s">
                            <Link className="build_button" href="/request-quote">Start a Journey<i className="flaticon-right-up"></i></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioFour;