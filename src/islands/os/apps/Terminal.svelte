<script lang="ts">
  import { tick } from 'svelte';
  import { runCommand } from '../../../lib/terminal';
  import type { AppId } from '../../../lib/os/appIds';

  let { api }: { api: { open: (id: AppId) => void } } = $props();

  let lines = $state<string[]>(["BAKİ OS terminali. 'help' yaz."]);
  let value = $state('');
  let history: string[] = [];
  let hIndex = -1;
  let screen: HTMLDivElement;

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    const input = value;
    value = '';
    if (input.trim()) { history = [input, ...history].slice(0, 50); hIndex = -1; }
    const res = runCommand(input);
    if (res.action?.type === 'clear') lines = [];
    else lines = [...lines, `> ${input}`, ...res.lines];
    if (res.action?.type === 'open') api.open(res.action.appId);
    await tick();
    screen.scrollTop = screen.scrollHeight;
  }

  function keys(e: KeyboardEvent) {
    if (e.key === 'ArrowUp' && hIndex < history.length - 1) { hIndex++; value = history[hIndex]; e.preventDefault(); }
    if (e.key === 'ArrowDown' && hIndex > 0) { hIndex--; value = history[hIndex]; e.preventDefault(); }
  }
</script>

<div class="term" bind:this={screen}>
  {#each lines as l, i (i)}<pre>{l}</pre>{/each}
  <form onsubmit={submit}>
    <label for="term-in">baki@os:~$</label>
    <!-- svelte-ignore a11y_autofocus -->
    <input id="term-in" type="text" bind:value onkeydown={keys} autocomplete="off" spellcheck="false" autofocus />
  </form>
</div>

<style>
  .term { height: 100%; background: var(--ink); color: #e9e9e2; padding: 12px 14px; font: 14px/1.5 var(--font-mono); overflow: auto; }
  pre { margin: 0; white-space: pre-wrap; font: inherit; }
  form { display: flex; gap: 8px; align-items: center; }
  label { color: var(--accent); font-weight: 800; white-space: nowrap; }
  input { flex: 1; background: none; border: 0; outline: 0; color: inherit; font: inherit; caret-color: var(--accent); }
</style>
