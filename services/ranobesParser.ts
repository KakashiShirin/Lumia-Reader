import { TOCItem } from '../types';

interface RanobesChapterData {
    id: string;
    title: string;
    date: string;
    comm_num: string;
    showDate: string;
    link: string;
}

interface RanobesPageData {
    book_title: string;
    book_link: string;
    book_id: number;
    chapters: RanobesChapterData[];
    pages_count: number;
    count_all: number;
    cstart: number;
    limit: number;
}

/**
 * Extracts the __DATA__ object from a Ranobes TOC page using multiple methods
 */
export function extractRanobesData(html: string): RanobesPageData | null {
    // Method 1: Regex extraction
    try {
        const regex = /window\.__DATA__\s*=\s*({[\s\S]*?})(?=;|\s*<\/script>)/;
        const match = html.match(regex);
        if (match) {
            const data = JSON.parse(match[1]) as RanobesPageData;
            console.log(`[Ranobes Parser] Extracted data via regex: ${data.chapters?.length || 0} chapters`);
            return data;
        }
    } catch (e) {
        console.warn('[Ranobes Parser] Regex extraction failed:', e);
    }

    // Method 2: String index-based extraction with brace matching
    try {
        const startStr = 'window.__DATA__ =';
        const startIndex = html.indexOf(startStr);
        if (startIndex !== -1) {
            const dataStart = html.indexOf('{', startIndex);
            let braceCount = 0;
            let dataEnd = dataStart;

            // Find matching closing brace
            for (let i = dataStart; i < html.length; i++) {
                if (html[i] === '{') braceCount++;
                if (html[i] === '}') braceCount--;
                if (braceCount === 0) {
                    dataEnd = i + 1;
                    break;
                }
            }

            if (dataEnd > dataStart) {
                const jsonStr = html.substring(dataStart, dataEnd);
                const data = JSON.parse(jsonStr) as RanobesPageData;
                console.log(`[Ranobes Parser] Extracted data via string parsing: ${data.chapters?.length || 0} chapters`);
                return data;
            }
        }
    } catch (e) {
        console.warn('[Ranobes Parser] String extraction failed:', e);
    }

    console.error('[Ranobes Parser] All extraction methods failed');
    return null;
}

/**
 * Fetches all chapters from a Ranobes novel using the TOC page's JSON data
 */
export async function fetchAllRanobesChapters(
    tocUrl: string,
    proxyFn: (url: string) => Promise<Response>
): Promise<TOCItem[]> {
    const allChapters: TOCItem[] = [];

    try {
        // Fetch the first page to get metadata
        console.log(`[Ranobes Parser] Fetching TOC page: ${tocUrl}`);
        const firstPageResponse = await proxyFn(tocUrl);

        if (!firstPageResponse.ok) {
            console.error(`[Ranobes Parser] Failed to fetch TOC: ${firstPageResponse.status}`);
            return [];
        }

        const firstPageHtml = await firstPageResponse.text();
        const firstPageData = extractRanobesData(firstPageHtml);

        if (!firstPageData) {
            console.warn('[Ranobes Parser] Could not extract data from first page');
            return [];
        }

        console.log(`[Ranobes Parser] Found ${firstPageData.count_all} total chapters across ${firstPageData.pages_count} pages`);

        // Add chapters from first page
        allChapters.push(...convertRanobesChapters(firstPageData.chapters));

        // Fetch remaining pages if needed
        if (firstPageData.pages_count > 1) {
            for (let page = 2; page <= firstPageData.pages_count; page++) {
                const pageUrl = `${tocUrl}page/${page}/`;
                console.log(`[Ranobes Parser] Fetching page ${page}/${firstPageData.pages_count}: ${pageUrl}`);

                const pageResponse = await proxyFn(pageUrl);
                if (!pageResponse.ok) {
                    console.warn(`[Ranobes Parser] Failed to fetch page ${page}: ${pageResponse.status}`);
                    continue;
                }

                const pageHtml = await pageResponse.text();
                const pageData = extractRanobesData(pageHtml);

                if (pageData && pageData.chapters.length > 0) {
                    allChapters.push(...convertRanobesChapters(pageData.chapters));
                    console.log(`[Ranobes Parser] Added ${pageData.chapters.length} chapters from page ${page}`);
                }
            }
        }

        // Sort by chapter number and deduplicate
        allChapters.sort((a, b) => a.number - b.number);
        const uniqueChapters = allChapters.filter((chapter, index, self) =>
            index === self.findIndex((c) => c.number === chapter.number)
        );

        console.log(`[Ranobes Parser] Total chapters collected: ${uniqueChapters.length}`);
        return uniqueChapters;

    } catch (error) {
        console.error('[Ranobes Parser] Error fetching chapters:', error);
        return [];
    }
}

/**
 * Converts Ranobes chapter data to TOCItem format
 */
function convertRanobesChapters(chapters: RanobesChapterData[]): TOCItem[] {
    return chapters.map(chapter => {
        // Extract chapter number from title
        const numMatch = chapter.title.match(/Chapter (\d+)/i);
        const number = numMatch ? parseInt(numMatch[1]) : 0;

        return {
            number: number,
            title: chapter.title,
            url: chapter.link
        };
    }).filter(ch => ch.number > 0);
}

/**
 * Fallback: Parse chapters from HTML if __DATA__ is not available
 */
export function parseChaptersFromHTML(doc: Document): TOCItem[] {
    const chapterLinks = doc.querySelectorAll('.chapters-scroll-list li a');
    if (chapterLinks.length === 0) {
        return [];
    }

    return Array.from(chapterLinks).map((link) => {
        const titleSpan = link.querySelector('.title');
        const titleText = titleSpan?.textContent?.trim() || "";
        const href = link.getAttribute('href') || '';

        const numMatch = titleText.match(/Chapter (\d+)/i);
        const number = numMatch ? parseInt(numMatch[1]) : 0;

        return {
            number: number,
            title: titleText,
            url: href
        };
    }).filter(ch => ch.number > 0);
}
