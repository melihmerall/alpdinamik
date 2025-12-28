"use client"
import Link from "next/link";
import React, { useState } from 'react';
import { useAppContext } from '@/lib/app-context';

const ResponsiveMenu = () => {
    const { menu: representatives, loading } = useAppContext();
    const [activeMenu, setActiveMenu] = useState(null);
    const [activeMenus, setActiveMenus] = useState(null);
    const [activeCategoryMenus, setActiveCategoryMenus] = useState({});

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

    // Get category URL - only category page, no fallback to product
    const getCategoryUrl = (category, repSlug) => {
        // Only use category page URL if slug exists
        if (category.slug) {
            return `/temsilcilikler/${repSlug}/kategoriler/${category.slug}`;
        }
        
        // No fallback - return null if no category slug
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

                {!loading && representatives && representatives.length > 0 && (
                    <li className='menu-item-has-children'>
                        <Link href='/temsilcilikler'>TEMSİLCİLİKLER</Link>
                        <ul className='sub-menu' style={activeSubMenu("temsilcilikler")}>
                            {representatives.map((rep) => {
                                const hasCategories = rep.categories && rep.categories.length > 0;
                                
                                return (
                                    <li key={rep.id} className='menu-item-has-children'>
                                        <Link href={`/temsilcilikler/${rep.slug}`}>{rep.name}</Link>
                                        <ul className='sub-menu' style={activeSubMenus(`rep-${rep.id}`)}>
                                            <li className={hasCategories ? 'menu-item-has-children' : ''}>
                                                <Link href={`/temsilcilikler/${rep.slug}`}>Ürünler</Link>
                                                {hasCategories && (
                                                    <>
                                                        <ul className='sub-menu' style={activeCategorySubMenu(rep.id, 'urunler')}>
                                                            {rep.categories.map((category) => {
                                                                const categoryUrl = getCategoryUrl(category, rep.slug);
                                                                return (
                                                                    <li key={category.id}>
                                                                        {categoryUrl ? (
                                                                            <Link href={categoryUrl}>
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
                                                    </>
                                                )}
                                            </li>
                                            <li>
                                                <Link href={`/temsilcilikler/${rep.slug}/uygulamalar`}>Uygulamalar</Link>
                                            </li>
                                            <li>
                                                <Link href={`/temsilcilikler/${rep.slug}/dokumanlar`}>Dökümanlar</Link>
                                            </li>
                                        </ul>
                                        <a className={`mean-expand ${activeIcons(`rep-${rep.id}`)}`} onClick={() => actives(`rep-${rep.id}`)}></a>
                                    </li>
                                );
                            })}
                        </ul>
                        <a className={`mean-expand ${activeIcon("temsilcilikler")}`} onClick={() => active("temsilcilikler")}></a>
                    </li>
                )}

                <li><Link href='/sektorler'>Sektörler</Link></li>

                <li><Link href='/blog'>Haberler</Link></li>

                <li><Link href='/iletisim'>İletişim</Link></li>
            </ul>  
        </>
    );
};

export default ResponsiveMenu;
