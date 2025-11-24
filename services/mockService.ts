
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
const RANOBES_CHAPTER_17_CONTENT = [
    "Ch 17: Setting Sail",
    "The Sacrifice Ceremony ended, and Ragnar led the largest fleet in history out to sea.",
    "Currently, there are two routes from Northern Europe to Britain:",
    "The northern route departs from the west coast of Norway, replenishes fresh water at the Shetland Islands and Orkney Islands, and then arrives in Northern Britain.",
    "The southern route is riskier, requiring a direct crossing of the North Sea from southern Norway, following the North Atlantic Current, and finally arriving in eastern Britain.",
    "Image",
    "The fleet was large, with twenty slow-speed supply ships, so Ragnar chose the safer northern route. He led the fleet slowly along the Norwegian coastline, and then briefly rested in Bergen.",
    "Three thousand five hundred raiders caused a commotion there for two days, annoying the Lord of Bergen. Due to the power disparity, he dared not show any disrespect on the surface, enthusiastically entertaining these uninvited guests until they set sail westward.",
    "“Odin above, please unleash a storm and send these vile wretches to feed the fishes!”",
    "Departing Bergen, the fleet officially embarked on this unpredictable voyage. Vig’s longship carried forty warriors, with Ivar as captain.",
    "As Ragnar’s eldest son, Ivar had been going to sea with his father since he was fourteen. Besides the common operations of using a sundial and North Star for navigation, he also mastered a rare skill of using a sunstone for orientation.",
    "Facing Vig’s curious gaze, Ivar briefly demonstrated: “If you encounter a gloomy overcast day, and the sun is obscured by thick clouds, you cannot directly determine its position. At this time, point one end of the sunstone at the clouds, and it will decompose into two beams of light. Adjust the angle until the two beams of light… Then this direction is the sun’s direction.”",
    "After trying for a while, Vig quickly mastered the technique, but still felt that the sundial and sunstone techniques were too primitive, far inferior to the technology of the Age of Exploration.",
    "“Sigh, this is pure gambling with one’s life.”",
    "At night, the sailors took turns rowing. When Vig was awakened by his comrade, he found a gray-white mist surrounding them. He raised his head, trying to find the North Star, only to see a gray, hazy night sky.",
    "“What should we do?” He asked Ivar, who took out a horn to contact the other ships. The low, muffled sound spread continuously into the mist, but there was no response.",
    "They had become separated from the fleet.",
    "The next day, continuous dark clouds piled up overhead, making it hard to breathe. Ivar used the sunstone to determine their direction at intervals, constantly adjusting the longship’s course. After sailing for three whole days, they still could not see the Shetland Islands.",
    "“Release the raven.”",
    "As custom, each Viking longship carried 2-4 ravens. These carrion-eating birds, when released, tend to fly towards land to forage. If a released raven flies in one direction and does not return, it proves that it has found land, and the longship can sail in that direction. If the raven circles in the air a few times before returning, it indicates that there is no visible land nearby.",
    "At Ivar’s command, the sailor opened the cage, and a dark-feathered raven flapped its wings into the high air, then returned to the ship to the disappointment of everyone.",
    "Sensing that the situation was bad, a young sailor lost control: “This is Jörmungandr’s mist; we’re going to be eaten by it!”",
    "“This man’s crazy, tie him up.” Ivar knocked the man down with a punch. The worst thing during a sea voyage was for sailors to talk nonsense; if this panic were allowed to spread, it would lightly affect morale and seriously cause mutiny.",
    "The following two days were also overcast, with increasing waves; the seawater tossed the ship back and forth. Someone suggested holding a sacrifice ceremony, choosing an unlucky person to throw into the sea, but this resulted in Ivar beating them.",
    "“Remember, only the captain has authority on this ship. If anyone disagrees, feel free to duel me!”",
    "Looking at the many avoiding gazes, Ivar felt a growing sense of unease. Violence could only have a temporary deterrent effect; if they didn’t find land soon, the crew would eventually riot. Who would then stand by his side? 𝘳𝔞ŊỔβΕ𐌔",
    "Bjorn, Vig, Niels",
    "Five names flashed through his mind; only five.",
    "Time came to the eighth day.",
    "The sky was still gloomy, but the waves were much smaller. Ivar regarded this as divine mercy, urging the crew to row desperately. He himself stood at the stern, steering the ship, occasionally making some inspiring speeches.",
    "At noon, the gray clouds revealed a little yellowish light. Ivar, under the expectant gaze of the crew, opened the cage and released the last raven.",
    "After cawing several times, the black bird circled above the longship, then suddenly flew away towards the southwest without looking back.",
    "“Follow it!” Ivar roared, and everyone rowed with all their might. Five hours later, Nielson, who had the best eyesight, suddenly shouted: “Land! It’s a cliff!”",
    "On the gray coastline in the distance, steep cliffs pierced the clouds like the teeth of a giant. Although they didn’t know the exact location, they had finally found a piece of land.",
    "The longship ran aground on a gravel beach; the creaking sound of the hull scraping against the gravel startled a flock of seagulls. Leaving ten men to watch the ship, Ivar led the rest inland to scout the situation.",
    "Soon, they discovered several thatched-roof farmhouses on a hillside, with smoke coming from the chimneys. When Ivar kicked open the door, the people inside were cooking soup around a fire. Seeing these raiders, they immediately picked up axes to prepare for battle.",
    "Ivar: “Are you Vikings?”",
    "“Yes.” The residents inside responded coldly.",
    "“Put down your weapons.” After a tense few seconds, Ivar decided to spare these kinsmen and revealed his identity.",
    "Hearing that this person was the famous Boneless, a thirteen- or fourteen-year-old boy couldn’t help but exclaim, “You’re Ivar? Can you take me with you?”",
    "The next moment, the male head of the household covered his son’s mouth, responding with a pale face: “Take whatever you want, just don’t hurt us.”",
    "“Don’t be nervous, I’m not one of those berserkers obsessed with killing.” Ivar gave what he thought was a friendly smile, pulled out two silver coins and tossed them over, asking if they had seen a large fleet.",
    "“Yes, three days ago, a large fleet sailed south.” The male head of the household poured him a bowl of hot soup, explaining that this was Pictish land, with rough, poor soil, only slightly better than Northern Europe.",
    "Picts, the future Scotland?",
    "In Vig’s memory, the concept of “Scotland” did not yet exist at this time. It was only after the eastern Picts and western Gaels slowly merged over a long period that a new nation—the Scots—gradually formed.",
    "Image",
    "Similarly, “England” did not yet exist. It would only appear after Alfred the Great, the monarch of Wessex (AD 849–899), defeated the Vikings. Afterwards, his descendants gradually took over the lands of the “Seven Kingdoms,” ultimately unifying them into the Kingdom of England."
];

const RANOBES_PARSED_CHAPTERS = [
    { "id": "3012660", "title": "Chapter 42: Invitation", "link": "https://ranobes.net/viking-master-of-the-icy-sea-1206956/3012660.html" },
    { "id": "3012369", "title": "Chapter 41: Tribute", "link": "https://ranobes.net/viking-master-of-the-icy-sea-1206956/3012369.html" },
    { "id": "3012214", "title": "Chapter 40: Income", "link": "https://ranobes.net/viking-master-of-the-icy-sea-1206956/3012214.html" },
    { "id": "3012213", "title": "Chapter 39: Agriculture", "link": "https://ranobes.net/viking-master-of-the-icy-sea-1206956/3012213.html" },
    { "id": "3012212", "title": "Chapter 38: Books", "link": "https://ranobes.net/viking-master-of-the-icy-sea-1206956/3012212.html" },
    { "id": "3012211", "title": "Chapter 37: Territory", "link": "https://ranobes.net/viking-master-of-the-icy-sea-1206956/3012211.html" },
    { "id": "3012210", "title": "Chapter 36: Water Mill", "link": "https://ranobes.net/viking-master-of-the-icy-sea-1206956/3012210.html" },
    { "id": "3012209", "title": "Chapter 35: Hadrian's Wall", "link": "https://ranobes.net/viking-master-of-the-icy-sea-1206956/3012209.html" },
    { "id": "3012208", "title": "Chapter 34: The Manor", "link": "https://ranobes.net/viking-master-of-the-icy-sea-1206956/3012208.html" },
    { "id": "3008781", "title": "Chapter 33: River Fish Banquet", "link": "https://ranobes.net/viking-master-of-the-icy-sea-1206956/3008781.html" },
    { "id": "3008780", "title": "Chapter 32: Tyne", "link": "https://ranobes.net/viking-master-of-the-icy-sea-1206956/3008780.html" },
    { "id": "3008779", "title": "Chapter 31: Procurement", "link": "https://ranobes.net/viking-master-of-the-icy-sea-1206956/3008779.html" },
    { "id": "3008778", "title": "Chapter 30: Investiture", "link": "https://ranobes.net/viking-master-of-the-icy-sea-1206956/3008778.html" },
    { "id": "3008777", "title": "Chapter 29: Lands", "link": "https://ranobes.net/viking-master-of-the-icy-sea-1206956/3008777.html" },
    { "id": "3008776", "title": "Chapter 28: Banquet", "link": "https://ranobes.net/viking-master-of-the-icy-sea-1206956/3008776.html" },
    { "id": "3008775", "title": "Chapter 27: Breaching The City", "link": "https://ranobes.net/viking-master-of-the-icy-sea-1206956/3008775.html" },
    { "id": "3008774", "title": "Chapter 26: Siege Engine", "link": "https://ranobes.net/viking-master-of-the-icy-sea-1206956/3008774.html" },
    { "id": "3008773", "title": "Chapter 25: Standoff", "link": "https://ranobes.net/viking-master-of-the-icy-sea-1206956/3008773.html" },
    { "id": "3008772", "title": "Chapter 24: Burning River", "link": "https://ranobes.net/viking-master-of-the-icy-sea-1206956/3008772.html" },
    { "id": "3008771", "title": "Chapter 23: Decision", "link": "https://ranobes.net/viking-master-of-the-icy-sea-1206956/3008771.html" },
    { "id": "3008770", "title": "Chapter 22: Siege", "link": "https://ranobes.net/viking-master-of-the-icy-sea-1206956/3008770.html" },
    { "id": "3008769", "title": "Chapter 21: York", "link": "https://ranobes.net/viking-master-of-the-icy-sea-1206956/3008769.html" },
    { "id": "3008768", "title": "Chapter 20: Shield Wall", "link": "https://ranobes.net/viking-master-of-the-icy-sea-1206956/3008768.html" },
    { "id": "3008767", "title": "Chapter 19: Mancunium", "link": "https://ranobes.net/viking-master-of-the-icy-sea-1206956/3008767.html" },
    { "id": "3008766", "title": "Chapter 18: Northumbria", "link": "https://ranobes.net/viking-master-of-the-icy-sea-1206956/3008766.html" }
];

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
      // Tries to find ID in format 1206956-title or /1206956/
      const idMatch = url.match(/(\d+)-(.+)\.html/) || url.match(/\/(\d+)\//);
      const id = idMatch ? idMatch[1] : '1206956';
      
      // Title extraction (fallback to ID if not found)
      let title = "Viking: Master of the Icy Sea";
      if (idMatch && idMatch[2]) {
          title = idMatch[2].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
      // If the provided URL matches the prompt example, force exact title
      if (id === '1206956') {
          title = "Viking: Master of the Icy Sea";
      }

      // Simulate building TOC from the provided JSON data structure (window.__DATA__)
      // Note: provided data has "count_all": 67
      const totalChapters = 67;
      const toc: TOCItem[] = [];

      // Create Map of known chapters from the parsed JSON provided in prompt
      const knownChapterMap = new Map();
      RANOBES_PARSED_CHAPTERS.forEach(ch => {
          const match = ch.title.match(/Chapter (\d+)/);
          if (match) {
              knownChapterMap.set(parseInt(match[1]), {
                  ...ch,
                  parsedNumber: parseInt(match[1])
              });
          }
      });

      // Manually add Chapter 17 (from second prompt content)
      knownChapterMap.set(17, {
          id: "3008765",
          title: "Chapter 17: Setting Sail",
          link: "https://ranobes.net/viking-master-of-the-icy-sea-1206956/3008765.html",
          parsedNumber: 17
      });

      // Build full TOC (1 to 67)
      for (let i = 1; i <= totalChapters; i++) {
          const known = knownChapterMap.get(i);
          if (known) {
              toc.push({
                  number: i,
                  title: known.title,
                  url: known.link
              });
          } else {
              // Placeholder for chapters not in sample JSON
              // In a real scraper, we would iterate pages 1..3 to get these
              toc.push({
                  number: i,
                  title: `Chapter ${i}: [Placeholder]`,
                  url: `https://ranobes.net/viking-master-of-the-icy-sea-${id}/placeholder-${i}.html`
              });
          }
      }

      // Sort TOC ensures correct reading order
      toc.sort((a, b) => a.number - b.number);

      // STASH to Local Storage (Simulating persistence)
      localStorage.setItem(`lumina_toc_${id}`, JSON.stringify(toc));

      return {
        id: id,
        title: title,
        author: "Unknown", 
        // Image poster is found here: /html/body/.../a/img -> Standard Ranobes URL structure for covers
        coverUrl: `https://ranobes.net/up/medium/${id}.jpg`, 
        // Description found in /html/body/... -> Using text provided in initial context or placeholder
        description: "Su Chen traveled to a world where Vikings were prevalent. He became the son of a jarl (earl) but was framed by his stepmother and expelled from the family. He could only lead the faithful remnants of his family to open up wasteland on the bitter cold island in the north.",
        tags: ["Imported", "Fantasy", "History"],
        status: "Ongoing",
        totalChapters: totalChapters,
        rating: 0
      };
  }

  // Fallback for other URLs
  return {
    id: `n-imported-${Date.now()}`,
    title: "Reincarnated as a Slime in Another World",
    author: "Fuse",
    coverUrl: "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=600&auto=format&fit=crop",
    description: "A man is stabbed by a robber on the run after pushing his coworker and his coworker's new fiance out of the way. As he lays dying, bleeding on the ground, he hears a voice...",
    tags: ["Isekai", "Fantasy", "Adventure"],
    status: "Ongoing",
    totalChapters: 250,
    rating: 4.9
  };
};

const generateComments = (count: number): Comment[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `cmt-${Math.random().toString(36).substr(2, 9)}`,
    user: USER_NAMES[Math.floor(Math.random() * USER_NAMES.length)],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
    content: "This chapter was absolutely insane! The cliffhanger is killing me. Can't wait for the next update.",
    timestamp: `${Math.floor(Math.random() * 24)}h ago`,
    likes: Math.floor(Math.random() * 500)
  }));
};

export const fetchChapter = async (chapterNumber: number, novelId?: string): Promise<Chapter> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));

  let title = TITLES[(chapterNumber - 1) % TITLES.length];
  let content = [...LOREM_PARAGRAPHS]; // Default fallback

  if (novelId) {
      // 1. Check Local Storage for TOC (To get correct title & simulate link usage)
      const storedToc = localStorage.getItem(`lumina_toc_${novelId}`);
      if (storedToc) {
          try {
              const toc = JSON.parse(storedToc) as TOCItem[];
              const item = toc.find(t => t.number === chapterNumber);
              if (item) {
                  title = item.title;
                  // In a real application, we would use item.url here to fetch the specific HTML content.
                  // For this mock, we verify we have the link:
                  if (item.url) {
                    console.log(`[Mock] Loading chapter content from source: ${item.url}`);
                  }
              }
          } catch (e) {
              console.error("Failed to parse stored TOC", e);
          }
      }

      // 2. Specific Mock Content for Prompt Requirement (Chapter 17)
      if (novelId === '1206956' && chapterNumber === 17) {
          content = RANOBES_CHAPTER_17_CONTENT;
      } else {
           // For other chapters (like 18-42 which we have titles for but no content text),
           // we generate Lorem Ipsum to simulate the reading experience.
           content = [];
           const paraCount = 15 + Math.floor(Math.random() * 10);
           for (let i = 0; i < paraCount; i++) {
                const p1 = LOREM_PARAGRAPHS[Math.floor(Math.random() * LOREM_PARAGRAPHS.length)];
                content.push(`${p1}`);
           }
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
