"use client"
import Link from 'next/link';
import { useAppContext } from '@/lib/app-context';

const BreadCrumb = ({title, innerTitle, backgroundImage}) => {
    const { siteSettings } = useAppContext();
    const defaultBreadcrumb = siteSettings?.defaultBreadcrumbImageUrl || null;

    // Priority: provided backgroundImage > default from settings > gradient fallback
    const bgImage = backgroundImage || defaultBreadcrumb || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    
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