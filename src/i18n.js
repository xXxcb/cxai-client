import { createI18n } from 'vue-i18n';

// Basic messages. In a real app, these might be in separate JSON files per locale.
const messages = {
  en: {
    // Messages used in NetworkTest.vue template with $t(liveMsg)
    'Starting Network Test': 'Starting Network Test',
    'Measuring Latency': 'Measuring Latency',
    'Performing Download Test': 'Performing Download Test',
    'Performing Upload Test': 'Performing Upload Test',
    'Measuring Jitter and Packet Loss': 'Measuring Jitter and Packet Loss',
    'Performing Port Scan': 'Performing Port Scan', // From STEP_MAP
    'Performing ICMP Scan': 'Performing ICMP Scan', // From STEP_MAP
    'Performing Traceroute': 'Performing Traceroute', // From STEP_MAP
    'Gathering System Information': 'Gathering System Information', // From STEP_MAP
    'Measuring Mean Opinion Score (MOS)': 'Measuring Mean Opinion Score (MOS)',
    'Test Completed': 'Test Completed',
    'Local WebSocket disconnected': 'Local CXAi Desktop application disconnected.', // Used in watch wsLocal.value.readyState
    'Test failed. Please try again.': 'Test failed. Please try again.', // Used in startTest catch

    // Messages used with Notify.failure(t(...))
    'Failed to load initial configuration.': 'Failed to load initial configuration.',
    'Could not connect to the local CXAi Desktop application. Please ensure it is running.': 'Could not connect to the local CXAi Desktop application. Please ensure it is running.',
    'Failed to connect to the local CXAi Desktop application. Please ensure it is running and try again.': 'Failed to connect to the local CXAi Desktop application. Please ensure it is running and try again.',
    'Local CXAi Desktop application disconnected.': 'Local CXAi Desktop application disconnected.', // Repeated, but used in Notify
    'Connection to local CXAi Desktop application lost.': 'Connection to local CXAi Desktop application lost.',
    'Client not found or invalid link. Redirecting...': 'Client not found or invalid link. Redirecting...',
    'Pre-authentication failed. Please check the link or try again.': 'Pre-authentication failed. Please check the link or try again.',
    'API connection not ready. Cannot start test.': 'API connection not ready. Cannot start test.',
    'An error occurred during the network test. Please try again.': 'An error occurred during the network test. Please try again.',
    'A name and email address are required to start the test.': 'A name and email address are required to start the test.',
    'Please enter a valid email address.': 'Please enter a valid email address.',
    'Could not initialize test. Please try again.': 'Could not initialize test. Please try again.',
    'An unexpected error occurred. Please try again.': 'An unexpected error occurred. Please try again.',
    'Network error or server unavailable. Please try again.': 'Network error or server unavailable. Please try again.',
    'Latency ping timed out': 'Latency ping timed out', // Error message from measureLatency
    'Download test timed out': 'Download test timed out', // Error message from measureDownload
    'Upload test timed out waiting for result': 'Upload test timed out waiting for result', // Error message from measureUpload
    'Local test phase timed out.': 'Local test phase timed out.', // Error message from initLocalTest/triggerLocalTestExecution
    'Failed to connect to API service (placeholder).': 'Failed to connect to API service (placeholder).',


    // Example for a more complex message from newClient errors
    // If err.response.data.errors is an array of { message: "key" }
    // You would need to handle that dynamically or ensure keys are consistent.
    // For now, assuming direct message keys.
  },
  // Add other languages here, e.g., 'es': { ... }
};

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: import.meta.env.VITE_I18N_LOCALE || 'en', // Default locale
  fallbackLocale: import.meta.env.VITE_I18N_FALLBACK_LOCALE || 'en',
  messages,
});

export default i18n;
