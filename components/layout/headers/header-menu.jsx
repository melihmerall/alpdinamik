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
                                
                                // Get first product URL from category
                                const getFirstProductFromCategory = (category) => {
                                    if (category.series && category.series.length > 0) {
                                        const firstSeries = category.series[0];
                                        // Try variants first
                                        for (const variant of firstSeries.variants || []) {
                                            if (variant.products && variant.products.length > 0) {
                                                return `/temsilcilikler/${rep.slug}/urunler/${variant.products[0].slug}`;
                                            }
                                        }
                                        // Then try direct products
                                        if (firstSeries.products && firstSeries.products.length > 0) {
                                            return `/temsilcilikler/${rep.slug}/urunler/${firstSeries.products[0].slug}`;
                                        }
                                    }
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
                                                            const firstProductUrl = getFirstProductFromCategory(category);
                                                            return (
                                                                <li key={category.id}>
                                                                    {firstProductUrl ? (
                                                                        <Link href={firstProductUrl}>
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

export default MainMenu;