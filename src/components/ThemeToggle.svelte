<script>
  let theme = "dark"

  function toggleTheme() {
    const body = document.querySelector("body");

    if (theme === "dark") {
      theme = "light";
      body.classList.remove("dark");
      body.classList.add("light");
    } else {
      theme = "dark";
      body.classList.remove("light");
      body.classList.add("dark");
    }

    
    // if (body) body.toggle
  }
</script>

<button on:click={toggleTheme}>
  Toggle Theme
</button>