import type { Channel } from '@/types';

/** Minuscules sans accents : « Béjaïa » se trouve en tapant « bejaia ». */
export const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

/** Recherche sur le nom latin et le nom arabe ; une requête vide accepte tout. */
export function matchesQuery(channel: Pick<Channel, 'name' | 'nameAr'>, query: string) {
  const q = query.trim();
  if (!q) return true;
  return normalize(channel.name).includes(normalize(q)) || (channel.nameAr ?? '').includes(q);
}
