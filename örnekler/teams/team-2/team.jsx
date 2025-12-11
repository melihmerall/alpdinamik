import React from 'react';
import teamData from '@/components/data/team-data';

const TeamMain = () => {
    return (
        <>
            <div className="team__area section-padding-three">
                <div className="container">
                    <div className="row">
                        {teamData?.map((data, id) => (
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
        </>
    );
};

export default TeamMain;