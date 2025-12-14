export function JsonLd() {
    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'README Generator',
        description: 'Generate professional README.md files for your GitHub repositories using AI. Analyze your codebase and create comprehensive documentation in seconds.',
        url: 'https://readme.leolaborie.com',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        author: {
            '@type': 'Person',
            name: 'Leo Laborie',
            url: 'https://leolaborie.com',
        },
    };

    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Leo Laborie',
        url: 'https://leolaborie.com',
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
        </>
    );
}
