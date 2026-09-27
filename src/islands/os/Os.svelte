<script lang="ts">
  import { onMount } from 'svelte';
  import Desktop from './Desktop.svelte';
  import MobileHome from './MobileHome.svelte';

  let mobile = $state<boolean | null>(null);

  onMount(() => {
    const mq = matchMedia('(max-width: 767px)');
    const set = () => (mobile = mq.matches);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  });
</script>

{#if mobile === true}
  <MobileHome />
{:else if mobile === false}
  <Desktop />
{:else}
  <div class="boot" aria-live="polite">BAKİ OS yükleniyor…</div>
{/if}

<style>
  .boot { position: fixed; inset: 0; display: grid; place-items: center; background: var(--ink); color: var(--accent); font-weight: 800; }
</style>
