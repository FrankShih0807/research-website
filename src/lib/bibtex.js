import { readFile } from 'node:fs/promises';
import bibtexParse from 'bibtex-parse-js';

function mapType(entryType) {
  const t = (entryType || '').toLowerCase();
  if (t === 'article') return 'journal';
  if (t === 'inproceedings' || t === 'conference' || t === 'proceedings') return 'conference';
  if (t === 'misc' || t === 'unpublished') return 'preprint';
  return 'other';
}

export async function loadPublications(bibUrl) {
  try {
    const fileUrl = bibUrl instanceof URL ? bibUrl : new URL(bibUrl, import.meta.url);
    const raw = await readFile(fileUrl, 'utf8');
    const entries = bibtexParse.toJSON(raw);
    const pubs = entries.map(({ citationKey, entryType, entryTags }) => {
      const authors = (entryTags?.author || '')
        .split(/\s+and\s+/i)
        .map((a) => a.trim())
        .filter(Boolean);
      const venue = entryTags?.journal || entryTags?.booktitle || entryTags?.publisher || '';
      const url = entryTags?.url || '';
      return {
        id: citationKey || `${entryType}-${Math.random().toString(36).slice(2)}`,
        title: entryTags?.title || '',
        authors,
        venue,
        year: Number(entryTags?.year) || null,
        type: mapType(entryType),
        doi: entryTags?.doi || '',
        url,
        arxiv: entryTags?.arxiv || entryTags?.eprint || '',
        pdf: entryTags?.pdf || (url.endsWith('.pdf') ? url : ''),
        code: entryTags?.code || '',
        data: entryTags?.data || '',
        slides: entryTags?.slides || '',
      };
    });
    return pubs.sort((a, b) => (b.year || 0) - (a.year || 0));
  } catch (err) {
    return [];
  }
}

