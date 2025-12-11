"use client"
import Link from "next/link";
import { useEffect, useState } from 'react';

const MainMenu = () => {
    const [representatives, setRepresentatives] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadMenu() {
            try {
                const response = await fetch('/api/menu');
                if (response.ok) {
                    const reps = await response.json();
                    setRepresentatives(reps);
                }
            } catch (error) {
                console.error('Error loading menu:', error);
            } finally {
                setLoading(false);
            }
        }
        loadMenu();
    }, []);

    return (
        <>
            <ul>
                <li><Link href='/'>Anasayfa</Link></li>
                
                <li className='menu-item-has-children'>
                    <Link href='/about-us'>Kurumsal</Link>
                    <ul className='sub-menu'>
                        <li><Link href='/about-us'>Hakkımızda</Link></li>
                        <li><Link href='/history'>Misyon & Vizyon</Link></li>
                    </ul>
                </li>

                {representatives.length > 0 && (
                    <li className='menu-item-has-children'>
                        <Link href='/temsilcilikler'>TEMSİLCİLİKLER</Link>
                        <ul className='sub-menu'>
                            {representatives.map((rep) => {
                                const hasCategories = rep.categories && rep.categories.length > 0;
                                const hasSubmenu = hasCategories;
                                
                                return (
                                    <li key={rep.id} className={hasSubmenu ? 'menu-item-has-children' : ''}>
                                        <Link href={`/temsilcilikler/${rep.slug}`}>{rep.name.toUpperCase()}</Link>
                                        {hasSubmenu && (
                                            <ul className='sub-menu'>
                                                <li className='menu-item-has-children'>
                                                    <Link href={`/temsilcilikler/${rep.slug}/urunler`}>Ürünler</Link>
                                                    <ul className='sub-menu'>
                                                        {rep.categories.map((category) => (
                                                            <li key={category.id}>
                                                                <Link href={`/temsilcilikler/${rep.slug}/kategoriler/${category.slug}`}>
                                                                    {category.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            </ul>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </li>
                )}

                <li><Link href='/sektorler'>Sektörler</Link></li>

                <li className='menu-item-has-children'>
                    <Link href='/blog'>Blog</Link>
                    <ul className='sub-menu'>
                        <li><Link href='/blog'>Blog Grid</Link></li>
                        <li><Link href='/blog-standard'>Blog Standard</Link></li>
                    </ul>
                </li>

                <li><Link href='/contact-us'>İLETİŞİM</Link></li>
            </ul>
        </>
    );
};

export default MainMenu;