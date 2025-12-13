"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Social from '../../data/social';
import logo2 from "../../../public/assets/img/logo-2.png";

const SideBar = ({ isOpen, setIsOpen }) => {
    const [siteSettings, setSiteSettings] = useState(null);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/site-settings`);
                if (response.ok) {
                    const data = await response.json();
                    setSiteSettings(data);
                }
            } catch (error) {
                console.error('Error fetching site settings:', error);
            }
        }
        fetchSettings();
    }, []);

    const phone = siteSettings?.phone || '+90 262 643 41 26';
    const email = siteSettings?.email || 'alpdinamik@alpdinamik.com.tr';
    const address = siteSettings?.address || 'Mevlana Mh. Soma Maden Şehitleri Blv. No:4/1 İç Kapı No:9 Gebze / Kocaeli';

    return (
        <>
            <div className={`header__area-menubar-right-sidebar-popup ${isOpen ? 'active' : ''}`}>
                <div className="sidebar-close-btn" onClick={() => setIsOpen(false)}><i className="fal fa-times"></i></div>
                <div className="header__area-menubar-right-sidebar-popup-logo">
                <Link href='/'>
                    <img src={logo2.src} alt="logo" />
                </Link>
                </div>
                <p>Lineer hareket sistemlerinde doğru ürün ve mühendislik çözümleri sunuyoruz. Mecmot markasının Türkiye temsilciliği ile projelerinize değer katıyoruz.</p>
                <div className="header__area-menubar-right-sidebar-popup-contact">
                    <h4 className="mb-30">İletişim Bilgileri</h4>
                    {phone && (
                        <div className="header__area-menubar-right-sidebar-popup-contact-item">
                            <div className="header__area-menubar-right-sidebar-popup-contact-item-icon">
                                <i className="flaticon-phone"></i>
                            </div>
                            <div className="header__area-menubar-right-sidebar-popup-contact-item-content">
                                <span>Telefon:</span>
                                <h6><Link href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</Link></h6>
                            </div>
                        </div>
                    )}
                    {email && (
                        <div className="header__area-menubar-right-sidebar-popup-contact-item">
                            <div className="header__area-menubar-right-sidebar-popup-contact-item-icon">
                                <i className="flaticon-email-3"></i>
                            </div>
                            <div className="header__area-menubar-right-sidebar-popup-contact-item-content">
                                <span>E-posta Adresi:</span>
                                <h6><Link href={`mailto:${email}`}>{email}</Link></h6>
                            </div>
                        </div>
                    )}
                    {address && (
                        <div className="header__area-menubar-right-sidebar-popup-contact-item">
                            <div className="header__area-menubar-right-sidebar-popup-contact-item-icon">
                                <i className="flaticon-location-1"></i>
                            </div>
                            <div className="header__area-menubar-right-sidebar-popup-contact-item-content">
                                <span>Konum:</span>
                                <h6>
                                    <Link 
                                        href={siteSettings?.mapEmbedUrl && !siteSettings.mapEmbedUrl.includes('maps/embed')
                                            ? siteSettings.mapEmbedUrl
                                            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
                                        } 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        {address}
                                    </Link>
                                </h6>
                            </div>
                        </div>
                    )}
                </div>
                <div className="header__area-menubar-right-sidebar-popup-social">
                    <Social />							
                </div>
            </div>
            <div className={`sidebar-overlay ${isOpen ? 'show' : ''}`}></div>
        </>
    );
};

export default SideBar;