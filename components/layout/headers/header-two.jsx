"use client"
import Link from "next/link";
import logo from "../../../public/assets/img/logo-2.png";
import logoKoyu from "../../../public/uploads/Logo_koyu.png";
import MainMenu from './header-menu';
import { useEffect, useState } from 'react';
import MobileMenuOne from './menu_sidebar/menu-one';
import SideBar from './offcanvas';

const HeaderTwo = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [menuSidebar, setMenuSidebar] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Try multiple ways to get scroll position
            const scrollY = window.scrollY 
                || window.pageYOffset 
                || document.documentElement.scrollTop 
                || document.body.scrollTop 
                || window.scrollTop
                || 0;
            
            const shouldBeSticky = scrollY > 30;
            setIsSticky(shouldBeSticky);
        };

        // Initial check
        handleScroll();
        
        // Add scroll listener - use both window and document
        window.addEventListener('scroll', handleScroll, { passive: true });
        document.addEventListener('scroll', handleScroll, { passive: true });
        document.documentElement.addEventListener('scroll', handleScroll, { passive: true });
        document.body.addEventListener('scroll', handleScroll, { passive: true });
        
        // Also try wheel event as fallback
        window.addEventListener('wheel', handleScroll, { passive: true });
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('scroll', handleScroll);
            document.documentElement.removeEventListener('scroll', handleScroll);
            document.body.removeEventListener('scroll', handleScroll);
            window.removeEventListener('wheel', handleScroll);
        };
    }, []);

    // Scroll yapınca header-one stiline geçiş yap
    const headerClass = isSticky ? 'header__area header__sticky-active' : 'header__two';
    const logoToShow = isSticky ? logoKoyu : logo;
    
    // Inline style ile tam kontrol
    const headerStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 999,
        transition: 'all 0.3s ease',
        ...(isSticky ? {
            background: 'rgba(255, 255, 255, 0.98)',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            padding: '20px 0',
            boxShadow: '0 2px 20px rgba(0, 0, 0, 0.08)'
        } : {
            background: 'transparent',
            backgroundColor: 'transparent',
            borderBottom: '1px solid rgba(255, 255, 255, 0.24)',
            padding: '20px 0'
        })
    };

    return (
        <>
            <div className={headerClass} style={headerStyle}>
                <div className="custom_container">
                    <div className="header__area-menubar">
                        <div className="header__area-menubar-left one">
                            <div className="header__area-menubar-left-logo">
                                <Link href='/'><img src={logoToShow.src} alt='logo'/></Link>
                            </div>
                        </div>
                        <div className="header__area-menubar-center">
                            <div className={`header__area-menubar-center-menu ${isSticky ? 'header__area-menu-style' : 'header__two-menu-style'}`}>
                                <MainMenu />
                            </div>
                        </div>
                        <div className="header__area-menubar-right">
                            <div className="header__area-menubar-right-btn one">
                                <Link 
                                    className="build_button" 
                                    href="/#iletisim"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const currentPath = window.location.pathname;
                                        
                                        if (currentPath === '/') {
                                            // Same page, just scroll
                                            const element = document.getElementById('iletisim');
                                            if (element) {
                                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                            }
                                        } else {
                                            // Different page, navigate first
                                            window.location.href = '/#iletisim';
                                        }
                                    }}
                                >
                                    Projenizi Paylaşın<i className="flaticon-right-up"></i>
                                </Link>
                            </div>
                            <div className="header__area-menubar-right-sidebar">
                                <div className="header__area-menubar-right-sidebar-icon" onClick={() => setSidebarOpen(true)}>
                                    <i className="flaticon-menu-6"></i>
                                </div>
                            </div>
                            <div className="header__area-menubar-right-responsive-menu menu__bar">
                                <i className="flaticon-menu-3" onClick={() => setMenuSidebar(true)}></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <SideBar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <MobileMenuOne isOpen={menuSidebar} setIsOpen={setMenuSidebar} />
        </>
    );
};

export default HeaderTwo;
