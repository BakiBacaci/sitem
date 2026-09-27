import type { NoteInput } from './validate';

export type Note = NoteInput & { id: string };
export type Guestbook = { list(limit?: number): Promise<Note[]>; add(n: NoteInput): Promise<void> };

const env = import.meta.env;

/**
 * Duvar istemcisi. Firebase yapılandırması yoksa ya da başlatılamazsa `null` döner;
 * arayüz bu durumda "şu an kapalı" gösterir. Firebase yalnızca burada, ihtiyaç anında yüklenir.
 * Testler `window.__guestbookMock` ile sahte bir istemci verebilir.
 */
export async function getGuestbook(): Promise<Guestbook | null> {
  const mock = (globalThis as { __guestbookMock?: Guestbook }).__guestbookMock;
  if (mock) return mock;
  if (!env.PUBLIC_FIREBASE_API_KEY || !env.PUBLIC_FIREBASE_PROJECT_ID) return null;

  try {
    const { initializeApp, getApps } = await import('firebase/app');
    const fs = await import('firebase/firestore');
    const app = getApps()[0] ?? initializeApp({
      apiKey: env.PUBLIC_FIREBASE_API_KEY,
      authDomain: env.PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: env.PUBLIC_FIREBASE_PROJECT_ID,
      appId: env.PUBLIC_FIREBASE_APP_ID,
    });
    if (env.PUBLIC_RECAPTCHA_KEY) {
      const { initializeAppCheck, ReCaptchaV3Provider } = await import('firebase/app-check');
      try { initializeAppCheck(app, { provider: new ReCaptchaV3Provider(env.PUBLIC_RECAPTCHA_KEY), isTokenAutoRefreshEnabled: true }); } catch { /* zaten başlatılmış */ }
    }
    const db = fs.getFirestore(app);
    const notes = fs.collection(db, 'notes');
    return {
      async list(limit = 120) {
        const snap = await fs.getDocs(fs.query(notes, fs.orderBy('createdAt', 'desc'), fs.limit(limit)));
        return snap.docs.map((d) => ({ id: d.id, ...(d.data() as NoteInput) }));
      },
      async add(n) {
        await fs.addDoc(notes, { text: n.text, sticker: n.sticker, color: n.color, x: n.x, y: n.y, createdAt: fs.serverTimestamp() });
      },
    };
  } catch {
    return null;
  }
}
