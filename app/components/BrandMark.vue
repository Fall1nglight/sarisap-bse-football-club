<template>
  <svg viewBox="0 0 80 96" role="img" aria-label="Sárisápi BSE címere">
    <path class="brand-mark__field" d="M40 2 76 16v28c0 22-14 39-36 50C18 83 4 66 4 44V16L40 2Z" />
    <path class="brand-mark__line" d="M40 10v74M13 29h54M16 57c16-8 32-8 48 0M28 29v28m24-28v28" />
    <text x="40" y="49" text-anchor="middle">SBSE</text>
  </svg>
</template>

<style scoped>
svg { display: block; width: var(--brand-mark-size, 100%); height: auto; color: var(--color-brand); }
.brand-mark__field { fill: currentColor; }
.brand-mark__line { fill: none; stroke: var(--color-on-brand); stroke-width: 1.2; opacity: .36; }
text { fill: var(--color-on-brand); font: 700 15px/1 var(--font-display); letter-spacing: .06em; }
</style>
