// socketRecon.js
// Using the provided implementation.
// Note: This version of createReconnectingSocket has a different signature
// than the placeholder that was initially in NetworkTest.vue.
// NetworkTest.vue's calls will need to be updated to match this new signature.
// Specifically, it now takes onMessage and onDisconnect callbacks.

import { ref } from 'vue'; // Assuming Vue is globally available or use 'vue' if in a strict module env.
                           // For Vite, `import { ref } from 'vue'` is standard.

/**
 * Try to open a WebSocket until it succeeds or maxRetries is hit.
 * Returns a Promise that resolves with an OPEN socket.
 */
export function openWithRetry(makeSocket, opts = {}) {
  const { maxRetries = 5, delayMs = 400 } = opts; // Reduced maxRetries for faster feedback in dev

  return new Promise((resolve, reject) => {
    let tries = 0;
    let ws;

    const tryOpen = () => {
      if (tries >= maxRetries) {
        return reject(
          new Error(`WebSocket failed after ${maxRetries} attempts`)
        );
      }
      tries += 1;
      ws = makeSocket();

      const cleanup = () => {
        ws.removeEventListener('open',  onOpen);
        ws.removeEventListener('error', onError);
        ws.removeEventListener('close', onClose);
      };

      const onOpen = () => {
        cleanup();
        // console.log(`[WS openWithRetry] Connected at ${new Date().toISOString()} to ${ws.url}`);
        resolve(ws);                 // ✅ connected!
      };

      const onError = (err) => {
        // console.error(`[WS openWithRetry] Error on attempt ${tries} for ${ws.url}:`, err);
        // Don't cleanup here, onClose will handle retry.
      };

      const onClose = (event) => {
        cleanup();
        // console.log(`[WS openWithRetry] Closed on attempt ${tries} for ${ws.url}. Code: ${event.code}, Reason: ${event.reason}`);
        if (tries >= maxRetries) { // Check again in case it closed immediately after maxRetries was hit in tryOpen
          return reject(new Error(`WebSocket failed to connect and stay open after ${maxRetries} attempts to ${ws.url}. Last close code: ${event.code}`));
        }
        setTimeout(tryOpen, delayMs); // 🔁 retry
      };

      ws.addEventListener('open',  onOpen,  { once: true });
      ws.addEventListener('error', onError, { once: true }); // Listen to error to log it, but retry on close
      ws.addEventListener('close', onClose, { once: true });
    };

    tryOpen();                        // initial attempt
  });
}

/**
 * Manages a reconnecting WebSocket.
 *
 * @param {string} url - The WebSocket URL.
 * @param {string} id - An identifier for this connection (e.g., client_id for API, 'local' for local client).
 * @param {object} configForRegister - Configuration data sent upon successful (re)connection in a 'register' message.
 * @param {function} onMessageCallback - (event) => void - Called when a message is received.
 * @param {function} onDisconnectCallback - (details) => void - Called when the socket disconnects.
 * @param {object} [opts={}] - Options for retry behavior.
 * @returns {{ socketRef: import('vue').Ref<WebSocket|null>, isConnected: import('vue').Ref<boolean>, whenConnected: Promise<WebSocket>, send: (data: any) => void, disconnect: () => void }}
 */
export function createReconnectingSocket( url, id, configForRegister, onMessageCallback, onDisconnectCallback, opts = {} ) {
  const {
    initialMaxRetries = 5,    // for the very first connection attempt series
    initialDelayMs = 400,     // delay for initial attempts
    reconnectDelayMs = 1000,  // delay before attempting to reconnect a dropped session
    reconnectMaxRetries = Infinity // Retries for re-establishing a dropped connection (can be Infinity)
  } = opts;

  const socketRef = ref(null);
  const isConnected = ref(false);
  let explicitlyClosed = false; // Flag to prevent reconnection if disconnect() is called

  const connect = () => {
    explicitlyClosed = false;
    return openWithRetry(
      () => {
        const ws = new WebSocket(url);
        // Assign onmessage directly if ws instance is fresh, before openWithRetry's internal listeners
        // or rely on adding event listener after connection.
        // For this structure, it's better to add listeners after `openWithRetry` resolves.
        return ws;
      },
      { maxRetries: initialMaxRetries, delayMs: initialDelayMs }
    )
    .then((wsInstance) => {
      socketRef.value = wsInstance;
      isConnected.value = true;
      // console.log(`[WS createReconnectingSocket - ${id}] Successfully connected to ${url}`);

      // Send registration message
      if (wsInstance.readyState === WebSocket.OPEN) {
        wsInstance.send(JSON.stringify({ type: 'register', id: id, config: configForRegister }));
      } else {
        // This case should ideally not happen if openWithRetry resolves with an OPEN socket
        wsInstance.addEventListener('open', () => {
          wsInstance.send(JSON.stringify({ type: 'register', id: id, config: configForRegister }));
        }, { once: true });
      }

      // Attach long-term handlers
      wsInstance.onmessage = (event) => {
        if (onMessageCallback) {
          onMessageCallback(event);
        }
      };

      wsInstance.onerror = (errorEvent) => {
        // console.error(`[WS createReconnectingSocket - ${id}] Error:`, errorEvent);
        // The 'close' event will typically follow an error that closes the socket.
        // No specific reconnection logic here, relying on onClose.
      };

      wsInstance.onclose = (closeEvent) => {
        // console.log(`[WS createReconnectingSocket - ${id}] Closed. Code: ${closeEvent.code}, Reason: ${closeEvent.reason}. ExplicitlyClosed: ${explicitlyClosed}`);
        isConnected.value = false;
        socketRef.value = null;

        if (onDisconnectCallback) {
          onDisconnectCallback({ event: closeEvent, when: new Date().toISOString(), id: id });
        }

        if (!explicitlyClosed) {
          // console.log(`[WS createReconnectingSocket - ${id}] Attempting to reconnect in ${reconnectDelayMs}ms...`);
          setTimeout(() => {
            // Recurse with connect, but use reconnectMaxRetries
            // This is a simplified recursion; a more robust solution might use a different retry strategy for ongoing reconnections.
            // For this version, we'll just call connect() again which uses initialMaxRetries.
            // To implement reconnectMaxRetries, connect would need to track its depth or mode.
            // For simplicity, we'll just retry the initial connection logic.
            if (!explicitlyClosed) { // Check again before retrying
                 connect().catch(err => {
                    // console.error(`[WS createReconnectingSocket - ${id}] Reconnect attempt series failed:`, err);
                    // Potentially schedule another full connect attempt after a longer delay or stop.
                    // For now, if openWithRetry fails, it stops for this round. The user might need to manually re-initiate.
                 });
            }
          }, reconnectDelayMs);
        }
      };
      return wsInstance; // Return the connected socket
    })
    .catch((err) => {
      // console.error(`[WS createReconnectingSocket - ${id}] Initial connection sequence failed:`, err);
      if (onDisconnectCallback) { // Notify of ultimate failure to connect initially
        onDisconnectCallback({ error: err, when: new Date().toISOString(), id: id, phase: 'initial connection' });
      }
      throw err; // Re-throw for the caller to handle if needed
    });
  };

  const whenConnectedPromise = connect();

  const send = (data) => {
    if (socketRef.value && socketRef.value.readyState === WebSocket.OPEN) {
      const jsonData = typeof data === 'string' ? data : JSON.stringify(data);
      socketRef.value.send(jsonData);
    } else {
      console.warn(`[WS createReconnectingSocket - ${id}] Cannot send data, socket not open. State: ${socketRef.value?.readyState}`);
      // Optionally queue messages or throw error
    }
  };

  const disconnect = () => {
    // console.log(`[WS createReconnectingSocket - ${id}] disconnect() called.`);
    explicitlyClosed = true;
    if (socketRef.value) {
      socketRef.value.close(1000, "Client initiated disconnect"); // Standard close code
    }
    isConnected.value = false;
    socketRef.value = null;
  };

  return {
    socketRef, // A Vue ref holding the current WebSocket instance (or null)
    isConnected, // A Vue ref<boolean>
    whenConnected: whenConnectedPromise, // Promise that resolves with the first successfully connected WebSocket
    send,        // Method to send data
    disconnect   // Method to explicitly close the WebSocket and prevent reconnection
  };
}
