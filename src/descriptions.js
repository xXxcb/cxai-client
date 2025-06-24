// descriptions.js

// The user provided this as a simple object, not a computed property.
// Vue's v-popover will reactively update if the bound object changes,
// but these descriptions are static, so a simple object is fine.
// If they needed to be reactive (e.g., for i18n), then computed or ref would be appropriate.

const descriptions = {
  download: `<p>Download speed measures how quickly data can be transferred <strong>from the internet to your device</strong>. It is typically measured in megabits per second (Mbps). Higher download speeds allow for faster loading of web pages, streaming videos, and downloading files.</p>`,
  upload: `<p>Upload speed measures how quickly data can be <strong>sent from your device to the internet</strong>. It is also measured in megabits per second (Mbps). Higher upload speeds are important for activities like sending large files, video conferencing, and live streaming.</p>`,
  latency: `<p>Latency, often referred to as ping, is the time it takes for a data packet to travel from your device to a server and back. It is measured in milliseconds (ms). Lower latency means a more responsive connection, which is crucial for real-time applications like online gaming and video calls.</p>`,
  mos: `<p>Mean Opinion Score (MOS) is a numerical measure of the quality of a voice or video call. It ranges from 1 to 5, with higher scores indicating better quality. MOS takes into account factors like clarity, delay, and overall user experience during calls.</p>`,
  jitter: `<p>Jitter is the variation in latency over time. It measures how much the delay of data packets varies, which can affect the quality of real-time communications. Lower jitter values indicate a more stable connection, while higher values can lead to choppy audio or video during calls.</p>`,
  rtt: `<p>Round Trip Time (RTT) is the total time it takes for a data packet to travel from your device to a server and back again. It is similar to latency but includes both the outgoing and incoming journey. Lower RTT values indicate a more efficient connection, which is important for activities like online gaming and video conferencing.</p>`,
  packetLoss: `<p>Packet loss occurs when data packets traveling over the network fail to reach their destination. It is typically expressed as a percentage. Lower packet loss rates indicate a more reliable connection, while higher rates can lead to interruptions in streaming, gaming, or video calls.</p>`,
};

export default descriptions;
