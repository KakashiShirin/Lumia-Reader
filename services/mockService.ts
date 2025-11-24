
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
  // Initialize with some random progress and categories
  const categories = ['reading', 'plan', 'completed', 'dropped'];

  return MOCK_NOVELS_DATA.map((novel, idx) => ({
    ...novel,
    lastReadChapter: Math.floor(Math.random() * 10),
    readChapters: [],
    bookmarkedChapters: [],
    categoryId: categories[idx % categories.length]
  }));
};

// Simulate scraping a novel from a URL
export const fetchNovelFromUrl = async (url: string): Promise<Novel> => {
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network request

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
      // Try CodeTabs proxy as it often handles basic protections better
      const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      console.log(`[Proxy] Response status: ${response.status}`);

      if (response.ok) {
        const html = await response.text();
        console.log(`[Proxy] HTML received, length: ${html.length}`);

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        console.log(`[DOM] Document title: ${doc.title}`);

        if (doc.title.includes("Just a moment") || doc.title.includes("Attention Required")) {
          console.warn("[Proxy] Cloudflare/Bot protection detected. Cannot parse actual content.");
          throw new Error("Cloudflare blocked");
        }

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
          coverUrl = foundImage;
          // Fix relative URLs
          if (coverUrl.startsWith('/')) {
            coverUrl = `https://ranobes.net${coverUrl}`;
          }
          console.log(`[Image Extraction] Final cover URL: ${coverUrl}`);
        } else {
          console.warn(`[Image Extraction] Failed to find cover image with any strategy.`);
        }

        // Optional: Try to extract description too if we have the doc
        const descMeta = doc.querySelector('meta[property="og:description"]');
        if (descMeta) {
          description = descMeta.getAttribute('content') || description;
        }

        // --- Author Extraction ---
        try {
          const authorXPath = "/html/body/div[1]/div/div/div[2]/div/article/div[2]/div[1]/div/div[1]/div[3]/div[1]/div[2]/ul[1]/li[7]/span/a";
          const authorResult = doc.evaluate(authorXPath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          const authorElement = authorResult.singleNodeValue as HTMLElement;
          if (authorElement) {
            author = authorElement.textContent?.trim() || author;
            console.log(`[Author Extraction] Found: ${author}`);
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

          // Create a proxy function for the parser
          const proxyFn = async (url: string) => {
            const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
            return await fetch(proxyUrl);
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
      } else {
        console.error(`[Proxy] Failed to fetch. Status: ${response.status}`);
        throw new Error(`Proxy status: ${response.status}`);
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

    return {
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
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));

  let title = TITLES[(chapterNumber - 1) % TITLES.length] || `Chapter ${chapterNumber}`;
  let content = [...LOREM_PARAGRAPHS]; // Default fallback

  if (novelId) {
    // 1. Check Local Storage for TOC
    const storedToc = localStorage.getItem(`lumina_toc_${novelId}`);
    if (storedToc) {
      try {
        const toc = JSON.parse(storedToc) as TOCItem[];
        const item = toc.find(t => t.number === chapterNumber);
        if (item) {
          title = item.title;
        }
      } catch (e) {
        console.error("Failed to parse stored TOC", e);
      }
    }

    // Generate random content length
    content = [];
    const paraCount = 15 + Math.floor(Math.random() * 10);
    for (let i = 0; i < paraCount; i++) {
      const p1 = LOREM_PARAGRAPHS[Math.floor(Math.random() * LOREM_PARAGRAPHS.length)];
      content.push(`${p1}`);
    }
  }

  return {
    id: `ch-${chapterNumber}`,
    number: chapterNumber,
    title: title,
    content: content,
    comments: generateComments(3 + Math.floor(Math.random() * 5))
  };
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
