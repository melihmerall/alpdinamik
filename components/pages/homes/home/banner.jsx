import React from 'react';
import bannerBg from "../../../../public/assets/img/shape/banner-shape.png";
import user from "../../../../public/assets/img/avatar/user.png";
import award from "../../../../public/assets/img/shape/award.png";
import image from "../../../../public/assets/img/banner/banner.jpg";

const BannerOne = () => {
    return (
        <div className="banner__one" style={{backgroundImage: `url(${bannerBg.src})`}}>
            <div className="container">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="banner__one-content">
                            <h1 className="wow fadeInRight" data-wow-delay=".4s">Building Construction Solutions</h1>
                            <div className="banner__one-content-user wow fadeInUp" data-wow-delay=".6s">
                                <img src={user.src} alt="image" />
                                <h5>More then 25K Clients Reviews</h5>
                            </div>
                            <div className="banner__one-content-award bounce_y">
                                <img src={award.src} alt="image" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="banner__one-image">
                <img className="img_full" src={image.src} alt="image" />
            </div>
        </div>
    );
};

export default BannerOne;