"use client"
import Link from "next/link";
import React from 'react';
import { useAppContext } from "@/lib/app-context";

const Social = () => {
    const { siteSettings } = useAppContext();
    
    const socialLinks = {
        facebookUrl: siteSettings?.facebookUrl || '',
        twitterUrl: siteSettings?.twitterUrl || '',
        instagramUrl: siteSettings?.instagramUrl || '',
        linkedinUrl: siteSettings?.linkedinUrl || '',
        youtubeUrl: siteSettings?.youtubeUrl || '',
        behanceUrl: siteSettings?.behanceUrl || '',
    };

    return (
        <>
            <ul>
                {socialLinks.facebookUrl && (
                    <li><Link href={socialLinks.facebookUrl} target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></Link></li>
                )}
                {socialLinks.twitterUrl && (
                    <li><Link href={socialLinks.twitterUrl} target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-x-twitter"></i></Link></li>
                )}
                {socialLinks.instagramUrl && (
                    <li><Link href={socialLinks.instagramUrl} target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></Link></li>
                )}
                {socialLinks.linkedinUrl && (
                    <li><Link href={socialLinks.linkedinUrl} target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></Link></li>
                )}
                {socialLinks.youtubeUrl && (
                    <li><Link href={socialLinks.youtubeUrl} target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></Link></li>
                )}
                {socialLinks.behanceUrl && (
                    <li><Link href={socialLinks.behanceUrl} target="_blank" rel="noopener noreferrer"><i className="fab fa-behance"></i></Link></li>
                )}
            </ul>            
        </>
    );
};

export default Social;