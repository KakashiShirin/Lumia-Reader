import fetch from 'node-fetch';

const proxyUrl = 'http://localhost:3005/proxy';
const targetUrl = 'https://ranobes.net/novels/1207003-the-hundred-reigns.html';

async function verify() {
    try {
        console.log('Testing proxy...');
        const res = await fetch(`${proxyUrl}?url=${encodeURIComponent(targetUrl)}`);
        if (!res.ok) {
            throw new Error(`Proxy returned ${res.status}`);
        }

        const data = await res.json();
        const html = data.contents;

        if (html.includes('<title>Lumia Reader</title>')) {
            console.error('FAIL: Proxy returned App HTML!');
            process.exit(1);
        }

        if (html.includes('The Hundred Reigns')) {
            console.log('SUCCESS: Proxy returned Novel content!');
        } else {
            console.warn('WARNING: Content did not contain expected title, but was not App HTML.');
            console.log('Snippet:', html.substring(0, 200));
        }

    } catch (e) {
        console.error('Error:', e.message);
        process.exit(1);
    }
}

verify();
