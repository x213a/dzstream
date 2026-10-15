import type { Category, Channel } from '@/types';

/**
 * Catalogue initial de DzStream.
 *
 * Sert de contenu par défaut tant que Firestore n'est pas configuré (mode démo), et
 * de jeu de données à importer depuis le panneau d'administration (« Importer le
 * catalogue initial »).
 *
 * Flux vérifiés le 14/10/2026. Les flux TV publics changent souvent : les chaînes
 * sans flux connu sont livrées inactives (`isActive: false`), invisibles du public,
 * en attendant qu'un admin renseigne leur URL depuis l'application.
 */

export const SEED_CATEGORIES: Category[] = [
  { id: 'general', type: 'tv', order: 0, name: { fr: 'Généraliste', ar: 'عامة', en: 'General' } },
  { id: 'news', type: 'both', order: 1, name: { fr: 'Information', ar: 'أخبار', en: 'News' } },
  { id: 'entertainment', type: 'tv', order: 2, name: { fr: 'Divertissement', ar: 'ترفيه', en: 'Entertainment' } },
  { id: 'sport', type: 'both', order: 3, name: { fr: 'Sport', ar: 'رياضة', en: 'Sports' } },
  { id: 'music', type: 'radio', order: 4, name: { fr: 'Musique', ar: 'موسيقى', en: 'Music' } },
  { id: 'religion', type: 'both', order: 5, name: { fr: 'Religion', ar: 'دين', en: 'Religion' } },
  { id: 'radio-national', type: 'radio', order: 6, name: { fr: 'Radios nationales', ar: 'إذاعات وطنية', en: 'National radio' } },
  { id: 'radio-regional', type: 'radio', order: 7, name: { fr: 'Radios régionales', ar: 'إذاعات جهوية', en: 'Regional radio' } },
];

const RA_LOGO = 'https://my.radioalgerie.dz/sites/default/files/styles/d02/public';

const tv = (c: Omit<Channel, 'type'>): Channel => ({ ...c, type: 'tv' });
const radio = (c: Omit<Channel, 'type'>): Channel => ({ ...c, type: 'radio' });

export const SEED_CHANNELS: Channel[] = [
  // ——— Télévision (EPTV & privées) ———
  tv({
    id: 'eptv-tv1', name: 'TV1', nameAr: 'التلفزيون الجزائري', categoryId: 'general', order: 0,
    streamUrl: '', isActive: false,
    description: { fr: 'Chaîne généraliste historique de la télévision publique algérienne.', ar: 'القناة العامة التاريخية للتلفزيون الجزائري.', en: 'The historic general channel of Algerian public television.' },
  }),
  tv({
    id: 'eptv-tv2', name: 'Canal Algérie', nameAr: 'كنال ألجيري', categoryId: 'general', order: 1,
    streamUrl: 'http://185.9.2.18/chid_347/index.m3u8', isActive: true,
    logoUrl: 'https://i.imgur.com/VEb631f.png',
    description: { fr: 'La chaîne francophone de la télévision publique (TV2).', ar: 'القناة الناطقة بالفرنسية للتلفزيون العمومي.', en: 'The French-language public channel (TV2).' },
  }),
  tv({
    id: 'eptv-tv3', name: 'TV3', nameAr: 'الجزائرية الثالثة', categoryId: 'news', order: 2,
    streamUrl: '', isActive: false,
    description: { fr: "Chaîne d'information en continu en langue arabe.", ar: 'قناة إخبارية باللغة العربية.', en: 'Arabic-language news channel.' },
  }),
  tv({
    id: 'eptv-tv4', name: 'TV4 Tamazight', nameAr: 'الأمازيغية', categoryId: 'general', order: 3,
    streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/BZvdjBN.png',
    description: { fr: 'La chaîne publique en tamazight.', ar: 'القناة العمومية الناطقة بالأمازيغية.', en: 'Public channel in Tamazight.' },
  }),
  tv({
    id: 'eptv-tv5', name: 'TV5 Coran', nameAr: 'القرآن الكريم', categoryId: 'religion', order: 4,
    streamUrl: '', isActive: false,
  }),
  tv({
    id: 'eptv-tv6', name: 'TV6', nameAr: 'الجزائرية السادسة', categoryId: 'entertainment', order: 5,
    streamUrl: '', isActive: false,
  }),
  tv({
    id: 'al24-news', name: 'AL24 News', nameAr: 'الجزائر 24', categoryId: 'news', order: 6,
    streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/vyVEXYL.png',
  }),
  tv({
    id: 'cna', name: 'CNA', nameAr: 'قناة شمال إفريقيا', categoryId: 'news', order: 7,
    streamUrl: 'https://live.creacast.com/cna/stream/playlist.m3u8', isActive: true,
    logoUrl: 'https://i.imgur.com/Ki3ySUE.png',
    description: { fr: 'Chaîne Nord-Africaine (diffusion non continue).', ar: 'قناة شمال إفريقيا (بث غير متواصل).', en: 'North African channel (not 24/7).' },
  }),
  tv({
    id: 'el-heddaf', name: 'El Heddaf TV', nameAr: 'الهداف', categoryId: 'sport', order: 8,
    streamUrl: 'https://live.elheddaftv.com:8081/elheddaftv/index.m3u8', isActive: false,
    logoUrl: 'https://i.imgur.com/cDkIDIA.png',
  }),
  tv({
    id: 'amou-yazid', name: 'Amou Yazid TV', nameAr: 'عمو يزيد', categoryId: 'entertainment', order: 9,
    streamUrl: 'http://mkstream.servehttp.com:1940/AmouYazid/ay1/playlist.m3u8', isActive: true,
    logoUrl: 'https://i.imgur.com/L8UPGPC.png',
    description: { fr: 'Programmes jeunesse.', ar: 'برامج الأطفال.', en: 'Kids programming.' },
  }),

  // ——— Radio Algérienne : chaînes nationales ———
  radio({
    id: 'ra-chaine1', name: 'Chaîne 1', nameAr: 'القناة الأولى', categoryId: 'radio-national', order: 0,
    streamUrl: 'https://webradio2.tda.dz:8001/Chaine1_64K.mp3', isActive: true,
    logoUrl: `${RA_LOGO}/2021-10/logo-ch1-en-bleu.png`,
  }),
  radio({
    id: 'ra-chaine2', name: 'Chaîne 2', nameAr: 'القناة الثانية', categoryId: 'radio-national', order: 1,
    streamUrl: 'https://webradio2.tda.dz:8001/Chaine2_64K.mp3', isActive: true,
    logoUrl: `${RA_LOGO}/2021-09/chaine2.png`,
  }),
  radio({
    id: 'ra-chaine3', name: 'Chaîne 3', nameAr: 'القناة الثالثة', categoryId: 'radio-national', order: 2,
    streamUrl: 'https://webradio2.tda.dz:8001/Chaine3_64K.mp3', isActive: true,
    logoUrl: `${RA_LOGO}/2021-10/ch-3.png`,
  }),
  radio({
    id: 'ra-jil-fm', name: 'Jil FM', nameAr: 'جيل أف أم', categoryId: 'music', order: 3,
    streamUrl: 'https://webradio1.tda.dz:8001/Jeunesse_64K.mp3', isActive: true,
    logoUrl: `${RA_LOGO}/2021-09/jilfm.png`,
  }),
  radio({
    id: 'ra-internationale', name: 'Algérie Internationale', nameAr: 'الجزائر الدولية', categoryId: 'news', order: 4,
    streamUrl: 'https://webradio3.tda.dz:8001/Internationale_64K.mp3', isActive: true,
    logoUrl: `${RA_LOGO}/2021-10/logo-rai-en-rouge.png`,
  }),
  radio({
    id: 'ra-culture', name: 'Radio Culture', nameAr: 'إذاعة الثقافة', categoryId: 'radio-national', order: 5,
    streamUrl: 'https://webradio2.tda.dz:8001/Culture_64K.mp3', isActive: true,
    logoUrl: `${RA_LOGO}/2021-09/culture.png`,
  }),
  radio({
    id: 'ra-coran', name: 'Radio Coran', nameAr: 'إذاعة القرآن الكريم', categoryId: 'religion', order: 6,
    streamUrl: 'https://webradio2.tda.dz:8001/Coran_64K.mp3', isActive: true,
    logoUrl: `${RA_LOGO}/2021-09/coran.png`,
  }),
  radio({
    id: 'ra-zamen', name: 'Zamen FM', nameAr: 'زمان أف أم', categoryId: 'music', order: 7,
    streamUrl: 'https://webradio2.tda.dz:8001/Zamen_64K.mp3', isActive: true,
    logoUrl: `${RA_LOGO}/2023-06/logo_zmen_fm.png`,
  }),

  // ——— Radio Algérienne : radios régionales ———
  radio({
    id: 'ra-el-bahdja', name: 'El Bahdja', nameAr: 'البهجة', categoryId: 'radio-regional', order: 10,
    streamUrl: 'https://webradio3.tda.dz:8001/ElBahdja_64K.mp3', isActive: true,
    logoUrl: `${RA_LOGO}/2021-10/Logo-Bahdja.png`,
  }),
  radio({
    id: 'ra-oran', name: 'Radio Oran', nameAr: 'إذاعة وهران', categoryId: 'radio-regional', order: 11,
    streamUrl: 'https://webradio2.tda.dz:8001/Oran_64K.mp3', isActive: true,
    logoUrl: `${RA_LOGO}/2021-10/wilaya---031.png`,
  }),
  radio({
    id: 'ra-constantine', name: 'Radio Constantine', nameAr: 'إذاعة قسنطينة', categoryId: 'radio-regional', order: 12,
    streamUrl: 'https://webradio3.tda.dz:8001/Constantine_64K.mp3', isActive: true,
    logoUrl: `${RA_LOGO}/2021-10/wilaya---025.png`,
  }),
  radio({
    id: 'ra-tizi-ouzou', name: 'Radio Tizi Ouzou', nameAr: 'إذاعة تيزي وزو', categoryId: 'radio-regional', order: 13,
    streamUrl: 'https://webradio2.tda.dz:8001/TiziOuzou_64K.mp3', isActive: true,
    logoUrl: `${RA_LOGO}/2021-10/wilaya---015.png`,
  }),
  radio({
    id: 'ra-bejaia', name: 'Radio Béjaïa', nameAr: 'إذاعة بجاية', categoryId: 'radio-regional', order: 14,
    streamUrl: 'https://webradio1.tda.dz:8001/Bejaia_64K.mp3', isActive: true,
    logoUrl: `${RA_LOGO}/2021-10/wilaya---006.png`,
  }),
  radio({
    id: 'ra-tlemcen', name: 'Radio Tlemcen', nameAr: 'إذاعة تلمسان', categoryId: 'radio-regional', order: 15,
    streamUrl: 'https://webradio1.tda.dz:8001/Tlemcen_64K.mp3', isActive: true,
    logoUrl: `${RA_LOGO}/2021-10/wilaya---013.png`,
  }),
  radio({
    id: 'ra-ouargla', name: 'Radio Ouargla', nameAr: 'إذاعة ورقلة', categoryId: 'radio-regional', order: 16,
    streamUrl: 'https://webradio1.tda.dz:8001/Ouargla_64K.mp3', isActive: true,
    logoUrl: `${RA_LOGO}/2021-10/wilaya---030.png`,
  }),
  radio({
    id: 'ra-tamanrasset', name: 'Radio Tamanrasset', nameAr: 'إذاعة تمنراست', categoryId: 'radio-regional', order: 17,
    streamUrl: 'https://webradio1.tda.dz:8001/Tamanrasset_64K.mp3', isActive: true,
    logoUrl: `${RA_LOGO}/2021-10/wilaya---011.png`,
  }),
];
