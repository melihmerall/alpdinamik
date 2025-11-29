import Link from "next/link";
import logo from "../../../public/assets/img/logo-2.png";
import MainMenu from './header-menu';
import Search from './search';
import { useState } from 'react';
import MobileMenuOne from './menu_sidebar/menu-one';
import SideBar from './offcanvas';

const HeaderTwo = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [menuSidebar, setMenuSidebar] = useState(false);
    const [search, setSearch] = useState(false);
    return (
        <>
            <div className="header__area two">
                <div className="custom_container">
                    <div className="header__area-menubar">
                        <div className="header__area-menubar-left one">
                            <div className="header__area-menubar-left-logo">
                                <Link href='/'><img className='one' src={logo.src} alt='logo'/></Link>
                            </div>
                        </div>
                        <div className="header__area-menubar-center">
                            <div className="header__area-menubar-center-menu">
                                <MainMenu />
                            </div>
                        </div>
                        <div className="header__area-menubar-right">
                            <div className="header__area-menubar-right-search">
                                <div className="search">	
                                    <span className="header__area-menubar-right-search-icon open" onClick={() => setSearch(true)}><i className="fal fa-search"></i></span>
                                </div>
                                <Search isOpen={search} setIsOpen={setSearch} />
                            </div>
                            <div className="header__area-menubar-right-btn one">
                                <Link className="build_button" href="/request-quote">Get Started<i className="flaticon-right-up"></i></Link>
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