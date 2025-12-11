import { useState } from "react";
import ModalVideo from "react-modal-video";
import videoBg from "../../../../public/assets/img/page/video.jpg";

const Video = () => {
    const [openVideo, setOpenVideo] = useState(false);
    const openVideoModal = () => {
        setOpenVideo(true);
    };
    return (
        <>
        <div className="video__area" style={{backgroundImage: `url(${videoBg.src})`}}>
            <div className="container">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="video__area-icon wow fadeInDown" data-wow-delay="0.8s">
                            <div className="video video-pulse">
                                <span onClick={openVideoModal}><i className="fas fa-play"></i></span>
                            </div>						
                        </div>
                    </div>
                </div>
            </div>
        </div>    
        <ModalVideo className='video-modal' channel="youtube" autoplay isOpen={openVideo} videoId="SZEflIVnhH8" onClose={() => setOpenVideo(false)} />        
        </>
    );
};

export default Video;