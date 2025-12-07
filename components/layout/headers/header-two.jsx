"use client"
import Link from "next/link";
import logo from "../../../public/assets/img/logo-2.png";
import MainMenu from './header-menu';
import Search from './search';
import { useState, useEffect } from 'react';
import MobileMenuOne from './menu_sidebar/menu-one';
import SideBar from './offcanvas';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLocale } from 'next-intl';

const HeaderTwo = () => {
    const locale = useLocale();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [menuSidebar, setMenuSidebar] = useState(false);
    const [search, setSearch] = useState(false);
    const [dark, setDark] = useState(false);

    useEffect(() => {
        // Check localStorage for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setDark(true);
            document.body.classList.add('dark-mode');
        } else {
            setDark(false);
            document.body.classList.remove('dark-mode');
        }
    }, []);

    const toggleTheme = () => {
        if (dark) {
            setDark(false);
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        } else {
            setDark(true);
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        }
    };
    return (
        <>
            <div className="header__area two">
                <div className="custom_container">
                    <div className="header__area-menubar">
                        <div className="header__area-menubar-left one">
                            <div className="header__area-menubar-left-logo">
                                <Link href={`/${locale}`}><img className='one' src={logo.src} alt='logo'/></Link>
                            </div>
                        </div>
                        <div className="header__area-menubar-center">
                            <div className="header__area-menubar-center-menu">
                                <MainMenu />
                            </div>
                        </div>
                        <div className="header__area-menubar-right">
                            <div style={{marginRight: '15px'}}>
                                <LanguageSwitcher />
                            </div>
                            <div className="header__area-menubar-right-theme" onClick={toggleTheme} style={{cursor: 'pointer', marginRight: '15px', fontSize: '20px', color: dark ? '#fff' : '#000', transition: 'all 0.3s'}}>
                                {dark ? (
                                    <i className="fas fa-sun" title="Light Mode"></i>
                                ) : (
                                    <i className="fas fa-moon" title="Dark Mode"></i>
                                )}
                            </div>
                            <div className="header__area-menubar-right-search">
                                <div className="search">	
                                    <span className="header__area-menubar-right-search-icon open" onClick={() => setSearch(true)}><i className="fal fa-search"></i></span>
                                </div>
                                <Search isOpen={search} setIsOpen={setSearch} />
                            </div>
                            <div className="header__area-menubar-right-btn one">
                                <Link className="build_button" href={`/${locale}/request-quote`}>Projenizi Paylaşın<i className="flaticon-right-up"></i></Link>
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