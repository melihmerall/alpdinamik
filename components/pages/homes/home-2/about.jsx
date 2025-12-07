"use client"
import { useState, useEffect } from 'react'
import Link from "next/link"
import Count from "../../common/count"
import image from "../../../../public/assets/img/page/who-we-are.jpg"

const AboutTwo = () => {
    const [aboutData, setAboutData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchAboutData() {
            try {
                const response = await fetch('/api/company-pages/home-about')
                if (response.ok) {
                    const data = await response.json()
                    setAboutData(data)
                }
            } catch (error) {
                console.error('Error fetching about data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchAboutData()
    }, [])

    // Fallback data if database is empty
    const fallbackData = {
        subtitle: 'Hakkımızda',
        title: 'Lineer Hareket Sistemlerinde Güvenilir Çözüm Ortağınız',
        body: 'Alp Dinamik, lineer hareket sistemleri konusunda projeci ve mühendislik odaklı bir firmadır. Temsil ettiğimiz Mecmot markasının ürünlerini sadece satış olarak değil; uygulama analizi, ürün seçimi ve boyutlandırma, CAD desteği, devreye alma ve satış sonrası hizmetlerle birlikte sunar.',
        imageUrl: image.src,
        stat1Number: 25,
        stat1Label: 'Yıl Sektör Tecrübesi',
        stat2Number: 500,
        stat2Label: 'Endüstriyel Proje',
        stat3Number: 10,
        stat3Label: 'Farklı Uygulama Alanı',
        ctaLabel: 'Tüm Hizmetler',
        ctaUrl: '/services'
    }

    const displayData = aboutData || fallbackData

    if (loading) {
        return null
    }

    return (
        <div className="about__two section-padding pt-0">
            <div className="container">
                <div className="row">
                    <div className="col-xl-5 col-lg-6 lg-mb-25">
                        <div className="about__two-left section-padding pb-0">
                            {displayData.subtitle && (
                                <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">
                                    {displayData.subtitle}
                                </span>
                            )}
                            <h2 className="wow fadeInRight" data-wow-delay=".6s">
                                {displayData.title}
                            </h2>
                            <p className="wow fadeInUp" data-wow-delay=".4s">
                                {displayData.body}
                            </p>
                            {displayData.ctaLabel && displayData.ctaUrl && (
                                <div className="wow fadeInDown" data-wow-delay=".6s">
                                    <Link className="build_button mt-35" href={displayData.ctaUrl}>
                                        {displayData.ctaLabel}
                                        <i className="flaticon-right-up"></i>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-xl-7 col-lg-6">
                        <div className="about__two-right">
                            <img 
                                className="wow img_top_animation" 
                                src={displayData.imageUrl || image.src} 
                                alt={displayData.title || 'About'} 
                            />
                            {(displayData.stat1Number || displayData.stat2Number || displayData.stat3Number) && (
                                <div className="counter__one-area mt-35">
                                    {displayData.stat1Number && displayData.stat1Label && (
                                        <div className="about__two-right-counter">
                                            <h2><Count number={displayData.stat1Number}/>+</h2>
                                            <p>{displayData.stat1Label}</p>
                                        </div>
                                    )}
                                    {displayData.stat2Number && displayData.stat2Label && (
                                        <div className="about__two-right-counter">
                                            <h2><Count number={displayData.stat2Number}/>+</h2>
                                            <p>{displayData.stat2Label}</p>
                                        </div>
                                    )}
                                    {displayData.stat3Number && displayData.stat3Label && (
                                        <div className="about__two-right-counter">
                                            <h2><Count number={displayData.stat3Number}/>+</h2>
                                            <p>{displayData.stat3Label}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutTwo
