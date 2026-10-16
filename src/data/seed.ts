import type { Category, Channel } from '@/types';

/**
 * Catalogue initial de Mawave.
 *
 * Sert de contenu par défaut tant que Firestore n'est pas configuré (mode démo), et
 * de jeu de données à importer depuis le panneau d'administration (« Importer le
 * catalogue initial »).
 *
 * Flux vérifiés le 14/10/2026 (radios) et le 16/10/2026 (TV). Les flux TV publics changent souvent : les chaînes
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
  { id: 'kids', type: 'tv', order: 8, name: { fr: 'Jeunesse', ar: 'أطفال', en: 'Kids' } },
  { id: 'culture', type: 'tv', order: 9, name: { fr: 'Culture & savoir', ar: 'ثقافة ومعرفة', en: 'Culture & learning' } },
];

const RA_LOGO = 'https://my.radioalgerie.dz/sites/default/files/styles/d02/public';

const tv = (c: Omit<Channel, 'type'>): Channel => ({ ...c, type: 'tv' });
const radio = (c: Omit<Channel, 'type'>): Channel => ({ ...c, type: 'radio' });

export const SEED_CHANNELS: Channel[] = [
  // ——— Télévision publique (EPTV) ———
  tv({
    id: 'eptv-tv1', name: 'TV1', nameAr: 'التلفزيون الجزائري', categoryId: 'general', order: 0,
    streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/F0DOrxX.png',
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
    streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/EQTGCbm.png',
    description: { fr: "Chaîne d'information en continu en langue arabe.", ar: 'قناة إخبارية باللغة العربية.', en: 'Arabic-language news channel.' },
  }),
  tv({
    id: 'eptv-tv4', name: 'TV4 Tamazight', nameAr: 'الأمازيغية', categoryId: 'general', order: 3,
    streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/BZvdjBN.png',
    description: { fr: 'La chaîne publique en tamazight.', ar: 'القناة العمومية الناطقة بالأمازيغية.', en: 'Public channel in Tamazight.' },
  }),
  tv({
    id: 'eptv-tv5', name: 'TV5 Coran', nameAr: 'القرآن الكريم', categoryId: 'religion', order: 4,
    streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/zQr0SDM.png',
  }),
  tv({
    id: 'eptv-tv6', name: 'TV6', nameAr: 'الجزائرية السادسة', categoryId: 'entertainment', order: 5,
    streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/nu0CpJn.png',
  }),
  tv({
    id: 'eptv-tv7', name: 'TV7 El Maarifa', nameAr: 'الجزائرية السابعة', categoryId: 'culture', order: 6,
    streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/40rR4hD.png',
    description: { fr: 'Chaîne publique éducative.', ar: 'القناة العمومية التعليمية.', en: 'Public educational channel.' },
  }),
  tv({
    id: 'eptv-tv8', name: 'TV8 El Dhakira', nameAr: 'الجزائرية الثامنة', categoryId: 'culture', order: 7,
    streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/LlQcIWM.png',
    description: { fr: 'Chaîne publique de la mémoire et du documentaire.', ar: 'القناة العمومية للذاكرة والأفلام الوثائقية.', en: 'Public channel for history and documentaries.' },
  }),
  tv({
    id: 'eptv-tv9', name: 'TV9 El Barlamania', nameAr: 'الجزائرية البرلمانية', categoryId: 'news', order: 8,
    streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/fGO0WUa.png',
    description: { fr: 'La chaîne parlementaire.', ar: 'القناة البرلمانية.', en: 'The parliamentary channel.' },
  }),
  tv({
    id: 'al24-news', name: 'AL24 News', nameAr: 'الجزائر الدولية', categoryId: 'news', order: 9,
    // Flux du CDN de la chaîne ; seule la variante 240p est publiée.
    streamUrl: 'https://cdn.live.easybroadcast.io/abr_corp/66_al24_u4yga6h/corp/66_al24_u4yga6h_240p/chunks.m3u8', isActive: true,
    logoUrl: 'https://i.imgur.com/vyVEXYL.png',
    description: { fr: "Chaîne d'information internationale algérienne.", ar: 'القناة الإخبارية الدولية الجزائرية.', en: 'Algerian international news channel.' },
  }),

  // ——— Information ———
  tv({ id: 'ennahar-tv', name: 'Ennahar TV', nameAr: 'النهار تي في', categoryId: 'news', order: 10, streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/C0TCA1s.png' }),
  tv({ id: 'echorouk-news', name: 'Echorouk News', nameAr: 'الشروق الإخبارية', categoryId: 'news', order: 11, streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/TNtjYcw.png' }),
  tv({ id: 'elikhbaria-tv', name: 'Elikhbaria TV', nameAr: 'الإخبارية', categoryId: 'news', order: 12, streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/DwARo71.png' }),
  tv({ id: 'el-djazair-n1', name: 'El Djazaïr N1', categoryId: 'news', order: 13, streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/jnuu5eN.png' }),
  tv({ id: 'dz-news-tv', name: 'Dz News TV', categoryId: 'news', order: 14, streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/TqVXtbj.jpg' }),
  tv({ id: 'aures-tv', name: 'Aures TV', nameAr: 'أوراس تيفي', categoryId: 'news', order: 15, streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/8ARqynB.png' }),
  tv({ id: 'setif-news', name: 'Sétif News', categoryId: 'news', order: 16, streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/vjEIEsW.jpeg' }),
  tv({ id: 'alaqaria-tv', name: 'Alaqaria TV', nameAr: 'العقارية', categoryId: 'news', order: 17, streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/8Z6zyqU.png' }),
  tv({ id: 'eliktisadia-tv', name: 'Eliktisadia El Oula', nameAr: 'الاقتصادية الأولى', categoryId: 'news', order: 18, streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/j7mg4Y5.png' }),
  tv({ id: 'cna', name: 'CNA', nameAr: 'قناة شمال إفريقيا', categoryId: 'news', order: 19,
    streamUrl: 'https://live.creacast.com/cna/stream/playlist.m3u8', isActive: true,
    logoUrl: 'https://i.imgur.com/Ki3ySUE.png',
    description: { fr: 'Chaîne Nord-Africaine (diffusion non continue).', ar: 'قناة شمال إفريقيا (بث غير متواصل).', en: 'North African channel (not 24/7).' },
  }),

  // ——— Généralistes privées ———
  tv({ id: 'echorouk-tv', name: 'Echorouk TV', nameAr: 'الشروق', categoryId: 'general', order: 20, streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/33rf7KV.png' }),
  tv({ id: 'el-bilad-tv', name: 'El Bilad TV', nameAr: 'البلاد تيفي', categoryId: 'general', order: 21, streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/7c1JjCd.png' }),
  tv({ id: 'el-hayat-tv', name: 'El Hayat TV', nameAr: 'قناة الحياة', categoryId: 'general', order: 22, streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/C0s1I8w.png' }),
  tv({
    id: 'elwatania-tv', name: 'Elwatania TV', nameAr: 'الوطنية', categoryId: 'general', order: 23,
    // Serveur du lecteur officiel (elwataniatv.dz/live) : injoignable lors de la vérification, à tester depuis l'Algérie.
    streamUrl: 'https://itserverlab.2bd.net:5443/WebRTCApp/streams/stream.m3u8', isActive: false,
    logoUrl: 'https://i.imgur.com/NKR8WFq.png',
  }),
  tv({ id: 'el-hidhab-tv', name: 'El Hidhab TV', nameAr: 'الهضاب تيفي', categoryId: 'general', order: 24, streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/MEZQ9tW.png' }),
  tv({ id: 'el-fadjer-tv', name: 'El Fadjer TV', nameAr: 'قناة الفجر', categoryId: 'general', order: 25, streamUrl: '', isActive: false, logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/El_Fadjer_TV.png/960px-El_Fadjer_TV.png' }),
  tv({ id: 'bahia-tv', name: 'Bahia TV', nameAr: 'قناة الباهية', categoryId: 'general', order: 26, streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/RvfNxIw.png' }),
  tv({ id: 'essalam-tv', name: 'Essalam TV', nameAr: 'السلام تيفي', categoryId: 'general', order: 27, streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/wzU41aN.png' }),
  tv({ id: 'jeel-dz-tv', name: 'Jeel DZ TV', nameAr: 'جيل دي زاد', categoryId: 'general', order: 28, streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/VuJVOpt.png' }),
  tv({ id: 'alsir-tv', name: 'Alsir TV', categoryId: 'general', order: 29, streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/4GDhRFD.png' }),
  tv({ id: 'channel-0225', name: 'Channel 0225 TV', categoryId: 'general', order: 30, streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/LreWENk.png' }),
  tv({ id: 'fairs-tv', name: 'Fairs TV', categoryId: 'general', order: 31, streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/PFOVj2b.png' }),

  // ——— Divertissement, cuisine ———
  tv({
    id: 'chebab-tv', name: 'Chebab TV', categoryId: 'entertainment', order: 32,
    // Flux publié sur chebabtv.dz : injoignable lors de la vérification, à tester depuis l'Algérie.
    streamUrl: 'http://80.246.15.146:9091/mediaserver/hls/chebabtv.m3u8', isActive: false,
    logoUrl: 'https://i.imgur.com/yp2clII.png',
  }),
  tv({ id: 'one-tv', name: 'One TV', categoryId: 'entertainment', order: 33, streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/wluVKm3.png' }),
  tv({ id: 'samira-tv', name: 'Samira TV', nameAr: 'سميرة تي في', categoryId: 'entertainment', order: 34, streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/XZzINfq.png',
    description: { fr: 'Cuisine et art de vivre.', ar: 'الطبخ وفن العيش.', en: 'Cooking and lifestyle.' } }),
  tv({ id: 'zahra-tv', name: 'Zahra TV', categoryId: 'entertainment', order: 35, streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/mzCrpqj.png',
    description: { fr: 'Cuisine.', ar: 'الطبخ.', en: 'Cooking.' } }),

  // ——— Sport ———
  tv({
    id: 'el-heddaf', name: 'El Heddaf TV', nameAr: 'الهداف', categoryId: 'sport', order: 36,
    streamUrl: 'https://live.elheddaftv.com:8081/elheddaftv/index.m3u8', isActive: false,
    logoUrl: 'https://i.imgur.com/cDkIDIA.png',
  }),
  tv({ id: 'sport-plus-hd', name: 'Sport Plus HD', categoryId: 'sport', order: 37, streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/XiR1r58.png' }),
  tv({ id: 'dzair-tube-tv', name: 'Dzair Tube TV', categoryId: 'sport', order: 38, streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/jzQfLX5.jpg' }),

  // ——— Jeunesse ———
  tv({
    id: 'amou-yazid', name: 'Amou Yazid TV', nameAr: 'عمو يزيد', categoryId: 'kids', order: 39,
    streamUrl: 'http://mkstream.servehttp.com:1940/AmouYazid/ay1/playlist.m3u8', isActive: true,
    logoUrl: 'https://i.imgur.com/L8UPGPC.png',
    description: { fr: 'Programmes jeunesse.', ar: 'برامج الأطفال.', en: 'Kids programming.' },
  }),
  tv({ id: '4kids-tv', name: '4Kids TV', categoryId: 'kids', order: 40, streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/507piHp.png' }),

  // ——— Culture & savoir ———
  tv({ id: 'sahra-tv', name: 'Sahra TV', nameAr: 'قناة صحراء الجزائرية', categoryId: 'culture', order: 41, streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/l1CIbx9.png' }),
  tv({ id: 'al-anis-tv', name: 'Al Anis TV', nameAr: 'قناة الأنيس', categoryId: 'culture', order: 42, streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/yedYbpa.png' }),
  tv({ id: 'webtv-univ-bejaia', name: 'WebTV Université de Béjaïa', categoryId: 'culture', order: 43, streamUrl: '', isActive: false, logoUrl: 'https://i.imgur.com/8kiUuTU.png' }),

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
