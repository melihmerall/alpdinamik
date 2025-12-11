import Link from "next/link";
import portfolioData from '../../../data/portfolio-data';

const PortfolioTwo = () => {
    const portfolioItem = portfolioData.slice(0, 4);
    return (
        <div className="portfolio__two section-padding">
            <div className="container">
                <div className="row">
                    <div className="col-lg-5 columns_sticky lg-mb-25">
                        <div className="portfolio__two-left mr-40 xl-mr-0">
                            <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Latest Creations</span>
                            <h2 className="wow fadeInRight" data-wow-delay=".6s">View Our Completed Projects</h2>
                            <div className="wow fadeInDown" data-wow-delay="1.2s">
                                <Link className="build_button mt-35" href="/portfolio">All Project<i className="flaticon-right-up"></i></Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-7">
                        <div className="portfolio__two-right">
                            {portfolioItem?.map((data, id) => (
                                <div className="portfolio__two-item mt-25 card_sticky" key={id}>
                                    <img src={data.image.src} alt="image" />
                                    <div className="portfolio__two-item-content">
                                        <span>{data.subtitle}</span>
                                        <h4><Link href={`/portfolio/${data.id}`}>{data.title}</Link></h4>
                                        <Link href={`/portfolio/${data.id}`}><i className="flaticon-right-up"></i></Link>
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