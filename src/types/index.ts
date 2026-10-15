export type MediaType = 'tv' | 'radio';

export type Language = 'fr' | 'ar' | 'en';

/** Texte traduit : le français est obligatoire (langue par défaut). */
export type LocalizedText = { fr: string } & Partial<Record<Exclude<Language, 'fr'>, string>>;

export interface Category {
  id: string;
  name: LocalizedText;
  /** Type de contenus que la catégorie regroupe. */
  type: MediaType | 'both';
  order: number;
}

export interface Channel {
  id: string;
  name: string;
  /** Nom en arabe, affiché quand l'interface est en arabe. */
  nameAr?: string;
  type: MediaType;
  /** HLS `.m3u8` pour la TV, flux MP3/AAC/HLS pour la radio. */
  streamUrl: string;
  logoUrl?: string;
  categoryId: string;
  description?: LocalizedText;
  order: number;
  /** Une chaîne inactive (flux absent ou hors service) n'est visible que des admins. */
  isActive: boolean;
  /** En-têtes HTTP éventuels exigés par le diffuseur (Referer, User-Agent…). */
  headers?: Record<string, string>;
  updatedAt?: number;
}

export type UserRole = 'user' | 'admin';

export interface HistoryEntry {
  channelId: string;
  at: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  favorites: string[];
  history: HistoryEntry[];
}
