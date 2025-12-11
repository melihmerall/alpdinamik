"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import breadCrumbBg from "../../../public/assets/img/page/breadcrumb.jpg";

const BreadCrumb = ({title, innerTitle, backgroundImage}) => {
    const [defaultBreadcrumb, setDefaultBreadcrumb] = useState(null);

    useEffect(() => {
        // Fetch default breadcrumb from site settings
        fetch('/api/site-settings')
            .then(res => res.json())
            .then(data => {
                if (data.defaultBreadcrumbImageUrl) {
                    setDefaultBreadcrumb(data.defaultBreadcrumbImageUrl);
                }
            })
            .catch(err => console.error('Error fetching default breadcrumb:', err));
    }, []);

    // Priority: provided backgroundImage > default from settings > fallback image
    const bgImage = backgroundImage || defaultBreadcrumb || breadCrumbBg.src;
    
    return (
        <div className="breadcrumb__area" style={{backgroundImage: `url(${bgImage})`}}>
            <div className="container">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="breadcrumb__area-content">
                            <h2>{title}</h2>
                            <ul>
                                <li><Link href="/">Anasayfa</Link><i className="fa-regular fa-angle-right"></i></li>
                                <li>{innerTitle}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BreadCrumb;