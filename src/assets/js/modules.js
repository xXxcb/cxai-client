import ProgressBar from 'progressbar.js'; // Import progressbar.js
import { Waypoint } from 'waypoints/lib/noframework.waypoints.js'; // Import Waypoint

let modules = {};

// This function seems to be for a "scroll to top" progress indicator,
// which is not directly related to the network test progress bar in NetworkTest.vue.
// Keeping it as provided by the user.
modules.pageProgress = () => {
  var progressWrap = document.querySelector('.progress-wrap'); // Needs <div class="progress-wrap"><svg><path>...</path></svg></div> in HTML

  if (progressWrap != null) {
    var progressPath = document.querySelector('.progress-wrap path');
    if (!progressPath) {
        console.warn('.progress-wrap path element not found for pageProgress.');
        return;
    }
    var pathLength = progressPath.getTotalLength();
    var offset = 50;
    progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
    progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
    progressPath.style.strokeDashoffset = pathLength;
    progressPath.getBoundingClientRect();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';

    const updateProgress = () => {
      var scroll = document.body.scrollTop || document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (height === 0) return; // Avoid division by zero
      var progress = pathLength - (scroll * pathLength / height);
      progressPath.style.strokeDashoffset = progress;
      var scrollElementPos = document.body.scrollTop || document.documentElement.scrollTop;
      if (scrollElementPos >= offset) {
        progressWrap.classList.add("active-progress");
      } else {
        progressWrap.classList.remove("active-progress");
      }
    };

    window.addEventListener("scroll", updateProgress);

    progressWrap.addEventListener('click', function(e) {
      e.preventDefault();
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    });
  }
};

modules.progressBarInstances = new Map();

// This is the function used by NetworkTest.vue
modules.progressBar = () => {
  // The original query was for ".progressbar.line"
  // NetworkTest.vue uses id="net-test-progress" and class="progressbar line blue"
  // We'll select by ID for specificity, or ensure the class is used for selection.
  // For now, let's assume the element in NetworkTest.vue will be adapted to be selectable by a class
  // or this function will be adapted if only one such bar is expected.
  const plineElements = document.querySelectorAll(".progressbar.line"); // Selects elements with both classes

  if (plineElements.length === 0) {
    // console.warn("No elements found with class '.progressbar.line' for progressBar module.");
    // Fallback or specific ID selection if needed:
    const specificBar = document.getElementById('net-test-progress');
    if (specificBar && specificBar.classList.contains('progressbar') && specificBar.classList.contains('line')) {
        plineElements = [specificBar]; // Use this specific bar
    } else {
        // console.warn("Element with ID 'net-test-progress' also not suitable or found.");
        return; // No suitable elements
    }
  }


  plineElements.forEach(e => {
    // Ensure an ID exists for mapping, or generate one if necessary.
    // For NetworkTest.vue, the element already has id="net-test-progress".
    const barId = e.id || `progressbar-${Math.random().toString(36).substr(2, 9)}`;
    if (!e.id) e.id = barId;


    const line = new ProgressBar.Line(e, {
      strokeWidth: 6,
      trailWidth: 6,
      duration: 300, // Adjusted from original 800ms for better responsiveness in test UI
      easing: 'easeInOut',
      svgStyle: { width: '100%', height: '100%', borderRadius: '5px' }, // height 100% of container
      text: {
        // Text display is not used in the NetworkTest.vue original UI for this bar.
        // Enabling it would show "X %" text.
        // Keeping it as per user's code, but it might need styling or disabling if not desired.
        style: {
          color: 'inherit', // Inherit color from parent
          position: 'absolute',
          right: '0px', // Adjusted to '0px'
          top: '-20px', // Position above the bar
          padding: '0',
          margin: '0',
          transform: null,
        },
        autoStyleContainer: false
      },
      step: (state, lineInstance) => { // Renamed 'line' to 'lineInstance' to avoid conflict
        // lineInstance.setText(Math.round(lineInstance.value() * 100) + ' %');
        // The text display might not be desired for the NetworkTest.vue progress bar.
        // If text is not needed, this step function can be simplified or text display disabled.
        // For now, if the text element is styled to be hidden or not part of the layout, this is fine.
      }
    });

    modules.progressBarInstances.set(barId, line);

    const value = parseFloat(e.getAttribute('data-value')) / 100; // Ensure float parsing

    // Waypoint integration: Animate when it comes into view.
    // For NetworkTest.vue, the progress bar is usually always in view once the test starts.
    // This might be more relevant for other uses of progress bars on a longer page.
    if (typeof Waypoint !== 'undefined') {
      new Waypoint({
        element: e,
        handler: function () {
          if (!isNaN(value)) { // Animate only if data-value was valid
            // line.animate(value); // Initial animation based on data-value might not be what we want for dynamic test progress
          }
        },
        offset: 'bottom-in-view', // Trigger when bottom of element enters view
      });
    } else {
        console.warn("Waypoint library not found for progressBar module.");
    }
  });
};

// The user's code had `modules.init = () => { modules.pageProgress() }`
// This implies `modules.init()` should be called somewhere if `pageProgress` is desired.
// For NetworkTest.vue, only `modules.progressBar()` is explicitly called.
// If `init` is standard for this module, we should keep it.
modules.init = () => {
    // console.log("modules.init() called");
    // modules.pageProgress(); // Call if the scroll-to-top progress is needed globally
    // modules.progressBar(); // Call if progress bars should be auto-initialized on page load
};


export default modules;
