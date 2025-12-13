"use client"
import Link from "next/link";
import React, { useState, useEffect } from 'react';

const ResponsiveMenu = () => {
    const [representatives, setRepresentatives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeMenu, setActiveMenu] = useState(null);
    const [activeMenus, setActiveMenus] = useState(null);
    const [activeCategoryMenus, setActiveCategoryMenus] = useState({});

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

    const active = (value) => setActiveMenu(value === activeMenu ? null : value);
    const activeIcon = (value) => (activeMenu == value ? "mean-clicked" : "");
    const activeSubMenu = (value) => value == activeMenu ? { display: "block" } : { display: "none" };

    const actives = (value) => setActiveMenus(value === activeMenus ? null : value);
    const activeIcons = (value) => (activeMenus == value ? "mean-clicked" : "");
    const activeSubMenus = (value) => value == activeMenus ? { display: "block" } : { display: "none" };

    const activeCategory = (repId, catId) => {
        const key = `${repId}-${catId}`;
        setActiveCategoryMenus(prev => ({
            ...prev,
            [key]: prev[key] ? null : catId
        }));
    };
    const activeCategoryIcon = (repId, catId) => {
        const key = `${repId}-${catId}`;
        return activeCategoryMenus[key] == catId ? "mean-clicked" : "";
    };
    const activeCategorySubMenu = (repId, catId) => {
        const key = `${repId}-${catId}`;
        return activeCategoryMenus[key] == catId ? { display: "block" } : { display: "none" };
    };

    // Get first product URL from category
    const getFirstProductFromCategory = (category, repSlug) => {
        if (category.series && category.series.length > 0) {
            const firstSeries = category.series[0];
            // Try variants first
            for (const variant of firstSeries.variants || []) {
                if (variant.products && variant.products.length > 0) {
                    return `/temsilcilikler/${repSlug}/urunler/${variant.products[0].slug}`;
                }
            }
            // Then try direct products
            if (firstSeries.products && firstSeries.products.length > 0) {
                return `/temsilcilikler/${repSlug}/urunler/${firstSeries.products[0].slug}`;
            }
        }
        return null;
    };

    return (
        <>    
            <ul>
                <li><Link href='/'>Anasayfa</Link></li>
                
                <li className='menu-item-has-children'>
                    <Link href='/hakkimizda'>Kurumsal</Link>
                    <ul className='sub-menu' style={activeSubMenu("kurumsal")}>
                        <li><Link href='/hakkimizda'>Hakkımızda</Link></li>
                        <li><Link href='/misyon-vizyon'>Misyon & Vizyon</Link></li>
                    </ul>
                    <a className={`mean-expand ${activeIcon("kurumsal")}`} onClick={() => active("kurumsal")}></a>
                </li>

                {!loading && representatives.length > 0 && (
                    <li className='menu-item-has-children'>
                        <Link href='/temsilcilikler'>TEMSİLCİLİKLER</Link>
                        <ul className='sub-menu' style={activeSubMenu("temsilcilikler")}>
                            {representatives.map((rep) => {
                                const hasCategories = rep.categories && rep.categories.length > 0;
                                
                                return (
                                    <li key={rep.id} className={hasCategories ? 'menu-item-has-children' : ''}>
                                        <Link href={`/temsilcilikler/${rep.slug}`}>{rep.name.toUpperCase()}</Link>
                                        {hasCategories && (
                                            <>
                                                <ul className='sub-menu' style={activeSubMenus(`rep-${rep.id}`)}>
                                                    <li className='menu-item-has-children'>
                                                        <Link href='#'>Ürünler</Link>
                                                        <ul className='sub-menu' style={activeCategorySubMenu(rep.id, 'urunler')}>
                                                            {rep.categories.map((category) => {
                                                                const firstProductUrl = getFirstProductFromCategory(category, rep.slug);
                                                                return (
                                                                    <li key={category.id}>
                                                                        {firstProductUrl ? (
                                                                            <Link href={firstProductUrl}>
                                                                                {category.name}
                                                                            </Link>
                                                                        ) : (
                                                                            <span style={{ cursor: 'default', color: 'var(--text-white)' }}>
                                                                                {category.name}
                                                                            </span>
                                                                        )}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                        <a className={`mean-expand ${activeCategoryIcon(rep.id, 'urunler')}`} onClick={() => activeCategory(rep.id, 'urunler')}></a>
                                                    </li>
                                                </ul>
                                                <a className={`mean-expand ${activeIcons(`rep-${rep.id}`)}`} onClick={() => actives(`rep-${rep.id}`)}></a>
                                            </>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                        <a className={`mean-expand ${activeIcon("temsilcilikler")}`} onClick={() => active("temsilcilikler")}></a>
                    </li>
                )}

                <li><Link href='/sektorler'>Sektörler</Link></li>

                <li><Link href='/blog'>Blog</Link></li>

                <li><Link href='/iletisim'>İLETİŞİM</Link></li>
            </ul>  
        </>
    );
};

export default ResponsiveMenu;