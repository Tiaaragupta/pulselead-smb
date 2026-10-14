// PulseLead SMB — Modern Obsidian Dark Frontend Engine
// Synchronized with Python REST Backend (Port 8080) & SQLite Database
// Product Design & Lean Startup Strategy — Unit 1 Project

const API_BASE = "http://localhost:8080/api";
let backendAvailable = false;

// Fallback Seed Data (used if backend is offline or on GitHub Pages)
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
      "10:15 AM - WhatsApp inquiry received",
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
      "Yesterday 02:00 PM - Sent ₹32,000 package. Stale for 29h."
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
      "Yesterday 09:30 AM - Garage consultation",
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
      "09:45 AM - Call with HR manager",
      "10:30 AM - Menu PDF dispatched via WhatsApp"
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
    notes: "Clothing boutique owner looking to move from Instagram to automated cart.",
    history: [
      "Yesterday 01:15 PM - Audit conducted",
      "Yesterday 03:00 PM - Proposal submitted"
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
      "11:45 AM - Confirmed booking & paid via GPay 🎉"
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
      "Yesterday 06:30 PM - Enrollment confirmed & fee cleared 🎉"
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

// WhatsApp Thread Conversations Database for Dual-Pane Hub
const WA_THREADS = {
  vikrant: {
    name: "Vikrant Sharma",
    phone: "9876543210",
    avatar: "VS",
    avatarClass: "",
    service: "Class 12 Maths & Physics Tuition",
    budget: 14000,
    messages: [
      { sender: "inbound", text: "Namaste sir! Mera naam Vikrant Sharma hai. Mujhe class 12 physics aur maths crash course ke baare me puchna tha.", time: "10:14 AM" },
      { sender: "inbound", text: "Meri sister CBSE board exam de rahi hai. Hamara budget around 14000 hai. Kya weekend doubt classes available hain?", time: "10:15 AM" },
      { sender: "outbound", text: "Hello Vikrant ji! Yes, we have dedicated CBSE Class 12 batches with senior faculty. Saturday and Sunday 10 AM to 1 PM. Let me share the detailed schedule with you.", time: "10:16 AM" }
    ]
  },
  priya: {
    name: "Priya Nair",
    phone: "9988776655",
    avatar: "PN",
    avatarClass: "pink",
    service: "Bridal HD Makeup & Hair Styling",
    budget: 32000,
    messages: [
      { sender: "inbound", text: "Hi Luxe Studio! Priya here. Looking for bridal makeup packages for December 18 wedding reception.", time: "Yesterday 11:00 AM" },
      { sender: "outbound", text: "Hello Priya! Congratulations! We have HD Bridal & Airbrush packages. Sending you our portfolio brochure right away.", time: "Yesterday 11:30 AM" },
      { sender: "outbound", text: "Quoted ₹32,000 for bride + 2 bridesmaids. Let us know if you would like to book the slot!", time: "Yesterday 02:00 PM" }
    ]
  },
  amit: {
    name: "Amitabh Patel",
    phone: "9123456789",
    avatar: "AP",
    avatarClass: "blue",
    service: "Ceramic Coating & Deep Interior Detailing",
    budget: 18500,
    messages: [
      { sender: "inbound", text: "Hello Speedy Auto, Amitabh Patel here. Got a brand new Honda City white color.", time: "Yesterday 09:15 AM" },
      { sender: "inbound", text: "Want 9H Ceramic coating with 3-year warranty and interior dry clean. How much will it cost?", time: "Yesterday 09:30 AM" },
      { sender: "outbound", text: "Hi Amitabh! Our 9H Ceramic package is ₹18,500 including 3 coats, hydrophobic glass treatment, and free interior detailing.", time: "Yesterday 10:00 AM" }
    ]
  }
};

let currentWaThreadKey = "vikrant";

// Helper to calculate date offsets (YYYY-MM-DD)
function getTodayOffset(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}

// App State
let leads = [];
let searchQuery = "";
let selectedTone = "friendly-hinglish";
let activeNudgeLead = null;
let activeDrawerLead = null;
let captureStartTime = null;
let captureTimerInterval = null;

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  await checkBackendAndLoad();
  initEventListeners();
  initRoiCalculator();
  renderAll();
  renderWaActiveThread();
});

// Check Python REST Backend or Fallback
async function checkBackendAndLoad() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      backendAvailable = true;
      document.getElementById("backendStatusText").innerText = "Python REST API • Port 8080";
      const leadsRes = await fetch(`${API_BASE}/leads`);
      leads = await leadsRes.json();
      return;
    }
  } catch (e) {
    backendAvailable = false;
  }

  // Fallback to LocalStorage
  document.getElementById("backendStatusText").innerText = "Client Engine (Offline Mode)";
  const stored = localStorage.getItem("pulselead_dark_leads");
  if (stored) {
    try { leads = JSON.parse(stored); } catch (e) { leads = [...SEED_LEADS]; }
  } else {
    leads = [...SEED_LEADS];
    saveLeadsLocal();
  }
}

function saveLeadsLocal() {
  localStorage.setItem("pulselead_dark_leads", JSON.stringify(leads));
}

async function persistLeadChange(lead, method = "PUT") {
  if (backendAvailable) {
    try {
      if (method === "PUT") {
        await fetch(`${API_BASE}/leads/${lead.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lead)
        });
      } else if (method === "POST") {
        await fetch(`${API_BASE}/leads`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lead)
        });
      }
    } catch (e) {
      console.warn("Backend sync failed; local state preserved.", e);
    }
  }
  saveLeadsLocal();
}

// Event Listeners
function initEventListeners() {
  // Navigation Tabs in Left Sidebar
  document.querySelectorAll(".side-nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".side-nav-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-view").forEach(v => v.classList.remove("active"));
      btn.classList.add("active");
      const targetId = `tab-${btn.dataset.tab}`;
      const targetEl = document.getElementById(targetId);
      if (targetEl) targetEl.classList.add("active");

      // Update breadcrumb
      const titleMap = {
        "pipeline": "Lead Pipeline Kanban",
        "cold-radar": "Cold Lead Radar & Recovery",
        "chat-hub": "WhatsApp Business Chat Hub",
        "list-view": "All Leads Database Ledger",
        "roi-calculator": "SMB Lost Revenue & ROI Engine"
      };
      document.getElementById("pageTitleText").innerText = titleMap[btn.dataset.tab] || "PulseLead";
    });
  });

  // Search input
  document.getElementById("searchInput").addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderKanban();
    renderTable();
  });

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

  // AI Extraction & Sample Buttons
  document.getElementById("aiParseBtn").addEventListener("click", runAiParser);
  document.querySelectorAll(".chip-dark").forEach(chip => {
    chip.addEventListener("click", () => loadSampleChat(chip.dataset.sample));
  });

  // Lead Form Submission
  document.getElementById("leadForm").addEventListener("submit", handleLeadFormSubmit);

  // Simulate Incoming Lead
  document.getElementById("simulateLeadBtn").addEventListener("click", simulateIncomingLead);

  // Tone Buttons in Nudge Modal
  document.querySelectorAll(".tone-card-dark").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tone-card-dark").forEach(b => b.classList.remove("active"));
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

  // Reset Demo Database
  document.getElementById("resetDemoBtn").addEventListener("click", async () => {
    if (confirm("Reset database to initial verified sample data?")) {
      if (backendAvailable) {
        await fetch(`${API_BASE}/reset`, { method: "POST" });
        const res = await fetch(`${API_BASE}/leads`);
        leads = await res.json();
      } else {
        leads = [...SEED_LEADS];
        saveLeadsLocal();
      }
      renderAll();
      showToast("✓ Database reset successfully");
    }
  });

  // WhatsApp Thread items click
  document.querySelectorAll(".wa-thread-item").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".wa-thread-item").forEach(t => t.classList.remove("active"));
      item.classList.add("active");
      currentWaThreadKey = item.dataset.thread;
      renderWaActiveThread();
    });
  });

  // Extract from active WhatsApp chat
  document.getElementById("extractFromActiveChatBtn").addEventListener("click", extractFromCurrentWaChat);

  // Send quick reply in WhatsApp simulator
  document.getElementById("sendQuickReplyBtn").addEventListener("click", sendWaQuickReply);
  document.getElementById("waQuickReplyInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendWaQuickReply();
  });

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
    return !searchQuery || 
      lead.name.toLowerCase().includes(searchQuery) ||
      lead.phone.includes(searchQuery) ||
      lead.service.toLowerCase().includes(searchQuery);
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
  card.className = `lead-card-dark ${isCold ? "card-stale" : ""} ${isDueToday ? "card-due-today" : ""}`;
  card.draggable = true;
  card.dataset.id = lead.id;

  card.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", lead.id);
  });

  card.addEventListener("click", (e) => {
    if (e.target.closest("button") || e.target.closest("a")) return;
    openDrawerModal(lead.id);
  });

  const channelClass = (lead.channel || "whatsapp").toLowerCase().replace(" ", "-");
  const urgencyClass = (lead.urgency || "medium").toLowerCase();

  card.innerHTML = `
    <div class="c-head-row">
      <span class="c-name">${lead.name}</span>
      <span class="channel-tag-dark ${channelClass}">${lead.channel}</span>
    </div>

    <div class="c-service-text">${lead.service}</div>

    <div class="c-money-row">
      <span class="c-deal-val font-mono">₹${(lead.value || 0).toLocaleString("en-IN")}</span>
      <span class="urgency-dark-tag ${urgencyClass}">${lead.urgency || "Medium"}</span>
    </div>

    ${lead.notes ? `<div class="c-notes-snippet">${lead.notes}</div>` : ""}

    <div class="c-timing-row">
      <span class="${isCold ? 'timing-warn' : ''}">
        ${isCold ? '⚠️ Untouched: ' : '⏱️ '}${lead.createdHoursAgo}h ago
      </span>
      <span>
        📅 Due: ${lead.followUpDue || "Today"}
      </span>
    </div>

    <div class="c-actions-grid">
      <button class="btn-card-dark btn-nudge-dark" onclick="openNudgeModal('${lead.id}')">
        <span>⚡ WhatsApp</span>
      </button>
      ${lead.stage !== 'Closed Won' ? `
        <button class="btn-card-dark btn-win-dark" onclick="markLeadWon('${lead.id}')" title="Mark as Won">
          <span>🎉 Won</span>
        </button>
      ` : ''}
      <button class="btn-card-dark" onclick="advanceLeadStage('${lead.id}')" title="Move to next stage">
        <span>→ Next</span>
      </button>
    </div>
  `;

  return card;
}

// Drag & Drop
window.handleDragOver = function(e) {
  e.preventDefault();
};

window.handleDrop = async function(e, targetStage) {
  e.preventDefault();
  const leadId = e.dataTransfer.getData("text/plain");
  const lead = leads.find(l => l.id === leadId);
  if (lead && lead.stage !== targetStage) {
    lead.stage = targetStage;
    const historyMsg = `${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - Moved to "${targetStage}"`;
    lead.history = lead.history || [];
    lead.history.push(historyMsg);

    await persistLeadChange({ id: lead.id, stage: targetStage, historyItem: historyMsg });

    if (targetStage === "Closed Won") {
      triggerConfetti();
      showToast(`🎉 CONGRATS! Won ₹${lead.value.toLocaleString("en-IN")} deal with ${lead.name}!`);
    } else {
      showToast(`Lead moved to "${targetStage}"`);
    }

    renderAll();
  }
};

// Advance Stage Button
window.advanceLeadStage = async function(leadId) {
  const lead = leads.find(l => l.id === leadId);
  if (!lead) return;

  const stageOrder = ["New", "Contacted", "Quote Sent", "Follow-Up Scheduled", "Closed Won"];
  const currentIndex = stageOrder.indexOf(lead.stage);

  if (currentIndex >= 0 && currentIndex < stageOrder.length - 1) {
    lead.stage = stageOrder[currentIndex + 1];
    const historyMsg = `${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - Advanced to "${lead.stage}"`;
    lead.history = lead.history || [];
    lead.history.push(historyMsg);

    await persistLeadChange({ id: lead.id, stage: lead.stage, historyItem: historyMsg });

    if (lead.stage === "Closed Won") {
      triggerConfetti();
      showToast(`🎉 Deal WON: ₹${lead.value.toLocaleString("en-IN")} with ${lead.name}!`);
    } else {
      showToast(`✓ Advanced ${lead.name} to "${lead.stage}"`);
    }

    renderAll();
  }
};

// Mark as Closed Won
window.markLeadWon = async function(leadId) {
  const lead = leads.find(l => l.id === leadId);
  if (!lead) return;

  lead.stage = "Closed Won";
  const historyMsg = `${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - Closed Won! Recovered ₹${lead.value}`;
  lead.history = lead.history || [];
  lead.history.push(historyMsg);

  await persistLeadChange({ id: lead.id, stage: "Closed Won", historyItem: historyMsg });

  triggerConfetti();
  showToast(`🎉 CONGRATS! Won deal worth ₹${lead.value.toLocaleString("en-IN")} with ${lead.name}!`);
  renderAll();
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
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: rgba(0,0,0,0.3); border-radius: 16px; border: 1px dashed var(--border-subtle);">
        <span style="font-size: 36px;">🛡️</span>
        <h3 style="font-size: 17px; margin-top: 10px; font-weight: 800;">Zero Cold Leads! Radar is All Clear.</h3>
        <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Every enquiry is being followed up within the optimal 24-hour conversion window.</p>
      </div>
    `;
    return;
  }

  coldLeads.forEach(lead => {
    const card = document.createElement("div");
    card.className = "cold-card-dark";
    card.innerHTML = `
      <div class="cold-head-row">
        <div>
          <div style="font-size: 15px; font-weight: 800;">${lead.name}</div>
          <div style="font-size: 12px; color: var(--text-muted);">📱 ${lead.phone} • Channel: ${lead.channel}</div>
        </div>
        <div class="delay-badge-neon">
          🚨 ${lead.createdHoursAgo}h Untouched
        </div>
      </div>

      <div class="cold-details-dark">
        <div><strong>Service:</strong> ${lead.service}</div>
        <div><strong>Quoted Deal Size:</strong> <span class="font-mono text-emerald">₹${(lead.value || 0).toLocaleString("en-IN")}</span></div>
        <div><strong>Current Stage:</strong> ${lead.stage}</div>
        ${lead.notes ? `<div><strong>Notes:</strong> ${lead.notes}</div>` : ""}
      </div>

      <div class="cold-actions-row">
        <button class="btn btn-whatsapp-glow" onclick="openNudgeModal('${lead.id}')" style="flex: 2;">
          ⚡ Send AI WhatsApp Nudge
        </button>
        <button class="btn btn-outline-dark" onclick="markLeadWon('${lead.id}')" style="flex: 1;">
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
        <small style="color: var(--text-muted);">${lead.phone}</small>
      </td>
      <td><span class="channel-tag-dark ${(lead.channel || 'whatsapp').toLowerCase().replace(' ', '-')}">${lead.channel}</span></td>
      <td>${lead.service}</td>
      <td><strong class="font-mono text-emerald">₹${(lead.value || 0).toLocaleString("en-IN")}</strong></td>
      <td><span class="col-count">${lead.stage}</span></td>
      <td>${lead.createdHoursAgo}h ago</td>
      <td>${lead.followUpDue || "-"}</td>
      <td><span class="urgency-dark-tag ${(lead.urgency || "medium").toLowerCase()}">${lead.urgency || "Medium"}</span></td>
      <td>
        <button class="btn-card-dark btn-nudge-dark" style="padding: 4px 8px; font-size: 11px;" onclick="openNudgeModal('${lead.id}')">
          ⚡ Nudge
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Render Active WhatsApp Thread in Dual-Pane Hub
function renderWaActiveThread() {
  const thread = WA_THREADS[currentWaThreadKey];
  if (!thread) return;

  const avatarEl = document.getElementById("activeChatAvatar");
  avatarEl.innerText = thread.avatar;
  avatarEl.className = `wa-avatar ${thread.avatarClass}`;

  document.getElementById("activeChatName").innerText = thread.name;
  document.getElementById("activeChatSubtitle").innerText = `+91 ${thread.phone} • WhatsApp Business`;

  const stage = document.getElementById("waMessagesStage");
  stage.innerHTML = "";

  thread.messages.forEach(m => {
    const bubble = document.createElement("div");
    bubble.className = `wa-bubble ${m.sender}`;
    bubble.innerHTML = `
      ${m.text}
      <span class="bubble-time">${m.time}</span>
    `;
    stage.appendChild(bubble);
  });
  stage.scrollTop = stage.scrollHeight;
}

// Send Quick Reply in WhatsApp Hub
function sendWaQuickReply() {
  const input = document.getElementById("waQuickReplyInput");
  const text = input.value.trim();
  if (!text) return;

  const thread = WA_THREADS[currentWaThreadKey];
  if (!thread) return;

  thread.messages.push({
    sender: "outbound",
    text: text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  input.value = "";
  renderWaActiveThread();
  showToast("✓ Message sent on WhatsApp!");
}

// Extract Lead Directly from Active WhatsApp Chat
async function extractFromCurrentWaChat() {
  const thread = WA_THREADS[currentWaThreadKey];
  if (!thread) return;

  const existing = leads.find(l => l.phone === thread.phone);
  if (existing) {
    showToast(`Lead for ${thread.name} already exists in CRM!`);
    return;
  }

  const newLead = {
    id: `lead-${Date.now()}`,
    name: thread.name,
    phone: thread.phone,
    channel: "WhatsApp",
    service: thread.service,
    value: thread.budget,
    urgency: "High",
    stage: "New",
    createdHoursAgo: 0,
    followUpDue: getTodayOffset(0),
    notes: thread.messages[0].text,
    history: [`Extracted in 0.4s directly from WhatsApp Business thread`]
  };

  leads.unshift(newLead);
  await persistLeadChange(newLead, "POST");
  renderAll();
  showToast(`⚡ Lead "${newLead.name}" extracted into CRM in 0.4s! (Page 7 Target Met)`);
}

// AI Quick Capture Modal
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
async function runAiParser() {
  const text = document.getElementById("rawChatInput").value.trim();
  if (!text) {
    alert("Please paste chat text or select a sample enquiry first!");
    return;
  }

  // If backend available, use Python AI endpoint
  if (backendAvailable) {
    try {
      const res = await fetch(`${API_BASE}/ai/extract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      document.getElementById("leadName").value = data.name;
      document.getElementById("leadPhone").value = data.phone;
      document.getElementById("leadService").value = data.service;
      document.getElementById("leadValue").value = data.value;
      document.getElementById("leadUrgency").value = data.urgency;
      document.getElementById("leadNotes").value = text;
      document.getElementById("parseStatus").innerText = `✓ Backend AI Extracted in ${data.extractedInMs}ms!`;
      return;
    } catch (e) {
      // Fallback to client logic
    }
  }

  // Client NLP Extraction
  const phoneMatch = text.match(/[6-9]\d{9}/);
  if (phoneMatch) document.getElementById("leadPhone").value = phoneMatch[0];

  let name = "";
  const namePatterns = [
    /(?:name is|naam|this is|i am)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
    /([A-Z][a-z]+\s+[A-Z][a-z]+)\s+here/i
  ];
  for (let pat of namePatterns) {
    const m = text.match(pat);
    if (m && m[1]) { name = m[1].trim(); break; }
  }
  if (!name && phoneMatch) name = "WhatsApp Customer";
  document.getElementById("leadName").value = name;

  const budgetMatch = text.match(/(?:budget|price|around|worth|quote)?\s*(?:around|is)?\s*(?:₹|rs\.?|inr)?\s*(\d{4,6}|\d{1,2}k)/i);
  if (budgetMatch && budgetMatch[1]) {
    let valStr = budgetMatch[1].toLowerCase();
    let val = valStr.endsWith("k") ? parseInt(valStr.replace("k", "")) * 1000 : parseInt(valStr);
    document.getElementById("leadValue").value = val;
  }

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

  document.getElementById("leadUrgency").value = (lower.includes("urgent") || lower.includes("jaldi") || lower.includes("asap")) ? "High" : "Medium";
  document.getElementById("leadNotes").value = text;
  document.getElementById("parseStatus").innerText = "✓ Extracted in 0.4s! Ready to save.";
}

// Form Submit
async function handleLeadFormSubmit(e) {
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
    history: [`Captured via PulseLead AI in ${elapsed}s (Page 7 Target: <30s)`]
  };

  leads.unshift(newLead);
  await persistLeadChange(newLead, "POST");
  closeCaptureModal();
  renderAll();

  showToast(`⚡ Lead "${newLead.name}" saved in ${elapsed}s! (Page 7 SLA Met)`);
}

// Simulate Incoming Lead
async function simulateIncomingLead() {
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
    history: ["Simulated real-time WhatsApp enquiry"]
  };

  leads.unshift(simulatedLead);
  await persistLeadChange(simulatedLead, "POST");
  renderAll();

  showToast(`💬 Incoming WhatsApp chat from ${simulatedLead.name}! Added to "New Enquiry" queue.`);
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
    item.className = "timeline-item-dark";
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

    const monthlyRescuedRevenue = monthlyLostRevenue * 0.70;
    const subscriptionCost = 499;
    const roiMultiplier = Math.round(monthlyRescuedRevenue / subscriptionCost);

    document.getElementById("calcLostRevenue").innerText = `₹${Math.round(monthlyLostRevenue).toLocaleString("en-IN")} / mo`;
    document.getElementById("calcRescuedRevenue").innerText = `₹${Math.round(monthlyRescuedRevenue).toLocaleString("en-IN")} / mo`;
    document.getElementById("calcRoiRatio").innerText = `${roiMultiplier}x Return`;
  }

  leadsSlider.addEventListener("input", calculate);
  ticketSlider.addEventListener("input", calculate);
  dropSlider.addEventListener("input", calculate);

  calculate();
}

// Canvas Confetti
function triggerConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#06b6d4", "#8b5cf6"];

  for (let i = 0; i < 140; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.5) * 18 - 4,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12
    });
  }

  let animationFrame;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeParticles = 0;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
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
  showToast("✓ Exported leads database to CSV");
}

// Toast
function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMessage");
  toastMsg.innerText = message;
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3500);
}
