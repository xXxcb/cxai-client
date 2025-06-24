<script setup>
  const emit = defineEmits(['downloadTriggered'])

  function downloadCompanion(osSpec) {
    emit('downloadTriggered', { download: true, ...osSpec });
    // Use import.meta.env.PROD for Vite environment check
    const baseUrl = import.meta.env.PROD ? "https://alpha.cxai.com" : "http://localhost:7777";

    const query = new URLSearchParams(osSpec).toString();
    const url = `${baseUrl}/cxai-api/download?${query}`;

    const a = document.createElement('a');
    a.href = url;
    a.download = ''; // Let server decide filename or use a default
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a); // Clean up the element

    // It might be better to emit 'downloadStarted' after the click,
    // though actual download start is browser-dependent.
    // The original emitted { download: 'started', ... }, this seems fine.
    emit('downloadTriggered', { download: 'started', ...osSpec });
  }
</script>

<template>
  <div id="downloadChooser" class="container py-5">
    <h2 class="mb-4 text-center">Choose Your Architecture</h2>
    <p class="text-center text-muted mb-5">Our test requires a companion app to be running on your computer. We couldn’t detect your architecture automatically. Please select your platform:</p>

    <div class="row row-cols-2 row-cols-sm-3 row-cols-md-4 g-4 d-flex justify-content-center">
      <!-- Windows x64 -->
      <div class="col">
        <a href="javascript:void(0)" class="card text-center text-decoration-none h-100 shadow-sm hover-shadow" @click="downloadCompanion({platform: 'win', architecture: 'universal'})">
          <div class="card-body d-flex flex-column justify-content-center align-items-center">
            <i class="uil uil-windows fs-40 mb-3"></i> <!-- Make sure uil-icons are available -->
            <h6 class="card-title mb-1">Windows (Universal)</h6>
            <small class="text-muted">*.exe</small>
          </div>
        </a>
      </div>

      <!-- Linux x64 -->
      <div class="col">
        <a href="javascript:void(0)" class="card text-center text-decoration-none h-100 shadow-sm hover-shadow" @click="downloadCompanion({platform: 'linux', architecture: 'x64'})">
          <div class="card-body d-flex flex-column justify-content-center align-items-center">
            <i class="uil uil-linux fs-40 mb-3"></i>
            <h6 class="card-title mb-1">Linux (x64)</h6>
            <small class="text-muted">.tar.gz</small>
          </div>
        </a>
      </div>

      <!-- macOS Apple Silicon -->
      <div class="col">
        <a href="javascript:void(0)" class="card text-center text-decoration-none h-100 shadow-sm hover-shadow" @click="downloadCompanion({platform: 'macOS', architecture: 'universal'})">
          <div class="card-body d-flex flex-column justify-content-center align-items-center">
            <i class="uil uil-apple fs-40 mb-3"></i>
            <h6 class="card-title mb-1">macOS (Universal)</h6>
            <small class="text-muted">.dmg</small>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles for DownloadChooser if any specific ones are needed.
   Using Bootstrap classes, so most styling should come from there.
   The .hover-shadow might need a definition if not global.
*/
.hover-shadow:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important; /* Example hover effect */
}
.fs-40 { /* Assuming this is for font-size: 40px or similar for icons */
    font-size: 2.5rem; /* approx 40px if 1rem = 16px */
}
/* Ensure uil icons are loaded, e.g., via a CDN in index.html or npm package */
/* @import url("https://unicons.iconscout.com/release/v4.0.0/css/line.css"); */
/* Better to add icon font globally if used in multiple places */
</style>
