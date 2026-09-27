<script lang="ts">
  import type { AppId } from '../../../lib/os/appIds';
  let { api }: { api: { open: (id: AppId) => void } } = $props();
</script>

<article class="notes">
  <h1>merhaba 👋</h1>
  <p>BAKİ OS'a hoş geldin. Burası sitenin oyun alanı: denemeler, mini oyunlar ve birkaç sürpriz.</p>
  <ul>
    <li><button type="button" onclick={() => api.open('yilan')}>yilan.exe</button> rekorumu geçebilir misin?</li>
    <li><button type="button" onclick={() => api.open('terminal')}>terminal.exe</button> gizli komutları bul.</li>
    <li><button type="button" onclick={() => api.open('plip')}>plip.exe</button> slime oyunum.</li>
    <li><button type="button" onclick={() => api.open('blof')}>blof.exe</button> arkadaşlarınla oyna.</li>
  </ul>
  <p class="sig">— Baki</p>
</article>

<style>
  .notes { padding: 18px 20px; font-size: 14px; background: repeating-linear-gradient(var(--white) 0 27px, #e6e6df 27px 28px); min-height: 100%; }
  h1 { font-size: 1.6rem; margin-bottom: .5em; text-transform: none; }
  ul { padding-left: 1.1em; }
  li { margin: .35em 0; }
  button { background: var(--accent); border: 2px solid var(--ink); font: 800 13px var(--font-mono); padding: 0 6px; cursor: pointer; }
  .sig { font-weight: 800; }
</style>
