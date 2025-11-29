import { useState } from 'react';
import Link from "next/link";
import servicesData from '../../../data/services-data';

const Services = () => {
    const [active, setActive] = useState(1);

    const handelActive = (index) => {
        setActive(index);
    };

    return (
        <>
            <div className="services__three section-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-5 columns_sticky">
                            <div className="services__three-title">
                                <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Our Services</span>
                                <h2 className="wow fadeInRight" data-wow-delay=".6s">We Ready to Provide Services</h2>
                                <div className="wow fadeInDown" data-wow-delay="1.2s">
                                    <Link className="build_button mt-40" href="/about-us">
                                        All Services<i className="flaticon-right-up"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="services__three-right">
                                {servicesData.slice(0, 4)?.map((data, index) => (
                                    <div
                                        onMouseEnter={() => handelActive(index)}
                                        className={`services__three-item ${active === index ? "active" : ""}`}
                                        key={index}
                                    >
                                        <div className="services__three-item-title">
                                            <h3>
                                                <span>0{data.number}</span>
                                                <Link href={`/services/${data.id}`}>{data.title}</Link>
                                            </h3>
                                        </div>
                                        <div
                                            className="services__three-item-body"
                                            style={{
                                                opacity: active === index ? 1 : 0,
                                                maxHeight: active === index ? "500px" : "0px",
                                                paddingBottom: active === index ? "30px" : "0px",
                                                overflow: "hidden",
                                                transition: "opacity 0.5s ease, max-height 0.5s ease",
                                            }}
                                        >
                                            <img src={data.image.src} alt="image" />
                                            <p>{data.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Services;
