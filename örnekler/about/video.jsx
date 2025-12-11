import React, { useState } from 'react';
import Link from "next/link";
import ModalVideo from 'react-modal-video';
import portfolioData from '../../data/portfolio-data';
import videoBg from "../../../public/assets/img/service/service-1.jpg";
import icon2 from '../../../public/assets/img/icon/star-dark.svg';

const Video = () => {
    const [openVideo, setOpenVideo] = useState(false);
    const openVideoModal = () => {
        setOpenVideo(true);
    };
    return (
        <>
            <div className="video__two" style={{backgroundImage: `url(${videoBg.src})`}}>
                <div className="container">
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="video__two-icon item_bounce">
                                <div className="video video-pulse">
                                <span onClick={openVideoModal}><i className="fas fa-play"></i></span>
                                </div>						
                            </div>
                        </div>
                    </div>
                </div>
                <div className="scroll__slider">
                    <div className="text-slide">
                        <div className="sliders text_scroll">
                            <ul>
                                {portfolioData?.map((data, id) => (
                                    <li key={id}><img src={icon2.src} alt="icon"/><Link href={`/portfolio/${data.id}`}>{data.title.split(' ').slice(0, 1).join(' ')}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div className="sliders text_scroll">
                            <ul>
                                {portfolioData?.map((data, id) => (
                                    <li key={id}><img src={icon2.src} alt="icon"/><Link href={`/portfolio/${data.id}`}>{data.title.split(' ').slice(0, 1).join(' ')}</Link></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <ModalVideo className='video-modal' channel="youtube" autoplay isOpen={openVideo} videoId="SZEflIVnhH8" onClose={() => setOpenVideo(false)} />
        </>
    );
};

export default Video;