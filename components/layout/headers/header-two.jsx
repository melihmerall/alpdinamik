"use client"
import Link from "next/link";
import logo from "../../../public/assets/img/logo-2.png";
import logo1 from "../../../public/assets/img/logo-1.png";
import MainMenu from './header-menu';
import { useEffect, useState } from 'react';
import MobileMenuOne from './menu_sidebar/menu-one';
import SideBar from './offcanvas';

const HeaderTwo = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [menuSidebar, setMenuSidebar] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
                    setIsSticky(scrollY > 30);
                    ticking = false;
                });
                ticking = true;
            }
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Scroll yapınca header-one stiline geçiş yap
    const headerClass = isSticky ? 'header__area' : `header__four`;
    const logoToShow = isSticky ? logo1 : logo;
    
    const headerStyle = isSticky ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        background: 'var(--primary-color-1)',
        borderBottom: '1px solid #E5B142',
        zIndex: 999,
        transition: 'all 0.3s ease'
    } : {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        background: 'transparent',
        zIndex: 999,
        transition: 'all 0.3s ease'
    };

    return (
        <>
            <div className={headerClass} style={headerStyle}>
                <div className="custom_container">
                    <div className="header__area-menubar">
                        <div className="header__area-menubar-left one">
                            <div className="header__area-menubar-left-logo">
                                <Link href='/'><img className='one' src={logoToShow.src} alt='logo'/></Link>
                            </div>
                        </div>
                        <div className="header__area-menubar-center">
                            <div className="header__area-menubar-center-menu">
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
