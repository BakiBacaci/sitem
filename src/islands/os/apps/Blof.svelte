<script lang="ts">
  let playing = $state(false);
  const URL = 'https://blof-64f01.web.app';
</script>

{#if playing}
  <iframe src={URL} title="Blöf" allow="clipboard-write"></iframe>
{:else}
  <div class="blof">
    <p class="big">BLÖF</p>
    <p>3-8 kişilik gerçek zamanlı parti oyunu. Bir oda aç, linki arkadaşlarına at; kimse bir şey indirmeden oyuna katılsın.</p>
    <div class="btns">
      <button type="button" onclick={() => (playing = true)}>Burada aç ▶</button>
      <a href={URL} target="_blank" rel="noopener">Yeni sekmede ↗</a>
    </div>
  </div>
{/if}

<style>
  iframe { width: 100%; height: 100%; border: 0; display: block; }
  .blof { padding: 22px; display: grid; gap: 8px; align-content: center; min-height: 100%; background: var(--ink); color: var(--paper); }
  .big { font: 900 4rem/1 var(--font-display); color: var(--accent); margin: 0; }
  .btns { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 8px; }
  button, a { font: 800 14px var(--font-mono); text-decoration: none; border: 3px solid var(--paper); padding: 8px 14px; cursor: pointer; background: var(--accent); color: var(--ink); }
  a { background: transparent; color: var(--paper); }
</style>
