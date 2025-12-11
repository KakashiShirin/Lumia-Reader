
import ePub, { Book, NavItem } from 'epubjs';
import { Chapter, TOCItem, Novel } from '../types';

export class LocalReaderService {
    private registry: Map<string, Book> = new Map();
    private activeBookId: string | null = null;

    async registerBook(data: ArrayBuffer | string, customId?: string): Promise<Novel> {
        return this.loadBook(data, customId);
    }

    async loadBook(data: ArrayBuffer | string, customId?: string): Promise<Novel> {
        const book = ePub(data);
        await book.ready;

        const metadata = await book.loaded.metadata;
        const coverUrl = await book.coverUrl();

        // Generate a unique ID based on title/author or random, or use custom
        const id = customId || `local-${Date.now()}`;

        this.registry.set(id, book);
        this.activeBookId = id;

        return {
            id,
            title: metadata.title,
            author: metadata.creator,
            coverUrl: coverUrl || '',
            description: metadata.description || 'Local EPUB file',
            tags: ['Local', 'EPUB'],
            status: 'Completed', // Assume local books are complete or unknown
            totalChapters: 0, // Will be updated after TOC load
            rating: 0,
            lastReadChapter: 0,
            readChapters: [],
            bookmarkedChapters: []
        } as Novel;
    }

    setActiveBook(id: string) {
        if (this.registry.has(id)) {
            this.activeBookId = id;
        } else {
            throw new Error(`Book with ID ${id} not found in registry`);
        }
    }

    getActiveBook(): Book | null {
        if (!this.activeBookId) return null;
        return this.registry.get(this.activeBookId) || null;
    }

    async getTOC(bookId?: string): Promise<TOCItem[]> {
        const book = bookId ? this.registry.get(bookId) : this.getActiveBook();
        if (!book) return [];

        const navigation = await book.loaded.navigation;
        const toc: TOCItem[] = [];

        const processNav = (items: NavItem[], level = 0) => {
            items.forEach((item, index) => {
                toc.push({
                    number: toc.length + 1,
                    title: item.label.trim(),
                    url: item.href, // This is the internal href in the EPUB
                    id: item.id
                });
                if (item.subitems && item.subitems.length > 0) {
                    processNav(item.subitems, level + 1);
                }
            });
        };

        processNav(navigation.toc);
        return toc;
    }

    async getChapter(href: string, bookId?: string): Promise<Chapter> {
        const book = bookId ? this.registry.get(bookId) : this.getActiveBook();
        if (!book) throw new Error("Book not loaded");

        await book.ready;

        // Try to resolve the href using the spine to get the canonical internal path
        let targetHref = href;
        const section = book.spine.get(href);
        if (section) {
            targetHref = section.href;
        }

        let doc: Document;
        try {
            // book.load automatically handles resolving relative paths if we pass the canonical href from spine
            doc = await book.load(targetHref) as Document;
        } catch (e: any) {
            console.warn(`Initial load failed for ${targetHref}. Trying fuzzy match...`, e);

            // Fuzzy Match Strategy: Find any file in the archive that ends with the requested filename
            try {
                // Access internal zip files (epubjs uses JSZip)
                const archive = (book as any).archive;
                if (archive && archive.zip && archive.zip.files) {
                    const files = Object.keys(archive.zip.files);
                    // Extract basename of the missing file (e.g., 'p01.xhtml')
                    const targetBasename = targetHref.split('/').pop()!;

                    // Find a file ending with /p01.xhtml or equal to p01.xhtml
                    const match = files.find(f => f.endsWith('/' + targetBasename) || f === targetBasename);

                    if (match) {
                        console.log(`Fuzzy matched ${targetHref} to ${match}. Reading directly from archive.`);
                        // BYPASS book.load() which causes path issues (double OPS/OPS)
                        // Read directly from the zip file
                        const contentStr = await archive.zip.file(match).async('string');
                        const parser = new DOMParser();
                        doc = parser.parseFromString(contentStr, "application/xhtml+xml") as Document;
                    } else {
                        throw new Error(`No fuzzy match found for ${targetBasename}`);
                    }
                } else {
                    throw new Error("Could not access archive for fuzzy matching");
                }
            } catch (fuzzyErr) {
                console.error("Fuzzy load failed", fuzzyErr);
                throw new Error(`Failed to load chapter ${href}: ${(e as Error).message}`);
            }
        }

        // Extract text content
        let content: string[] = [];
        if (doc && doc.body) {
            // Strategy 1: Select common block elements
            const paragraphs = doc.querySelectorAll('p, div.paragraph, div.text');

            if (paragraphs.length > 0) {
                content = Array.from(paragraphs)
                    .map(p => p.textContent?.trim() || '')
                    .filter(t => t.length > 0);
            }

            // Strategy 2: If insufficient structural content, use text Content splitting
            // This fallback catches cases where p tags are missing or text is direct in body/divs
            if (content.length < 5) {
                const rawLines = (doc.body.innerText || doc.body.textContent || "")
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0);

                // If strategy 1 gave very little but raw text gives more, prefer raw text
                if (rawLines.length > content.length) {
                    content = rawLines;
                }
            }
        } else {
            content = ["(No text content found in this chapter)"];
        }

        // Find chapter title from TOC if possible, or doc title
        const title = doc?.title || "Chapter";

        return {
            id: href,
            number: 0,
            title: title,
            content: content,
            comments: []
        };
    }

    // Helper to get chapter by index from TOC
    async getChapterByIndex(index: number, toc: TOCItem[], bookId?: string): Promise<Chapter> {
        if (index < 1 || index > toc.length) throw new Error("Chapter index out of bounds");
        const item = toc[index - 1];
        const chapter = await this.getChapter(item.url!, bookId);
        chapter.number = item.number;
        chapter.title = item.title;
        return chapter;
    }
}

export const localReader = new LocalReaderService();
