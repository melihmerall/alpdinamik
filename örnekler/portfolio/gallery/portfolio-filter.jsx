import React, { useState } from 'react';
import portfolioData from '../../../data/portfolio-data';
import Link from 'next/link';

const filters = [
    { id: 1, name: "All", filterData: "all", },
    { id: 2, name: "Marketing", filterData: "marketing", },
    { id: 3, name: "Business", filterData: "business", },
    { id: 4, name: "Corporate", filterData: "corporate", },
];

const getFilteredProjects = (filterData) => {
    if (filterData === "all") {
        return portfolioData.filter((project) => project);
    }
    return portfolioData.filter((project) => project.category === filterData && project);
};
  
const PortfolioFilter = () => {
    const [filter, setFilter] = useState("all");
    const filteredProjects = getFilteredProjects(filter);
    
    return (
        <>
            <div className="gallery__area four__columns section-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-12 mb-40">
                            <div className="gallery__area-button t-center">
                                {filters.map(({ id, name, filterData }) => (
                                    <button key={id} onClick={() => setFilter(filterData)}
                                    className={filter === filterData ? "active" : ""}
                                    >{name}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {filteredProjects.slice(0, 6)?.map((data, id) => (
                            <div className="col-xl-4 col-md-6 mt-25" key={id}>
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
        </>
    );
};

export default PortfolioFilter;