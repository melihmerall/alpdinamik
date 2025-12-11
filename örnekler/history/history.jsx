import historyData from '@/components/data/history-data';
import React from 'react';

const CompanyHistory = () => {
    return (
        <div className="history__area section-padding">
            <div className="container">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="company__history-area">
                            {historyData.map((item, id) => (
                                <div className="company__history-area-item" key={id}>
                                    <div className="company__history-area-item-date">
                                        <span>{item.date}</span>
                                    </div>
                                    <div className="company__history-area-item-inner">
                                        <div className="company__history-area-item-inner-image">
                                            <img src={item.image.src} alt={item.title} />
                                        </div>
                                        <div className="company__history-area-item-inner-content">
                                            <h4>{item.title}</h4>
                                            <p>{item.description}</p>
                                        </div>
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

export default CompanyHistory;