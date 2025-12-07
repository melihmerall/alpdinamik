"use client"
import Link from "next/link";
import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

const MainMenu = () => {
    const locale = useLocale();
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
                <li><Link href={`/${locale}`}>Anasayfa</Link></li>
                
                <li className='menu-item-has-children'>
                    <Link href={`/${locale}/about-us`}>Kurumsal</Link>
                    <ul className='sub-menu'>
                        <li><Link href={`/${locale}/about-us`}>Hakkımızda</Link></li>
                        <li><Link href={`/${locale}/history`}>Misyon & Vizyon</Link></li>
                    </ul>
                </li>

                {representatives.length > 0 && (
                    <li className='menu-item-has-children'>
                        <Link href={`/${locale}/temsilcilikler`}>TEMSİLCİLİKLER</Link>
                        <ul className='sub-menu'>
                            {representatives.map((rep) => (
                                <li key={rep.id} className={rep.products.length > 0 ? 'menu-item-has-children' : ''}>
                                    <Link href={`/${locale}/temsilcilikler/${rep.slug}`}>{rep.name.toUpperCase()}</Link>
                                    {rep.products.length > 0 && (
                                        <ul className='sub-menu'>
                                            <li className='menu-item-has-children'>
                                                <Link href={`/${locale}/temsilcilikler/${rep.slug}/urunler`}>Ürünler</Link>
                                                <ul className='sub-menu'>
                                                    {rep.products.map((product) => (
                                                        <li key={product.id}>
                                                            <Link href={`/${locale}/temsilcilikler/${rep.slug}/urunler/${product.slug}`}>
                                                                {product.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </li>
                )}

                <li><Link href={`/${locale}/sektorler`}>Sektörler</Link></li>

                <li className='menu-item-has-children'>
                    <Link href={`/${locale}/blog`}>Blog</Link>
                    <ul className='sub-menu'>
                        <li><Link href={`/${locale}/blog`}>Blog Grid</Link></li>
                        <li><Link href={`/${locale}/blog-standard`}>Blog Standard</Link></li>
                    </ul>
                </li>

                <li><Link href={`/${locale}/contact-us`}>İLETİŞİM</Link></li>
            </ul>
        </>
    );
};

export default MainMenu;
