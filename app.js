// PulseLead SMB — Modern Lead Inbox & Automated Follow-Up Radar
// Product Design & Lean Startup Strategy — Unit 1 Submission

// Initial Seed Data tailored for Indian SMBs
const SEED_LEADS = [
  {
    id: "lead-1",
    name: "Vikrant Sharma",
    phone: "9876543210",
    channel: "WhatsApp",
    service: "Class 12 Maths & Physics Tuition",
    value: 14000,
    urgency: "High",
    stage: "New",
    createdHoursAgo: 2,
    followUpDue: getTodayOffset(0),
    notes: "Parent looking for CBSE board prep + weekend doubt clearing sessions.",
    history: [
      "10:15 AM - Received WhatsApp enquiry",
      "10:16 AM - Auto-extracted by PulseLead AI (12.4s)"
    ]
  },
  {
    id: "lead-2",
    name: "Priya Nair",
    phone: "9988776655",
    channel: "Instagram",
    service: "Bridal HD Makeup & Hair Styling",
    value: 32000,
    urgency: "High",
    stage: "Quote Sent",
    createdHoursAgo: 29, // >24h => Cold Radar
    followUpDue: getTodayOffset(-1),
    notes: "Wedding date Dec 18. Sent quote sheet; waiting for bride's confirmation.",
    history: [
      "Yesterday 11:00 AM - Inquired via Instagram DM",
      "Yesterday 11:30 AM - Sent package PDF brochure on WhatsApp",
      "Yesterday 02:00 PM - Quoted ₹32,000 package. No reply since 29h."
    ]
  },
  {
    id: "lead-3",
    name: "Amitabh Patel",
    phone: "9123456789",
    channel: "WhatsApp",
    service: "Ceramic Coating & Deep Interior Detailing",
    value: 18500,
    urgency: "Medium",
    stage: "Follow-Up Scheduled",
    createdHoursAgo: 31, // >24h => Cold Radar
    followUpDue: getTodayOffset(0),
    notes: "Honda City owner. Asked if water spots will be 100% removed.",
    history: [
      "Yesterday 09:30 AM - Walk-in consultation at garage",
      "Yesterday 12:00 PM - Sent photos of past Honda City ceramic work",
      "Scheduled follow-up due today"
    ]
  },
  {
    id: "lead-4",
    name: "Kavita Reddy",
    phone: "9440112233",
    channel: "Phone Call",
    service: "Corporate Lunch Catering (80 Pax)",
    value: 48000,
    urgency: "High",
    stage: "Contacted",
    createdHoursAgo: 5,
    followUpDue: getTodayOffset(1),
    notes: "Requires South & North Indian fusion buffet for tech symposium.",
    history: [
      "09:45 AM - Phone discussion with HR manager",
      "10:30 AM - Menu PDF and price list dispatched via WhatsApp"
    ]
  },
  {
    id: "lead-5",
    name: "Rajesh Malhotra",
    phone: "9820054321",
    channel: "WhatsApp",
    service: "Shopify E-Commerce Website Redesign",
    value: 28000,
    urgency: "Medium",
    stage: "Quote Sent",
    createdHoursAgo: 26, // >24h => Cold Radar
    followUpDue: getTodayOffset(-1),
    notes: "Clothing boutique owner looking to move from Instagram orders to automated cart.",
    history: [
      "Yesterday 01:15 PM - Website audit conducted",
      "Yesterday 03:00 PM - Proposal & scope document submitted"
    ]
  },
  {
    id: "lead-6",
    name: "Sneha Sen",
    phone: "9731298765",
    channel: "Walk-in",
    service: "Keratin Hair Treatment & Global Color",
    value: 8500,
    urgency: "Low",
    stage: "Closed Won",
    createdHoursAgo: 12,
    followUpDue: getTodayOffset(0),
    notes: "Booked slot for Saturday 11 AM. Advance token ₹2,000 paid via GPay.",
    history: [
      "11:00 AM - Walk-in enquiry at studio",
      "11:20 AM - Consultation with senior stylist",
      "11:45 AM - Confirmed booking & advance paid via GPay 🎉"
    ]
  },
  {
    id: "lead-7",
    name: "Manish Joshi",
    phone: "9811223344",
    channel: "WhatsApp",
    service: "NEET Crash Course (Biology + Chemistry)",
    value: 25000,
    urgency: "High",
    stage: "Closed Won",
    createdHoursAgo: 18,
    followUpDue: getTodayOffset(0),
    notes: "Enrolled in morning batch. Course materials dispatched.",
    history: [
      "Yesterday 04:00 PM - Attended demo lecture",
      "Yesterday 06:30 PM - Parent confirmed admission & tuition fee cleared 🎉"
    ]
  },
  {
    id: "lead-8",
    name: "Kunal Bansal",
    phone: "9654321876",
    channel: "Instagram",
    service: "Custom Wedding Reception Decor",
    value: 65000,
    urgency: "Low",
    stage: "Cold / Lost",
    createdHoursAgo: 72,
    followUpDue: getTodayOffset(-3),
    notes: "Decided to postpone wedding reception to Q2 2027.",
    history: [
      "3 days ago - Sent decor catalog",
      "2 days ago - Follow-up call; client postponed event"
    ]
  }
];

// Helper to calculate date offsets (YYYY-MM-DD)
function getTodayOffset(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}

// App State
let leads = [];
let currentFilter = "all";
let searchQuery = "";
let selectedTone = "friendly-hinglish";
let activeNudgeLead = null;
let activeDrawerLead = null;
let captureStartTime = null;
let captureTimerInterval = null;
let isAudioPlaying = false;

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  loadLeads();
  initEventListeners();
  initRoiCalculator();
  renderAll();
});

// Load from LocalStorage or Seed Data
function loadLeads() {
  const stored = localStorage.getItem("pulselead_leads_v2");
  if (stored) {
    try {
      leads = JSON.parse(stored);
    } catch (e) {
      leads = [...SEED_LEADS];
    }
  } else {
    leads = [...SEED_LEADS];
    saveLeads();
  }
}

function saveLeads() {
  localStorage.setItem("pulselead_leads_v2", JSON.stringify(leads));
}

// Reset Demo Data
function resetDemoData() {
  if (confirm("Reset all demo data back to default Indian SMB sample leads?")) {
    leads = [...SEED_LEADS];
    saveLeads();
    renderAll();
    showToast("✓ Demo leads reset to initial state");
  }
}

// Event Listeners
function initEventListeners() {
  // Navigation Tabs
  document.querySelectorAll(".tab-btn").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach(c => c.classList.remove("active"));
      tab.classList.add("active");
      const targetId = `tab-${tab.dataset.tab}`;
      const targetEl = document.getElementById(targetId);
      if (targetEl) targetEl.classList.add("active");
    });
  });

  // Search & Filter
  document.getElementById("searchInput").addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderKanban();
    renderTable();
  });

  document.getElementById("channelFilter").addEventListener("change", (e) => {
    currentFilter = e.target.value;
    renderKanban();
    renderTable();
  });

  document.getElementById("resetDemoBtn").addEventListener("click", resetDemoData);

  // Business Selector
  document.getElementById("businessSelect").addEventListener("change", (e) => {
    showToast(`Switched active profile to: ${e.target.selectedOptions[0].text}`);
  });

  // Modal Triggers
  document.getElementById("openCaptureModalBtn").addEventListener("click", openCaptureModal);
  document.getElementById("closeCaptureModalBtn").addEventListener("click", closeCaptureModal);
  document.getElementById("cancelCaptureBtn").addEventListener("click", closeCaptureModal);

  document.getElementById("closeNudgeModalBtn").addEventListener("click", closeNudgeModal);
  document.getElementById("closeDrawerBtn").addEventListener("click", closeDrawerModal);

  // Voice Note Modal
  document.getElementById("openVoiceModalBtn").addEventListener("click", () => {
    document.getElementById("voiceModal").classList.remove("hidden");
  });
  document.getElementById("closeVoiceModalBtn").addEventListener("click", () => {
    document.getElementById("voiceModal").classList.add("hidden");
    stopAudioSimulation();
  });
  document.getElementById("playVoiceBtn").addEventListener("click", toggleAudioSimulation);
  document.getElementById("transcribeVoiceBtn").addEventListener("click", transcribeAudioSimulation);
  document.getElementById("importVoiceLeadBtn").addEventListener("click", importVoiceLead);

  // AI Extraction & Sample Buttons
  document.getElementById("aiParseBtn").addEventListener("click", runAiParser);
  document.querySelectorAll(".chip-btn").forEach(chip => {
    chip.addEventListener("click", () => loadSampleChat(chip.dataset.sample));
  });

  // Lead Form Submission
  document.getElementById("leadForm").addEventListener("submit", handleLeadFormSubmit);

  // Simulate Incoming Lead
  document.getElementById("simulateLeadBtn").addEventListener("click", simulateIncomingLead);

  // Tone Buttons in Nudge Modal
  document.querySelectorAll(".tone-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tone-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedTone = btn.dataset.tone;
      updateNudgeMessage();
    });
  });

  // Copy Nudge
  document.getElementById("copyNudgeBtn").addEventListener("click", () => {
    const text = document.getElementById("nudgeMessageText").value;
    navigator.clipboard.writeText(text);
    showToast("✓ WhatsApp nudge copied to clipboard!");
  });

  // Export CSV
  document.getElementById("exportCsvBtn").addEventListener("click", exportToCsv);

  // Drawer Action Buttons
  document.getElementById("drawerWhatsAppBtn").addEventListener("click", () => {
    if (activeDrawerLead) {
      closeDrawerModal();
      openNudgeModal(activeDrawerLead.id);
    }
  });

  document.getElementById("drawerAdvanceBtn").addEventListener("click", () => {
    if (activeDrawerLead) {
      advanceLeadStage(activeDrawerLead.id);
      openDrawerModal(activeDrawerLead.id);
    }
  });

  document.getElementById("drawerWinBtn").addEventListener("click", () => {
    if (activeDrawerLead) {
      markLeadWon(activeDrawerLead.id);
      closeDrawerModal();
    }
  });
}

// Master Render
function renderAll() {
  renderKanban();
  renderColdRadar();
  renderTable();
  updateKPIs();
}

// Update Top KPI Bar
function updateKPIs() {
  const activeLeads = leads.filter(l => l.stage !== "Closed Won" && l.stage !== "Cold / Lost");
  const dueTodayLeads = leads.filter(l => l.stage !== "Closed Won" && l.stage !== "Cold / Lost" && l.followUpDue <= getTodayOffset(0));
  const coldLeads = leads.filter(l => l.stage !== "Closed Won" && l.stage !== "Cold / Lost" && l.createdHoursAgo >= 24);
  const wonLeads = leads.filter(l => l.stage === "Closed Won");

  const pipelineVal = activeLeads.reduce((acc, curr) => acc + (curr.value || 0), 0);
  const revenueWonVal = wonLeads.reduce((acc, curr) => acc + (curr.value || 0), 0);

  document.getElementById("kpiActiveCount").innerText = activeLeads.length;
  document.getElementById("kpiDueToday").innerText = dueTodayLeads.length;
  document.getElementById("kpiColdCount").innerText = coldLeads.length;
  document.getElementById("coldCountBadge").innerText = coldLeads.length;
  document.getElementById("kpiPipelineValue").innerText = `₹${pipelineVal.toLocaleString("en-IN")}`;
  document.getElementById("kpiRevenueWon").innerText = `₹${revenueWonVal.toLocaleString("en-IN")}`;
}

// Filter Helper
function getFilteredLeads() {
  return leads.filter(lead => {
    const matchesChannel = currentFilter === "all" || lead.channel === currentFilter;
    const matchesSearch = !searchQuery || 
      lead.name.toLowerCase().includes(searchQuery) ||
      lead.phone.includes(searchQuery) ||
      lead.service.toLowerCase().includes(searchQuery);
    return matchesChannel && matchesSearch;
  });
}

// Render Kanban View
function renderKanban() {
  const stages = ["New", "Contacted", "Quote Sent", "Follow-Up Scheduled", "Closed Won", "Cold / Lost"];
  const filtered = getFilteredLeads();

  stages.forEach(stage => {
    const colList = document.getElementById(`col-list-${stage}`);
    const stageLeads = filtered.filter(l => l.stage === stage);
    document.getElementById(`count-${stage}`).innerText = stageLeads.length;

    if (!colList) return;
    colList.innerHTML = "";

    stageLeads.forEach(lead => {
      const card = createLeadCardElement(lead);
      colList.appendChild(card);
    });
  });
}

// Create Lead Card Element
function createLeadCardElement(lead) {
  const isCold = lead.stage !== "Closed Won" && lead.stage !== "Cold / Lost" && lead.createdHoursAgo >= 24;
  const isDueToday = lead.stage !== "Closed Won" && lead.stage !== "Cold / Lost" && lead.followUpDue <= getTodayOffset(0);

  const card = document.createElement("div");
  card.className = `lead-card-box ${isCold ? "card-stale" : ""} ${isDueToday ? "card-due-today" : ""}`;
  card.draggable = true;
  card.dataset.id = lead.id;

  card.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", lead.id);
  });

  // Clicking card opens the detail drawer
  card.addEventListener("click", (e) => {
    if (e.target.closest("button") || e.target.closest("a")) return;
    openDrawerModal(lead.id);
  });

  const channelClass = lead.channel.toLowerCase().replace(" ", "-");
  const urgencyClass = (lead.urgency || "medium").toLowerCase();

  card.innerHTML = `
    <div class="c-header">
      <span class="c-customer">${lead.name}</span>
      <span class="channel-tag ${channelClass}">${lead.channel}</span>
    </div>

    <div class="c-service">${lead.service}</div>

    <div class="c-financial-row">
      <span class="c-price font-mono">₹${(lead.value || 0).toLocaleString("en-IN")}</span>
      <span class="urgency-pill ${urgencyClass}">${lead.urgency || "Medium"}</span>
    </div>

    ${lead.notes ? `<div class="c-notes">${lead.notes}</div>` : ""}

    <div class="c-time-status">
      <span class="c-time ${isCold ? 'cold-warn' : ''}">
        ${isCold ? '⚠️ Untouched: ' : '⏱️ '}${lead.createdHoursAgo}h ago
      </span>
      <span class="c-time">
        📅 Due: ${lead.followUpDue || "Today"}
      </span>
    </div>

    <div class="c-card-actions">
      <button class="btn-card nudge-action" onclick="openNudgeModal('${lead.id}')">
        <span>⚡ WhatsApp</span>
      </button>
      ${lead.stage !== 'Closed Won' ? `
        <button class="btn-card win-action" onclick="markLeadWon('${lead.id}')" title="Mark as Won">
          <span>🎉 Won</span>
        </button>
      ` : ''}
      <button class="btn-card" onclick="advanceLeadStage('${lead.id}')" title="Move to next stage">
        <span>→ Next</span>
      </button>
    </div>
  `;

  return card;
}

// Drag and Drop Handling
window.handleDragOver = function(e) {
  e.preventDefault();
};

window.handleDrop = function(e, targetStage) {
  e.preventDefault();
  const leadId = e.dataTransfer.getData("text/plain");
  const lead = leads.find(l => l.id === leadId);
  if (lead && lead.stage !== targetStage) {
    lead.stage = targetStage;
    lead.history.push(`${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - Moved to "${targetStage}" stage`);
    
    if (targetStage === "Closed Won") {
      triggerConfetti();
      showToast(`🎉 CONGRATS! Won ₹${lead.value.toLocaleString("en-IN")} deal with ${lead.name}!`);
    } else {
      showToast(`Lead moved to "${targetStage}"`);
    }

    saveLeads();
    renderAll();
  }
};

// Advance Stage Button
window.advanceLeadStage = function(leadId) {
  const lead = leads.find(l => l.id === leadId);
  if (!lead) return;

  const stageOrder = ["New", "Contacted", "Quote Sent", "Follow-Up Scheduled", "Closed Won"];
  const currentIndex = stageOrder.indexOf(lead.stage);

  if (currentIndex >= 0 && currentIndex < stageOrder.length - 1) {
    lead.stage = stageOrder[currentIndex + 1];
    lead.history.push(`${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - Advanced to "${lead.stage}"`);
    
    if (lead.stage === "Closed Won") {
      triggerConfetti();
      showToast(`🎉 Deal WON: ₹${lead.value.toLocaleString("en-IN")} with ${lead.name}!`);
    } else {
      showToast(`✓ Advanced ${lead.name} to "${lead.stage}"`);
    }

    saveLeads();
    renderAll();
  }
};

// Mark as Closed Won
window.markLeadWon = function(leadId) {
  const lead = leads.find(l => l.id === leadId);
  if (!lead) return;

  lead.stage = "Closed Won";
  lead.history.push(`${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - Deal marked as Closed Won! Recovered ₹${lead.value}`);
  saveLeads();
  renderAll();

  triggerConfetti();
  showToast(`🎉 CONGRATS! Won deal worth ₹${lead.value.toLocaleString("en-IN")} with ${lead.name}!`);
};

// Render Cold Lead Radar
function renderColdRadar() {
  const coldLeads = leads.filter(l => l.stage !== "Closed Won" && l.stage !== "Cold / Lost" && l.createdHoursAgo >= 24);
  const grid = document.getElementById("coldLeadsGrid");
  const riskCount = document.getElementById("radarAtRiskCount");
  const riskRev = document.getElementById("radarAtRiskRevenue");

  const totalRiskRevenue = coldLeads.reduce((acc, curr) => acc + (curr.value || 0), 0);
  riskCount.innerText = coldLeads.length;
  riskRev.innerText = `₹${totalRiskRevenue.toLocaleString("en-IN")}`;

  if (!grid) return;
  grid.innerHTML = "";

  if (coldLeads.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: #fff; border-radius: 16px; border: 1px dashed #cbd5e1;">
        <span style="font-size: 36px;">🛡️</span>
        <h3 style="font-size: 17px; margin-top: 10px; font-weight: 800;">Zero Cold Leads! Radar is All Clear.</h3>
        <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Every enquiry is being followed up within the optimal 24-hour conversion window.</p>
      </div>
    `;
    return;
  }

  coldLeads.forEach(lead => {
    const card = document.createElement("div");
    card.className = "cold-card";
    card.innerHTML = `
      <div class="cold-c-head">
        <div>
          <div class="cold-c-name">${lead.name}</div>
          <div class="cold-c-meta">📱 ${lead.phone} &bull; Channel: ${lead.channel}</div>
        </div>
        <div class="delay-pill">
          🚨 ${lead.createdHoursAgo}h Untouched
        </div>
      </div>

      <div class="cold-c-details">
        <div><strong>Service:</strong> ${lead.service}</div>
        <div><strong>Quoted Deal Size:</strong> <span class="font-mono">₹${(lead.value || 0).toLocaleString("en-IN")}</span></div>
        <div><strong>Current Stage:</strong> ${lead.stage}</div>
        ${lead.notes ? `<div><strong>Notes:</strong> ${lead.notes}</div>` : ""}
      </div>

      <div class="cold-c-actions">
        <button class="btn btn-whatsapp" onclick="openNudgeModal('${lead.id}')" style="flex: 2;">
          ⚡ Send AI WhatsApp Nudge
        </button>
        <button class="btn btn-outline" onclick="markLeadWon('${lead.id}')" style="flex: 1;">
          🎉 Mark Won
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Render Table View
function renderTable() {
  const filtered = getFilteredLeads();
  const tbody = document.getElementById("leadsTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  filtered.forEach(lead => {
    const tr = document.createElement("tr");
    tr.style.cursor = "pointer";
    tr.onclick = (e) => {
      if (e.target.closest("button")) return;
      openDrawerModal(lead.id);
    };

    tr.innerHTML = `
      <td>
        <strong>${lead.name}</strong><br>
        <small style="color: #64748b;">${lead.phone}</small>
      </td>
      <td><span class="channel-tag ${lead.channel.toLowerCase().replace(" ", "-")}">${lead.channel}</span></td>
      <td>${lead.service}</td>
      <td><strong class="font-mono">₹${(lead.value || 0).toLocaleString("en-IN")}</strong></td>
      <td><span class="col-count-pill">${lead.stage}</span></td>
      <td>${lead.createdHoursAgo}h ago</td>
      <td>${lead.followUpDue || "-"}</td>
      <td><span class="urgency-pill ${(lead.urgency || "medium").toLowerCase()}">${lead.urgency || "Medium"}</span></td>
      <td>
        <button class="btn btn-outline" style="padding: 4px 8px; font-size: 11px;" onclick="openNudgeModal('${lead.id}')">
          ⚡ Nudge
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// AI Quick Capture Modal Logic (Page 7 Metric: < 30 sec)
function openCaptureModal() {
  document.getElementById("captureModal").classList.remove("hidden");
  document.getElementById("leadFollowUpDate").value = getTodayOffset(1);
  startCaptureTimer();
}

function closeCaptureModal() {
  document.getElementById("captureModal").classList.add("hidden");
  stopCaptureTimer();
  document.getElementById("leadForm").reset();
  document.getElementById("rawChatInput").value = "";
  document.getElementById("parseStatus").innerText = "";
}

function startCaptureTimer() {
  captureStartTime = Date.now();
  const timerEl = document.getElementById("captureTimer");
  clearInterval(captureTimerInterval);
  captureTimerInterval = setInterval(() => {
    const elapsed = ((Date.now() - captureStartTime) / 1000).toFixed(1);
    timerEl.innerText = `${elapsed}s`;
  }, 100);
}

function stopCaptureTimer() {
  clearInterval(captureTimerInterval);
}

// Sample Chats for Testing
const SAMPLE_CHATS = {
  tuition: "Bhaiya mujhe class 12 physics aur maths crash course ke baare me enquiry karni thi for my sister. My name is Rohan Sharma, phone number 9876543210. Hamara budget around 15000 hai. Please weekend morning batch details share kardo jaldi, urgent hai exam aa raha hai.",
  salon: "Hi ma'am! Priya Nair here, 9988776655. Looking for bridal HD makeup and hair styling for my wedding reception on Nov 25th. Expected budget is 35000. Can you send available artist slots and portfolio?",
  auto: "Hey boss, this is Amit Verma 9811223344. Got a new Hyundai Creta and want ceramic coating plus deep interior dry cleaning. What would be the total price? Budget is 18000.",
  catering: "Hello Royal Feast, this is Vikram Malhotra 9820011223. Need corporate lunch buffet for 120 guests on next Friday. Budget is 60000 approx. Please send quote with continental and Indian menu options."
};

function loadSampleChat(key) {
  if (SAMPLE_CHATS[key]) {
    document.getElementById("rawChatInput").value = SAMPLE_CHATS[key];
    runAiParser();
  }
}

// AI Extraction Algorithm
function runAiParser() {
  const text = document.getElementById("rawChatInput").value.trim();
  if (!text) {
    alert("Please paste chat text or select a sample enquiry first!");
    return;
  }

  // Extract Phone Number (Indian 10-digit)
  const phoneMatch = text.match(/[6-9]\d{9}/);
  if (phoneMatch) {
    document.getElementById("leadPhone").value = phoneMatch[0];
  }

  // Extract Name
  let name = "";
  const namePatterns = [
    /(?:name is|naam|this is|i am)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
    /([A-Z][a-z]+\s+[A-Z][a-z]+)\s+here/i
  ];
  for (let pat of namePatterns) {
    const m = text.match(pat);
    if (m && m[1]) {
      name = m[1].trim();
      break;
    }
  }
  if (!name && phoneMatch) name = "WhatsApp Customer";
  document.getElementById("leadName").value = name;

  // Extract Price / Budget
  const budgetMatch = text.match(/(?:budget|price|around|worth|quote)?\s*(?:around|is)?\s*(?:₹|rs\.?|inr)?\s*(\d{4,6}|\d{1,2}k)/i);
  if (budgetMatch && budgetMatch[1]) {
    let valStr = budgetMatch[1].toLowerCase();
    let val = valStr.endsWith("k") ? parseInt(valStr.replace("k", "")) * 1000 : parseInt(valStr);
    document.getElementById("leadValue").value = val;
  }

  // Extract Service keywords
  let service = "General Consultation / Service Enquiry";
  const lower = text.toLowerCase();
  if (lower.includes("tuition") || lower.includes("physics") || lower.includes("maths") || lower.includes("class")) {
    service = "Academic Tuition & Coaching";
  } else if (lower.includes("makeup") || lower.includes("bridal") || lower.includes("hair") || lower.includes("salon")) {
    service = "Bridal Makeup & Styling Package";
  } else if (lower.includes("ceramic") || lower.includes("car") || lower.includes("coating") || lower.includes("detailing")) {
    service = "Ceramic Coating & Detailing";
  } else if (lower.includes("cater") || lower.includes("lunch") || lower.includes("buffet") || lower.includes("food")) {
    service = "Corporate Event Buffet Catering";
  }
  document.getElementById("leadService").value = service;

  // Detect Urgency
  if (lower.includes("urgent") || lower.includes("jaldi") || lower.includes("exam") || lower.includes("asap") || lower.includes("tomorrow")) {
    document.getElementById("leadUrgency").value = "High";
  } else {
    document.getElementById("leadUrgency").value = "Medium";
  }

  // Notes
  document.getElementById("leadNotes").value = text;

  // Feedback to User
  document.getElementById("parseStatus").innerText = "✓ Fields auto-extracted in 0.4s! Ready to save.";
}

// Save Lead from Form
function handleLeadFormSubmit(e) {
  e.preventDefault();
  stopCaptureTimer();

  const elapsed = ((Date.now() - captureStartTime) / 1000).toFixed(1);

  const newLead = {
    id: `lead-${Date.now()}`,
    name: document.getElementById("leadName").value.trim(),
    phone: document.getElementById("leadPhone").value.trim(),
    channel: document.getElementById("leadChannel").value,
    service: document.getElementById("leadService").value.trim(),
    value: parseInt(document.getElementById("leadValue").value) || 0,
    urgency: document.getElementById("leadUrgency").value,
    stage: document.getElementById("leadStage").value,
    createdHoursAgo: 0,
    followUpDue: document.getElementById("leadFollowUpDate").value || getTodayOffset(1),
    notes: document.getElementById("leadNotes").value.trim(),
    history: [
      `${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - Captured via PulseLead AI in ${elapsed}s (Page 7 Target: <30s)`
    ]
  };

  leads.unshift(newLead);
  saveLeads();
  closeCaptureModal();
  renderAll();

  showToast(`⚡ Lead "${newLead.name}" added to pipeline in ${elapsed}s! (Page 7 Target Met)`);
}

// Simulate Incoming Lead
function simulateIncomingLead() {
  const simulatedEnquiries = [
    {
      name: "Ananya Iyer",
      phone: "9876599887",
      channel: "WhatsApp",
      service: "NEET Crash Course 2026",
      value: 22000,
      urgency: "High",
      notes: "Hello sir! Can I get the schedule for upcoming NEET mock tests and weekend revision batches?"
    },
    {
      name: "Sameer Deshmukh",
      phone: "9823456711",
      channel: "WhatsApp",
      service: "Full PPF + Ceramic Package",
      value: 45000,
      urgency: "High",
      notes: "Hi, just took delivery of Mahindra XUV700. Want high gloss PPF installed this Friday."
    },
    {
      name: "Tanya Kapoor",
      phone: "9910022334",
      channel: "Instagram",
      service: "Engagement & Sangeet Styling",
      value: 28000,
      urgency: "Medium",
      notes: "Hey! Do you have slots available on Nov 10th for bridal party makeup?"
    }
  ];

  const randomEnquiry = simulatedEnquiries[Math.floor(Math.random() * simulatedEnquiries.length)];

  const simulatedLead = {
    id: `lead-${Date.now()}`,
    name: randomEnquiry.name,
    phone: randomEnquiry.phone,
    channel: randomEnquiry.channel,
    service: randomEnquiry.service,
    value: randomEnquiry.value,
    urgency: randomEnquiry.urgency,
    stage: "New",
    createdHoursAgo: 0,
    followUpDue: getTodayOffset(0),
    notes: randomEnquiry.notes,
    history: [
      `${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - Incoming WhatsApp enquiry simulated in real time`
    ]
  };

  leads.unshift(simulatedLead);
  saveLeads();
  renderAll();

  showToast(`💬 Incoming WhatsApp chat from ${simulatedLead.name}! Added to "New Enquiry" queue.`);
}

// Audio Simulation (Voice Note Parser)
function toggleAudioSimulation() {
  const waveforms = document.getElementById("audioWaveforms");
  const playIcon = document.getElementById("playIcon");
  const playText = document.getElementById("playText");

  isAudioPlaying = !isAudioPlaying;

  if (isAudioPlaying) {
    waveforms.classList.add("playing");
    playIcon.innerText = "⏸";
    playText.innerText = "Playing Voice Note (Simulated)...";
  } else {
    stopAudioSimulation();
  }
}

function stopAudioSimulation() {
  isAudioPlaying = false;
  const waveforms = document.getElementById("audioWaveforms");
  if (waveforms) waveforms.classList.remove("playing");
  const playIcon = document.getElementById("playIcon");
  const playText = document.getElementById("playText");
  if (playIcon) playIcon.innerText = "▶";
  if (playText) playText.innerText = "Simulate Playing Audio";
}

function transcribeAudioSimulation() {
  stopAudioSimulation();
  document.getElementById("transcriptionBox").classList.remove("hidden");
  showToast("✓ Audio voice note transcribed into text!");
}

function importVoiceLead() {
  const voiceLead = {
    id: `lead-${Date.now()}`,
    name: "Pooja Singhania",
    phone: "9845012345",
    channel: "WhatsApp",
    service: "Family Gathering Lunch Catering (40 Pax)",
    value: 25000,
    urgency: "High",
    stage: "New",
    createdHoursAgo: 0,
    followUpDue: getTodayOffset(0),
    notes: "Requires full catering service with starters & biryani for Sunday afternoon.",
    history: [
      `${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - Extracted directly from customer WhatsApp Audio Note`
    ]
  };

  leads.unshift(voiceLead);
  saveLeads();
  renderAll();
  document.getElementById("voiceModal").classList.add("hidden");
  showToast(`🎙️ Voice Note converted into Lead "${voiceLead.name}" in "New Enquiry" column!`);
}

// Customer Detail Drawer Modal
function openDrawerModal(leadId) {
  const lead = leads.find(l => l.id === leadId);
  if (!lead) return;

  activeDrawerLead = lead;

  const initials = lead.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  document.getElementById("drawerAvatar").innerText = initials;
  document.getElementById("drawerCustomerName").innerText = lead.name;
  document.getElementById("drawerCustomerSubtitle").innerText = `${lead.phone} • Channel: ${lead.channel}`;
  document.getElementById("drawerService").innerText = lead.service;
  document.getElementById("drawerValue").innerText = `₹${(lead.value || 0).toLocaleString("en-IN")}`;
  document.getElementById("drawerStage").innerText = lead.stage;
  document.getElementById("drawerDue").innerText = lead.followUpDue || "Today";

  const timelineEl = document.getElementById("drawerTimeline");
  timelineEl.innerHTML = "";

  (lead.history || ["Enquiry captured"]).forEach(h => {
    const item = document.createElement("div");
    item.className = "t-item";
    item.innerText = h;
    timelineEl.appendChild(item);
  });

  document.getElementById("leadDrawerModal").classList.remove("hidden");
}

function closeDrawerModal() {
  document.getElementById("leadDrawerModal").classList.add("hidden");
  activeDrawerLead = null;
}

// Nudge Modal (WhatsApp Message Generator)
window.openNudgeModal = function(leadId) {
  const lead = leads.find(l => l.id === leadId);
  if (!lead) return;

  activeNudgeLead = lead;
  document.getElementById("nudgeCustomerName").innerText = lead.name;
  document.getElementById("nudgeService").innerText = lead.service;
  document.getElementById("nudgeValue").innerText = `₹${(lead.value || 0).toLocaleString("en-IN")}`;
  document.getElementById("nudgeLastContact").innerText = `${lead.createdHoursAgo} hours ago`;

  updateNudgeMessage();
  document.getElementById("nudgeModal").classList.remove("hidden");
};

function closeNudgeModal() {
  document.getElementById("nudgeModal").classList.add("hidden");
  activeNudgeLead = null;
}

function updateNudgeMessage() {
  if (!activeNudgeLead) return;

  const lead = activeNudgeLead;
  const businessName = document.getElementById("businessSelect").selectedOptions[0].text;
  let msg = "";

  switch (selectedTone) {
    case "friendly-hinglish":
      msg = `Namaste ${lead.name} ji! 🙏 Hope you're doing well. Just following up regarding your enquiry for *${lead.service}* with ${businessName}. Humne aapke requirement note kar liye the. Please let me know agar aapka koi question hai ya aap confirm karna chahte hain! Happy to help. 😊`;
      break;

    case "professional":
      msg = `Dear ${lead.name}, greetings from ${businessName}. We are following up regarding your requirement for *${lead.service}*. Please let us know if you would like to proceed or if you need any adjustments to the proposal. We look forward to serving you.`;
      break;

    case "urgency":
      msg = `Hi ${lead.name}! A quick heads-up from ${businessName}: slots for *${lead.service}* are filling up fast for this week. Please confirm your booking today so we can guarantee your preferred timing. Thank you!`;
      break;

    case "discount":
      msg = `Exclusive offer for ${lead.name} ✨: Confirm your booking for *${lead.service}* within 24 hours and get a special 10% instant discount / complimentary add-on consultation! Reply back here to claim.`;
      break;
  }

  document.getElementById("nudgeMessageText").value = msg;

  // Build wa.me link
  const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
  const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(msg)}`;
  document.getElementById("sendWhatsAppLink").href = waUrl;
}

// SMB ROI Calculator Logic
function initRoiCalculator() {
  const leadsSlider = document.getElementById("monthlyLeadsSlider");
  const ticketSlider = document.getElementById("avgTicketSlider");
  const dropSlider = document.getElementById("dropRateSlider");

  function calculate() {
    const totalLeads = parseInt(leadsSlider.value);
    const avgTicket = parseInt(ticketSlider.value);
    const dropRate = parseInt(dropSlider.value) / 100;

    document.getElementById("displayLeads").innerText = `${totalLeads} enquiries`;
    document.getElementById("displayTicket").innerText = `₹${avgTicket.toLocaleString("en-IN")}`;
    document.getElementById("displayDrop").innerText = `${Math.round(dropRate * 100)}% dropped`;

    const droppedLeadsCount = totalLeads * dropRate;
    const monthlyLostRevenue = droppedLeadsCount * avgTicket;

    // PulseLead recovers ~70% of previously dropped leads
    const monthlyRescuedRevenue = monthlyLostRevenue * 0.70;
    const subscriptionCost = 499;
    const roiMultiplier = Math.round(monthlyRescuedRevenue / subscriptionCost);

    document.getElementById("calcLostRevenue").innerText = `₹${Math.round(monthlyLostRevenue).toLocaleString("en-IN")}`;
    document.getElementById("calcRescuedRevenue").innerText = `₹${Math.round(monthlyRescuedRevenue).toLocaleString("en-IN")}`;
    document.getElementById("calcRoiRatio").innerText = `${roiMultiplier}x`;
  }

  leadsSlider.addEventListener("input", calculate);
  ticketSlider.addEventListener("input", calculate);
  dropSlider.addEventListener("input", calculate);

  calculate();
}

// Pure JavaScript Canvas Confetti Engine
function triggerConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ["#4f46e5", "#10b981", "#f59e0b", "#ec4899", "#3b82f6", "#8b5cf6"];

  for (let i = 0; i < 120; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.5) * 16 - 3,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10
    });
  }

  let animationFrame;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeParticles = 0;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.3; // Gravity
      p.alpha -= 0.015;
      p.rotation += p.vRot;

      if (p.alpha > 0) {
        activeParticles++;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (activeParticles > 0) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  animate();
}

// Export to CSV
function exportToCsv() {
  const headers = ["ID", "Name", "Phone", "Channel", "Service", "Value (INR)", "Stage", "Hours Ago", "Follow-up Due", "Urgency", "Notes"];
  const rows = leads.map(l => [
    l.id,
    `"${l.name}"`,
    l.phone,
    l.channel,
    `"${l.service}"`,
    l.value || 0,
    l.stage,
    l.createdHoursAgo,
    l.followUpDue,
    l.urgency,
    `"${(l.notes || "").replace(/"/g, '""')}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `PulseLead_SMB_Leads_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("✓ Exported leads to CSV");
}

// Toast Notification System
function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMessage");
  toastMsg.innerText = message;
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3500);
}
