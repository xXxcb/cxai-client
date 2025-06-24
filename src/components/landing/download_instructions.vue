<script setup>
  import { inject } from "vue";

  const axios = inject('axios'); // Injected but not used in this script, which is fine.
  defineProps(['data'])

  // This function is identical to the one in DownloadChooser.
  // Consider moving to a composable if used in more places.
  function downloadCompanion(osSpec) {
    // emit('downloadTriggered', { download: true, ...osSpec }); // No emit defined/needed here
    const baseUrl = import.meta.env.PROD ? "https://alpha.cxai.com" : "http://localhost:7777";

    const query = new URLSearchParams(osSpec).toString();
    const url = `${baseUrl}/cxai-api/download?${query}`;

    const a = document.createElement('a');
    a.href = url;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // emit('downloadTriggered', { download: 'started', ...osSpec }); // No emit
  }
</script>

<template>
  <div id="instructions" class="container w-100 mt-5">
    <!-- Windows Instructions -->
    <div v-if="data.platform === 'win' || data.os === 'Windows' || data.os === 'win'" class="card mb-3" id="inst-windows">
      <div class="card-header bg-light fw-semibold">Windows Setup
        <span class="float-end fw-light">
          Your download should have started. If not,
          <a href="javascript:void(0)" @click="downloadCompanion({platform: 'win', architecture: 'universal'})" class="hover fw-semibold text-decoration-underline">download CXAiDesktop manually</a>.
        </span>
      </div>
      <div class="card-body">
        <ol class="mb-3 list-group list-group-numbered">
          <li class="list-group-item mb-4 border-0 ps-0">
            Locate <code>CXAiDesktop-universal.zip</code> in your browser’s downloads bar or <em>Downloads</em> folder.
            <div class="mt-2">
              <img src="/install-win/step1-download.png" alt="Download CXAiDesktop zip file" class="img-fluid rounded border shadow-sm w-75" loading="lazy" />
            </div>
          </li>
          <li class="list-group-item mb-4 border-0 ps-0">
            Right-click on the ZIP file and select <strong>Extract All…</strong>, then choose a location and click <strong>Extract</strong>.
            <div class="mt-2">
              <img src="/install-win/step2-extract.png" alt="Extract CXAiDesktop ZIP" class="img-fluid rounded border shadow-sm w-75" loading="lazy" />
            </div>
          </li>
          <li class="list-group-item mb-4 border-0 ps-0">
            Open the extracted folder, right-click <code>CXAiDesktop-universal.exe</code>, and choose <strong>Run as administrator</strong>.
            <div class="mt-2">
              <img src="/install-win/step3-run-as-admin.png" alt="Run CXAiDesktop as Administrator" class="img-fluid rounded border shadow-sm w-75" loading="lazy" />
            </div>
          </li>
          <li class="list-group-item mb-4 border-0 ps-0">
            If Windows SmartScreen appears, click <strong>More info</strong>, then <strong>Run anyway</strong>.
            <div class="alert alert-warning mt-2 small" role="alert">
              This is a standard Windows prompt for new or unsigned applications.
            </div>
            <div class="mt-2">
              <img src="/install-win/step4-smartscreen.png" alt="SmartScreen warning example" class="img-fluid rounded border shadow-sm w-75" loading="lazy" />
            </div>
          </li>
          <li class="list-group-item mb-4 border-0 ps-0">
            Allow network access when prompted by Windows Firewall by selecting both <strong>Private</strong> and <strong>Public</strong> networks, then click <strong>Allow access</strong>.
            <div class="alert alert-info mt-2 small" role="alert">
              This allows the app to run network tests and local diagnostics.
            </div>
            <div class="mt-2">
              <img src="/install-win/step5-firewall.png" alt="Windows Firewall network access prompt" class="img-fluid rounded border shadow-sm w-75" loading="lazy" />
            </div>
          </li>
          <li class="list-group-item mb-4 border-0 ps-0">
            Once started, the app will initialize and begin system and network checks. This page should update automatically once the desktop app is ready.
            <div class="mt-2">
              <img src="/install-win/step6-app-launched.png" alt="CXAiDesktop launched" class="img-fluid rounded border shadow-sm w-75" loading="lazy" />
            </div>
          </li>
        </ol>
      </div>
    </div>

    <!-- macOS Instructions -->
    <div v-if="data.platform === 'macOS' || data.os === 'macOS' || data.os === 'mac'" class="card mb-3" id="inst-macos">
      <div class="card-header bg-light fw-semibold">macOS Setup
        <span class="float-end fw-light">
            Your download should have started. If not,
            <a href="javascript:void(0)" @click="downloadCompanion({platform: 'macOS', architecture: 'universal'})" class="hover fw-semibold text-decoration-underline">download CXAiDesktop manually</a>.
        </span>
    </div>
      <div class="card-body">
        <ol class="mb-3 list-group list-group-numbered">
          <li class="list-group-item mb-4 border-0 ps-0">
            Locate <code>CXAiDesktop-universal.zip</code> in your <em>Downloads</em> folder or browser’s downloads bar.
            <br />
            <strong>Note:</strong> If you're using Safari, the ZIP archive may be extracted automatically.
            <div class="mt-2">
              <img src="/install-mac/step1-download.png" alt="Download CXAiDesktop zip file" class="img-fluid rounded border shadow-sm w-75" loading="lazy" />
            </div>
          </li>
          <li class="list-group-item mb-4 border-0 ps-0">
            Double-click the ZIP file to extract the <code>CXAiDesktop.dmg</code> installer.
            <div class="mt-2">
              <img src="/install-mac/step2-extract.png" alt="Extract .dmg from zip" class="img-fluid rounded border shadow-sm w-75" loading="lazy" />
            </div>
          </li>
          <li class="list-group-item mb-4 border-0 ps-0">
            Double-click <code>CXAiDesktop.dmg</code> to open the installer window.
            <div class="mt-2">
              <img src="/install-mac/step3-open-dmg.png" alt="Open .dmg file" class="img-fluid rounded border shadow-sm w-75" loading="lazy" />
            </div>
          </li>
          <li class="list-group-item mb-4 border-0 ps-0">
            Drag the <code>CXAiDesktop</code> icon into the <strong>Applications</strong> folder to install.
            <div class="mt-2">
              <img src="/install-mac/step4-drag-to-apps.png" alt="Drag app to Applications folder" class="img-fluid rounded border shadow-sm w-75" loading="lazy" />
            </div>
          </li>
          <li class="list-group-item mb-4 border-0 ps-0">
            Go to the <strong>Applications</strong> folder, right-click <code>CXAiDesktop</code>, and choose <strong>Open</strong>. You may need to do this twice to bypass Gatekeeper warning for unidentified developers.
            <div class="alert alert-warning mt-2 small" role="alert">
              Gatekeeper may warn you because the app is from an unidentified developer. Click <strong>Open</strong> to proceed. If "Open" is not an option, try opening it, then go to System Settings > Privacy & Security, and scroll down to allow the app.
            </div>
            <!-- Gatekeeper image was commented out in original, keeping it that way -->
            <!-- <div class="mt-2">
              <img src="/install-mac/step5-gatekeeper.png" alt="macOS Gatekeeper warning" class="img-fluid rounded border shadow-sm w-75" loading="lazy" />
            </div> -->
          </li>
          <li class="list-group-item mb-4 border-0 ps-0">
            During setup or network tests, the app may ask for your <strong>Mac password</strong> one or more times. Enter your password and click <strong>OK</strong> to proceed.
            <div class="alert alert-info mt-2 small" role="alert">
              This is required for system-level diagnostics like traceroute, ping, or packet sniffing.
            </div>
            <div class="mt-2">
              <img src="/install-mac/step6-password.png" alt="macOS admin password prompt" class="img-fluid rounded border shadow-sm w-75" loading="lazy" />
            </div>
          </li>
          <li class="list-group-item mb-4 border-0 ps-0">
            Once installed and running, the app will launch and begin checking your system and network. This page should update automatically once the desktop app is ready.
            <div class="mt-2">
              <img src="/install-mac/step7-app-running.png" alt="CXAiDesktop launched" class="img-fluid rounded border shadow-sm w-75" loading="lazy" />
            </div>
          </li>
        </ol>
      </div>
    </div>

    <!-- Linux Instructions -->
    <div v-if="data.platform === 'linux' || data.os === 'Linux'" class="card mb-3" id="inst-linux">
      <div class="card-header bg-light fw-semibold">Linux Setup
        <span class="float-end fw-light">
            Your download should have started. If not,
            <a href="javascript:void(0)" @click="downloadCompanion({platform: 'linux', architecture: 'x64'})" class="hover fw-semibold text-decoration-underline">download CXAiDesktop manually</a>.
        </span>
      </div>
      <div class="card-body">
        <p>1. Locate and extract <code>CXAiDesktop-linux-x64.tar.gz</code> (the filename might vary slightly):</p>
        <pre class="bg-dark text-white p-3 rounded small"><code>tar -xzf CXAiDesktop-linux-x64.tar.gz</code></pre>
        <p>2. Navigate into the extracted directory (e.g., <code>cd CXAiDesktop-linux-x64</code> or similar).</p>
        <p>3. Make the application executable and run it:</p>
        <pre class="bg-dark text-white p-3 rounded small"><code>chmod +x CXAiDesktop\n./CXAiDesktop &</code></pre>
        <p class="mb-0 text-muted small">The application might require root privileges for certain network diagnostics. If you encounter issues, try running with <code>sudo ./CXAiDesktop</code>.</p>
        <p class="mt-3">Once running, this page should update automatically once the desktop app is ready.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles for DownloadInstructions if any */
.list-group-item {
    border: none; /* Clean up list group item borders for this specific layout */
    padding-left: 0; /* Align with card body padding */
}
.w-75 { /* Ensure Bootstrap's w-75 is available or define it */
    width: 75% !important;
}
.hover-shadow:hover { /* Copied from DownloadChooser, consider making global if used often */
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}
.text-decoration-underline {
    text-decoration: underline !important;
}
</style>
