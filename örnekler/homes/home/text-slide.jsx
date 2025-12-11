import React from 'react';
import Link from "next/link";
import portfolioData from '@/components/data/portfolio-data';
import icon1 from '../../../../public/assets/img/icon/star.svg';
import icon2 from '../../../../public/assets/img/icon/star-dark.svg';

const TextSlide = () => {
    return (
        <>
        <div className="scroll__slider section-padding pt-0">
            <div className="text-slide">
                <div className="sliders text_scroll">
                    <ul>
                        {portfolioData?.map((data, id) => (
                            <li key={id}><img className="dark-n" src={icon1.src} alt="icon"/><img className="light-n" src={icon2.src} alt="icon"/><Link href={`/portfolio/${data.id}`}>{data.title.split(' ').slice(0, 1).join(' ')}</Link></li>
                        ))}
                    </ul>
                </div>
                <div className="sliders text_scroll">
                    <ul>
                        {portfolioData?.map((data, id) => (
                            <li key={id}><img className="dark-n" src={icon1.src} alt="icon"/><img className="light-n" src={icon2.src} alt="icon"/><Link href={`/portfolio/${data.id}`}>{data.title.split(' ').slice(0, 1).join(' ')}</Link></li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>            
        </>
    );
};

export default TextSlide;