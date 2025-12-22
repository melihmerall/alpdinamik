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
                <li className='menu-item-has-children'><Link href='/hakkimizda'>Kurumsal</Link>
                    <ul className='sub-menu'>
                        <li><Link href='/hakkimizda'>Hakkımızda</Link></li>
                        <li><Link href='/misyon-vizyon'>Misyon & Vizyon</Link></li>
                    </ul>
                </li>
                <li><Link href='/sektorler'>Sektörler</Link></li>
                <li><Link href='/blog'>Blog</Link></li>
                <li><Link href='/iletisim'>İletişim</Link></li>
            </ul>
        );
    }

    return (
        <>
            <ul>
                <li><Link href='/'>Anasayfa</Link></li>
                
                <li className='menu-item-has-children'>
                    <Link href='/hakkimizda'>Kurumsal</Link>
                    <ul className='sub-menu'>
                        <li><Link href='/hakkimizda'>Hakkımızda</Link></li>
                        <li><Link href='/misyon-vizyon'>Misyon & Vizyon</Link></li>
                    </ul>
                </li>

                {representatives.length > 0 && (
                    <li className='menu-item-has-children'>
                        <Link href='/temsilcilikler'>TEMSİLCİLİKLER</Link>
                        <ul className='sub-menu'>
                            {representatives.map((rep) => {
                                const hasCategories = rep.categories && rep.categories.length > 0;
                                
                                // Get category URL - only category page, no fallback to product
                                const getCategoryUrl = (category) => {
                                    // Only use category page URL if slug exists
                                    if (category.slug) {
                                        return `/temsilcilikler/${rep.slug}/kategoriler/${category.slug}`;
                                    }
                                    
                                    // No fallback - return null if no category slug
                                    return null;
                                };
                                
                                return (
                                    <li key={rep.id} className={hasCategories ? 'menu-item-has-children' : ''}>
                                        <Link href={`/temsilcilikler/${rep.slug}`}>{rep.name.toUpperCase()}</Link>
                                        {hasCategories && (
                                            <ul className='sub-menu'>
                                                <li className='menu-item-has-children'>
                                                    <Link href='#'>Ürünler</Link>
                                                    <ul className='sub-menu'>
                                                        {rep.categories.map((category) => {
                                                            const categoryUrl = getCategoryUrl(category);
                                                            return (
                                                                <li key={category.id}>
                                                                    {categoryUrl ? (
                                                                        <Link href={categoryUrl}>
                                                                            {category.name}
                                                                        </Link>
                                                                    ) : (
                                                                        <span style={{ cursor: 'default', color: 'var(--text-heading-color)' }}>
                                                                            {category.name}
                                                                        </span>
                                                                    )}
                                                                </li>
                                                            );
                                                        })}
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

                <li><Link href='/blog'>Blog</Link></li>

                <li><Link href='/iletisim'>İLETİŞİM</Link></li>
            </ul>
        </>
    );
};

export default MainMenuDynamic;

