import React, { useState } from 'react';
import image1 from "../../../../public/assets/img/portfolio/portfolio-1.jpg";
import image2 from "../../../../public/assets/img/portfolio/portfolio-2.jpg";
import image3 from "../../../../public/assets/img/portfolio/portfolio-3.jpg";
import image4 from "../../../../public/assets/img/portfolio/portfolio-4.jpg";

const Award = () => {
    const [activeImage, setActiveImage] = useState(2);
    const handleHover = (index) => {
        setActiveImage(index);
    };
    const images = [image1, image2, image3, image4];
    const awards = [
        { title: "Sustainable Practices", location: "France", year: "2017" },
        { title: "3D Design", location: "Italy", year: "2005" },
        { title: "Health and Safety", location: "Germany", year: "1990" },
        { title: "Construction Solution", location: "USA", year: "1968" },
    ];

    return (
        <div className="award__area section-padding">
            <div className="container">
                <div className="row al-end mb-60">
                    <div className="col-lg-7 lg-mb-10">
                        <div className="award__area-title">
                            <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Achieve Distinction</span>
                            <h2 className="wow fadeInRight" data-wow-delay=".6s">Recognition's and Award</h2>
                        </div>
                    </div>
                    <div className="col-lg-5 wow fadeInDown" data-wow-delay=".4s">
                        <div className="award__area-content jc-end">
                            <p>Our commitment to excellence has earned us numerous awards and honors in the construction industry, showcasing our dedication and quality.</p>
                        </div>
                    </div>
                </div>
                <div className="row al-center">
                    <div className="col-lg-4 lg-mb-40">
                        <div className="award__area-left mr-50 lg-mr-0 img_left_animation">
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    className={`award__area-left-image item-${index + 1} ${
                                        activeImage === index + 1 ? "active" : ""
                                    }`}
                                    style={{
                                        opacity: activeImage === index + 1 ? 1 : 0,
                                        position: activeImage === index + 1 ? "relative" : "absolute",
                                        transition: "opacity 0.5s ease",
                                    }}
                                >
                                    <img src={image.src} alt={`Award ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-lg-8 wow fadeInUp" data-wow-delay=".5s">
                        <div className="award__area-list ml-10">
                            {awards.map((award, index) => (
                                <div
                                    key={index}
                                    className={`award__area-list-item ${
                                        activeImage === index + 1 ? "active" : ""
                                    }`}
                                    onMouseEnter={() => handleHover(index + 1)}
                                >
                                    <div className="award__area-list-item-content">
                                        <h4>{award.title}</h4>
                                        <h4>{award.location}</h4>
                                        <h4>{award.year}</h4>
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

export default Award;
