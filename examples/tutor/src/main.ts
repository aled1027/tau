import "./index.css";

// Load tutor plugins eagerly at page load time
import "./plugins/index.js";

import "./components/tutor-root.js";

const root = document.getElementById("root")!;
root.innerHTML = "<tutor-root></tutor-root>";
