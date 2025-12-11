import React from 'react';
import teamData from '@/components/data/team-data';

const TeamMain = () => {
    return (
        <>
            <div className="team__two section-padding-three">
                <div className="container">
                    <div className="row">
                        {teamData?.slice(0, 6).map((data, id) => (
                            <div className="col-lg-4 col-md-6 mt-25" key={id}>
                                <div className="team__area-item">
                                    <img className="img_full" src={data.image.src} alt="image" />
                                    <div className="team__area-item-content">
                                        <span>{data.position}</span>
                                        <h4>{data.name}</h4>
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