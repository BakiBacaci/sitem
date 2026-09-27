<script lang="ts">
  import { onMount } from 'svelte';
  import { getGuestbook, type Guestbook, type Note } from '../../../lib/guestbook/client';
  import { canPost, COLORS, MAX_LEN, STICKERS, validateNote, type NoteError } from '../../../lib/guestbook/validate';

  const GLYPH: Record<(typeof STICKERS)[number], string> = { yildiz: '★', kalp: '♥', simsek: '⚡', gulen: '☺' };
  const ERRORS: Record<NoteError | 'hizli' | 'ag', string> = {
    bos: 'Boş not yapıştırılamaz.',
    uzun: `Not en fazla ${MAX_LEN} karakter olabilir.`,
    kufur: 'Bu notu duvara asamam. Başka bir şey yaz?',
    gecersiz: 'Bir şeyler ters gitti, tekrar dene.',
    hizli: 'Biraz yavaş: 30 saniyede bir not.',
    ag: 'Bağlantı sorunu, not gönderilemedi.',
  };
  const LAST_KEY = 'duvar-son';

  let gb = $state<Guestbook | null | undefined>(undefined);
  let notes = $state<Note[]>([]);
  let text = $state('');
  let sticker = $state<(typeof STICKERS)[number]>('yildiz');
  let color = $state<(typeof COLORS)[number]>('accent');
  let pos = $state({ x: 0.5, y: 0.5 });
  let error = $state('');
  let sending = $state(false);

  const count = $derived([...new Intl.Segmenter('tr', { granularity: 'grapheme' }).segment(text.trim())].length);

  function lastPost(): number | null { try { return Number(localStorage.getItem(LAST_KEY)) || null; } catch { return null; } }
  function markPost() { try { localStorage.setItem(LAST_KEY, String(Date.now())); } catch { /* gizli pencere */ } }

  onMount(async () => {
    gb = await getGuestbook();
    if (gb) { try { notes = await gb.list(); } catch { gb = null; } }
  });

  function pick(e: MouseEvent) {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    pos = { x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)) };
  }

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    error = '';
    if (!gb) return;
    const res = validateNote({ text, sticker, color, x: pos.x, y: pos.y });
    if (!res.ok) { error = ERRORS[res.error]; return; }
    if (!canPost(lastPost(), Date.now())) { error = ERRORS.hizli; return; }
    sending = true;
    try {
      await gb.add(res.note);
      markPost();
      text = '';
      notes = await gb.list();
    } catch {
      error = ERRORS.ag;
    } finally {
      sending = false;
    }
  }
</script>

<div class="gb" data-guestbook>
  {#if gb === undefined}
    <p class="state">duvar yükleniyor…</p>
  {:else if gb === null}
    <div class="closed"><span class="closed__tag">⚠ şu an kapalı</span><p>Ziyaretçi duvarı şu an kapalı. Birazdan tekrar uğra.</p></div>
  {:else}
    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
    <div class="wall" onclick={pick} title="Notunu yapıştırmak istediğin yere tıkla">
      {#each notes as n (n.id)}
        <div class="note note--{n.color}" data-note style={`left:${n.x * 100}%;top:${n.y * 100}%;--r:${(n.id.length * 37) % 14 - 7}deg`}>
          <span class="note__s" aria-hidden="true">{GLYPH[n.sticker as keyof typeof GLYPH] ?? '★'}</span>{n.text}
        </div>
      {/each}
      <span class="marker" style={`left:${pos.x * 100}%;top:${pos.y * 100}%`} aria-hidden="true">✚</span>
    </div>
    <form onsubmit={submit}>
      <label class="sr-only" for="gb-text">Notun</label>
      <input id="gb-text" type="text" bind:value={text} placeholder="duvara bir not bırak…" autocomplete="off" />
      <span class="count" class:over={count > MAX_LEN}>{count}/{MAX_LEN}</span>
      <div class="opts" role="group" aria-label="Sticker">
        {#each STICKERS as s}<button type="button" class:on={sticker === s} aria-pressed={sticker === s} aria-label={s} onclick={() => (sticker = s)}>{GLYPH[s]}</button>{/each}
      </div>
      <div class="opts" role="group" aria-label="Renk">
        {#each COLORS as c}<button type="button" class="sw sw--{c}" class:on={color === c} aria-pressed={color === c} aria-label={c} onclick={() => (color = c)}></button>{/each}
      </div>
      <button type="submit" class="go" disabled={sending}>Yapıştır</button>
    </form>
    {#if error}<p class="err" role="alert">{error}</p>{/if}
  {/if}
</div>

<style>
  .gb { height: 100%; display: grid; grid-template-rows: 1fr auto auto; background: var(--paper); }
  .state, .closed { padding: 24px; }
  .closed { display: grid; place-content: center; justify-items: center; gap: 10px; text-align: center; }
  .closed__tag { background: var(--accent); border: var(--border); box-shadow: 4px 4px 0 var(--ink); padding: 6px 12px; font-weight: 800; rotate: -4deg; }
  .wall { position: relative; overflow: hidden; min-height: 220px; cursor: crosshair; background: #d9cdb8 radial-gradient(rgba(11,11,11,.12) 1px, transparent 1px) 0 0 / 10px 10px; border-bottom: var(--border); }
  .note {
    position: absolute; translate: -50% -50%; rotate: var(--r); max-width: 180px; padding: 8px 10px 8px 26px;
    border: 2px solid var(--ink); box-shadow: 3px 3px 0 var(--ink); font-size: 12px; font-weight: 700; line-height: 1.3; word-break: break-word;
  }
  .note--accent { background: var(--accent); } .note--ink { background: var(--ink); color: var(--paper); } .note--white { background: var(--white); }
  .note__s { position: absolute; left: 7px; top: 6px; }
  .marker { position: absolute; translate: -50% -50%; color: var(--accent); font-size: 22px; -webkit-text-stroke: 1px var(--ink); pointer-events: none; }
  form { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; padding: 10px; }
  input { flex: 1 1 200px; border: var(--border); padding: 8px 10px; font: 14px var(--font-mono); background: var(--white); }
  .count { font-size: 12px; font-weight: 800; }
  .count.over { color: #c21; }
  .opts { display: flex; gap: 4px; }
  .opts button { width: 30px; height: 30px; border: 2px solid var(--ink); background: var(--white); cursor: pointer; font-size: 15px; }
  .opts button.on { outline: 3px solid var(--accent); outline-offset: 1px; }
  .sw--accent { background: var(--accent) !important; } .sw--ink { background: var(--ink) !important; } .sw--white { background: var(--white) !important; }
  .go { background: var(--accent); border: var(--border); box-shadow: 3px 3px 0 var(--ink); padding: 7px 14px; font: 800 14px var(--font-mono); cursor: pointer; }
  .err { margin: 0; padding: 0 10px 10px; font-weight: 800; color: #b3200e; }
</style>
