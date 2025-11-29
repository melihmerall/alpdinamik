import React from 'react';
import Count from '../../common/count';

const CounterUp = () => {
    return (
        <>
            <div className="counter__one section-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="counter__one-area">
                                <div className="counter__one-area-item item_bounce">
                                    <h2><Count number={25}/>+</h2>
                                    <p>Yıl Sektör Tecrübesi</p>
                                </div>
                                <div className="counter__one-area-item item_bounce">
                                    <h2><Count number={500}/>+</h2>
                                    <p>Endüstriyel Proje</p>
                                </div>
                                <div className="counter__one-area-item item_bounce">
                                    <h2><Count number={8}/>+</h2>
                                    <p>Farklı Uygulama Alanı</p>
                                </div>
                                <div className="counter__one-area-item item_bounce">
                                    <h2><Count number={100}/>+</h2>
                                    <p>Mutlu Müşteri</p>
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