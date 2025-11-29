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
                            <h4>Project Overview</h4>
                            <div className="portfolio__details-overview-item">
                                <span>Date :</span>
                                <h6>October 10, 2025</h6>
                            </div>
                            <div className="portfolio__details-overview-item">
                                <span>Client :</span>
                                <h6>Jonathan Michael</h6>
                            </div>
                            <div className="portfolio__details-overview-item">
                                <span>Category :</span>
                                <h6>Architecture </h6>
                            </div>
                            <div className="portfolio__details-overview-item">
                                <span>Location :</span>
                                <h6><a href="https://www.google.com/maps">Mesa, New Jersey 45463</a></h6>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div className="portfolio__details-area">
                            <img src={singleData.image.src} alt="image" />
                            <h3 className="mt-25 mb-20">{singleData.title}</h3>
                            <p className="mb-25">One of our standout projects is a modern residential home located in [City, State]. This home features a sleek design with open spaces and energy-efficient materials, ensuring comfort and sustainability. Our team collaborated closely with the homeowners to bring their dream to life, resulting in a stunning and functional living space. In the commercial sector, we completed an innovative office space that prioritizes employee well-being and productivity. By incorporating green building practices, we not only enhanced the aesthetic appeal but also created a healthier work environment.</p>
                            <div className="row mb-25">
                                <div className="col-md-6 md-mb-25">
                                    <ul className="portfolio__details-area-list">
                                        <li><i className="fas fa-check"></i>Conceptualisation and Ideation</li>
                                        <li><i className="fas fa-check"></i>Material Selection and Sustainability</li>
                                        <li><i className="fas fa-check"></i>Detailed Design Development</li>
                                    </ul>
                                </div>
                                <div className="col-md-6">
                                    <ul className="portfolio__details-area-list">
                                        <li><i className="fas fa-check"></i>Building Code Compliance and Safety</li>
                                        <li><i className="fas fa-check"></i>Sustainability Environmental Considerations</li>
                                        <li><i className="fas fa-check"></i>Final Construction Documents</li>
                                    </ul>								
                                </div>
                            </div>
                            <h4 className="mb-20">Post-Construction Evaluation</h4>
                            <p>Our dedication to quality and customer satisfaction is evident in every project we undertake. We invite you to explore our portfolio and see how [Your Company Name] can transform your vision into reality, creating spaces that inspire and endure. we are committed to crafting spaces that reflect.</p>
                            <div className="row mt-40 mb-40 portfolio__details-area-image">
                                <div className="col-sm-6 sm-mb-25">
                                    <img src={image1.src} alt="image" />
                                </div>
                                <div className="col-sm-6">
                                    <img src={image2.src} alt="image" />
                                </div>
                            </div>
                            <p>In addition to residential and commercial projects, our portfolio also includes community developments that focus on enhancing local engagement. One notable project is a vibrant community center designed to host events and activities, fostering a sense of belonging among residents. Our team worked diligently to ensure the facility was both functional and inviting, incorporating outdoor spaces for recreation</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioDetailsMain;