import { useEffect } from 'react';

export default function Layout({ children, currentPageName }) {
    useEffect(() => {
        // Set meta tags for social media previews
        const metaTags = [
            { property: 'og:title', content: 'Score Sync - Psychometric Score Converter' },
            { property: 'og:description', content: 'Instantly convert between Z-scores, T-scores, percentile ranks, standard scores, and scaled scores.' },
            { property: 'og:image', content: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6939d2373c3b5efcd612d121/8ec56e38e_ChatGPTImageDec11202501_44_18PM.png' },
            { property: 'og:type', content: 'website' },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: 'Score Sync - Psychometric Score Converter' },
            { name: 'twitter:description', content: 'Instantly convert between Z-scores, T-scores, percentile ranks, standard scores, and scaled scores.' },
            { name: 'twitter:image', content: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6939d2373c3b5efcd612d121/8ec56e38e_ChatGPTImageDec11202501_44_18PM.png' },
        ];

        // Update or create meta tags
        metaTags.forEach(({ property, name, content }) => {
            const attribute = property ? 'property' : 'name';
            const value = property || name;
            let meta = document.querySelector(`meta[${attribute}="${value}"]`);
            
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute(attribute, value);
                document.head.appendChild(meta);
            }
            
            meta.setAttribute('content', content);
        });
    }, []);

    return <>{children}</>;
}