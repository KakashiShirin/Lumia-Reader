import fetch from 'node-fetch';

const tocUrl = 'https://ranobes.net/chapters/1207003/';

async function inspectToc() {
    try {
        console.log(`Fetching ${tocUrl}...`);
        const res = await fetch(tocUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const html = await res.text();

        console.log('Title:', html.match(/<title>(.*?)<\/title>/)?.[1]);

        const hasData = html.includes('window.__DATA__');
        console.log('Has window.__DATA__:', hasData);

        console.log('Has .chapters-scroll-list:', html.includes('chapters-scroll-list'));

        // Look for chapter links
        const linkRegex = /<a[^>]*href="([^"]*)"[^>]*title="([^"]*Chapter[^"]*)"/g;
        let match;
        let count = 0;
        console.log('--- Sample Chapter Links ---');
        // Try a simpler regex for links
        const simpleLinkRegex = /<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/g;

        while ((match = simpleLinkRegex.exec(html)) !== null && count < 10) {
            if (match[1].includes('chapter') || match[2].includes('Chapter')) {
                console.log(`Link: ${match[1]}, Text: ${match[2].replace(/<[^>]*>/g, '').trim()}`);
                count++;
            }
        }

    } catch (e) {
        console.error(e);
    }
}

inspectToc();
