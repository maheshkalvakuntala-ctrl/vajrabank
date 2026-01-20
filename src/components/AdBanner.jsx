import React, { useState, useEffect } from 'react';
import { useAds } from '../context/AdContext';
import { ArrowRight, Megaphone } from 'react-bootstrap-icons';

export default function AdBanner() {
    const { ads, loading } = useAds(); // Get ads from global context
    const [currentIndex, setCurrentIndex] = useState(0);

    // Rotate ads every 5 seconds if multiple
    useEffect(() => {
        if (ads.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % ads.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [ads]);

    const handleAdClick = async (ad) => {
        // Backend returns 'redirectUrl' instead of 'url'
        window.open(ad.redirectUrl || ad.url, '_blank');
    };

    if (ads.length === 0) return null;

    const currentAd = ads[currentIndex];

    // Simple Banner Style
    return (
        <div style={{
            background: 'linear-gradient(90deg, #1e293b 0%, #0f172a 100%)',
            borderBottom: '1px solid #334155',
            padding: '12px 24px',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Glow effect */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, width: '4px', height: '100%',
                background: '#3b82f6',
                boxShadow: '0 0 12px #3b82f6'
            }}></div>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                maxWidth: '1200px',
                width: '100%',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: '#3b82f622', padding: '6px', borderRadius: '50%', color: '#3b82f6' }}>
                        <Megaphone size={16} />
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '0.5px' }}>
                        SPONSORED
                    </span>
                    <span style={{ width: '1px', height: '16px', background: '#475569' }}></span>
                    <span style={{ color: '#e2e8f0' }}>
                        {currentAd.title}
                    </span>
                </div>

                <button
                    onClick={() => handleAdClick(currentAd)}
                    style={{
                        background: 'transparent',
                        border: '1px solid #3b82f6',
                        color: '#3b82f6',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                        e.target.style.background = '#3b82f6';
                        e.target.style.color = 'white';
                    }}
                    onMouseLeave={e => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#3b82f6';
                    }}
                >
                    Learn More <ArrowRight size={12} />
                </button>
            </div>
        </div>
    );
}
