import type {MetadataRoute} from 'next';
import {URL_PUBLICA} from '@/lib/revision';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/registro', '/ingresar'].map((p) => ({url: `${URL_PUBLICA}${p}`, changeFrequency: 'weekly', priority: p === '/' ? 1 : 0.5}));
}
