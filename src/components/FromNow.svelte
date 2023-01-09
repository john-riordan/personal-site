<script>
  const UNITS = {
    year  : 24 * 60 * 60 * 1000 * 365,
    month : 24 * 60 * 60 * 1000 * 365/12,
    day   : 24 * 60 * 60 * 1000,
    hour  : 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000
  }
  const settings = {
    locale: 'en',
    options: { numeric: 'auto' }
  }

  const rtf = new Intl.RelativeTimeFormat(settings.locale, settings.options);

  function from(d1, d2){
      const elapsed = d1 - (d2 || new Date())

      // "Math.abs" accounts for both "past" & "future" scenarios
      for (let u in UNITS)
        if (Math.abs(elapsed) > UNITS[u] || u == 'second')
          return rtf.format(Math.round(elapsed/UNITS[u]), u)
    }

  export let date;
</script>

{#if date}
  {from(new Date(date))}
{/if}