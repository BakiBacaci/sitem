<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { getGuestbook, type Guestbook, type Note } from '../../lib/guestbook/client';
  import { canPost, MAX_LEN, validateNote, type NoteError } from '../../lib/guestbook/validate';
  import Editor from './Editor.svelte';
  import PostIt from './PostIt.svelte';
  import { PAPER_COLORS } from './papers';

  let { onclose }: { onclose: () => void } = $props();

  const ERRORS: Record<NoteError | 'hizli' | 'ag' | 'red', string> = {
    bos: 'Boş kağıt yapıştırılamaz. Bir şey yaz ya da çiz.',
    uzun: `Yazı en fazla ${MAX_LEN} karakter olabilir.`,
    kufur: 'Bu kağıdı panoya asamam. Başka bir şey yaz?',
    gecersiz: 'Çizim çok büyük ya da bozuk, biraz sadeleştir.',
    hizli: 'Biraz yavaş: 30 saniyede bir kağıt.',
    ag: 'Bağlantı sorunu, kağıt yapıştırılamadı.',
    red: 'Pano bu kağıdı kabul etmedi (çok uzun olabilir).',
  };
  const LAST_KEY = 'pano-son';

  let gb = $state<Guestbook | null | undefined>(undefined);
  let notes = $state<Note[]>([]);
  let mode = $state<'view' | 'edit' | 'place'>('view');
  let pending: { text: string; drawing: string; paper: string } | null = null;
  let error = $state('');
  let status = $state('');
  let freshId = $state<string | null>(null);
  let closeBtn: HTMLButtonElement;

  const lastPost = () => { try { return Number(localStorage.getItem(LAST_KEY)) || null; } catch { return null; } };
  const markPost = () => { try { localStorage.setItem(LAST_KEY, String(Date.now())); } catch { /* gizli pencere */ } };

  async function refresh() { if (gb) notes = await gb.list(); }

  onMount(() => {
    closeBtn?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (mode !== 'view') { mode = 'view'; error = ''; } else onclose();
    };
    window.addEventListener('keydown', onKey);
    (async () => {
      gb = await getGuestbook();
      try { await refresh(); } catch { gb = null; }
    })();
    return () => window.removeEventListener('keydown', onKey);
  });

  function submit(n: { text: string; drawing: string; paper: string }) {
    error = '';
    const res = validateNote({ ...n, x: 0.5, y: 0.5 });
    if (!res.ok) { error = ERRORS[res.error]; return; }
    if (!canPost(lastPost(), Date.now())) { error = ERRORS.hizli; return; }
    pending = { text: res.note.text, drawing: res.note.drawing, paper: res.note.paper };
    mode = 'place';
  }

  async function place(e: MouseEvent) {
    if (mode !== 'place' || !pending || !gb) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = Math.min(0.95, Math.max(0.05, (e.clientX - r.left) / r.width));
    const y = Math.min(0.92, Math.max(0.06, (e.clientY - r.top) / r.height));
    const note = { ...pending, x, y };
    mode = 'view';
    try {
      await gb.add(note);
      markPost();
      pending = null;
    } catch (err) {
      status = String((err as { code?: string })?.code ?? '').includes('permission') ? ERRORS.red : ERRORS.ag;
      return;
    }
    try {
      await refresh();
      freshId = notes[0]?.id ?? null;
      status = 'Yapıştırıldı! 📌';
    } catch {
      status = 'Yapıştırıldı, ama pano yenilenemedi. Sayfayı yenileyince görünür.';
    }
    await tick();
  }
</script>

<div class="overlay" role="dialog" aria-modal="true" aria-label="Post-it panosu" data-lenis-prevent>
  <header class="top">
    <h2>Post-it Panosu</h2>
    <p class="status" role="status">{status}</p>
    <button type="button" class="close" bind:this={closeBtn} onclick={onclose}>✕ Kapat</button>
  </header>

  <div class="frame">
    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
    <div class="cork" class:placing={mode === 'place'} data-board-surface onclick={place}>
      {#if gb === undefined}
        <p class="center">pano yükleniyor…</p>
      {:else if gb === null}
        <div class="center closed"><span class="tag">⚠ şu an kapalı</span><p>Pano şu an kapalı. Birazdan tekrar uğra.</p></div>
      {:else}
        {#each [...notes].reverse() as n (n.id)}
          <div class="slot" data-note style={`left:${n.x * 100}%;top:${n.y * 100}%`}>
            <PostIt id={n.id} text={n.text} drawing={n.drawing} paper={n.paper} fresh={n.id === freshId} />
          </div>
        {/each}
        {#if notes.length === 0 && mode === 'view'}<p class="center empty">Pano boş. İlk kağıdı sen as!</p>{/if}
        {#if mode === 'place'}<p class="hint">Panoda bir yere tıkla 📌</p>{/if}
      {/if}
    </div>

    {#if gb}
      <button type="button" class="stack" aria-label="Kağıt al" onclick={() => { mode = 'edit'; error = ''; status = ''; }} disabled={mode !== 'view'}>
        <span style={`--c:${PAPER_COLORS.pembe};--r:6deg`}></span>
        <span style={`--c:${PAPER_COLORS.mavi};--r:-4deg`}></span>
        <span style={`--c:${PAPER_COLORS.sari};--r:1deg`}>kağıt al</span>
      </button>
    {/if}
  </div>

  {#if mode === 'edit'}
    <div class="editor-wrap">
      <Editor {error} onsubmit={submit} oncancel={() => { mode = 'view'; error = ''; }} />
    </div>
  {/if}
</div>

<style>
  .overlay {
    position: fixed; inset: 0; z-index: 80; display: grid; grid-template-rows: auto 1fr;
    background: #141210; color: var(--paper); animation: fade .25s ease-out;
  }
  .top { display: flex; align-items: center; gap: 16px; padding: 14px var(--gutter); }
  .top h2 { font-size: clamp(1.2rem, 3vw, 2rem); color: var(--accent); }
  .status { flex: 1; margin: 0; font-weight: 800; }
  .close { background: var(--paper); color: var(--ink); border: var(--border); box-shadow: 3px 3px 0 var(--accent); font: 800 14px var(--font-mono); padding: 6px 12px; cursor: pointer; }
  .frame { position: relative; margin: 0 var(--gutter) var(--gutter); min-height: 0; }
  .cork {
    position: absolute; inset: 0; overflow: hidden;
    border: 12px solid #7a4a25; outline: 3px solid var(--ink); box-shadow: inset 0 0 40px rgba(0, 0, 0, .35);
    background-color: #c89b62;
    background-image: radial-gradient(rgba(90, 50, 20, .35) 1.2px, transparent 1.4px), radial-gradient(rgba(255, 230, 190, .25) 1px, transparent 1.2px);
    background-size: 9px 9px, 13px 13px;
    background-position: 0 0, 4px 5px;
  }
  .cork.placing { cursor: copy; outline-color: var(--accent); }
  .slot { position: absolute; translate: -50% -50%; }
  .center { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; gap: 10px; text-align: center; color: var(--ink); font-weight: 800; margin: 0; }
  .tag { background: var(--accent); border: var(--border); box-shadow: 4px 4px 0 var(--ink); padding: 6px 12px; rotate: -4deg; }
  .empty { font-size: 1.1rem; }
  .hint { position: absolute; left: 50%; top: 12px; translate: -50% 0; margin: 0; background: var(--ink); color: var(--accent); padding: 6px 12px; font-weight: 800; pointer-events: none; animation: bob 1s ease-in-out infinite alternate; }
  .stack { position: absolute; right: 22px; bottom: 22px; width: 96px; height: 96px; border: 0; background: none; cursor: pointer; padding: 0; }
  .stack:disabled { opacity: .5; cursor: default; }
  .stack span {
    position: absolute; inset: 0; background: var(--c); border: 2px solid var(--ink); rotate: var(--r);
    box-shadow: 2px 3px 0 var(--ink); display: grid; place-items: center; font: 800 13px var(--font-mono); color: var(--ink);
    transition: transform .3s var(--ease-spring);
  }
  .stack:hover:not(:disabled) span:last-child { transform: translate(-6px, -10px) rotate(-6deg); }
  .editor-wrap { position: fixed; inset: 0; display: grid; place-items: center; background: rgba(11, 11, 11, .45); z-index: 2; overflow: auto; padding: 16px; }
  @keyframes fade { from { opacity: 0; } }
  @keyframes bob { to { translate: -50% 4px; } }
  @media (max-width: 767px) { .top h2 { display: none; } .stack { right: 12px; bottom: 12px; width: 76px; height: 76px; } }
  @media (prefers-reduced-motion: reduce) { .overlay, .hint { animation: none; } }
</style>
