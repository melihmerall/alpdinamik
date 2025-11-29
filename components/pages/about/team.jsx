import React from 'react';
import teamData from '../../data/team-data';

const Team = () => {
    return (
        <div className="team__area section-padding">
            <div className="container">
                <div className="row mb-35">
                    <div className="col-xl-12">
                        <div className="team__area-title t-center">
                            <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Meet Our Experts</span>
                            <h2 className="title_split_anim">Dedicated Professionals</h2>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {teamData?.slice(0, 4).map((data, id) => (
                        <div className="col-lg-3 col-md-6 mt-25" key={id}>
                            <div className="team__area-item">
                                <img className="img_full" src={data.image.src} alt="image" />
                                <div className="team__area-item-content t-center pt-20">
                                    <h5>{data.name}</h5>
                                    <span>{data.position}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Team;