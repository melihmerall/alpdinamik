"use client"
import Link from "next/link";
import React, { useState, useEffect } from 'react';

const Social = () => {
    const [socialLinks, setSocialLinks] = useState({
        facebookUrl: '',
        twitterUrl: '',
        instagramUrl: '',
        linkedinUrl: '',
        youtubeUrl: '',
        behanceUrl: '',
    });

    useEffect(() => {
        // Fetch social media links from site settings
        fetch('/api/site-settings')
            .then(res => res.json())
            .then(data => {
                setSocialLinks({
                    facebookUrl: data.facebookUrl || '',
                    twitterUrl: data.twitterUrl || '',
                    instagramUrl: data.instagramUrl || '',
                    linkedinUrl: data.linkedinUrl || '',
                    youtubeUrl: data.youtubeUrl || '',
                    behanceUrl: data.behanceUrl || '',
                });
            })
            .catch(err => console.error('Error fetching social links:', err));
    }, []);

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