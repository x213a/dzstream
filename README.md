# DzStream

Application mobile de streaming des chaînes TV et radios algériennes : thème sombre
inspiré de Molotov, accès invité, comptes optionnels, panneau d'administration.

**Stack** : Expo SDK 57 (React Native 0.86, TypeScript) · Expo Router · i18next
(FR par défaut, AR en RTL, EN) · Firebase Auth + Firestore · `react-native-video`
(HLS TV) · `expo-audio` (radio en arrière-plan, écran de verrouillage).

## Démarrer

```bash
npm install
cp .env.example .env          # facultatif : sans Firebase, l'app tourne en mode démo
npx expo run:android          # build de développement (Android Studio requis)
# ou, sans environnement natif local :
npx eas-cli@latest build --profile development --platform android
npm start                     # serveur Metro pour le dev client
```

Expo Go ne suffit pas : `react-native-video` est un module natif, il faut un build de développement.

## Structure

```
src/app/                  Routes (Expo Router)
  _layout.tsx             Polices, i18n, providers, pile racine
  (tabs)/                 Accueil · Chaînes · Favoris · Profil (+ mini-lecteur)
  channel/[id].tsx        Fiche immersive
  player/[id].tsx         Lecteur TV plein écran
  auth/                   Connexion / inscription (modales)
  admin/                  Panneau d'administration (accès admin uniquement)
src/components/           UI (cartes, carrousels, mini-lecteur, formulaires…)
src/providers/            Auth, Catalogue (temps réel), Lecteur
src/services/             Firebase, catalogue, profils, audio (expo-audio)
src/i18n/                 i18next + traductions fr / ar / en
src/theme/                Couleurs, typographie, espacements
src/data/seed.ts          Catalogue initial (flux publics vérifiés)
firestore.rules           Règles de sécurité
```

## Firebase

1. Créer un projet Firebase, activer **Authentication > E-mail/Mot de passe** et **Firestore**.
2. Renseigner `.env` avec la config de l'app Web du projet.
3. Déployer `firestore.rules`.
4. Créer un compte depuis l'app, puis dans Firestore passer `users/{uid}.role` à `"admin"`.
5. Dans l'app : Profil > Panneau d'administration > **Importer le catalogue initial**.

Modèle de données :

| Collection | Champs |
| --- | --- |
| `channels/{id}` | `name`, `nameAr`, `type` (`tv`/`radio`), `streamUrl`, `logoUrl`, `categoryId`, `description{fr,ar,en}`, `order`, `isActive`, `headers`, `updatedAt` |
| `categories/{id}` | `name{fr,ar,en}`, `type` (`tv`/`radio`/`both`), `order` |
| `users/{uid}` | `email`, `displayName`, `role` (`user`/`admin`), `favorites[]`, `history[{channelId, at}]` |

Le catalogue est écouté via `onSnapshot` : une URL de flux modifiée depuis le panneau
d'administration est appliquée immédiatement sur tous les appareils, sans redéploiement
(y compris pour une radio en cours d'écoute).

## Langues et RTL

Français par défaut ; le choix est mémorisé (AsyncStorage). Passer à l'arabe, ou en
sortir, relance l'app pour basculer le sens de lecture natif (`I18nManager`). Les styles
utilisent `start`/`end` pour se retourner automatiquement.

## Flux

Vérifiés le 14/10/2026 : 3 chaînes TV (Canal Algérie, CNA, Amou Yazid TV) et
17 radios de la Radio Algérienne. TV1, TV3, TV4, TV5, TV6, AL24 News et El Heddaf sont
livrées **inactives** faute de flux public stable : renseignez leur URL depuis le
panneau d'administration. Certains flux sont en HTTP clair, d'où
`usesCleartextTraffic` (Android) et `NSAllowsArbitraryLoads` (iOS) dans `app.json`.
Assurez-vous de disposer des droits de diffusion des flux utilisés.

## Points d'attention

- Radio : `expo-audio` (compatible New Architecture). Un lecteur unique est conservé pour la
  session ; la reprise après pause recharge le flux pour revenir au direct. Tout est isolé
  dans `src/services/audio/radioPlayer.ts`.
- Scripts : `npm run typecheck`, `npm run lint`, `npm run doctor`.
