import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import axios from 'axios' // Import axios

// Import CSS
import './style.css' // Your global styles, includes font imports
import 'bootstrap/dist/css/bootstrap.min.css' // Import Bootstrap CSS
import 'floating-vue/dist/style.css' // Import FloatingVue CSS

// Import FloatingVue plugin
import FloatingVue from 'floating-vue'

// Create an Axios instance (optional: configure with base URL, headers, etc.)
const axiosInstance = axios.create({
  // baseURL: '/api', // Example: if your API is served from a subpath
  // timeout: 10000, // Example: 10 second timeout
  // headers: {'X-Custom-Header': 'foobar'}
});

const app = createApp(App)

// Provide the Axios instance for injection in components
app.provide('axios', axiosInstance)

app.use(router)
app.use(i18n)
app.use(FloatingVue, {
    // Global options for FloatingVue if needed
    // distance: 12, // Default distance of popover from target
    // themes: {
    //   'my-custom-theme': {
    //     $extend: 'tooltip', // Extend another theme
    //     $vars: {
    //       // Theme variables
    //       background: '#000',
    //       color: '#fff',
    //     },
    //   },
    // },
})

app.mount('#app')
