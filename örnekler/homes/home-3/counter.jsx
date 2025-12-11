import React from 'react';
import Count from '../../common/count';

const CounterUp = () => {
    return (
        <>
            <div className="counter__two section-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="counter__one-area">
                                <div className="counter__two-area-item item_bounce">
                                    <h2><Count number={678}/>+</h2>
                                    <p>Complete Projects</p>
                                </div>
                                <div className="counter__two-area-item item_bounce">
                                    <h2><Count number={120}/>+</h2>
                                    <p>Team Members</p>
                                </div>
                                <div className="counter__two-area-item item_bounce">
                                    <h2><Count number={635}/>+</h2>
                                    <p>Client Reviews</p>
                                </div>
                                <div className="counter__two-area-item item_bounce">
                                    <h2><Count number={89}/>+</h2>
                                    <p>Winning Awards</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>            
        </>
    );
};

export default CounterUp;