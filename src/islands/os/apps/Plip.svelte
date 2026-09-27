<div class="plip">
  <img src="/img/works/plip-cover.png" alt="Plip oyunundan bir kare" />
  <div class="plip__text">
    <h2>Plip: Eve Dönüş</h2>
    <p>Evine dönmeye çalışan yapışkan bir slime. Tut, ger, bırak, fırlat. Windows için itch.io'dan indirip oynayabilirsin.</p>
    <div class="plip__btns">
      <a href="https://bakibacaci.itch.io/plip" target="_blank" rel="noopener">itch.io'da oyna ↗</a>
      <a class="alt" href="/isler/plip">Nasıl yaptım →</a>
    </div>
    <div class="shots">
      <img src="/img/works/plip-1.png" alt="Plip bahçe bölümü" loading="lazy" />
      <img src="/img/works/plip-2.png" alt="Plip bal bölümü" loading="lazy" />
    </div>
  </div>
</div>

<style>
  .plip { display: grid; gap: 0; }
  img { width: 100%; display: block; }
  .plip > img { border-bottom: var(--border); }
  .plip__text { padding: 16px 18px 20px; }
  h2 { font-size: 1.6rem; }
  .plip__btns { display: flex; gap: 10px; flex-wrap: wrap; margin: 12px 0 16px; }
  a { font-weight: 800; text-decoration: none; border: var(--border); padding: 6px 12px; background: var(--accent); box-shadow: 4px 4px 0 var(--ink); }
  a.alt { background: var(--white); }
  .shots { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .shots img { border: 2px solid var(--ink); }
</style>
