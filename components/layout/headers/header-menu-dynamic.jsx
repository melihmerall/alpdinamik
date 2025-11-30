"use client"
import Link from "next/link";
import { useEffect, useState } from 'react';
import { getActiveRepresentatives } from '@/lib/content';

const MainMenuDynamic = () => {
    const [representatives, setRepresentatives] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadMenu() {
            try {
                const reps = await getActiveRepresentatives();
                setRepresentatives(reps);
            } catch (error) {
                console.error('Error loading menu:', error);
            } finally {
                setLoading(false);
            }
        }
        loadMenu();
    }, []);

    if (loading) {
        return (
            <ul>
                <li><Link href='/'>Anasayfa</Link></li>
                <li className='menu-item-has-children'><Link href='/about-us'>Kurumsal</Link>
                    <ul className='sub-menu'>
                        <li><Link href='/about-us'>Hakkımızda</Link></li>
                        <li><Link href='/history'>Misyon & Vizyon</Link></li>
                    </ul>
                </li>
                <li><Link href='/portfolio/3-columns'>Sektörler</Link></li>
                <li><Link href='/blog'>Blog</Link></li>
                <li><Link href='/contact-us'>İletişim</Link></li>
            </ul>
        );
    }

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
                            {representatives.map((rep) => (
                                <li key={rep.id} className={rep.products.length > 0 ? 'menu-item-has-children' : ''}>
                                    <Link href={`/temsilcilikler/${rep.slug}`}>{rep.name.toUpperCase()}</Link>
                                    {rep.products.length > 0 && (
                                        <ul className='sub-menu'>
                                            <li className='menu-item-has-children'>
                                                <Link href={`/temsilcilikler/${rep.slug}/urunler`}>Ürünler</Link>
                                                <ul className='sub-menu'>
                                                    {rep.products.map((product) => (
                                                        <li key={product.id}>
                                                            <Link href={`/temsilcilikler/${rep.slug}/urunler/${product.slug}`}>
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

export default MainMenuDynamic;

