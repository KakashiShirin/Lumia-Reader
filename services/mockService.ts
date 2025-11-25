
import { Chapter, Comment, TOCItem, Novel, LibraryEntry, User } from '../types';

const LOREM_PARAGRAPHS = [
  "The sky above the port was the color of television, tuned to a dead channel. It was not the darkness that bothered him, but the silence that stretched between the stars.",
  "\"You think you can just walk away from the Order?\" Kael whispered, his hand tightening around the hilt of his obsidian dagger. The wind howled through the canyon, carrying the scent of ozone and ancient dust.",
  "Elara adjusted her spectacles, the mana crystals embedded in the frames humming softly. \"According to the archives, the gates shouldn't open for another thousand years. Unless... someone forced them.\"",
  "The beast lunged. It was a blur of shadow and teeth, moving faster than human eyes could track. Kael didn't flinch. He had seen worse in the Void Lands. He stepped sideways, a fluid motion practiced a thousand times.",
  "Rain began to fall, sizzling as it hit the energy shield. The city below was a grid of neon and despair, a testament to a civilization that had conquered the atom but lost its soul.",
  "He remembered the taste of the apple tart his mother used to bake. Simple memories. Those were the first to go when the corruption took hold. Now, he struggled to recall her face.",
  "\"Power isn't given,\" the old mage rasped, coughing up a speck of black blood. \"It is taken. Violently. Irrevocably. Are you ready to pay that price, boy?\"",
  "The dungeon walls were slick with moss and something that glowed with a faint, sickly green light. Every footstep echoed like a thunderclap in the oppressive silence.",
  "She laughed, a sound like breaking glass. \"Destiny? There is no destiny. Only the choices we make and the consequences we endure. I chose to burn the world down.\"",
  "The interface flickered. SYSTEM ALERT: MANA RESERVES CRITICAL. He ignored it. He pushed the remaining energy into his legs and sprinted towards the closing rift."
];

const TITLES = [
  "The Echoes of Reality", "Whispers in the Void", "Shattered Horizons", "The Clockwork Heart",
  "Neon Tears", "Velvet Shadows", "The Silent King", "Protocol Omega", "Crimson Dawn", "Final Transmission"
];

const USER_NAMES = ["VoidWalker", "LightYagami_99", "KiritoSolos", "ReaderSan", "Alice_In_Borderland", "SoloLeveler"];

const MOCK_NOVELS_DATA: Novel[] = [
  {
    id: 'n-1',
    title: "The Clockwork Heart",
    author: "Eleanor Vance",
    coverUrl: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=600&auto=format&fit=crop",
    description: "In a world where steam powers the soul, a young mechanic discovers a conspiracy that threatens to unwind time itself.",
    tags: ["Steampunk", "Mystery", "Adventure"],
    status: "Ongoing",
    totalChapters: 142,
    rating: 4.8
  },
  {
    id: 'n-2',
    title: "Void Walker: Ascension",
    author: "K. R. Martin",
    coverUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop",
    description: "Thrown into the abyss, he didn't die. He adapted. Now he's back, and the gods themselves are trembling.",
    tags: ["Fantasy", "Action", "System"],
    status: "Completed",
    totalChapters: 500,
    rating: 4.5
  },
  {
    id: 'n-3',
    title: "Neon Samurai",
    author: "J. Silverhand",
    coverUrl: "https://images.unsplash.com/photo-1515462277128-24023d2a4c61?q=80&w=600&auto=format&fit=crop",
    description: "New Tokyo, 2145. The code of Bushido meets cybernetic enhancements in a rain-slicked city of betrayal.",
    tags: ["Cyberpunk", "Sci-Fi", "Thriller"],
    status: "Hiatus",
    totalChapters: 89,
    rating: 4.2
  },
  {
    id: 'n-4',
    title: "The Last Alchemist",
    author: "Sarah O'Conner",
    coverUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?q=80&w=600&auto=format&fit=crop",
    description: "Gold is easy. Immortality is hard. Keeping your humanity is impossible.",
    tags: ["Magic", "Drama", "Historical"],
    status: "Ongoing",
    totalChapters: 230,
    rating: 4.9
  },
  {
    id: 'n-5',
    title: "Dungeon of Gluttony",
    author: "EatAllDay",
    coverUrl: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=600&auto=format&fit=crop",
    description: "He was the weakest porter. Then he ate a slime. Now he's eating dragons.",
    tags: ["LitRPG", "Comedy", "Overpowered"],
    status: "Ongoing",
    totalChapters: 1200,
    rating: 4.1
  }
];

// Content exactly as parsed from the provided HTML structure, including implicit text nodes


export const mockLogin = async (username: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    id: 'user-1',
    username: username || 'Guest',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    isGuest: !username,
    bio: "Just a casual reader enjoying the multiverse.",
    stats: {
      booksFinished: 12,
      readingStreak: 5,
      totalReadTime: 2450, // minutes
      chaptersRead: 342
    },
    achievements: [
      { id: '1', title: 'Bookworm', description: 'Read for 10 hours', icon: '🐛', unlocked: true, progress: 100 },
      { id: '2', title: 'Night Owl', description: 'Read after 2 AM', icon: '🦉', unlocked: true, progress: 100 },
      { id: '3', title: 'Bibliophile', description: 'Finish 50 novels', icon: '📚', unlocked: false, progress: 24 },
      { id: '4', title: 'Speed Reader', description: 'Read 100 chapters in a day', icon: '⚡', unlocked: false, progress: 65 },
    ]
  };
};

export const fetchLibrary = async (): Promise<LibraryEntry[]> => {
  const categories = ['reading', 'plan', 'completed', 'dropped'];

  // Start with mock novels
  const mockNovels: LibraryEntry[] = MOCK_NOVELS_DATA.map((novel, idx) => ({
    ...novel,
    lastReadChapter: Math.floor(Math.random() * 10),
    readChapters: [],
    bookmarkedChapters: [],
    categoryId: categories[idx % categories.length]
  }));

  // Load imported novels from storage
  try {
    // Fetch list of all stored novels from proxy server
    const response = await fetch(`${PROXY_BASE}/store/list`);
    if (response.ok) {
      const { files } = await response.json();

      // Filter for novel files (novel_*.json)
      const novelFiles = files.filter((f: string) => f.startsWith('novel_') && f.endsWith('.json'));

      // Load each novel
      for (const file of novelFiles) {
        const key = file.replace('.json', '');
        const novelData = await fetchFromStore(key);

        if (novelData) {
          // Convert to LibraryEntry format
          const libraryEntry: LibraryEntry = {
            ...novelData,
            lastReadChapter: 0,
            readChapters: [],
            bookmarkedChapters: [],
            categoryId: 'reading', // Default to reading category
            sourceUrl: `https://ranobes.net/novels/${novelData.id}-${novelData.title.toLowerCase().replace(/\s+/g, '-')}.html`
          };

          // Check if already in mock data (avoid duplicates)
          if (!mockNovels.find(n => n.id === novelData.id)) {
            mockNovels.push(libraryEntry);
          }
        }
      }
    }
  } catch (e) {
    console.warn('[Library] Failed to load imported novels:', e);
  }

  return mockNovels;
};

// Check if user has solved Cloudflare challenge
const checkCloudflareBypass = (url: string): string | null => {
  const bypassKey = `cf_bypass_${btoa(url).slice(0, 20)}`;
  return localStorage.getItem(bypassKey);
};

// Store Cloudflare bypass token
const storeCloudflareBypass = (url: string, token: string) => {
  const bypassKey = `cf_bypass_${btoa(url).slice(0, 20)}`;
  localStorage.setItem(bypassKey, token);
};

// --- Rate Limiting Utilities ---
const FETCH_DELAY_MIN_MS = 2000; // 2 seconds minimum
const FETCH_DELAY_MAX_MS = 5000; // 5 seconds maximum

const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const getRandomDelay = (): number => {
  return Math.floor(Math.random() * (FETCH_DELAY_MAX_MS - FETCH_DELAY_MIN_MS + 1)) + FETCH_DELAY_MIN_MS;
};

let lastFetchTime = 0;

const rateLimitedFetch = async (url: string, options?: RequestInit): Promise<Response> => {
  const now = Date.now();
  const timeSinceLastFetch = now - lastFetchTime;

  if (timeSinceLastFetch < FETCH_DELAY_MIN_MS) {
    const delay = getRandomDelay();
    console.log(`[Rate Limit] Waiting ${delay}ms before next request...`);
    await sleep(delay);
  }

  lastFetchTime = Date.now();
  return fetch(url, options);
};

// --- Local Storage Helpers ---
const PROXY_BASE = 'http://localhost:3005';

const fetchFromStore = async (key: string): Promise<any | null> => {
  try {
    const res = await fetch(`${PROXY_BASE}/store/${key}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn(`[Store] Failed to fetch ${key}:`, e);
  }
  return null;
};

const saveToStore = async (key: string, data: any) => {
  try {
    await fetch(`${PROXY_BASE}/store/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    console.log(`[Store] Saved ${key}`);
  } catch (e) {
    console.error(`[Store] Failed to save ${key}:`, e);
  }
};

export const refreshNovel = async (url: string): Promise<Novel> => {
  return fetchNovelFromUrl(url, false, true);
};

// Simulate scraping a novel from a URL
export const fetchNovelFromUrl = async (url: string, isRetry = false, forceRefresh = false): Promise<Novel> => {

  // Extract ID for storage key
  const idMatch = url.match(/(\d+)-(.+)\.html/) || url.match(/\/(\d+)\//);
  const id = idMatch ? idMatch[1] : 'unknown';
  const storeKey = `novel_${id}`;

  // 1. Try Local Store first (unless forcing refresh)
  if (!forceRefresh && !isRetry) {
    const cached = await fetchFromStore(storeKey);
    if (cached) {
      console.log(`[Store] Loaded from cache: ${storeKey}`);
      return cached as Novel;
    }
  }

  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network request

  // Check if user has bypass token (but not on retry to avoid infinite loop)
  if (!isRetry) {
    const bypassToken = checkCloudflareBypass(url);
    if (bypassToken) {
      console.log('[Cloudflare] Using stored bypass token');
    }
  }

  // Ranobes Parsing Logic
  if (url.includes('ranobes.net')) {
    // Robust ID Extraction
    const idMatch = url.match(/(\d+)-(.+)\.html/) || url.match(/\/(\d+)\//);
    const id = idMatch ? idMatch[1] : '1206956';

    let title = "Viking: Master of the Icy Sea";
    if (idMatch && idMatch[2]) {
      title = idMatch[2].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    if (id === '1206956') {
      title = "Viking: Master of the Icy Sea";
    }

    let coverUrl = `https://ranobes.net/up/medium/${id}.jpg`; // Default fallback
    let description = "Su Chen traveled to a world where Vikings were prevalent..."; // Default fallback
    let author = "Unknown"; // Default fallback
    let rating = 0; // Default fallback
    let status: "Ongoing" | "Completed" | "Hiatus" | "Dropped" = "Ongoing"; // Default fallback
    let parsedChapters: TOCItem[] = [];

    try {
      console.log(`[Proxy] Fetching URL: ${url}`);

      // Try local proxy first, then fallback to public proxies
      const proxies = [
        `http://localhost:3005/proxy?url=${encodeURIComponent(url)}`,
        `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
      ];

      let html = '';

      for (const proxyUrl of proxies) {
        try {
          console.log(`[Proxy] Trying: ${proxyUrl.split('?')[0]}`);
          // Simple request to avoid CORS preflight
          const response = await fetch(proxyUrl);

          if (response.ok) {
            let testHtml = '';
            if (proxyUrl.includes('allorigins')) {
              const data = await response.json();
              testHtml = data.contents;
            } else {
              testHtml = await response.text();
            }

            // Check if we got the app's own HTML (proxy failure)
            if (testHtml.includes('<title>Lumia Reader</title>') || testHtml.includes('id="root"')) {
              console.warn(`[Proxy] ${proxyUrl.split('?')[0]} returned app HTML (proxy not running?), trying next...`);
              continue;
            }

            // Test if this proxy bypassed Cloudflare
            const parser = new DOMParser();
            const testDoc = parser.parseFromString(testHtml, "text/html");

            if (testDoc.title.includes("Just a moment") || testDoc.title.includes("Attention Required") || testHtml.includes('cf-browser-verification')) {
              console.warn(`[Proxy] ${proxyUrl.split('?')[0]} returned Cloudflare challenge, trying next...`);
              continue;
            }

            html = testHtml;
            console.log(`[Proxy] Success with ${proxyUrl.split('?')[0]}`);
            break;
          }
        } catch (e) {
          console.warn(`[Proxy] Failed with ${proxyUrl.split('?')[0]}:`, e);
          continue;
        }
      }

      if (!html) {
        // Open page for manual Cloudflare bypass
        console.log('[Cloudflare] Opening page for manual bypass...');

        const popup = window.open(url, 'cloudflareBypass', 'width=800,height=600');

        alert(
          'Cloudflare protection detected!\n\n' +
          'A new window has opened. Please:\n' +
          '1. Complete any CAPTCHA or challenge\n' +
          '2. Wait for the page to load fully\n' +
          '3. Close the popup window\n\n' +
          'The import will retry automatically.'
        );

        // Wait for user to close popup
        await new Promise((resolve) => {
          const checkInterval = setInterval(() => {
            if (popup?.closed) {
              clearInterval(checkInterval);
              resolve(null);
            }
          }, 1000);
        });

        // Retry with proxies after user completes challenge
        console.log('[Cloudflare] Retrying after manual bypass...');
        for (const proxyUrl of proxies) {
          try {
            const response = await fetch(proxyUrl);
            if (response.ok) {
              const data = await response.json();
              html = data.contents;
              break;
            }
          } catch (e) {
            continue;
          }
        }

        if (!html) {
          throw new Error('Cloudflare bypass failed - please try again');
        }
      }

      console.log(`[Proxy] HTML received, length: ${html.length}`);

      if (html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        console.log(`[DOM] Document title: ${doc.title}`);

        // Extract Image using multiple strategies
        let foundImage: string | null = null;

        // Strategy 1: Schema.org itemprop="image" (High confidence)
        const schemaImage = doc.querySelector('link[itemprop="image"]');
        if (schemaImage) {
          foundImage = schemaImage.getAttribute('href');
          console.log(`[Image Extraction] Found via itemprop="image": ${foundImage}`);
        }

        // Strategy 2: Open Graph Image
        if (!foundImage) {
          const ogImage = doc.querySelector('meta[property="og:image"]');
          if (ogImage) {
            foundImage = ogImage.getAttribute('content');
            console.log(`[Image Extraction] Found via og:image: ${foundImage}`);
          }
        }

        // Strategy 3: Specific Ranobes Structure (.r-fullstory-poster img)
        if (!foundImage) {
          const posterImg = doc.querySelector('.r-fullstory-poster img');
          if (posterImg) {
            foundImage = posterImg.getAttribute('src');
            console.log(`[Image Extraction] Found via .r-fullstory-poster img: ${foundImage}`);
          }
        }

        // Strategy 4: Background Image Style (.r-fullstory-poster .cover)
        if (!foundImage) {
          const coverDiv = doc.querySelector('.r-fullstory-poster .cover') as HTMLElement;
          if (coverDiv && coverDiv.style.backgroundImage) {
            // Extract url(...)
            const bgMatch = coverDiv.style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
            if (bgMatch && bgMatch[1]) {
              foundImage = bgMatch[1];
              console.log(`[Image Extraction] Found via background-image: ${foundImage}`);
            }
          }
        }

        // Strategy 5: User provided XPath (Fallback)
        if (!foundImage) {
          try {
            const imageXPath = "/html/body/div[1]/div/div/div[2]/div/article/div[2]/div[1]/div/div[1]/div[2]/div[1]/a/img";
            const imageResult = doc.evaluate(imageXPath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const imageElement = imageResult.singleNodeValue as HTMLImageElement;
            if (imageElement) {
              foundImage = imageElement.getAttribute('src');
              console.log(`[Image Extraction] Found via XPath: ${foundImage}`);
            }
          } catch (e) {
            console.warn("[Image Extraction] XPath error:", e);
          }
        }

        // Strategy 6: Heuristic - Look for images with 'uploads/posts'
        if (!foundImage) {
          const specificImg = doc.querySelector('img[src*="/uploads/posts/"]');
          if (specificImg) {
            foundImage = specificImg.getAttribute('src');
            console.log(`[Image Extraction] Found via src pattern: ${foundImage}`);
          }
        }

        if (foundImage) {
          // Clean up quotes and escape characters from the URL
          coverUrl = foundImage.replace(/["'\\]/g, '').replace(/&quot;/g, '');
          // Fix relative URLs
          if (coverUrl.startsWith('/')) {
            coverUrl = `https://ranobes.net${coverUrl}`;
          } else if (!coverUrl.startsWith('http')) {
            coverUrl = `https://ranobes.net/${coverUrl}`;
          }
          console.log(`[Image Extraction] Final cover URL: ${coverUrl}`);
        } else {
          console.warn(`[Image Extraction] Failed to find cover image with any strategy.`);
        }

        // Optional: Try to extract description too if we have the doc
        // Strategy 1: Full description from .moreless__full (expanded content)
        const fullDescDiv = doc.querySelector('.moreless__full');
        if (fullDescDiv) {
          // Remove the "Collapse" button text
          const clonedDiv = fullDescDiv.cloneNode(true) as HTMLElement;
          const collapseBtn = clonedDiv.querySelector('.moreless__toggle');
          if (collapseBtn) collapseBtn.remove();

          description = clonedDiv.textContent?.trim() || description;
          console.log(`[Description Extraction] Found via .moreless__full`);
        } else {
          // Fallback to og:description
          const descMeta = doc.querySelector('meta[property="og:description"]');
          if (descMeta) {
            description = descMeta.getAttribute('content') || description;
            console.log(`[Description Extraction] Found via og:description`);
          }
        }

        // --- Author Extraction ---
        try {
          // Strategy 1: itemprop="creator" (more reliable)
          const authorTag = doc.querySelector('.tag_list[itemprop="creator"] a, span[itemprop="creator"] a');
          if (authorTag) {
            author = authorTag.textContent?.trim() || author;
            console.log(`[Author Extraction] Found via itemprop: ${author}`);
          } else {
            // Fallback to XPath
            const authorXPath = "/html/body/div[1]/div/div/div[2]/div/article/div[2]/div[1]/div/div[1]/div[3]/div[1]/div[2]/ul[1]/li[7]/span/a";
            const authorResult = doc.evaluate(authorXPath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const authorElement = authorResult.singleNodeValue as HTMLElement;
            if (authorElement) {
              author = authorElement.textContent?.trim() || author;
              console.log(`[Author Extraction] Found via XPath: ${author}`);
            }
          }
        } catch (e) {
          console.warn("[Author Extraction] Error:", e);
        }

        // --- Rating Extraction ---
        try {
          const ratingXPath = "/html/body/div[1]/div/div/div[2]/div/article/div[2]/aside/div[1]/div[1]/div[2]/div[1]/div[1]/div/div/div/span[1]";
          const ratingResult = doc.evaluate(ratingXPath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          const ratingElement = ratingResult.singleNodeValue as HTMLElement;
          if (ratingElement) {
            const ratingText = ratingElement.textContent?.trim();
            const ratingValue = parseFloat(ratingText || '0');
            if (!isNaN(ratingValue)) {
              rating = ratingValue;
              console.log(`[Rating Extraction] Found: ${rating}`);
            }
          }
        } catch (e) {
          console.warn("[Rating Extraction] Error:", e);
        }

        // --- Status Extraction ---
        try {
          const statusXPath = "/html/body/div[1]/div/div/div[2]/div/article/div[2]/div[1]/div/div[1]/div[3]/div[1]/div[2]/ul[1]/li[1]/span/a";
          const statusResult = doc.evaluate(statusXPath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          const statusElement = statusResult.singleNodeValue as HTMLElement;
          if (statusElement) {
            const statusText = statusElement.textContent?.trim().toLowerCase() || "";
            console.log(`[Status Extraction] Raw status: ${statusText}`);

            // Normalize status to match our type
            if (statusText.includes("complet")) {
              status = "Completed";
            } else if (statusText.includes("hiatus")) {
              status = "Hiatus";
            } else if (statusText.includes("drop")) {
              status = "Dropped";
            } else if (statusText.includes("ongoing") || statusText.includes("continu")) {
              status = "Ongoing";
            }
            console.log(`[Status Extraction] Normalized status: ${status}`);
          }
        } catch (e) {
          console.warn("[Status Extraction] Error:", e);
        }

        // --- Chapter List Parsing ---
        try {
          // Look for "More chapters" link
          // Construct TOC URL directly from novel ID
          const tocUrl = `https://ranobes.net/chapters/${id}/`;

          console.log(`[Chapter Parsing] Constructed TOC URL: ${tocUrl}`);

          // Use the Ranobes parser to fetch all chapters
          const { fetchAllRanobesChapters, parseChaptersFromHTML } = await import('./ranobesParser');

          // Create a proxy function using local proxy
          const proxyFn = async (url: string) => {
            const response = await fetch(`http://localhost:3005/proxy?url=${encodeURIComponent(url)}`);
            if (response.ok) {
              const data = await response.json();
              return {
                ok: true,
                text: () => Promise.resolve(data.contents),
                json: () => Promise.resolve(data),
                status: 200,
                headers: new Headers(),
              } as unknown as Response;
            }
            throw new Error('Chapter proxy failed');
          };

          parsedChapters = await fetchAllRanobesChapters(tocUrl, proxyFn);

          // If parsing failed, try HTML fallback from main page
          if (parsedChapters.length === 0) {
            console.warn('[Chapter Parsing] JSON parsing failed, trying HTML fallback from main page');
            parsedChapters = parseChaptersFromHTML(doc);
          }

          console.log(`[Chapter Parsing] Final chapter count: ${parsedChapters.length}`);

        } catch (e) {
          console.warn("[Chapter Parsing] Error:", e);
        }
      }
    } catch (error) {
      console.error("Failed to fetch or parse novel page:", error);
      // Fallback for the specific Viking novel if proxy fails (likely due to Cloudflare)
      if (url.includes("1206956") || url.includes("viking-master")) {
        console.log("[Fallback] Using hardcoded data for Viking novel due to fetch failure.");
        coverUrl = "https://ranobes.net/uploads/posts/2025-09/thumbs/1759050603_viking-master-of-the-icy-sea.webp";
        title = "Viking: Master of the Icy Sea";
      }
    }

    // Use parsed chapters if available, otherwise fallback to mock
    const totalChapters = parsedChapters.length > 0 ? parsedChapters.length : 67;
    const toc: TOCItem[] = parsedChapters.length > 0 ? parsedChapters : Array.from({ length: totalChapters }, (_, i) => ({
      number: i + 1,
      title: `Chapter ${i + 1}`,
      url: `${url}/chapter-${i + 1}`
    }));

    // STASH to Local Storage (Simulating persistence)
    localStorage.setItem(`lumina_toc_${id}`, JSON.stringify(toc));

    const novelData: Novel = {
      id: id,
      title: title,
      author: author,
      coverUrl: coverUrl,
      description: description,
      tags: ["Imported", "Fantasy", "History"],
      status: status,
      totalChapters: totalChapters,
      rating: rating
    };

    // Save novel data with chapters to store
    const novelWithChapters = {
      ...novelData,
      chapters: toc // Include chapter links
    };
    await saveToStore(storeKey, novelWithChapters);

    return novelData;
  }

  // Fallback for other URLs
  return {
    id: `n-imported-${Date.now()}`,
    title: "Imported Novel",
    author: "Unknown",
    coverUrl: "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=600&auto=format&fit=crop",
    description: "Imported novel description...",
    tags: ["Imported"],
    status: "Ongoing",
    totalChapters: 0,
    rating: 0
  };
};

const generateComments = (count: number): Comment[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `cmt-${Math.random().toString(36).substr(2, 9)}`,
    user: USER_NAMES[Math.floor(Math.random() * USER_NAMES.length)],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
    content: "Great chapter!",
    timestamp: `${Math.floor(Math.random() * 24)}h ago`,
    likes: Math.floor(Math.random() * 500)
  }));
};

export const fetchChapter = async (chapterNumber: number, novelId?: string): Promise<Chapter> => {
  let title = `Chapter ${chapterNumber}`;
  let content: string[] = [];
  let chapterUrl = '';

  if (novelId) {
    // 1. Try to load from storage first
    const chapterStoreKey = `chapter_${novelId}_${chapterNumber}`;
    const cachedChapter = await fetchFromStore(chapterStoreKey);

    if (cachedChapter) {
      console.log(`[Chapter] Loaded from cache: ${chapterStoreKey}`);
      // Trigger background prefetch for next chapters
      prefetchChapters(novelId, chapterNumber + 1, 3).catch(e =>
        console.warn('[Prefetch] Error:', e)
      );
      return cachedChapter as Chapter;
    }

    // 2. Check Local Storage for TOC to get the chapter URL
    const storedToc = localStorage.getItem(`lumina_toc_${novelId}`);
    if (storedToc) {
      try {
        const toc = JSON.parse(storedToc) as TOCItem[];
        const item = toc.find(t => t.number === chapterNumber);
        if (item) {
          title = item.title;
          chapterUrl = item.url || '';
        }
      } catch (e) {
        console.error("Failed to parse stored TOC", e);
      }
    }

    // 3. If we have a chapter URL, fetch the actual content
    if (chapterUrl && chapterUrl.includes('ranobes.net')) {
      try {
        console.log(`[Chapter Fetch] Fetching chapter from: ${chapterUrl}`);

        const proxyUrl = `http://localhost:3005/proxy?url=${encodeURIComponent(chapterUrl)}`;
        const response = await rateLimitedFetch(proxyUrl);

        if (response.ok) {
          const data = await response.json();
          const html = data.contents;

          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");

          // Extract title from h1.title
          const titleElement = doc.querySelector('h1.title[itemprop="headline"]');
          if (titleElement) {
            const fullTitle = titleElement.textContent?.trim() || '';
            const titleParts = fullTitle.split('|');
            title = titleParts[0]?.trim() || title;
            console.log(`[Chapter Fetch] Extracted title: ${title}`);
          }

          // Extract content from div.text#arrticle
          const contentElement = doc.querySelector('div.text#arrticle');
          if (contentElement) {
            const paragraphs = contentElement.querySelectorAll('p');
            content = Array.from(paragraphs)
              .map(p => p.textContent?.trim() || '')
              .filter(text => {
                return text.length > 0 &&
                  !text.includes('data-cfasync') &&
                  !text.includes('script') &&
                  text.length > 10;
              });

            console.log(`[Chapter Fetch] Extracted ${content.length} paragraphs`);
          }
        }
      } catch (error) {
        console.error("[Chapter Fetch] Error fetching chapter content:", error);
      }
    }
  }

  // If no content was fetched, show a message
  if (content.length === 0) {
    content = ["Unable to load chapter content. Please check your connection or try again later."];
  }

  const chapter: Chapter = {
    id: `ch-${chapterNumber}`,
    number: chapterNumber,
    title: title,
    content: content,
    comments: generateComments(3 + Math.floor(Math.random() * 5))
  };

  // Save to storage if we fetched real content
  if (novelId && content.length > 1) {
    const chapterStoreKey = `chapter_${novelId}_${chapterNumber}`;
    await saveToStore(chapterStoreKey, chapter);

    // Trigger background prefetch for next chapters
    prefetchChapters(novelId, chapterNumber + 1, 3).catch(e =>
      console.warn('[Prefetch] Error:', e)
    );
  }

  return chapter;
};

// Background prefetch for upcoming chapters
const prefetchChapters = async (novelId: string, startNum: number, count: number): Promise<void> => {
  console.log(`[Prefetch] Starting prefetch for chapters ${startNum}-${startNum + count - 1}`);

  for (let i = 0; i < count; i++) {
    const chapterNum = startNum + i;
    const chapterStoreKey = `chapter_${novelId}_${chapterNum}`;

    // Skip if already cached
    const cached = await fetchFromStore(chapterStoreKey);
    if (cached) {
      console.log(`[Prefetch] Chapter ${chapterNum} already cached, skipping`);
      continue;
    }

    // Fetch in background
    try {
      console.log(`[Prefetch] Fetching chapter ${chapterNum}...`);
      await fetchChapter(chapterNum, novelId);
    } catch (e) {
      console.warn(`[Prefetch] Failed to prefetch chapter ${chapterNum}:`, e);
    }
  }

  console.log(`[Prefetch] Completed prefetch`);
};

export const fetchTOC = async (novelId?: string): Promise<TOCItem[]> => {
  if (novelId) {
    const storedToc = localStorage.getItem(`lumina_toc_${novelId}`);
    if (storedToc) {
      try {
        return JSON.parse(storedToc);
      } catch (e) {
        console.error("Error parsing local TOC", e);
      }
    }
  }

  // Default / Mock TOC for hardcoded novels
  return Array.from({ length: 100 }).map((_, i) => ({
    number: i + 1,
    title: TITLES[i % TITLES.length]
  }));
};

