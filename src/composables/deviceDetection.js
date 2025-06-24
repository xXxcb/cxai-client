import { computed } from 'vue'

export function useDeviceDetection() {
  const userAgent = navigator.userAgent || navigator.vendor || (window.opera ? window.opera.toString() : "");
  const platformDetails = navigator.platform || ''; // Use navigator.platform for OS hints

  // More detailed OS detection
  const isWindows = /Win/i.test(platformDetails);
  const isMac = /Mac/i.test(platformDetails);
  // For Linux, navigator.platform often returns "Linux armv[7-8]l", "Linux i686", "Linux x86_64" etc.
  const isLinux = /Linux/i.test(platformDetails);

  // Mobile OS detection from User Agent
  const isAndroid = /android/i.test(userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window.MSStream || navigator.msMaxTouchPoints); // Added check for !window.MSStream for older IE mobile on Windows

  const os = computed(() => {
    if (isAndroid) return 'Android';
    if (isIOS) return 'iOS';
    if (isWindows) return 'Windows'; // Could be more specific (e.g. Windows 10/11) but 'Windows' is fine
    if (isMac) return 'macOS';
    if (isLinux) return 'Linux'; // Could be more specific (e.g. Ubuntu) but 'Linux' is fine
    return 'Unknown OS';
  });

  const deviceType = computed(() => {
    const ua = userAgent.toLowerCase();
    // Check for mobile first
    if (/mobi|mobile|iphone|ipod|android.*mobile|windows phone|iemobile/.test(ua)) return 'Mobile';
    // Check for tablet
    if (/tablet|ipad|android(?!.*mobile)/.test(ua)) return 'Tablet';
    // Otherwise, assume Desktop
    return 'Desktop';
  });

  return {
    os,
    deviceType,
    // Expose raw checks if they are useful externally
    isAndroid,
    isIOS,
    isWindows,
    isMac,
    isLinux,
    userAgent // Exposing userAgent might be useful for debugging or more specific checks
  };
}
