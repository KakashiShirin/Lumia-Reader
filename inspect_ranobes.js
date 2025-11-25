import fetch from 'node-fetch';

const url = 'https://ranobes.net/novels/1207003-the-hundred-reigns.html';

async function inspect() {
  try {
    console.log(`Fetching ${url}...`);
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const html = await res.text();
    
    console.log('Title:', html.match(/<title>(.*?)<\/title>/)?.[1]);
    
    // Check for window.__DATA__
    const hasData = html.includes('window.__DATA__');
    console.log('Has window.__DATA__:', hasData);
    
    // Check for chapter list classes
    console.log('Has .chapters-scroll-list:', html.includes('chapters-scroll-list'));
    
    // Extract some chapter links to see structure
    const linkRegex = /<a[^>]*href="([^"]*chapters[^"]*)"[^>]*>(.*?)<\/a>/g;
    let match;
    let count = 0;
    console.log('--- Sample Chapter Links ---');
    while ((match = linkRegex.exec(html)) !== null && count < 5) {
      console.log(match[0]);
      count++;
    }

    // Check for cover image
    console.log('--- Cover Image Candidates ---');
    const imgRegex = /<img[^>]*src="([^"]*)"[^>]*>/g;
    count = 0;
    while ((match = imgRegex.exec(html)) !== null && count < 10) {
        if (match[1].includes('uploads') || match[1].includes('poster')) {
            console.log(match[0]);
        }
        count++;
    }

  } catch (e) {
    console.error(e);
  }
}

inspect();
