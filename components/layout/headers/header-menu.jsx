import Link from "next/link";
import React from 'react';

const MainMenu = () => {
    return (
        <>
            <ul>
                <li><Link href='/'>Anasayfa</Link>
                   
                </li>  
                <li className='menu-item-has-children'><Link href='/about-us'>Kurumsal</Link>
                    <ul className='sub-menu'>
                        <li><Link href='/about-us'>Hakkımızda</Link></li>
                        <li><Link href='/history'>Misyon & Vizyon</Link></li>                       
                    </ul>
                </li>
                <li className='menu-item-has-children'><Link href='/portfolio/3-columns'>TEMSİLCİLİKLER</Link>
                    <ul className='sub-menu'>
                        <li className='menu-item-has-children'><Link href='/portfolio/2-columns'>MECMOT</Link>
                            <ul className='sub-menu'>
                                <li><Link href='/portfolio/2-columns'>Ürünler</Link></li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li><Link href='portfolio/healthcare-facility'>Sektörler</Link></li>

                <li className='menu-item-has-children'><Link href='/blog'>Blog</Link>
                    <ul className='sub-menu'>
                        <li><Link href='/blog'>Blog Grid</Link></li>
                        <li><Link href='/blog-standard'>Blog Standard</Link></li>
                        <li><Link href='/blog/key-steps-to-ensure-a-smooth-building-process'>Blog Details</Link></li>
                    </ul>
                </li>
                <li><Link href='/contact-us'>İLETİŞİM</Link></li>      
            </ul>  
        </>
    );
};

export default MainMenu;