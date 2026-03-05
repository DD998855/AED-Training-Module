/**
 * AED Training Module
 * - Guided learning: step-by-step with visuals + micro-checks (recognition)
 * - Practice: interactive quiz (partial hints)
 * - Final assessment: drag-drop order (recall)
 */

console.log("? AED Training Module - JavaScript loaded successfully!");

// === AUDIO FEEDBACK SYSTEM ===
const AudioFeedback = {
  successSound: null,
  errorSound: null,
  init() {
    // Create simple success beep using AudioContext
    this.successSound = () => {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    };
    // Create error sound
    this.errorSound = () => {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 200;
      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    };
  },
  playSuccess() {
    try { if (this.successSound) this.successSound(); } catch(e) { }
  },
  playError() {
    try { if (this.errorSound) this.errorSound(); } catch(e) { }
  }
};

const STEPS = [
  {
    id: "s1",
    group: "Preparation",
    title: "Power on AED",
    subtitle: "Turn on the AED immediately when it arrives.",
    goal: "Ensure the AED is ready to provide voice prompts and begin rhythm analysis without delay.",
    instruction: "Place AED near the patient's head (operator side). Open the case and press Power (or open lid). Follow voice prompts.",
    image: "assets/Frame-1.png",
    imgAlt: "Placeholder image for Step 1: Power on AED",
    microCheck: {
      prompt: "Why should you power on the AED immediately?",
      options: [
        { text: "To avoid delaying rhythm analysis and treatment", correct: true },
        { text: "Because pads can only stick if the AED is on", correct: false },
        { text: "So you can shock right away without analysis", correct: false }
      ],
      hint: "AED guides you. Turning it on immediately starts prompts and analysis sooner."
    },
    commonMistake: "Delayed power-on (waiting to finish CPR cycle first).",
    criticalFail: null
  },
  {
    id: "s2",
    group: "Preparation",
    title: "Expose & dry the chest",
    subtitle: "Remove clothing. Dry sweat/water. Shave if needed.",
    goal: "Ensure the patient's chest is bare and dry for optimal pad adhesion and accurate rhythm detection.",
    instruction: "Remove clothing from chest for direct skin contact. If wet, dry with towel. If excessive hair interferes, use razor from AED kit to shave pad sites.",
    image: "assets/Frame-2.png",
    imgAlt: "Placeholder image for Step 2: Expose and dry chest",
    microCheck: {
      prompt: "What is the main reason to dry the chest?",
      options: [
        { text: "Better pad adhesion and fewer pad errors", correct: true },
        { text: "So the AED can detect breathing", correct: false },
        { text: "To reduce chest compressions pain", correct: false }
      ],
      hint: "Wet skin or hair can reduce adhesion and trigger 'Check Pads' delays."
    },
    commonMistake: "Poor pad adhesion (pads not pressed firmly / wet chest).",
    criticalFail: null
  },
  {
    id: "s3",
    group: "Pads & Analysis",
    title: "Apply AED pads",
    subtitle: "Place pads exactly as illustrated on packaging.",
    goal: "Position electrode pads correctly to enable effective current flow through the heart.",
    instruction: "Apply self-adhesive pads to bare chest. One on upper right chest (infraclavicular). One on lower left side (mid-axillary line).",
    image: "assets/Frame-3.png",
    imgAlt: "Placeholder image for Step 3: Apply pads",
    microCheck: {
      prompt: "Which pad placement is correct?",
      options: [
        { text: "Upper right chest + lower left side", correct: true },
        { text: "Both pads centered on sternum", correct: false },
        { text: "Both pads on left chest near each other", correct: false }
      ],
      hint: "Correct placement helps current flow through the heart effectively."
    },
    commonMistake: "Pads placed too close together / reversed.",
    criticalFail: "Incorrect pad placement can reduce effectiveness."
  },
  {
    id: "s4",
    group: "Pads & Analysis",
    title: "Connect electrode cable",
    subtitle: "Connect pads cable if not pre-connected.",
    goal: "Establish electrical connection between pads and AED to enable rhythm analysis.",
    instruction: "Connect electrode cable to AED unit (if needed). Prepare to stop CPR for analysis.",
    image: "assets/Frame-4.png",
    imgAlt: "Placeholder image for Step 4: Connect cable",
    microCheck: {
      prompt: "When do you connect the cable?",
      options: [
        { text: "After pads are applied (if not pre-connected)", correct: true },
        { text: "Only after shock is advised", correct: false },
        { text: "Before turning on the AED", correct: false }
      ],
      hint: "Many AEDs have pre-connected pads, but you must confirm connection."
    },
    commonMistake: null,
    criticalFail: null
  },
  {
    id: "s5",
    group: "Pads & Analysis",
    title: "Clear the patient for analysis",
    subtitle: "Stop CPR. Do not touch the patient.",
    goal: "Allow the AED to accurately detect the patient's cardiac rhythm without interference.",
    instruction: "Ensure all rescuers stop CPR and clear the patient. Let AED analyze rhythm for several seconds to determine shockable rhythm.",
    image: "assets/Frame-5.png",
    imgAlt: "Placeholder image for Step 5: Rhythm analysis",
    microCheck: {
      prompt: "What MUST you do during rhythm analysis?",
      options: [
        { text: "Do not touch the patient", correct: true },
        { text: "Continue CPR to keep blood flowing", correct: false },
        { text: "Check pulse immediately", correct: false }
      ],
      hint: "Touching during analysis can confuse rhythm detection."
    },
    commonMistake: null,
    criticalFail: "Touching the patient during analysis."
  },
  {
    id: "s6",
    group: "Shock & CPR",
    title: "Announce 'Clear!' before shock",
    subtitle: "Make sure nobody touches patient or conductive surfaces.",
    goal: "Prevent accidental shock to rescuers and ensure safe delivery of electrical current.",
    instruction: "If shock advised, visually sweep and loudly state: 'I'm clear, you're clear, everybody's clear!' Ensure no contact with patient.",
    image: "assets/Frame-6.png",
    imgAlt: "Placeholder image for Step 6: Clear before shock",
    microCheck: {
      prompt: "Why announce 'Clear' out loud?",
      options: [
        { text: "To prevent someone from touching the patient during shock", correct: true },
        { text: "To help the AED charge faster", correct: false },
        { text: "To make the patient wake up", correct: false }
      ],
      hint: "Clear communication reduces critical errors in high-stress situations."
    },
    commonMistake: null,
    criticalFail: "Failing to clear during discharge."
  },
  {
    id: "s7",
    group: "Shock & CPR",
    title: "Deliver the shock",
    subtitle: "Press the Shock button when advised.",
    goal: "Deliver defibrillation shock at the right moment to restore normal heart rhythm.",
    instruction: "Press Shock button (often flashing orange/red). Maintain visual contact to ensure no one touches patient during shock.",
    image: "assets/Frame-7.png",
    imgAlt: "Placeholder image for Step 7: Deliver shock",
    microCheck: {
      prompt: "What should you monitor during the shock?",
      options: [
        { text: "Make sure nobody touches the patient", correct: true },
        { text: "Count chest compressions out loud", correct: false },
        { text: "Remove pads immediately after shock", correct: false }
      ],
      hint: "Safety first - prevent accidental contact and hazards (e.g., oxygen proximity)."
    },
    commonMistake: null,
    criticalFail: "Shock with uncontrolled oxygen source nearby."
  },
  {
    id: "s8",
    group: "Shock & CPR",
    title: "Resume CPR immediately",
    subtitle: "Do not wait for prompts or check pulse first.",
    goal: "Maintain blood circulation immediately after defibrillation to maximize survival chances.",
    instruction: "Immediately resume high-quality chest compressions. AED typically sets a 2-minute CPR timer before next analysis cycle.",
    image: "assets/Frame-8.png",
    imgAlt: "Placeholder image for Step 8: Resume CPR",
    microCheck: {
      prompt: "After shock, what should you do next?",
      options: [
        { text: "Resume CPR immediately", correct: true },
        { text: "Wait for next AED prompt before doing anything", correct: false },
        { text: "Check pulse for 30 seconds", correct: false }
      ],
      hint: "High-quality CPR resumes circulation while AED prepares for next analysis."
    },
    commonMistake: "Waiting for a new prompt before resuming CPR.",
    criticalFail: null
  }
];

// Practice phase uses different images (Frame-9 to Frame-16)
const PRACTICE_IMAGES = [
  "assets/Frame-9.png",
  "assets/Frame-10.png",
  "assets/Frame-11.png",
  "assets/Frame-12.png",
  "assets/Frame-13.png",
  "assets/Frame-14.png",
  "assets/Frame-15.png",
  "assets/Frame-16.png"
];

// Build a single answer key for all interactive quiz questions:
// Learn (1..N) + Practice (N+1..2N), cycling A/B/C.
const QUIZ_ANSWER_PLAN = [
  ...STEPS.map((_, stepIndex) => ({ phase: "learn", stepIndex, correctIndex: stepIndex % 3 })),
  ...STEPS.map((_, stepIndex) => ({ phase: "practice", stepIndex, correctIndex: (STEPS.length + stepIndex) % 3 }))
];

function getCorrectOptionIndex(phase, stepIndex){
  const row = QUIZ_ANSWER_PLAN.find(item => item.phase === phase && item.stepIndex === stepIndex);
  return row ? row.correctIndex : 0;
}

const state = {
  phase: "intro", // intro | learn | practice | assessment | summary | complete
  stepIndex: -1,  // for learn/practice
  guidedLearningProgress: new Set(),
  practiceProgress: new Set(),
  practiceScore: 0,
  assessmentResult: null,
  // Error tracking for remediation
  errorCount: {}, // { stepId: count }
  correctFirstTry: new Set(), // stepIds answered correctly first time
  retriesNeeded: 0
};

// ----- DOM -----
const DOM = {
  view: document.getElementById("view"),
  backBtn: document.getElementById("backBtn"),
  resetBtn: document.getElementById("resetBtn"),
  footerHint: document.getElementById("footerHint"),
  stepChecklist: document.getElementById("stepChecklist")
};

// Backward compatibility aliases
const view = DOM.view;
const backBtn = DOM.backBtn;
const resetBtn = DOM.resetBtn;
const footerHint = DOM.footerHint;
const stepChecklist = DOM.stepChecklist;

// ----- Inline toast helper (must be declared before render()) -----
let inlineToastEl = null;

function showInlineToast(kind, msg){
  clearInlineToast();
  inlineToastEl = document.createElement("div");
  inlineToastEl.className = `toast ${kind}`;
  inlineToastEl.textContent = msg;
  inlineToastEl.style.marginTop = "10px";
  view.appendChild(inlineToastEl);
  setTimeout(() => {
    clearInlineToast();
  }, 1200);
}

function clearInlineToast(){
  if(inlineToastEl && inlineToastEl.parentElement){
    inlineToastEl.parentElement.removeChild(inlineToastEl);
  }
  inlineToastEl = null;
}

// === MODAL/POPOVER SYSTEM ===
function showModal(type, title, message, buttons) {
  // Remove any existing modal
  const existing = document.querySelector('.modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  
  const modal = document.createElement('div');
  modal.className = 'modal';
  
  const headerClass = type === 'success' ? 'success' : 'error';
  const titleClass = type === 'success' ? 'success' : 'error';
  const icon = type === 'success' ? '✓' : '⚠';
  
  const header = document.createElement('div');
  header.className = `modal-header ${headerClass}`;
  header.innerHTML = `<h2 class="modal-title ${titleClass}">${icon} ${title}</h2>`;
  
  const body = document.createElement('div');
  body.className = 'modal-body';
  body.innerHTML = message;
  
  const footer = document.createElement('div');
  footer.className = 'modal-footer';
  
  buttons.forEach(btn => {
    const button = document.createElement('button');
    button.className = `btn ${btn.primary ? 'btn-primary' : 'btn-outline'}`;
    button.textContent = btn.text;
    button.onclick = () => {
      overlay.remove();
      if (btn.callback) btn.callback();
    };
    footer.appendChild(button);
  });
  
  modal.appendChild(header);
  modal.appendChild(body);
  modal.appendChild(footer);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  // Play sound
  if (type === 'success') {
    AudioFeedback.playSuccess();
  } else {
    AudioFeedback.playError();
  }
  
  return overlay;
}

function closeModal() {
  const overlay = document.querySelector('.modal-overlay');
  if (overlay) overlay.remove();
}

// ----- Critical: Validate ALL required DOM elements -----
console.log("?? Validating DOM elements...");
const missingElements = [];
const requiredElements = [
  'view', 'backBtn', 'resetBtn', 'footerHint',
  'stepChecklist'
];

requiredElements.forEach(id => {
  if (!DOM[id]) {
    missingElements.push(id);
    console.error(`? Missing element: #${id}`);
  } else {
    console.log(`? Found: #${id}`);
  }
});

if (missingElements.length > 0) {
  const errorMsg = `? FATAL ERROR: Missing ${missingElements.length} DOM elements: ${missingElements.join(', ')}\n\nCheck your index.html for these IDs!`;
  console.error(errorMsg);
  alert(errorMsg);
  throw new Error(errorMsg);
}

console.log("? All DOM elements validated!");

// ----- Init with error handling -----
console.log("?? Initializing app...");
try {
  // Initialize audio feedback
  AudioFeedback.init();
  console.log("?? Audio feedback initialized");
  
  renderChunks();
  render();
  console.log("? App initialized successfully!");

} catch (err) {
  console.error("? Initialization failed:", err);
  alert("App initialization failed. Check browser console for details.");
  throw err;
}

// ----- Events -----
console.log("?? Binding event listeners...");

try {
  resetBtn.addEventListener("click", () => {
    console.log("? Reset clicked - Restarting from beginning");
    state.phase = "intro";
    state.stepIndex = -1;
    state.guidedLearningProgress = new Set();
    state.practiceProgress = new Set();
    state.practiceScore = 0;
    state.assessmentResult = null;
    state.errorCount = {};
    state.correctFirstTry = new Set();
    state.retriesNeeded = 0;
    setPhaseUI("intro");
    renderChunks();
    render();
    console.log("?? Reset complete - back to Scenario");
  });

  backBtn.addEventListener("click", () => {
    console.log("? Back clicked");
    navigate(-1);
  });

  console.log("? All event listeners bound successfully!");
} catch (err) {
  console.error("? Failed to bind event listeners:", err);
  alert("Failed to setup event listeners. Check console for details.");
  throw err;
}

// ----- Navigation logic -----
function navigate(direction){
  // direction: -1 back, +1 next
  if(state.phase === "intro"){
    if(direction === 1){
      console.log("?? Starting Guided Learning from Scenario");
      state.phase = "learn";
      state.stepIndex = 0;
      setPhaseUI("learn");
      render();
    }
    return;
  }

  if(state.phase === "learn"){
    if(direction === -1){
      if(state.stepIndex === 0){
        state.phase = "intro";
        state.stepIndex = -1;
        setPhaseUI("intro");
      } else {
        state.stepIndex -= 1;
      }
      render();
      return;
    }

    // direction === 1
    if(!canProceedFromLearnStep()){
      // must finish micro-check
      showInlineToast("warn", "Complete the quick check before moving on.");
      return;
    }

    markLearned(state.stepIndex);

    if(state.stepIndex < STEPS.length - 1){
      state.stepIndex += 1;
      console.log(`?? Learn: Moving to step ${state.stepIndex + 1}`);
      render();
    } else {
      // end of learn phase - transition to practice
      console.log("? Learn phase complete! Transitioning to Practice...");
      state.phase = "practice";
      state.stepIndex = 0;
      state.practiceProgress = new Set(); // Reset practice progress
      setPhaseUI("practice");
      render();
    }
    return;
  }

  if(state.phase === "practice"){
    if(direction === -1){
      if(state.stepIndex === 0){
        state.phase = "learn";
        state.stepIndex = STEPS.length - 1;
        setPhaseUI("learn");
      } else {
        state.stepIndex -= 1;
      }
      render();
      return;
    }

    // direction === 1
    if(!canProceedFromPracticeStep()){
      showInlineToast("warn", "Answer the practice question before continuing.");
      return;
    }

    markLearned(state.stepIndex); // Mark practice step as completed

    if(state.stepIndex < STEPS.length - 1){
      state.stepIndex += 1;
      console.log(`?? Practice: Moving to step ${state.stepIndex + 1}`);
      render();
    } else {
      // end of practice phase - transition to summary
      console.log("? Practice phase complete! Transitioning to Summary...");
      state.phase = "summary";
      state.stepIndex = -1;
      setPhaseUI("summary");
      render();
    }
    return;
  }

  if(state.phase === "summary"){
    if(direction === -1){
      // go back to practice last step
      state.phase = "practice";
      state.stepIndex = STEPS.length - 1;
      setPhaseUI("practice");
      render();
      return;
    }

    // direction === 1 - move to assessment
    console.log("Moving from Summary to Assessment...");
    state.phase = "assessment";
    setPhaseUI("assessment");
    render();
    return;
  }

  if(state.phase === "assessment"){
    if(direction === -1){
      // go back to summary
      state.phase = "summary";
      setPhaseUI("summary");
      render();
      return;
    }

    // direction === 1
    if(state.assessmentResult?.passed){
      console.log("?? Assessment passed! Transitioning to Complete...");
      state.phase = "complete";
      setPhaseUI("complete");
      render();
    } else {
      showInlineToast("warn", "Finish the assessment (and pass) to continue.");
    }
    return;
  }

  if(state.phase === "complete"){
    if(direction === -1){
      console.log("?? Going back from Complete to Assessment");
      state.phase = "assessment";
      setPhaseUI("assessment");
      render();
    }
    return; // Prevent any further execution
  }
}

function setPhaseUI(phase){
  // update sidebar phases
  const items = document.querySelectorAll(".phase");
  items.forEach(li => {
    li.classList.remove("active");
    li.classList.remove("complete");
    
    const phaseOrder = ["intro", "learn", "practice", "assessment", "complete"];
    const currentIndex = phaseOrder.indexOf(phase);
    const itemIndex = phaseOrder.indexOf(li.dataset.phase);
    
    // Mark as active if it's the current phase
    if(li.dataset.phase === phase) {
      li.classList.add("active");
    }
    
    // Mark as complete if it's before the current phase
    if(itemIndex < currentIndex) {
      li.classList.add("complete");
    }
    
    // Special case: when on complete phase, mark complete itself as both active and complete
    if(phase === "complete" && li.dataset.phase === "complete") {
      li.classList.add("complete");
      li.classList.add("active");
    }
  });
}

function markLearned(stepIndex){
  const step = STEPS[stepIndex];
  
  // Add to appropriate progress set based on current phase
  if(state.phase === "learn"){
    state.guidedLearningProgress.add(step.id);
    console.log(`? Marked step ${stepIndex + 1} as learned in Guided Learning`);
  } else if(state.phase === "practice"){
    state.practiceProgress.add(step.id);
    console.log(`? Marked step ${stepIndex + 1} as completed in Practice`);
  }
  
  renderChunks();
}

function renderChunks(){
  if (!stepChecklist) {
    console.error("? renderChunks: Missing stepChecklist element");
    return;
  }

  stepChecklist.innerHTML = "";
  
  // Get the appropriate progress set based on current phase
  let currentProgress = new Set();
  if(state.phase === "learn"){
    currentProgress = state.guidedLearningProgress;
  } else if(state.phase === "practice"){
    currentProgress = state.practiceProgress;
  }

  STEPS.forEach((s, idx) => {
    const item = document.createElement("div");
    item.className = "checklist-item";
    
    // Determine status: completed, current, or future
    const isCompleted = currentProgress.has(s.id);
    const isCurrent = (state.phase === "learn" || state.phase === "practice") && state.stepIndex === idx;
    
    if (isCompleted) item.classList.add("completed");
    if (isCurrent) item.classList.add("current");
    
    // Icon: SVG checkmark for completed, filled circle for current, empty circle for future
    let iconHtml = '<span class="checklist-icon" style="font-size:16px;">○</span>'; // future
    
    if (isCompleted) {
      // Animated SVG checkmark
      iconHtml = `
        <svg class="checklist-icon checkmark-svg" viewBox="0 0 24 24" width="20" height="20" style="display:inline-block; vertical-align:middle;">
          <path d="M20 6L9 17l-5-5" stroke="#2dd4bf" stroke-width="2.5" fill="none" 
                stroke-linecap="round" stroke-linejoin="round" 
                style="stroke-dasharray: 20; stroke-dashoffset: 20; animation: checkmarkDraw 0.4s ease forwards;"/>
        </svg>
      `;
    } else if (isCurrent) {
      iconHtml = '<span class="checklist-icon" style="font-size:16px;">●</span>';
    }
    
    item.innerHTML = `
      ${iconHtml}
      <span class="checklist-text">
        <strong>Step ${idx + 1}</strong> - ${escapeHtml(s.title)}
      </span>
    `;
    
    stepChecklist.appendChild(item);
  });
  
  // Update checklist title dynamically
  updateChecklistTitle();
}

// Update checklist title based on current phase
function updateChecklistTitle(){
  const cardTitleEl = document.querySelector(".card-title");
  if(!cardTitleEl) return;
  
  if(state.phase === "learn"){
    cardTitleEl.textContent = "Guided Learning Checklist";
  } else if(state.phase === "practice"){
    cardTitleEl.textContent = "Practice Checklist";
  } else {
    cardTitleEl.textContent = "Step Checklist";
  }
}

function updateStatus(){
  if (!footerHint || !backBtn) {
    console.error("❌ updateStatus: Missing status elements");
    return;
  }

  // footer hint
  if(state.phase === "learn"){
    footerHint.textContent = "Complete the quick check (encoding) before moving on. One step at a time.";
  } else if(state.phase === "practice"){
    footerHint.textContent = "Practice with fewer hints. Focus on understanding WHY each step matters.";
  } else if(state.phase === "summary"){
    footerHint.textContent = "Review your performance and identify areas for improvement.";
  } else if(state.phase === "assessment"){
    footerHint.textContent = "No hints now. Drag steps into the correct order (recall).";
  } else if(state.phase === "complete"){
    footerHint.textContent = "Nice work. You completed the module.";
  } else {
    footerHint.textContent = "Start with the scenario, then guided learning, then practice, then assessment.";
  }

  // buttons enabled
  backBtn.disabled = (state.phase === "intro");
}

// Update progress bar - must be called AFTER rendering step content
function updateProgressBar(){
  const stepProgressBar = document.getElementById("stepProgressBar");
  const stepProgressText = document.getElementById("stepProgressText");
  
  console.log("?? Progress bar check:", {
    element: stepProgressBar,
    phase: state.phase,
    stepIndex: state.stepIndex
  });
  
  if(!stepProgressBar) {
    console.warn("?? stepProgressBar not found - might be intro/assessment/summary/complete phase");
    return;
  }
  
  let pct = 0;

  if(state.phase === "learn"){
    // Learn: 0% to 50% (distribute across 8 steps)
    // Step 1 (idx 0): 6.25%, Step 8 (idx 7): 50%
    pct = ((state.stepIndex + 1) / STEPS.length) * 50;
  } else if(state.phase === "practice"){
    // Practice: 50% to 90% (distribute across 8 steps)
    // Step 1 (idx 0): 55%, Step 8 (idx 7): 90%
    pct = 50 + ((state.stepIndex + 1) / STEPS.length) * 40;
  } else if(state.phase === "summary"){
    pct = 90;
  } else if(state.phase === "assessment"){
    pct = 95;
  } else if(state.phase === "complete"){
    pct = 100;
  } else {
    pct = 0;
  }

  pct = Math.min(100, Math.max(0, pct));
  stepProgressBar.style.width = `${pct}%`;
  
  // Update progress text if element exists
  if(stepProgressText && (state.phase === "learn" || state.phase === "practice")) {
    stepProgressText.textContent = `Step ${state.stepIndex + 1} of ${STEPS.length}`;
  }
  
  console.log("? Progress updated to:", pct + "%");
}

function render(){
  if (!view) {
    console.error("? render: Missing view element");
    return;
  }

  try {
    updateStatus();
    renderChunks();

    // clear view
    view.innerHTML = "";
    clearInlineToast();

    if(state.phase === "intro"){
      view.appendChild(renderIntro());
    } else if(state.phase === "learn"){
      view.appendChild(renderLearnStep());
    } else if(state.phase === "practice"){
      view.appendChild(renderPracticeStep());
    } else if(state.phase === "summary"){
      view.appendChild(renderSummary());
    } else if(state.phase === "assessment"){
      view.appendChild(renderAssessment());
    } else if(state.phase === "complete"){
      view.appendChild(renderComplete());
    }
    
    // Update progress bar AFTER rendering (so DOM element exists)
    updateProgressBar();
    
  } catch (err) {
    console.error("? render() error:", err);
    view.innerHTML = `<div style="padding:20px;color:#ff6b6b;border:1px solid #ff6b6b;border-radius:12px;margin:20px;">
      <h2>?? Rendering Error</h2>
      <p>Something went wrong while rendering the page.</p>
      <p><strong>Error:</strong> ${err.message}</p>
      <p>Check browser console (F12) for details.</p>
    </div>`;
  }
}

function renderIntro(){
  const wrap = document.createElement("div");
  wrap.className = "single-column-layout";

  const main = document.createElement("div");
  main.className = "panel panel-with-nav";

  main.innerHTML = `
    <div class="panel-content">
      <h1 class="h1">Scenario: Sudden Collapse</h1>
      <p class="p">
        A person collapses and is unresponsive. An AED arrives.
        Your job is to follow the correct step sequence safely and confidently.
      </p>

      <div class="content-img-wrap">
        <img src="assets/Frame.png" alt="AED scenario illustration">
      </div>

      <div class="callout">
        <div class="callout-title">What you will do</div>
        <ul>
          <li>Learn the AED sequence step-by-step (with guidance).</li>
          <li>Practice with small questions and fewer hints.</li>
          <li>Complete a final assessment by ordering the steps from memory.</li>
        </ul>
      </div>

      <div class="callout" style="margin-top:12px">
        <div class="callout-title">Why sequence matters</div>
        <p class="p" style="margin:0">
          In high-stress situations, people make slips and mistakes.
          Good interfaces reduce cognitive load, prevent critical errors, and support recovery.
        </p>
      </div>

      <div class="callout" style="margin-top:12px">
        <div class="callout-title">Common mistakes we will prevent</div>
        <ul>
          <li>Delayed power-on</li>
          <li>Pads placed incorrectly</li>
          <li>Touching patient during analysis</li>
          <li>Not clearing before shock</li>
        </ul>
      </div>

      <p class="muted tiny" style="margin-top:12px">
        Tip: Use <span class="kbd">Back</span> to review anytime.
      </p>
    </div>
    
    <div class="panel-nav">
      <button class="btn btn-primary" type="button" onclick="navigate(1)" style="margin-left: auto;">
        Start Learning
      </button>
    </div>
  `;

  wrap.appendChild(main);
  return wrap;
}

// ----- Guided Learning -----
function renderLearnStep(){
  const step = STEPS[state.stepIndex];

  const wrap = document.createElement("div");
  wrap.className = "single-column-layout";

  const main = document.createElement("div");
  main.className = "panel panel-with-nav";

  main.innerHTML = `
    <div class="panel-content">
      <h1 class="h1">Step ${state.stepIndex + 1}: ${escapeHtml(step.title)}</h1>
      <p class="p"><strong>${escapeHtml(step.subtitle)}</strong></p>
      
      <div class="step-goal">
        <div class="step-goal-title">Goal</div>
        <p class="step-goal-text">${escapeHtml(step.goal)}</p>
      </div>
      
      <div class="step-content-row">
        <div class="step-image-col">
          <img src="${step.image}" alt="${escapeHtml(step.imgAlt)}" onerror="this.remove(); this.parentElement.querySelector('.img-placeholder').style.display='block';">
          <div class="img-placeholder" style="display:none">
            <strong>Image placeholder for Step ${state.stepIndex + 1}</strong><br>
            Put your visual here: <span class="kbd">${step.image}</span>
          </div>
        </div>
        <div class="step-text-col">
          <p class="p">${escapeHtml(step.instruction)}</p>
        </div>
      </div>

      ${renderSafetyReminder(step)}

      <div class="callout" style="margin-top:10px">
        <div class="callout-title">Quick Check</div>
        <p class="p" style="margin:0 0 6px">${escapeHtml(step.microCheck.prompt)}</p>
        <div class="quiz" id="learnQuiz"></div>
        <div class="toast" id="learnToast" style="display:none"></div>
      </div>
    </div>
    
    <div class="panel-nav">
      <button class="btn btn-outline" type="button" onclick="DOM.backBtn.click()" ${state.stepIndex === 0 && state.phase === 'learn' ? 'disabled' : ''}>
        Back
      </button>
    </div>
  `;

  const right = document.createElement("div");
  right.className = "panel media";

  const img = document.createElement("div");
  img.className = "img-wrap";
  img.innerHTML = `
    <img src="${step.image}" alt="${escapeHtml(step.imgAlt)}" onerror="this.remove(); this.parentElement.querySelector('.img-placeholder').style.display='block';">
    <div class="img-placeholder" style="display:none">
      <strong>Image placeholder for Step ${state.stepIndex + 1}</strong><br>
      Put your visual here: <span class="kbd">${step.image}</span><br>
      <span class="muted tiny">Tip: Use a clear diagram or photo + simple arrows.</span>
    </div>
  `;

  const hint = document.createElement("div");
  hint.className = "callout";
  hint.innerHTML = `
    <div class="callout-title">Design hint (Progressive Disclosure)</div>
    <p class="p" style="margin:0">
      This screen shows only what's needed for the current step - reducing cognitive load.
      The module will remove cues later in the final assessment.
    </p>
  `;

  right.appendChild(img);
  right.appendChild(hint);

  wrap.appendChild(main);

  // Render quiz
  setTimeout(() => initLearnQuiz(step), 0);

  return wrap;
}

function renderMistakeCallouts(step){
  const parts = [];
  if(step.commonMistake){
    parts.push(`
      <div class="callout" style="margin-top:12px">
        <div class="callout-title">Common Mistake</div>
        <p class="p" style="margin:0">${escapeHtml(step.commonMistake)}</p>
      </div>
    `);
  }
  if(step.criticalFail){
    parts.push(`
      <div class="callout" style="margin-top:12px; border-color: rgba(255,107,107,.25)">
        <div class="callout-title" style="color: var(--danger)">Critical Fail Risk</div>
        <p class="p" style="margin:0">${escapeHtml(step.criticalFail)}</p>
      </div>
    `);
  }
  return parts.join("");
}

// Merge Common Mistake + Critical Fail into Safety Reminder
function renderSafetyReminder(step){
  const items = [];
  if(step.commonMistake) items.push(step.commonMistake);
  if(step.criticalFail) items.push(step.criticalFail);
  
  if(items.length === 0) return "";
  
  const itemsHtml = items.map(item => `<li>${escapeHtml(item)}</li>`).join("");
  
  return `
    <div class="safety-reminder" id="safetyReminder">
      <div class="safety-reminder-title">⚠ Safety Reminder</div>
      <ul class="safety-reminder-list">
        ${itemsHtml}
      </ul>
    </div>
  `;
}

function initLearnQuiz(step){
  const quiz = document.getElementById("learnQuiz");
  const toast = document.getElementById("learnToast");
  if(!quiz || !toast) return;

  const correctIndex = getCorrectOptionIndex("learn", state.stepIndex);

  quiz.innerHTML = "";
  const optionsWrap = document.createElement("div");
  optionsWrap.className = "options";

  // Track error count for this step
  if(!state.errorCount[step.id]) state.errorCount[step.id] = 0;

  step.microCheck.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.type = "button";
    btn.textContent = opt.text;

    btn.addEventListener("click", () => {
      // lock all
      const all = optionsWrap.querySelectorAll(".option");
      all.forEach(b => b.disabled = true);

      if(idx === correctIndex){
        btn.classList.add("correct");
        
        // Track if correct on first try
        if(state.errorCount[step.id] === 0) {
          state.correctFirstTry.add(step.id);
        }
        
        // Show success modal
        showModal(
          'success',
          'Correct',
          `<p>Great job! You followed the AED protocol correctly.</p>`,
          [
            {
              text: 'Continue',
              primary: true,
              callback: () => {
                setLearnStepCompleted(true);
                // Trigger animation on checklist
                const currentItem = document.querySelector('.checklist-item.current');
                if(currentItem) {
                  const icon = currentItem.querySelector('.checklist-icon');
                  if(icon) icon.style.transform = 'scale(1.2)';
                  setTimeout(() => { if(icon) icon.style.transform = 'scale(1)'; }, 200);
                }
                // Auto-navigate to next step (like clicking Next button)
                setTimeout(() => {
                  navigate(1);
                }, 300); // Short delay for animation
              }
            }
          ]
        );
        setLearnStepCompleted(true);
      } else {
        btn.classList.add("wrong");
        state.errorCount[step.id]++;
        state.retriesNeeded++;
        
        // Build modal message
        let message = `<p><strong>Review the key safety rule:</strong></p>`;
        message += `<p>${escapeHtml(step.microCheck.hint)}</p>`;
        
        // On 2nd error, highlight safety reminder
        if(state.errorCount[step.id] >= 2) {
          const safetyReminder = document.getElementById('safetyReminder');
          if(safetyReminder) {
            safetyReminder.classList.add('highlighted');
          }
          message += `<p class="muted tiny" style="margin-top:12px">💡 Check the Safety Reminder section above for more details.</p>`;
        }
        
        showModal(
          'error',
          'Try Again',
          message,
          [
            {
              text: 'Retry',
              primary: true,
              callback: () => {
                // Re-enable buttons after a moment
                setTimeout(() => {
                  all.forEach(b => { 
                    b.disabled = false; 
                    b.classList.remove("wrong"); 
                  });
                }, 100);
              }
            }
          ]
        );
        
        setLearnStepCompleted(false);
      }
    });

    optionsWrap.appendChild(btn);
  });

  quiz.appendChild(optionsWrap);
  setLearnStepCompleted(false);
}

let learnStepCompleted = false;
function setLearnStepCompleted(v){ learnStepCompleted = v; }
function canProceedFromLearnStep(){ return learnStepCompleted; }

// ----- Practice -----
function renderPracticeStep(){
  const step = STEPS[state.stepIndex];

  const wrap = document.createElement("div");
  wrap.className = "single-column-layout";

  const main = document.createElement("div");
  main.className = "panel panel-with-nav";

  main.innerHTML = `
    <div class="panel-content">
      <h1 class="h1">Practice: Step ${state.stepIndex + 1}</h1>
      <p class="p"><strong>${escapeHtml(step.title)}</strong></p>
      
      <div class="step-goal">
        <div class="step-goal-title">Goal</div>
        <p class="step-goal-text">${escapeHtml(step.goal)}</p>
      </div>
      
      <div class="step-content-row">
        <div class="step-image-col">
          <img src="${PRACTICE_IMAGES[state.stepIndex]}" alt="${escapeHtml(step.title)}" onerror="this.remove(); this.parentElement.querySelector('.img-placeholder').style.display='block';">
          <div class="img-placeholder" style="display:none">
            Put your reminder image here: <span class="kbd">${PRACTICE_IMAGES[state.stepIndex]}</span>
          </div>
        </div>
        <div class="step-text-col">
          <p class="p">Fewer hints now. Choose the best answer to show you understand the step.</p>
        </div>
      </div>

      <div class="callout">
        <div class="callout-title">Practice Question</div>
        <p class="p" style="margin:0 0 6px">${escapeHtml(step.microCheck.prompt)}</p>
        <div class="quiz" id="practiceQuiz"></div>
        <div class="toast" id="practiceToast" style="display:none"></div>
      </div>

      <div class="callout" style="margin-top:10px">
        <div class="callout-title">Micro-support</div>
        <p class="p" style="margin:0">
          Tip: If you get stuck, think about safety and what the AED needs before it can shock.
        </p>
      </div>
    </div>
    
    <div class="panel-nav">
      <button class="btn btn-outline" type="button" onclick="DOM.backBtn.click()">
        Back
      </button>
    </div>
  `;

  wrap.appendChild(main);

  setTimeout(() => initPracticeQuiz(step), 0);

  return wrap;
}

let practiceStepCompleted = false;
function canProceedFromPracticeStep(){ return practiceStepCompleted; }

function initPracticeQuiz(step){
  const quiz = document.getElementById("practiceQuiz");
  const toast = document.getElementById("practiceToast");
  if(!quiz || !toast) return;

  const correctIndex = getCorrectOptionIndex("practice", state.stepIndex);

  quiz.innerHTML = "";
  practiceStepCompleted = false;

  const optionsWrap = document.createElement("div");
  optionsWrap.className = "options";

  // Track error count for this step (if not already tracked)
  if(!state.errorCount[step.id]) state.errorCount[step.id] = 0;

  step.microCheck.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.type = "button";
    btn.textContent = opt.text;

    btn.addEventListener("click", () => {
      const all = optionsWrap.querySelectorAll(".option");
      all.forEach(b => b.disabled = true);

      if(idx === correctIndex){
        btn.classList.add("correct");
        
        // Track if correct on first try
        if(state.errorCount[step.id] === 0) {
          state.correctFirstTry.add(step.id);
        }
        
        showModal(
          'success',
          'Correct',
          `<p>Nice! You've got it. Continue when ready.</p>`,
          [
            {
              text: 'Continue',
              primary: true,
              callback: () => {
                practiceStepCompleted = true;
                state.practiceScore += 1;
                // Auto-navigate to next step (like clicking Next button)
                setTimeout(() => {
                  navigate(1);
                }, 300); // Short delay for modal close animation
              }
            }
          ]
        );
        practiceStepCompleted = true;
        state.practiceScore += 1;
      } else {
        btn.classList.add("wrong");
        state.errorCount[step.id]++;
        state.retriesNeeded++;
        practiceStepCompleted = false;

        showModal(
          'error',
          'Try Again',
          `<p>Almost there - not quite. Let's try again. Review and try again.</p>
          <p class="muted tiny" style="margin-top:8px">Hint: Think about the safety precautions and protocol.</p>`,
          [
            {
              text: 'Retry',
              primary: true,
              callback: () => {
                setTimeout(() => {
                  all.forEach(b => { b.disabled = false; b.classList.remove("wrong"); });
                }, 100);
              }
            }
          ]
        );

        practiceStepCompleted = false;
      }
    });

    optionsWrap.appendChild(btn);
  });

  quiz.appendChild(optionsWrap);
}

// ----- Assessment (Recall) -----
function renderSummary(){
  const wrap = document.createElement("div");
  wrap.className = "single-column-layout";

  const main = document.createElement("div");
  main.className = "panel panel-with-nav";

  // Calculate statistics
  const totalSteps = STEPS.length;
  const correctFirstTryCount = state.correctFirstTry.size;
  const accuracyPct = Math.round((correctFirstTryCount / totalSteps) * 100);
  
  // Determine feedback message
  let feedbackMsg = "";
  let feedbackClass = "";
  if(state.retriesNeeded < 3) {
    feedbackMsg = "You demonstrated strong procedural confidence and safety awareness.";
    feedbackClass = "ok";
  } else if(state.retriesNeeded < 6) {
    feedbackMsg = "Good progress! Review the safety-critical timing steps to build confidence.";
    feedbackClass = "warn";
  } else {
    feedbackMsg = "Consider reviewing the material. Focus on safety-critical timing steps.";
    feedbackClass = "danger";
  }
  
  // Get weak steps (where errors occurred)
  const weakSteps = [];
  Object.keys(state.errorCount).forEach(stepId => {
    if(state.errorCount[stepId] > 0) {
      const step = STEPS.find(s => s.id === stepId);
      if(step) {
        weakSteps.push({ 
          title: step.title, 
          errors: state.errorCount[stepId] 
        });
      }
    }
  });
  weakSteps.sort((a, b) => b.errors - a.errors); // Sort by most errors

  main.innerHTML = `
    <div class="panel-content">
      <h1 class="h1">Training Complete ✓</h1>
      <p class="p">
        You have completed all practice steps. Review your performance below before moving to the final assessment.
      </p>

      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:16px; margin: 20px 0;">
        <div class="callout" style="text-align:center">
          <div class="callout-title">Accuracy Score</div>
          <div style="font-size:48px; font-weight:800; color:var(--accent); margin:8px 0;">
            ${accuracyPct}%
          </div>
          <p class="muted tiny" style="margin:0">First-attempt correct</p>
        </div>
        
        <div class="callout" style="text-align:center">
          <div class="callout-title">Correct First Try</div>
          <div style="font-size:48px; font-weight:800; color:var(--ok); margin:8px 0;">
            ${correctFirstTryCount} / ${totalSteps}
          </div>
          <p class="muted tiny" style="margin:0">Steps mastered</p>
        </div>
        
        <div class="callout" style="text-align:center">
          <div class="callout-title">Retries Needed</div>
          <div style="font-size:48px; font-weight:800; color:var(--warn); margin:8px 0;">
            ${state.retriesNeeded}
          </div>
          <p class="muted tiny" style="margin:0">Total attempts</p>
        </div>
      </div>

      <div class="callout ${feedbackClass}">
        <div class="callout-title">Behavior-based Feedback</div>
        <p class="p" style="margin:0">
          ${escapeHtml(feedbackMsg)}
        </p>
      </div>

      ${weakSteps.length > 0 ? `
        <div class="callout" style="margin-top:12px">
          <div class="callout-title">Steps Needing Review</div>
          <ul>
            ${weakSteps.map(ws => `<li><strong>${escapeHtml(ws.title)}</strong> — ${ws.errors} error${ws.errors > 1 ? 's' : ''}</li>`).join('')}
          </ul>
        </div>
      ` : `
        <div class="callout ok" style="margin-top:12px">
          <div class="callout-title">Perfect Performance! ✓</div>
          <p class="p" style="margin:0">You got all steps correct on the first try!</p>
        </div>
      `}

      <div class="callout" style="margin-top:12px">
        <div class="callout-title">Next: Final Assessment</div>
        <p class="p" style="margin:0">
          The final assessment will test your recall without any visual cues.
          You'll need to arrange all steps in the correct order from memory.
        </p>
      </div>
    </div>
    
    <div class="panel-nav">
      <button class="btn btn-outline" type="button" onclick="DOM.backBtn.click()">
        Back to Practice
      </button>
      <button class="btn btn-primary" type="button" onclick="navigate(1)">
        Start Final Assessment
      </button>
    </div>
  `;

  wrap.appendChild(main);
  return wrap;
}

// ----- Assessment (Recall) -----
function renderAssessment(){
  const wrap = document.createElement("div");
  wrap.className = "panel";

  wrap.innerHTML = `
    <h1 class="h1">Final Assessment</h1>
    <p class="p">
      All visible cues are removed. Drag steps into the correct order from memory.
      No hints — this tests true recall.
    </p>

    <div class="drag-area" style="margin-top:12px">
      <div class="drag-col">
        <h2 class="h2">Step Cards</h2>
        <p class="muted tiny">Drag cards into the slots on the right.</p>
        <div id="cardPool"></div>
      </div>

      <div class="drag-col">
        <h2 class="h2">Order Slots</h2>
        <p class="muted tiny">Fill all slots, then click <span class="kbd">Check Order</span>.</p>
        <div id="slots"></div>

        <div style="display:flex; gap:10px; margin-top:10px; flex-wrap:wrap">
          <button id="checkOrderBtn" class="btn btn-primary" type="button">Check Order</button>
          <button id="resetAssessmentBtn" class="btn btn-ghost" type="button">Reset Assessment</button>
        </div>

        <div class="toast" id="assessmentToast" style="display:none; margin-top:10px"></div>
      </div>
    </div>

    <div class="callout" style="margin-top:12px">
      <div class="callout-title">Safety Focus</div>
      <p class="p" style="margin:0">
        The correct sequence prevents critical errors (e.g., touching patient during analysis or failing to clear before shock).
      </p>
    </div>
  `;

  setTimeout(initAssessment, 0);
  return wrap;
}

function initAssessment(){
  const pool = document.getElementById("cardPool");
  const slots = document.getElementById("slots");
  const toast = document.getElementById("assessmentToast");
  const checkBtn = document.getElementById("checkOrderBtn");
  const resetBtn = document.getElementById("resetAssessmentBtn");
  if(!pool || !slots || !toast || !checkBtn || !resetBtn) return;

  state.assessmentResult = { passed:false };

  // Shuffle cards for assessment
  const cards = [...STEPS].map(s => ({ id:s.id, title:s.title }));
  shuffle(cards);

  pool.innerHTML = "";
  slots.innerHTML = "";

  // Create draggable cards
  cards.forEach(card => {
    const el = document.createElement("div");
    el.className = "draggable";
    el.draggable = true;
    el.id = `card-${card.id}`;
    el.textContent = card.title;

    el.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", el.id);
    });

    pool.appendChild(el);
  });

  // Create dropzones (8 slots)
  for(let i=0;i<STEPS.length;i++){
    const dz = document.createElement("div");
    dz.className = "dropzone";
    dz.dataset.index = String(i);
    dz.innerHTML = `
      <div class="zone-label">${i+1}</div>
      <div class="zone-text muted">Drop a step here</div>
      <button class="zone-clear" type="button" aria-label="Clear slot ${i+1}">Clear</button>
    `;

    dz.addEventListener("dragover", (e) => e.preventDefault());
    dz.addEventListener("drop", (e) => {
      e.preventDefault();
      const id = e.dataTransfer.getData("text/plain");
      const cardEl = document.getElementById(id);
      if(!cardEl) return;

      // if slot already filled, move existing card back to pool
      const existing = dz.querySelector(".draggable");
      if(existing){
        pool.appendChild(existing);
      }

      dz.classList.add("filled");
      dz.querySelector(".zone-text").replaceWith(cardEl);
      cardEl.classList.add("zone-text");
    });

    dz.querySelector(".zone-clear").addEventListener("click", () => {
      const existing = dz.querySelector(".draggable");
      if(existing) pool.appendChild(existing);
      dz.classList.remove("filled");
      
      // Remove any existing zone-text elements to prevent duplicates
      const oldTexts = dz.querySelectorAll(".zone-text");
      oldTexts.forEach(el => el.remove());
      
      // Create fresh placeholder
      const placeholder = document.createElement("div");
      placeholder.className = "zone-text muted";
      placeholder.textContent = "Drop a step here";
      dz.querySelector(".zone-label").insertAdjacentElement("afterend", placeholder);
    });

    slots.appendChild(dz);
  }

  checkBtn.addEventListener("click", () => {
    // Must fill all
    const zones = [...slots.querySelectorAll(".dropzone")];
    
    // Reset previous feedback colors
    zones.forEach(z => {
      z.classList.remove("slot-correct", "slot-wrong");
    });
    
    const pickedIds = zones.map(z => {
      const c = z.querySelector(".draggable");
      if(!c) return null;
      return c.id.replace("card-","");
    });

    if(pickedIds.some(x => x === null)){
      toast.className = "toast warn";
      toast.style.display = "block";
      toast.textContent = "Please fill all slots before checking.";
      state.assessmentResult = { passed:false };
      return;
    }

    const correct = STEPS.map(s => s.id);
    
    // Apply visual feedback for each slot
    zones.forEach((zone, idx) => {
      if(pickedIds[idx] === correct[idx]) {
        zone.classList.add("slot-correct");
      } else {
        zone.classList.add("slot-wrong");
      }
    });
    
    const passed = pickedIds.every((id, idx) => id === correct[idx]);

    if(passed){
      toast.className = "toast ok";
      toast.style.display = "block";
      toast.textContent = "Perfect! You placed every step in the correct order.";
      state.assessmentResult = { passed:true };
      
      // Auto-transition to completion page after showing success message
      setTimeout(() => {
        console.log("Assessment passed! Transitioning to Complete...");
        state.phase = "complete";
        setPhaseUI("complete");
        render();
      }, 1200); // Show success message for 1.2 seconds before transitioning
    } else {
      toast.className = "toast danger";
      toast.style.display = "block";
      toast.textContent = "Not yet. Review the sequence and try again.";
      state.assessmentResult = { passed:false };
    }
  });

  resetBtn.addEventListener("click", () => {
    initAssessment();
  });
}

function renderComplete(){
  const wrap = document.createElement("div");
  wrap.className = "single-column-layout";

  const main = document.createElement("div");
  main.className = "panel panel-with-nav";

  // Calculate final statistics
  const totalSteps = STEPS.length;
  const correctFirstTryCount = state.correctFirstTry.size;
  const accuracyPct = Math.round((correctFirstTryCount / totalSteps) * 100);
  const assessmentPassed = state.assessmentResult?.passed || false;

  main.innerHTML = `
    <div class="panel-content" style="text-align: center; padding: 40px 20px;">
      <div style="font-size: 72px; margin-bottom: 16px;">🎉</div>
      
      <h1 class="h1" style="margin-bottom: 16px;">Module Complete!</h1>
      
      <p class="p" style="font-size: 18px; max-width: 600px; margin: 0 auto 32px;">
        Congratulations! You've successfully completed the <strong>AED Training Module</strong>.
        You've demonstrated mastery of the complete AED protocol from scenario to final recall assessment.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 32px 0; max-width: 800px; margin-left: auto; margin-right: auto;">
        <div class="completion-stat">
          <div class="completion-stat-icon">📚</div>
          <div class="completion-stat-value">${totalSteps}</div>
          <div class="completion-stat-label">Steps Mastered</div>
        </div>
        
        <div class="completion-stat">
          <div class="completion-stat-icon">✓</div>
          <div class="completion-stat-value">${accuracyPct}%</div>
          <div class="completion-stat-label">First-Try Accuracy</div>
        </div>
        
        <div class="completion-stat">
          <div class="completion-stat-icon">🏆</div>
          <div class="completion-stat-value">${assessmentPassed ? 'Perfect' : 'Done'}</div>
          <div class="completion-stat-label">Final Assessment</div>
        </div>
      </div>

    <div class="callout" style="max-width: 700px; margin: 32px auto; text-align: left;">
      <div class="callout-title">What You Accomplished</div>
      <ul style="margin: 12px 0 0 0;">
        <li><strong>Scenario:</strong> Understood the emergency context and why AED sequence matters</li>
        <li><strong>Guided Learning:</strong> Learned all ${totalSteps} steps with visual aids and encoding checks</li>
        <li><strong>Interactive Practice:</strong> Practiced with fewer hints to build procedural fluency</li>
        <li><strong>Final Assessment:</strong> Demonstrated pure recall by ordering steps from memory</li>
      </ul>
    </div>

    <div class="callout" style="max-width: 700px; margin: 32px auto; background: linear-gradient(135deg, #e8f5e9, #f1f8e9); border: 1px solid rgba(76, 175, 80, 0.3);">
      <div class="callout-title" style="color: #2e7d32; text-align: center;">💡 Real-World Impact</div>
      <p style="margin-top:8px; line-height:1.6; text-align: left;">
        In a cardiac emergency, every second counts. You now know the critical sequence that can 
        <strong>double or triple</strong> a victim's chance of survival. This knowledge empowers you 
        to act confidently when it matters most.
      </p>
    </div>

    <p class="muted tiny" style="margin-top:24px; text-align: center;">
      ⚠ <strong>Important:</strong> This module is for educational demonstration. Always follow certified training and local protocols.
    </p>
  </div>
  `;

  const right = document.createElement("div");
right.style.display = "none"; // Hide the right panel
  right.innerHTML = `
    <h2 class="h2">Next improvements (optional)</h2>
    <div class="callout">
      <div class="callout-title">If you want extra A+ polish</div>
      <ul>
        <li>Add animated "ghosted" cues in Guided mode (Recognition)</li>
        <li>Add a "mistake replay" mini lesson after failed assessment</li>
        <li>Add sound toggles (AED voice prompt simulation)</li>
        <li>Add accessibility: larger buttons + keyboard drag alternatives</li>
      </ul>
    </div>
  `;

  wrap.appendChild(main);
  return wrap;
}

// Toast functions already moved to top of file (before initialization)

// ----- Utils -----
function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]];
  }
  return arr;
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

// Sidebar phase UI initialize
setPhaseUI("intro");
// Initial render
console.log("?? Initial render...");
render();
console.log("? App initialized successfully!");
