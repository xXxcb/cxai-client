<template>
  <section class="wrapper bg-gradient-orange">
    <div class="container pt-10 pt-md-16 pb-8 text-center">
      <div class="row d-flex justify-content-center">
        <!-- /column -->
        <div class="col-10 col-lg-7">
          <h1 class="display-1 mb-5 mx-md-n10 mx-lg-0">Network Stability Test</h1>
          <p class="text-warning-emphasis lead fs-lg mt-7" v-if="isMobile">This network test is only supported by Windows, Mac and Linux based computers. Please visit this site using a desktop browser.</p>
          <p class="lead fs-lg mb-7" v-else>Start the network stability test to see if your internet connection meets the requirements needed to ensure consistent performance for calls, video meetings, and other real-time online activities.</p>
          <div class="row g-3" v-if="!queryID && !isMobile && !testStart && !testResult">
            <div class="col-6">
              <div class="form-floating mb-4">
                <input id="name" type="text" v-model="name" :disabled="showDownload" class="form-control" placeholder="John Doe">
                <label for="name">Name</label>
              </div>
            </div>
            <div class="col-6">
              <div class="form-floating mb-4">
                <input id="email" type="email" v-model="email" :disabled="showDownload" class="form-control" placeholder="jdoe@email.com">
                <label for="email">Email</label>
              </div>
            </div>
          </div>

          <span v-if="!queryID && !isMobile && !testStart && !testResult">
            <button class="btn btn-gradient gradient-7 rounded-pill me-2" :disabled="nameEmailConfirmed && newClientTest" @click="newClient">
              <span v-if="waitingForTest && testStart">
                <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                Waiting for CXAi Desktop
              </span>
              <span v-else>Start Network Test</span>
            </button>
          </span>

          <span v-if="!testStart && !testResult && queryID && !isMobile">
            <button class="btn btn-gradient gradient-6 rounded-pill me-2" :disabled="!testReady" @click="startTest">
              <span v-if="waitingForTest">
                <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                Waiting for CXAi Desktop
              </span>
              <span v-else>Start Network Test</span>
            </button>
          </span>


          <div class="d-flex justify-content-center" v-if="testStart && !testResult">
            <DotLottieVue style="width: 200px" autoplay loop src="https://lottie.host/cab4c9cf-f387-487a-a9b8-be9269804633/B3AVmAvOJY.lottie" />
          </div>
          <span v-if="testStart && !testResult"><p class="lead">{{ $t(liveMsg) }}</p></span>
          <div class="d-flex justify-content-center">
            <div v-show="testStart && !testResult" class="progressbar line blue" id="net-test-progress"></div>
          </div>
        </div>
      </div>
    </div>

    <download-instructions v-if="showInstructions && !testReady && !testResult" :data="instructObj" />
    <download-chooser v-if="!testReady && showDownload && !results.mos && !showInstructions" @downloadTriggered="downloadStarted" />
    <!--    <download-chooser v-if="!testReady && showDownload && !results.mos" @downloadTriggered="downloadStarted" />-->
  </section>

  <section class="wrapper" v-if="testResult">
    <div class="container pt-10 pt-md-1 pb-8 text-center">
      <div class="row gx-md-2 gx-lg-4 gx-xl-5 gy-4 align-items-center">

        <div class="col-12 col-md-4 col-xl-4">
          <div class="card border border-0 shadow-md rounded-4 p-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="fw-light fs-18">Download Speed
                  <i class="uil uil-info-circle" style="cursor: help" v-popover="description.download"></i>
                </span>
              <i class="bi bi-chevron-double-right text-success"></i>
            </div>
            <div class="text-start fw-bolder fs-40" style="font-family: 'Poppins', sans-serif !important;">{{ results.download }}<span class="fs-12 fw-normal text-muted">Mb/s</span></div>
          </div>
        </div>

        <div class="col-12 col-md-4 col-xl-4">
          <div class="card border border-0 shadow-md rounded-4 p-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span class=" fw-light fs-18">
                 Upload Speed
                  <i class="uil uil-info-circle" v-popover="description.upload"></i>
                </span>
              <i class="bi bi-chevron-double-right text-success"></i>
            </div>
            <div class="text-start fs-40 fw-bold" style="font-family: 'Poppins', sans-serif !important;">{{ results.upload }}<span class="fs-12 fw-normal text-muted"> Mb/s</span></div>
          </div>
        </div>
        <div class="col-12 col-md-4 col-xl-4">
          <div class="card border border-0 shadow-md rounded-4 p-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span class=" fw-light fs-18">Latency
                  <i class="uil uil-info-circle" style="cursor: help" v-popover="description.latency"></i>
                </span>
              <i class="bi bi-chevron-double-right text-success"></i>
            </div>
            <div class="text-start fw-bolder fs-40" style="font-family: 'Poppins', sans-serif !important;">{{ results.latency.toFixed(0) }}<span class="fs-12 fw-normal text-muted">ms</span></div>
          </div>
        </div>
        <div class="col-12 col-md-3 col-xl-2">
          <div class="card border border-0 shadow-md rounded-4 p-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span class=" fw-light fs-18">MOS
                  <i class="uil uil-info-circle" style="cursor: help" v-popover="description.mos"></i>
                </span>
              <i class="bi bi-chevron-double-right text-success"></i>
            </div>
            <div class="text-start fw-bolder fs-40" style="font-family: 'Poppins', sans-serif !important;">{{ results.mos || 0 }}</div>
          </div>
        </div>
        <div class="col-12 col-md-3 col-xl-2">
          <div class="card border border-0 shadow-md rounded-4 p-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span class=" fw-light fs-18">Jitter
                  <i class="uil uil-info-circle" style="cursor: help" v-popover="description.jitter"></i>
                </span>
              <i class="bi bi-chevron-double-right text-success"></i>
            </div>
            <div class="text-start fw-bolder fs-40" style="font-family: 'Poppins', sans-serif !important;">{{ results.pingStats.jitter }} <span class="fs-12 fw-normal text-muted">ms</span></div>
          </div>
        </div>
        <div class="col-12 col-md-3 col-xl-2">
          <div class="card border border-0 shadow-md rounded-4 p-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span class=" fw-light fs-18">RTT
                  <i class="uil uil-info-circle" style="cursor: help" v-popover="description.rtt"></i>
                </span>
              <i class="bi bi-chevron-double-right text-success"></i>
            </div>
            <div class="text-start fw-bolder fs-40" style="font-family: 'Poppins', sans-serif !important;">
              {{ results.pingStats.averageRTT.toFixed(2) }} <span class="fs-12 fw-normal text-muted">ms</span></div>
          </div>
        </div>
        <div class="col-12 col-md-3 col-xl-2">
          <div class="card border border-0 shadow-md rounded-4 p-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span class=" fw-light fs-18">Packet Loss
                  <i class="uil uil-info-circle" style="cursor: help" v-popover="description.packetLoss"></i>
                </span>
              <i class="bi bi-chevron-double-right text-success"></i>
            </div>
            <div class="text-start fw-bolder fs-40" style="font-family: 'Poppins', sans-serif !important;">{{ results.pingStats.packetLoss }} <span class="fs-12 fw-normal text-muted">%</span></div>
          </div>
        </div>
      </div>

      <div class="row mt-lg-1 gx-md-2 gx-lg-4 gx-xl-5 gy-4 align-items-center">
        <div class="col-12 col-md-3 col-xl-4">
          <div class="card border border-0 shadow-md rounded-4 p-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class=" fw-light fs-18">IP Address</span>
              <i class="bi bi-chevron-double-right text-success"></i>
            </div>
            <div class="text-start fw-bolder fs-40" style="font-family: 'Poppins', sans-serif !important;">{{ results.location.IP }} </div>
          </div>
        </div>
        <div class="col-12 col-md-3 col-xl-4">
          <div class="card border border-0 shadow-md rounded-4 p-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class=" fw-light fs-18">Country</span>
              <i class="bi bi-chevron-double-right text-success"></i>
            </div>
            <div class="text-start fw-bolder fs-40" style="font-family: 'Poppins', sans-serif !important;">{{ results.location.country }} </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineAsyncComponent } from "vue";
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { ref, onMounted, onBeforeUnmount, inject, computed, watch } from 'vue';
// Imports for actual placeholder files
const DownloadChooser = defineAsyncComponent(() => import("../components/landing/download_chooser.vue"))
const DownloadInstructions = defineAsyncComponent(() => import("../components/landing/download_instructions.vue"))
import { useDeviceDetection } from '@/composables/deviceDetection'
import descriptions from '@/descriptions' // Default export from descriptions.js is already computed
import modules from '@/assets/js/modules'
import { createReconnectingSocket } from '@/socketRecon'
import { Notify } from "notiflix";

import { useRoute } from 'vue-router';
import { useI18n } from "vue-i18n";
const { t } = useI18n()


const axios = inject('axios');
const route = useRoute();

const testStart = ref(false);
const testResult = ref(false);
const testReady = ref(false);
const newClientTest = ref(false);
const showDownload = ref(false);
const showInstructions = ref(false);
const waitingForTest = ref(false);
const config = ref({})
const instructObj = ref({});
const isMobile = ref(false);
const name = ref('');
const email = ref('');
const user_id = ref('');
const liveMsg = ref('');
const results = ref({ upload: 0, download: 0, latency: 0, pingStats: { jitter: 0, averageRTT: 0, packetLoss: 0 }, pcStats: {}, location: { IP: 'N/A', country: 'N/A' }});
let wsLocal = ref(null);

let wsApi = ref(null);
let readyMsg = ref(''); // This was defined but not used in original script, keeping for consistency
let driftRAF = null;
// actualProgress and targetProgress are mostly managed by the progress bar module itself now.
// However, NetworkTest.vue was using them to control the mock progress bar.
// The new modules.js placeholder also uses a similar internal variable.
// For consistency with original logic that might have relied on these being component-level for some reason:
let actualProgress = ref(0); // If progress bar module needs to update this, it can.
let targetProgress = ref(0); // Or these can be passed to updateBar/startDrift.
// For now, the placeholder modules.js has its own internal simulation.
// If direct manipulation from NetworkTest.vue is still needed for the real module, these can be used.

// --- Store socket utility instances ---
let wsApiConnection = null;
let wsLocalConnection = null;

// --- API WebSocket Handlers ---
function handleApiMessage(event) {
  if (event.data instanceof ArrayBuffer) return;
  // This is the generic message handler for wsApi.
  // Specific test functions (measureLatency, measureDownload etc.) will add their own
  // temporary listeners to wsApi.value for specific messages (pong, download-done).
  // This handler is for more general messages not caught by those, like the final net-test results.
  try {
    let msg = JSON.parse(event.data);
    // console.log('Global API Message Handler:', msg);

    if (msg.type === 'net-test') { // Final results including MOS, location, and completion
      if (msg.data?.mos_score) results.value.mos = msg.data.mos_score;
      if (msg.data?.country) results.value.location.country = msg.data.country;
      if (msg.data?.city) results.value.location.city = msg.data.city;
      if (msg.data?.IP) results.value.location.IP = msg.data.IP;
      if (msg.data?.postal) results.value.location.postal = msg.data.postal;

      if (msg.data?.complete) {
        liveMsg.value = 'Test Completed';
        updateBar(liveMsg.value);
        finalizeBar();
        testResult.value = true;
        testStart.value = false;
        if (wsApiConnection) wsApiConnection.disconnect(); // Use disconnect from socketRecon
        if (wsLocalConnection) wsLocalConnection.disconnect();
      }
    } else if (msg.type !== 'pong' && msg.type !== 'download-done' && msg.type !== 'upload-result') {
      // Log other message types not handled by specific measure functions.
      // console.log('[API RAW MSG Unhandled by specific listeners]', event.data);
    }
  } catch (e) {
    console.error('Error parsing API message in global handler:', e, event.data);
  }
}

function handleApiDisconnect(details) {
  // console.warn(`API WebSocket disconnected. Details:`, details);
  // Notify.warning(t('Connection to API service lost. Attempting to reconnect...'));
  // wsApi.value will be nullified by socketRecon, or isConnected will be false.
  // The socketRecon module handles reconnection attempts.
  // UI updates based on wsApiConnection?.isConnected.value might be useful.
  if (details.error && !testResult.value) { // Only notify if it's an error-driven disconnect and test not done
     Notify.failure(t('Connection to API service failed. Please check your internet connection.'));
  } else if (!details.event?.wasClean && !testResult.value) {
     Notify.warning(t('Connection to API service lost. Attempting to reconnect...'));
  }
   wsApi.value = null; // Explicitly nullify on disconnect
}

function initSocket() {
  if (userID.value && config.value && (!wsApiConnection || !wsApiConnection.isConnected.value)) {
    const apiUrl = import.meta.env.PROD ? 'wss://alpha.cxai.com/ws' : 'ws://localhost:7777/ws';
    wsApiConnection = createReconnectingSocket(
      apiUrl,
      userID.value,
      config.value,
      handleApiMessage,
      handleApiDisconnect,
      { initialMaxRetries: 5, initialDelayMs: 1000, reconnectDelayMs: 2000 }
    );

    wsApiConnection.whenConnected.then((ws) => {
      ws.binaryType = 'arraybuffer';
      wsApi.value = ws; // Store the raw socket instance
    }).catch(e => {
      console.error('Failed to connect to API Socket:', e);
      Notify.failure(t('Failed to connect to API service. Please check your connection or try again later.'));
      wsApi.value = null;
    });
  }
}

// --- Local WebSocket Handlers ---
function handleLocalMessage(event) {
  if (event.data instanceof ArrayBuffer) return;
  let msg;
  try { msg = JSON.parse(event.data); } catch { return; }

  if (msg.type === 'net-test') {
    if (typeof msg.ready !== 'undefined') {
        testReady.value = !!msg.ready;
        waitingForTest.value = !testResult.value && !msg.ready;
         if (testReady.value) { // If local app becomes ready
            showDownload.value = false; // Hide download prompts
            showInstructions.value = false; // Hide instructions
         }
    }
    if (msg.message && testStart.value && !testResult.value) {
        liveMsg.value = msg.message;
        updateBar(liveMsg.value);
    }
    // For initLocalTest, it will set up its own temporary onmessage handler on wsLocal.value
    // This global handler is for general 'ready' status or other messages.
  }
}

function handleLocalDisconnect(details) {
  // console.warn(`Local WebSocket disconnected. Details:`, details);
  testReady.value = false;
  if (!testStart.value && !testResult.value) { // Only manipulate these if test not active/done
    waitingForTest.value = true; // If local disconnects before/without test, user is waiting for it
    if(userID.value) showDownload.value = true; // Re-prompt download if local app disconnects and we have a user
  }

  // Avoid spamming "disconnected" if it was an initial connection failure handled by onMounted's catch block
  if (details.event && details.event.code !== 1006 && details.event.code !== 1000 ) { // 1006 is abnormal closure, 1000 is normal
      Notify.warning(t('Local CXAi Desktop application disconnected. Please ensure it is running.'));
  } else if (details.error) { // This means initial connection series failed
      // This is handled in onMounted's catch block for the initial connection
  }
  wsLocal.value = null; // Explicitly nullify on disconnect
}


// Computed properties
const queryID = computed(() => {
  return route?.query?.uft_id || ''
});
const userID = computed(() => {
  return route.query.uft_id || user_id.value
});
const scanID = computed(() => {
  return route?.query?.ns_id || ''
});
const nameEmailConfirmed = computed(() => {
  // Original logic was: !!name.value && !!email.value
  // This was causing issues with the Start button being disabled when name/email not required (i.e. queryID present)
  // Corrected logic: button should be disabled if newClientTest is true AND name/email are NOT confirmed.
  // The :disabled attribute on the button was `nameEmailConfirmed && newClientTest` which seems incorrect.
  // It should be more like `!nameEmailConfirmed && newClientTest` if `newClientTest` implies name/email are needed.
  // For now, sticking to a direct translation that enables the button if name and email are filled.
  // The button's :disabled logic is `nameEmailConfirmed && newClientTest` which means
  // "disable if name/email IS confirmed AND it's a new client test" - this seems backward.
  // Let's assume it should be "disable if it's a new client test AND name/email IS NOT confirmed"
  // So, this computed should be `!!name.value && !!email.value;`
  // And the button :disabled should be `newClientTest && !nameEmailConfirmed`
  // For now, I will keep the original computed property and address the button logic if it's a bug.
  // The original button logic: :disabled="nameEmailConfirmed && newClientTest"
  // This means if it's a new client (no queryID) and they HAVE filled name/email, the button becomes active.
  // Let's refine this: the button for "newClient" should be enabled if name and email are filled.
  // The `newClientTest` ref is used to track if the newClient flow has been initiated.
  // The button's `@click="newClient"` implies it's for initiating a new client test.
  // So, it should be enabled if name and email are present.
  // The `:disabled="nameEmailConfirmed && newClientTest"` means:
  // If name and email are *filled* AND it's a new client test already *initiated*, then disable.
  // This seems to be for preventing re-clicks after initiation.
  // A simpler approach for the button's enabled state before initiation might be just `!nameAndEmailAreValid`.
  // I'll stick to the original `nameEmailConfirmed` for now.
  return !!name.value && !!email.value;
});
// description computed is now a placeholder above

onMounted(async () => {
  modules.progressBar() // Initialize placeholder progress bar
  await preAuthenticate()

  let { os, deviceType } = useDeviceDetection(); // Using placeholder

  try {
    let { data } = await axios.get('/cxai-api/config'); // This will use the injected axios
    config.value = data;
    // Ensure ports is an array, even if not provided by API, for safety, matching original code
    config.value.ports = config.value.ports || [50555, 51555, 52555, 53555, 54555, 55555, 56555, 57555, 58555, 59555];
  } catch (error) {
    console.error("Failed to fetch /cxai-api/config", error);
    Notify.failure(t('Failed to load initial configuration.'));
    config.value.ports = [50555, 51555, 52555, 53555, 54555, 55555, 56555, 57555, 58555, 59555]; // Default
  }


  deviceType.value === 'Mobile' ? isMobile.value = true : isMobile.value = false;
  // Original: userID.value && !testReady.value ? showDownload.value = true : showDownload.value = false
  // This should be reactive to userID changes as well, covered by the watcher.
  showDownload.value = !!(userID.value && !testReady.value);


  if (!isMobile.value && !testResult.value && !wsLocalConnection) { // Check if not already initialized
    // The new socketRecon doesn't iterate ports; it tries one URL.
    // The original code picked the first port: config.value.ports[0]
    // We'll stick to that for now. A more advanced setup could involve trying multiple.
    const localSocketUrl = `ws://localhost:${config.value.ports[0]}/`;

    wsLocalConnection = createReconnectingSocket(
      localSocketUrl,
      'local', // ID for this connection
      config.value, // Config (might not be used by local for registration message, but passed)
      handleLocalMessage,
      handleLocalDisconnect,
      { initialMaxRetries: 3, initialDelayMs: 500, reconnectDelayMs: 1500 } // Options for local
    );

    wsLocalConnection.whenConnected.then((ws) => {
      ws.binaryType = 'arraybuffer';
      wsLocal.value = ws; // Store the raw socket instance
      // console.log("Local WebSocket connected and wsLocal.value is set.");
      // Initial 'ready' state might be sent by local client upon connection and handled by handleLocalMessage
    }).catch(e => {
      // This catch is for the initial series of connection attempts failing.
      console.error('Failed to connect to Local CXAi Desktop Application:', e);
      testReady.value = false; // Ensure testReady is false
      waitingForTest.value = true; // User is waiting for it
      if (userID.value) { // Only show download if there's a user context (implies test was initiated or pre-auth)
          showDownload.value = true;
      }
      Notify.failure(t('Could not connect to the local CXAi Desktop application. Please ensure it is running and try again.'));
      wsLocal.value = null; // Ensure it's null on failure
    });

    initSocket(); // Initialize API socket (if not already done by a watcher)
  }
})

  // Watchers
  watch(() => ({
    ready: testReady.value,
    id: userID.value,
    // Use the isConnected ref from the new wsApiConnection object
    open: wsApiConnection?.isConnected?.value
  }), ({ ready, id, open }) => {
    if (ready && id && open && !testStart.value && !testResult.value) {
      startTest();
    }
  });

  watch(userID, (newId) => {
    if (newId && !testReady.value) {
      showDownload.value = true;
    }
    // If userID is set (e.g. by newClient or query param) and API is not connected, try to init.
    // initSocket() itself has a guard against re-initializing if wsApiConnection exists and is connected.
    if (newId && config.value) {
      initSocket();
    }
  });

  // The watcher for wsLocal.value?.readyState is removed as handleLocalDisconnect now covers this.

  onBeforeUnmount(() => {
    // Send shutdown to local client if connected
    if (wsLocalConnection?.isConnected?.value && wsLocal.value) {
      wsLocal.value.send(JSON.stringify({ type: 'control', cmd: 'shutdown' }));
    }
    // Use the disconnect method from socketRecon to properly close and prevent reconnection
    if (wsApiConnection) {
      wsApiConnection.disconnect();
    }
    if (wsLocalConnection) {
      wsLocalConnection.disconnect();
    }
  });

  async function preAuthenticate() {
    if (queryID.value && userID.value) { // userID here is the computed property reacting to query
      try {
        let {data} = await axios.post('/cxai-api/pre-auth', {uft_id: userID.value, ns_id: scanID.value})
        if (data.tkn) {
          localStorage.setItem('tkn', data.tkn)
          // user_id.value = queryID.value; // Set internal user_id if needed, though computed userID should work
          return // Token stored, proceed to connect sockets
        }
        if (data.completed) {
          results.value = data.completed
          results.value.location.IP = data.completed.location?.ip || 'N/A' // Safe access
          results.value.mos = data.completed.mos_score
          testResult.value = true
          return
        }
        if (!data.client) {
          Notify.failure(t('Client not found or invalid link. Redirecting...'));
          setTimeout(() => {
            window.location.href = import.meta.env.PROD ? "https://alpha.cxai.com" : "http://localhost:4000"
          }, 3000);
        }
      } catch (error) {
        console.error("Pre-authentication failed:", error);
        Notify.failure(t('Pre-authentication failed. Please check the link or try again.'));
        // Potentially redirect or show error message
      }
    }
  }

const startTest = async () => {
  liveMsg.value = 'Starting Network Test';
  testStart.value = true; // Set testStart to true here
  showDownload.value = false; // Hide download prompts
  showInstructions.value = false; // Hide instructions

  updateBar(liveMsg.value); // Update progress bar

  // Ensure wsApi is ready before proceeding
  if (!wsApiConnection?.isConnected?.value || !wsApi.value) {
    Notify.error(t('API connection not ready. Cannot start test.'));
    console.error('API ws not ready for startTest. isConnected:', wsApiConnection?.isConnected?.value, 'wsApi.value:', wsApi.value);
    testStart.value = false; // Reset testStart
    // Optionally, try to re-init or alert user more prominently
    // Attempt to re-initiate connection if userID and config are available
    if(userID.value && config.value) initSocket();
    return;
  }

  // Ensure wsLocal is ready if it's a non-mobile device (local tests are part of the flow)
  if (!isMobile.value && (!wsLocalConnection?.isConnected?.value || !wsLocal.value)) {
      Notify.error(t('Local CXAi Desktop application is not connected. Cannot start test.'));
      console.error('Local ws not ready for startTest. isConnected:', wsLocalConnection?.isConnected?.value, 'wsLocal.value:', wsLocal.value);
      testStart.value = false;
      // Attempt to re-initiate local connection (onMounted logic)
      // This is tricky here, user might need to manually ensure local app is running.
      // For now, just prevent test start.
      return;
  }


  try {
    results.value.latency = await measureLatency(userID.value);
    results.value.download = await measureDownload(userID.value);
    results.value.upload = await measureUpload(userID.value);
    results.value.pingStats = await measurePingStats(userID.value, 10, 500); // Default values from original
    results.value.client_id = userID.value; //This is actually uft_id

    // Setup API message listener for final results (MOS, location)
    // This was inside initSocket in original, but seems more relevant to startTest flow for these messages
    wsApi.value.onmessage = event => {
      if (event.data instanceof ArrayBuffer) return;
      try {
        let msg = JSON.parse(event.data);
        console.log('API Message:', msg); // General log for all messages

        if (msg.type === 'net-test') { // Assuming final results also use this type
          if (msg.data?.mos_score) { // Check if data and mos_score exist
            results.value.mos = msg.data.mos_score;
          }
          if (msg.data?.country) results.value.location.country = msg.data.country;
          if (msg.data?.city) results.value.location.city = msg.data.city; // Not in template, but store if provided
          if (msg.data?.IP) results.value.location.IP = msg.data.IP;
          if (msg.data?.postal) results.value.location.postal = msg.data.postal; // Not in template

          if (msg.data?.complete) {
            liveMsg.value = 'Test Completed';
            updateBar(liveMsg.value); // Finalize bar based on text? Or call finalizeBar?
            finalizeBar(); // Explicitly finalize
            testResult.value = true;
            testStart.value = false;
            closeSockets(); // Close sockets on completion
          }
        } else if (msg.type === 'pong' || msg.type === 'download-done' || msg.type === 'upload-result') {
          // These are handled by their respective measure functions' listeners
          // console.log(`Specific test pong/ack received: ${msg.type}`);
        } else {
          console.log('[API RAW MSG]', event.data);
        }
      } catch (e) {
        console.error('Error parsing API message:', e, event.data);
      }
    };

    // Add specific listeners for other messages if needed, though measure functions handle theirs
    // wsApi.value.addEventListener('message', e => {
    //   if (e.data instanceof ArrayBuffer) return;
    //   console.log('[RAW API]', e.data); // This would catch anything not parsed by onmessage
    // });


    results.value.pcStats = await initLocalTest(); // This will get metrics from local app

    liveMsg.value = 'Measuring Mean Opinion Score (MOS)';
    updateBar(liveMsg.value);

    results.value.scan_id = scanID.value; // Ensure to use .value for computed refs
    results.value.config = config.value?.mos; // Use optional chaining

    // Send results (including pcStats) to server to concat with Location Data and get MOS
    await axios.post('/cxai-api/cnt-test', results.value);
    // The server should respond via WebSocket with MOS and final 'complete' message.

  } catch (error) {
    console.error("Error during network test execution:", error);
    Notify.failure(t('An error occurred during the network test. Please try again.'));
    liveMsg.value = t('Test failed. Please try again.');
    testStart.value = false;
    // Optionally reset parts of results.value or show specific error messages
    // closeSockets(); // Consider if sockets should be closed on partial failure
  }
};


function closeSockets() {
  // Send shutdown to local client if connected
  if (wsLocalConnection?.isConnected?.value && wsLocal.value) {
      wsLocal.value.send(JSON.stringify({ type: 'control', cmd: 'shutdown' }));
  }

  // Use the disconnect method from socketRecon to properly close and prevent reconnection
  if (wsApiConnection) {
    wsApiConnection.disconnect();
    wsApiConnection = null; // Clear the connection utility instance
  }
  if (wsLocalConnection) {
    wsLocalConnection.disconnect();
    wsLocalConnection = null; // Clear the connection utility instance
  }
  // wsApi.value and wsLocal.value are already nullified by their respective disconnect handlers
}

function validateInputs() {
  if (!name.value || !email.value) {
    Notify.failure(t('A name and email address are required to start the test.'));
    return false;
  }
  // Basic email regex, consider a more robust one if needed
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    Notify.failure(t('Please enter a valid email address.'));
    return false;
  }
  return true;
}

async function newClient() {
  if (!validateInputs()) {
    waitingForTest.value = false; // Stop waiting if validation fails
    return;
  }
  waitingForTest.value = true; // Set true at the start of the attempt

  try {
    let {data} = await axios.post('/cxai-api/init-auth', {name: name.value, email: email.value})
    if (data.tkn) {
      localStorage.setItem('tkn', data.tkn)
    }

    if (data.uft_id) {
      newClientTest.value = true; // Flag that this is a new client flow
      user_id.value = data.uft_id; // This will trigger the watcher for userID

      // Watcher for userID should handle showDownload and initSocket.
      // if (!testReady.value) { // This check is also in the watcher
      //   showDownload.value = true;
      // }
      // initSocket(); // This is also in the watcher for userID
    } else {
      // Handle cases where uft_id might not be returned but no error thrown
      Notify.failure(t('Could not initialize test. Please try again.'));
      waitingForTest.value = false;
    }
  } catch (err) {
    waitingForTest.value = false; // Stop waiting on error
    console.error("Error in newClient:", err);
    if (err.response) {
      const { status, data: errData } = err.response;
      if (status === 422 && errData.errors) {
        errData.errors.forEach((msg) => Notify.failure(t(msg.message || msg))); // Assuming msg can be object or string
      } else if (errData && errData.error) {
        Notify.failure(t(errData.error));
      } else {
        Notify.failure(t('An unexpected error occurred. Please try again.'));
      }
    } else {
      Notify.failure(t('Network error or server unavailable. Please try again.'));
    }
  }
}

function once(target, type, handler) {
  const wrapped = (evt) => {
    target.removeEventListener(type, wrapped);
    handler(evt);
  };
  target.addEventListener(type, wrapped);
}

/* ---------- Latency (RTT) ------------------------------------------ */
function measureLatency(id, watchdog = 5000 /* ms */) {
  liveMsg.value = 'Measuring Latency';
  updateBar(liveMsg.value);

  if (!wsApi.value || wsApi.value.readyState !== WebSocket.OPEN) { // Check OPEN explicitly
    console.error("API WebSocket not open for measureLatency");
    return Promise.reject(new Error('API WebSocket is not ready for latency test.'));
  }

  return new Promise((resolve, reject) => {
    const seq = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const t0 = performance.now();
    let timer; // Declare timer here to be accessible in both handler and timeout

    const handler = (evt) => {
      if (evt.data instanceof ArrayBuffer || evt.data instanceof Blob) return;
      let msg;
      try { msg = JSON.parse(evt.data); } catch { return; }

      if (msg.type === 'pong' && msg.seq === seq && msg.id === id) {
        wsApi.value.removeEventListener('message', handler);
        clearTimeout(timer);
        resolve(performance.now() - t0);
      }
    };

    wsApi.value.addEventListener('message', handler);
    wsApi.value.send(JSON.stringify({type: 'ping', seq, id}));

    timer = setTimeout(() => {
      wsApi.value.removeEventListener('message', handler);
      reject(new Error('Latency ping timed out'));
    }, watchdog);
  });
}


// ---------- Download ---------------------------------------------------
function measureDownload(id) {
  liveMsg.value = 'Performing Download Test';
  updateBar(liveMsg.value);

  if (!wsApi.value || wsApi.value.readyState !== WebSocket.OPEN) {
     console.error("API WebSocket not open for measureDownload");
    return Promise.reject(new Error('API WebSocket is not ready for download test.'));
  }

  return new Promise((resolve, reject) => {
    let bytes = 0;
    let t0;
    let timeoutTimer;

    const dataHandler = (evt) => {
      if (evt.data instanceof ArrayBuffer) {
        if (!t0) t0 = performance.now();
        bytes += evt.data.byteLength;
        return;
      }
      // JSON control frames
      let msg;
      try { msg = JSON.parse(evt.data); } catch { return; }

      if (msg.type === 'download-done' && msg.id === id) { // Ensure msg.id matches if server sends it
        clearTimeout(timeoutTimer);
        wsApi.value.removeEventListener('message', dataHandler);
        const durationSeconds = (performance.now() - t0) / 1000;
        if (durationSeconds === 0) { // Avoid division by zero
             resolve('0.00'); // Or some other indicator of no data/time
             return;
        }
        const mbps = (bytes * 8) / (durationSeconds * 1000 * 1000); // Corrected: duration is already in seconds, then to Mbps
        resolve(mbps.toFixed(2));
      }
    };

    wsApi.value.addEventListener('message', dataHandler);
    wsApi.value.send(JSON.stringify({type: 'start-download', id}));

    timeoutTimer = setTimeout(() => {
        wsApi.value.removeEventListener('message', dataHandler);
        reject(new Error('Download test timed out'));
    }, config.value?.speedTest?.downloadTimeout || 15000); // e.g. 15s timeout, configurable
  });
}


// ---------- Upload -----------------------------------------------------
function measureUpload(id) {
  liveMsg.value = 'Performing Upload Test';
  updateBar(liveMsg.value);

  if (!wsApi.value || wsApi.value.readyState !== WebSocket.OPEN) {
    console.error("API WebSocket not open for measureUpload");
    return Promise.reject(new Error('API WebSocket is not ready for upload test.'));
  }

  return new Promise((resolve, reject) => {
    const TARGET_BYTES = (config.value?.speedTest?.uploadSizeMiB || 10) * 1024 * 1024; // Default 10MiB
    const CHUNK = crypto.getRandomValues(new Uint8Array(64 * 1024)); // 64KB chunks
    let sent = 0;
    // const t0 = performance.now(); // t0 for upload is usually measured by server based on first byte received
    let timeoutTimer;

    function pump() {
      if (wsApi.value.readyState !== WebSocket.OPEN) { // Stop if socket closes mid-pump
        reject(new Error('WebSocket closed during upload pump.'));
        return;
      }
      while (wsApi.value.bufferedAmount < (1 << 20) && sent < TARGET_BYTES) { // Keep buffer under 1MB
        wsApi.value.send(CHUNK);
        sent += CHUNK.length;
      }
      if (sent < TARGET_BYTES) {
        setTimeout(pump, 10); // Adjusted pump interval slightly
      } else {
        wsApi.value.send(JSON.stringify({type: 'upload-done', id, totalSent: sent }));
      }
    }

    pump(); // Start pumping data

    const resultHandler = (evt) => {
      if (evt.data instanceof ArrayBuffer) return;
      let msg;
      try { msg = JSON.parse(evt.data); } catch { return; }

      if (msg.type === 'upload-result' && msg.id === id) { // Ensure msg.id matches
        clearTimeout(timeoutTimer);
        wsApi.value.removeEventListener('message', resultHandler);
        resolve(parseFloat(msg.mbps).toFixed(2));
      }
    };
    wsApi.value.addEventListener('message', resultHandler);

    timeoutTimer = setTimeout(() => {
        wsApi.value.removeEventListener('message', resultHandler);
        reject(new Error('Upload test timed out waiting for result'));
    }, config.value?.speedTest?.uploadTimeout || 20000); // e.g. 20s timeout
  });
}


// ---------- Ping / Jitter / Packet-loss test ---------------------------
async function measurePingStats(id, pingCount = 30, timeout = 500) {
  liveMsg.value = 'Measuring Jitter and Packet Loss';
  updateBar(liveMsg.value);

  if (!wsApi.value || wsApi.value.readyState !== WebSocket.OPEN) {
    console.error("API WebSocket not open for measurePingStats");
    return Promise.reject(new Error('API WebSocket is not ready for ping stats.'));
  }

  return new Promise((resolve, reject) => {
    const rtts = [];
    let sentPings = 0;
    let receivedPongs = 0;
    const timeouts = new Map();  // seq -> timerId
    const sentAt = new Map();    // seq -> t0
    let overallTimeoutTimer;

    const handleMessage = (evt) => {
      if (evt.data instanceof ArrayBuffer || evt.data instanceof Blob) return;
      let msg;
      try { msg = JSON.parse(evt.data); } catch { return; }

      if (msg.type !== 'pong' || msg.id !== id) return; // Also check ID
      const {seq} = msg;

      if (!sentAt.has(seq)) return; // Unknown or late pong

      clearTimeout(timeouts.get(seq));
      timeouts.delete(seq);

      const rtt = performance.now() - sentAt.get(seq);
      sentAt.delete(seq); // Remove after processing

      rtts.push(rtt);
      receivedPongs++;

      // Check if all pongs accounted for (either received or timed out by individual timers)
      // This check is tricky because pongs can arrive after their individual timeout
      // The final aggregation below handles the definitive result.
    };

    wsApi.value.addEventListener('message', handleMessage);

    const sendPings = async () => {
      for (let i = 0; i < pingCount; i++) {
        if (wsApi.value.readyState !== WebSocket.OPEN) {
          reject(new Error("WebSocket closed mid-ping series."));
          return;
        }
        const seq = `p-${i}`; // Unique sequence string
        const t0 = performance.now();
        sentAt.set(seq, t0);

        wsApi.value.send(JSON.stringify({type: 'ping', seq, id}));
        sentPings++;

        const individualTimer = setTimeout(() => {
          // This pong timed out
          sentAt.delete(seq); // Remove from outstanding pings
          timeouts.delete(seq);
          // No receivedPongs increment
        }, timeout);
        timeouts.set(seq, individualTimer);

        await new Promise(r => setTimeout(r, 100));  // spacing between pings
      }

      // After sending all pings, wait a bit longer than the last ping's timeout for results
      overallTimeoutTimer = setTimeout(() => {
        wsApi.value.removeEventListener('message', handleMessage);
        for (const timer of timeouts.values()) clearTimeout(timer); // Clear any remaining individual timers

        const packetLoss = sentPings > 0 ? ((sentPings - receivedPongs) / sentPings) * 100 : 0;
        const minRTT = rtts.length ? +Math.min(...rtts).toFixed(2) : 0;
        const maxRTT = rtts.length ? +Math.max(...rtts).toFixed(2) : 0;
        const averageRTTVal = rtts.length ? +average(rtts).toFixed(2) : 0;

        resolve({
          minRTT,
          averageRTT: averageRTTVal,
          maxRTT,
          jitter: calculateJitter(rtts),
          packetLoss: +packetLoss.toFixed(2),
        });
      }, timeout + 500); // Wait for all pings to potentially timeout + a buffer
    };

    sendPings().catch(reject); // Catch errors from sendPings itself (e.g. socket closed)

    // Safety net for the entire operation
    const absoluteMaximumTime = (pingCount * 100) + timeout + 2000; // Estimate total time
    const safetyNetTimer = setTimeout(() => {
        clearTimeout(overallTimeoutTimer);
        wsApi.value.removeEventListener('message', handleMessage);
        for (const timer of timeouts.values()) clearTimeout(timer);
        // Resolve with whatever data has been gathered, or reject if it indicates a failure
        console.warn("Ping stats safety net triggered. Test might be incomplete.");
        const packetLoss = sentPings > 0 ? ((sentPings - receivedPongs) / sentPings) * 100 : 0;
        resolve({ // Resolve with potentially partial data
          minRTT: rtts.length ? +Math.min(...rtts).toFixed(2) : 0,
          averageRTT: rtts.length ? +average(rtts).toFixed(2) : 0,
          maxRTT: rtts.length ? +Math.max(...rtts).toFixed(2) : 0,
          jitter: calculateJitter(rtts),
          packetLoss: +packetLoss.toFixed(2),
          warning: "Results might be incomplete due to timeout."
        });
    }, absoluteMaximumTime);
    // Ensure this timer is also cleared if test completes normally
    // Modify the main resolve path to clear this:
    const originalResolve = resolve;
    resolve = (value) => {
        clearTimeout(safetyNetTimer);
        originalResolve(value);
    };
    const originalReject = reject;
    reject = (reason) => {
        clearTimeout(safetyNetTimer);
        clearTimeout(overallTimeoutTimer); // Also clear overall if rejecting early
        originalReject(reason);
    }

  });
}


function average(arr) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0; // Added initial value for reduce
}

function calculateJitter(rtts) {
  if (rtts.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < rtts.length; i++) total += Math.abs(rtts[i] - rtts[i - 1]);
  return +(total / (rtts.length - 1)).toFixed(2);
}

function initLocalTest() {
  return new Promise((resolve, reject) => { // Added reject
    // Original: if (!isMobile) resolve({}) -> This should be isMobile.value
    // Also, the original resolved with {} for non-mobile, but the function is async.
    // It should consistently return a promise.
    if (isMobile.value) { // If it IS mobile, then this test is not applicable.
      resolve({ message: "Local tests not applicable on mobile." }); // Resolve with empty or indicator
      return;
    }

    if (!wsLocal.value || wsLocal.value.readyState !== WebSocket.OPEN) {
      console.error("Local WebSocket not open for initLocalTest");
      // Attempt to wait a very short period for connection if wsLocal is defined but not open yet
      // This is a bit of a hack; ideally, wsLocal should be ensured open before calling.
      if (wsLocal.value) {
          setTimeout(() => {
              if (wsLocal.value && wsLocal.value.readyState === WebSocket.OPEN) {
                  triggerLocalTestExecution(resolve, reject);
              } else {
                  reject(new Error('Local WebSocket is not ready for local test.'));
              }
          }, 500); // wait 500ms
      } else {
          reject(new Error('Local WebSocket is not available for local test.'));
      }
      return;
    }
    triggerLocalTestExecution(resolve, reject);
  });
}

function triggerLocalTestExecution(resolve, reject) {
    let localTestTimeout;

    const localTestMessageHandler = event => {
      clearTimeout(localTestTimeout); // Clear timeout on any message

      if (event.data instanceof ArrayBuffer) return;
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'net-test') {
          if (msg.message) {
            liveMsg.value = msg.message;
            updateBar(liveMsg.value);
          }
          if (msg.done) {
            wsLocal.value.removeEventListener('message', localTestMessageHandler); // Clean up listener
            resolve(msg.metrics || {});
            finalizeBar();
          } else {
            // Reset timeout if we got a progress message but not 'done'
            localTestTimeout = setTimeout(() => {
              console.error('Local test timed out waiting for next message or completion.');
              Notify.failure(t('Local test phase timed out.'));
              wsLocal.value.removeEventListener('message', localTestMessageHandler); // Clean up
              reject(new Error('Local test timed out.'));
            }, config.value?.localTest?.messageTimeout || 30000);
          }
        }
      } catch (e) {
        console.error("Error parsing local test message:", e, event.data);
      }
    };

    wsLocal.value.addEventListener('message', localTestMessageHandler);
    wsLocal.value.send(JSON.stringify({type: 'net-test', start: true}));

    // Initial timeout for the local test to start sending messages or complete
    localTestTimeout = setTimeout(() => {
        console.error('Local test timed out waiting for initial response or completion.');
        Notify.failure(t('Local test phase timed out.'));
        wsLocal.value.removeEventListener('message', localTestMessageHandler); // Clean up
        reject(new Error('Local test timed out.'));
    }, config.value?.localTest?.startTimeout || 60000);
}


function downloadStarted(obj) {
  waitingForTest.value = true; // Still waiting for local app connection
  showDownload.value = false;
  showInstructions.value = true;
  instructObj.value = obj;
}

const STEP_MAP = [ // Moved to const for easier reference
    'Starting Network Test',
    'Measuring Latency',
    'Performing Download Test',
    'Performing Upload Test',
    'Measuring Jitter and Packet Loss',
    // Messages from local client, ensure these exact strings are sent by electron app for progress
    'Performing Port Scan',
    'Performing ICMP Scan',
    'Performing Traceroute',
    'Gathering System Information',
    'Measuring Mean Opinion Score (MOS)',
    'Test Completed' // Added a final step
];

function updateBar(stepKey) { // stepKey is the message from liveMsg, which should be a key for t()
  const stepText = t(stepKey); // Translate the current step message if it's a key
                               // Or, if liveMsg is already translated, this might not be needed here.
                               // Assuming liveMsg holds keys like 'Starting Network Test' which are then translated by template
                               // So, for internal mapping, use the English key.

  const stepIndex = STEP_MAP.indexOf(stepKey); // Use the key directly from STEP_MAP
  const bar = modules.progressBarInstances.get('net-test-progress'); // Using placeholder
  if (!bar) {
    console.warn("Progress bar 'net-test-progress' not found in modules.");
    return;
  }

  if (stepIndex !== -1) {
    actualProgress = (stepIndex + 1) / STEP_MAP.length;
    bar.animate(actualProgress, { duration: 300, easing: 'easeInOut' });
    targetProgress = Math.min((stepIndex + 2) / STEP_MAP.length, 1);
    setTimeout(() => startDrift(bar), 400);
  } else {
    console.warn(`Step "${stepKey}" not found in STEP_MAP for progress bar.`);
    // Fallback: if step is not in map, maybe it's a sub-step.
    // For now, only advance on known major steps.
    // Or, advance slightly if bar.value() < actualProgress
    if (bar.value() < actualProgress && actualProgress < targetProgress) {
        // We are in a drifting phase, let drift continue or set to actualProgress.
        // No explicit action here, rely on drift or next major step.
    }
  }
}

function finalizeBar() {
  cancelAnimationFrame(driftRAF);
  const bar = modules.progressBarInstances.get('net-test-progress');
  if (bar) bar.animate(1, {duration: 500, easing: 'easeOut'});
}

function startDrift(bar, speed = 0.0005) { // Reduced default drift speed
  cancelAnimationFrame(driftRAF);
  function drift() {
    const current = bar.value();
    if (current === undefined || current === null) { // Guard against undefined bar.value() from placeholder
        console.warn("Progress bar value is undefined, stopping drift.");
        return;
    }
    const delta = targetProgress - current;

    if (Math.abs(delta) < 0.001 || current >= targetProgress) { // Stop if close enough or overshot target
        if (current > targetProgress && targetProgress < 1) bar.set(targetProgress); // Snap back if overshot
        return;
    }

    const newValue = current + Math.sign(delta) * speed;
    bar.set(Math.min(targetProgress, Math.max(current, newValue))); // Ensure it doesn't go beyond targetProgress for this step

    driftRAF = requestAnimationFrame(drift);
  }
  drift();
}

</script>

<style scoped>
  /* @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');
    font-family: 'DM Sans', sans-serif; */ /* Commented out as it's not a valid @font-face rule here, should be global */

  /* @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');
    font-family: 'Poppins', sans-serif; */ /* Same as above */

  /* These should be in a global CSS file or in main.js if loaded that way */

  :deep(.popover) {
    max-width: 400px !important;
    z-index: 1050; /* Ensure popovers are above other elements if needed */
  }

  /* Basic styling for progress bar if not provided by a library */
  .progressbar {
    width: 100%;
    height: 10px;
    background-color: #e0e0e0;
    border-radius: 5px;
    overflow: hidden; /* Ensures the inner bar respects border radius */
    margin-top: 10px;
  }
  .progressbar.line.blue { /* Placeholder for actual progress bar if modules.progressBar is a specific library */
    /* This styling might be handled by the progress bar library itself.
       If it's a simple div, you'd have an inner div for the progress.
       Example: <div class="progressbar line blue"><div style="width: X%"></div></div>
       The provided script suggests a JS library is manipulating this.
    */
  }

  /* Add some basic button styling if no framework is immediately available */
  .btn {
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
    text-align: center;
    border: 1px solid transparent;
  }
  .btn-gradient { /* Placeholder for gradient buttons */
    color: white;
    background-image: linear-gradient(to right, #ff8a00, #e52e71); /* Example gradient */
  }
  .rounded-pill {
    border-radius: 50rem !important; /* Bootstrap like */
  }
  .me-2 {
    margin-right: 0.5rem !important; /* Bootstrap like */
  }
  .spinner-border {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    vertical-align: -0.125em;
    border: .2em solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    -webkit-animation: .75s linear infinite spinner-border;
    animation: .75s linear infinite spinner-border;
  }
  .spinner-border-sm {
    width: 0.8rem;
    height: 0.8rem;
    border-width: .15em;
  }
  @-webkit-keyframes spinner-border {
    to { -webkit-transform: rotate(360deg); transform: rotate(360deg); }
  }
  @keyframes spinner-border {
    to { -webkit-transform: rotate(360deg); transform: rotate(360deg); }
  }

</style>
