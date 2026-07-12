/* ODA Game — Claire Watson TM Forum
   Belt progression: White → Yellow → Blue → Red → Black
*/
(function () {

/* ── Webhooks ──────────────────────────────────────────── */
const CLAIRE_WH = 'https://n8n.srv1739004.hstgr.cloud/webhook/claire-agent';
const SAVE_WH   = 'https://n8n.srv1739004.hstgr.cloud/webhook/oda-game-save';
const LOAD_WH   = 'https://n8n.srv1739004.hstgr.cloud/webhook/oda-game-load';
const DROP_WH   = 'https://n8n.srv1739004.hstgr.cloud/webhook/oda-game-dropout';
const ACH_WH    = 'https://n8n.srv1739004.hstgr.cloud/webhook/oda-game-achievement';
const LS_KEY    = 'oda-game-v1';

/* ── Belt Config ───────────────────────────────────────── */
const BELTS = [
  { name:'White',  color:'#E0E0E0', txt:'#0D0B4D', glow:'200,200,200', need:7, total:10, emoji:'🤍', topic:'ODA Fundamentals' },
  { name:'Yellow', color:'#F5C518', txt:'#0D0B4D', glow:'245,197,24',  need:7, total:10, emoji:'💛', topic:'ODA Canvas & Domains' },
  { name:'Blue',   color:'#2563EB', txt:'#ffffff', glow:'37,99,235',   need:7, total:10, emoji:'💙', topic:'TM Forum Open APIs' },
  { name:'Red',    color:'#D91241', txt:'#ffffff', glow:'217,18,65',   need:7, total:10, emoji:'❤️', topic:'eTOM & SID' },
  { name:'Black',  color:'#111122', txt:'#FFD700', glow:'255,215,0',   need:6, total:8,  emoji:'🖤', topic:'AI-Native & Autonomous Networks' },
];

/* ── Question Bank ─────────────────────────────────────── */
const Qs = [
  // ── WHITE BELT — ODA Fundamentals ──────────────────────
  {b:0,q:'What does ODA stand for in the TM Forum context?',
   opts:['Open Data Architecture','Open Digital Architecture','Operational Digital Automation','Open Domain Architecture'],
   a:1,why:'ODA — Open Digital Architecture — is TM Forum\'s framework for cloud-native, composable BSS/OSS transformation.'},
  {b:0,q:'Which organisation created and maintains the ODA standard?',
   opts:['3GPP','ETSI','TM Forum','ITU-T'],
   a:2,why:'TM Forum developed ODA as the industry\'s open standard for digital transformation in telecoms.'},
  {b:0,q:'What is the primary purpose of the Open Digital Architecture?',
   opts:['To standardise network hardware','To replace monolithic OSS/BSS with composable cloud-native components','To define 5G radio standards','To manage spectrum allocation'],
   a:1,why:'ODA breaks apart monolithic systems into interoperable, independently deployable components — the end of the "big stack".'},
  {b:0,q:'What are ODA Components?',
   opts:['Physical network nodes','Proprietary vendor modules','Standardised independently deployable building blocks exposing TM Forum Open APIs','Software development kits'],
   a:2,why:'ODA Components are the building blocks — standardised, loosely coupled, and interoperable via Open APIs.'},
  {b:0,q:'What architecture pattern is at the heart of ODA?',
   opts:['Monolithic','Client-server','Microservices / cloud-native','Mainframe'],
   a:2,why:'ODA is built on cloud-native microservices principles — containerised, scalable, independently deployable.'},
  {b:0,q:'What is the ODA Canvas?',
   opts:['A network diagram tool','The blueprint showing how ODA Components fit together across functional domains','A cloud provider\'s dashboard','A TM Forum marketing website'],
   a:1,why:'The ODA Canvas is the architectural map — it organises all ODA Components across horizontal layers and vertical cross-cutting concerns.'},
  {b:0,q:'Which TM Forum framework defines the business processes that ODA implements?',
   opts:['ITIL','TOGAF','eTOM (enhanced Telecom Operations Map)','BPMN'],
   a:2,why:'eTOM defines what needs to happen in a telecom business; ODA defines how to build the systems that do it.'},
  {b:0,q:'What is the SID in the TM Forum framework?',
   opts:['Service Integration Database','Shared Information/Data model — the common data model for telecom','System Interface Design','Subscriber Identity Directory'],
   a:1,why:'The SID ensures all systems agree on what a "Customer", "Service", or "Resource" means — the common language of TM Forum\'s information architecture.'},
  {b:0,q:'What does "composable" mean in the ODA context?',
   opts:['AI writes the architecture','Operators assemble capabilities from interoperable components without vendor lock-in','Systems that self-heal','Networks that compress their own traffic'],
   a:1,why:'Composability means operators can mix and match best-of-breed ODA components — no vendor lock-in.'},
  {b:0,q:'What is TM Forum\'s "Ready for ODA" designation?',
   opts:['A vendor\'s self-declaration','TM Forum\'s certification confirming a component meets ODA standards','An EU regulatory requirement','A 3GPP compliance mark'],
   a:1,why:'"Ready for ODA" is TM Forum\'s formal certification that a product genuinely conforms to ODA standards and Open APIs.'},

  // ── YELLOW BELT — ODA Canvas & Domains ─────────────────
  {b:1,q:'Which ODA Canvas layer deals directly with customer-facing processes?',
   opts:['Infrastructure Management','Intelligence & Data','Business Engagement','Production'],
   a:2,why:'The Business Engagement layer covers customer experience, sales, marketing, and service management — the front door of the digital telco.'},
  {b:1,q:'The Production layer of the ODA Canvas primarily covers:',
   opts:['Financial billing and settlements','Service orchestration and resource management','Customer experience management','AI and machine learning operations'],
   a:1,why:'The Production layer is where services are activated and resources are orchestrated across the network.'},
  {b:1,q:'What does the Core Commerce Management layer include?',
   opts:['Network hardware provisioning','Product catalog, order management, and billing','AI-driven network automation','Security and identity management'],
   a:1,why:'Core Commerce Management is the commercial engine — catalog defines what\'s sold, order management fulfils it, billing collects for it.'},
  {b:1,q:'Which ODA component acts as the single source of truth for products, services, and resources?',
   opts:['Order Management','Service Inventory','Product Catalog (TMF620)','Resource Orchestration'],
   a:2,why:'The Product Catalog is the master record — every downstream process (ordering, provisioning, billing) reads from it.'},
  {b:1,q:'Which ODA component catches failed orders and enables bulk automated remediation?',
   opts:['Product Catalog','Service Inventory','Order Management','Closed Loop / Fallout Management'],
   a:3,why:'The Closed Loop / Fallout Management component ensures no failed order falls through the cracks — it catches, batches, and remediates automatically.'},
  {b:1,q:'In ODA terminology, what is a CFS?',
   opts:['Customer Facing Service','Core Framework Standard','Cloud Function Service','Certified Forum Standard'],
   a:0,why:'A Customer Facing Service (CFS) is what the customer buys — it\'s composed from one or more Resource Facing Services (RFS) underneath.'},
  {b:1,q:'What is an RFS in ODA terminology?',
   opts:['Real-time Fulfilment System','Resource Facing Service','Remote Function Service','Ready for Sale'],
   a:1,why:'A Resource Facing Service (RFS) maps to a specific network resource — the building block that makes up Customer Facing Services.'},
  {b:1,q:'The Intelligence & Data layer primarily enables:',
   opts:['Physical network installation','AI/ML-driven analytics, insights and autonomous decision-making','Billing and revenue management','Customer onboarding flows'],
   a:1,why:'Intelligence & Data is the analytical brain of ODA — it ingests operational data and applies AI to drive closed-loop automation.'},
  {b:1,q:'What does the Service Inventory ODA component provide?',
   opts:['A catalogue of services for sale','A 360° view of every customer\'s active services and their current state','A hardware inventory of physical assets','A library of reusable service templates'],
   a:1,why:'The Service Inventory is the operational record of truth — what each customer has, in what state, right now.'},
  {b:1,q:'Which canvas layer manages cloud infrastructure, DevOps, and virtualisation?',
   opts:['Business Engagement','Core Commerce Management','Production','Infrastructure Management'],
   a:3,why:'Infrastructure Management underpins everything above it — cloud platforms, virtualisation, and the DevOps pipelines that deploy ODA components.'},

  // ── BLUE BELT — TM Forum Open APIs ─────────────────────
  {b:2,q:'What is the core purpose of TM Forum Open APIs?',
   opts:['To standardise mobile handset interfaces','To enable zero-touch interoperability between ODA components from any vendor','To replace all existing telecom protocols','To provide a public API marketplace'],
   a:1,why:'TM Forum Open APIs are the "universal connectors" of ODA — any compliant component plugs into any other, regardless of vendor.'},
  {b:2,q:'What does TMF620 cover?',
   opts:['Service Ordering','Trouble Ticketing','Product Catalog Management','Resource Inventory'],
   a:2,why:'TMF620 is the Product Catalog Management API — it exposes the catalog so any downstream system can query products, services, and resources.'},
  {b:2,q:'What does TMF622 define?',
   opts:['Product Inventory','Product Ordering Management','Customer Management','Billing Management'],
   a:1,why:'TMF622 is the Product Ordering API — it places, tracks, and manages product orders flowing from BSS to OSS.'},
  {b:2,q:'TMF638 is the Open API for:',
   opts:['Service Catalog','Resource Ordering','Service Inventory Management','Party Management'],
   a:2,why:'TMF638 exposes the Service Inventory — allowing any authorised system to query the current state of a customer\'s services.'},
  {b:2,q:'What does TM Forum\'s "Platinum Level Open API" designation mean?',
   opts:['The vendor has the highest membership tier','20+ TM Forum Open APIs certified in real-world implementations','The product is entirely cloud-hosted','The product uses only open-source components'],
   a:1,why:'Platinum Level is TM Forum\'s highest API certification tier — earned by certifying 20+ APIs in real production implementations.'},
  {b:2,q:'TMF641 relates to which domain?',
   opts:['Product Ordering','Customer Management','Service Ordering Management','Alarm Management'],
   a:2,why:'TMF641 is the Service Ordering API — it decomposes product orders into service-level instructions for the Production layer.'},
  {b:2,q:'What does TMF621 cover?',
   opts:['Service Inventory','Trouble Ticketing / Trouble Management','Resource Catalog','Geographic Address Management'],
   a:1,why:'TMF621 is the Trouble Ticketing API — used by the Closed Loop component to create, track, and resolve incidents and fallout cases.'},
  {b:2,q:'In ODA, what does "API-first design" mean?',
   opts:['APIs designed after the UI','API contract defined first, enabling parallel development of interoperable components','Only authentication-free APIs used','The first API deployed takes priority'],
   a:1,why:'API-first means the interface contract comes before implementation — enabling multiple vendors to build compliant components in parallel.'},
  {b:2,q:'What does the Async API standard (a TM Forum catalyst project) address?',
   opts:['APIs that respond slowly','Event-driven asynchronous communication between ODA components','APIs for legacy mainframes','Batch-processing interfaces'],
   a:1,why:'Async API enables event-driven communication between ODA components — critical for real-time closed-loop automation.'},
  {b:2,q:'Which REST method do TM Forum Open APIs use to update part of a resource?',
   opts:['PUT','POST','PATCH','DELETE'],
   a:2,why:'PATCH is used for partial updates in TM Forum Open APIs — it changes only specified fields without replacing the entire resource.'},

  // ── RED BELT — eTOM & SID ───────────────────────────────
  {b:3,q:'What does eTOM stand for?',
   opts:['Enhanced Technical Operations Model','Enhanced Telecom Operations Map','Electronic Telecom Operations Management','Enterprise Technology Operations Model'],
   a:1,why:'eTOM — the Enhanced Telecom Operations Map — is TM Forum\'s process framework defining every business process a telecom operator needs.'},
  {b:3,q:'How many top-level process areas (Level 0) does eTOM define?',
   opts:['3','5','7','12'],
   a:0,why:'eTOM has three Level 0 areas: Operations; Strategy, Infrastructure & Product; and Enterprise Management.'},
  {b:3,q:'Which eTOM Level 0 area covers day-to-day customer and network operations?',
   opts:['Strategy, Infrastructure & Product','Enterprise Management','Operations','Customer Experience'],
   a:2,why:'The Operations area covers Fulfil, Assure, and Bill — the day-to-day operational processes that OSS/BSS systems execute.'},
  {b:3,q:'In eTOM, what does the "Assure" process group cover?',
   opts:['Delivering ordered services to customers','Monitoring, fault management, and restoring service quality','Generating and collecting bills','Planning and building network infrastructure'],
   a:1,why:'Assure covers fault detection, incident management, SLA monitoring, and service restoration — the quality guardian of operations.'},
  {b:3,q:'What is the SID (Shared Information/Data model) used for?',
   opts:['Defining security protocols','Providing a common standardised data model for all telecom entities','Specifying network hardware interfaces','Managing spectrum allocation'],
   a:1,why:'The SID ensures all systems agree on what a "Customer", "Service", or "Resource" means — the common language of the TM Forum information architecture.'},
  {b:3,q:'In the SID, what is an "ABE"?',
   opts:['Automated Business Engine','Application Business Entity','Aggregate Business Entity — a grouping of related business entities','API Business Extension'],
   a:2,why:'An ABE (Aggregate Business Entity) groups related SID entities — for example, the Customer ABE covers everything about a customer relationship.'},
  {b:3,q:'How does eTOM relate to ODA?',
   opts:['They are competing frameworks','eTOM defines the business processes that ODA components execute','eTOM is a deprecated subset of ODA','eTOM replaces ODA for legacy operators'],
   a:1,why:'eTOM and ODA are complementary — eTOM defines what processes are needed; ODA defines how to build the components that execute them.'},
  {b:3,q:'Which eTOM process group deals with customer problem resolution and SLA management?',
   opts:['Fulfil','Bill','Assure','Market'],
   a:2,why:'Assure covers fault management and SLA monitoring — directly mapped to the Closed Loop / Fallout Management component in ODA.'},
  {b:3,q:'The SID "Resource" domain covers:',
   opts:['Human resources and staffing','Physical and logical network resources — hardware, software, and connections','Financial resources and CapEx','Customer data governance'],
   a:1,why:'The SID Resource domain models everything in the network — physical equipment, logical functions, and the connections between them.'},
  {b:3,q:'In TM Forum\'s Frameworx, eTOM, SID, and TAM together form what?',
   opts:['The ODA Canvas','The TM Forum Open API suite','The Business Process, Information, and Application frameworks','The Autonomous Networks standard'],
   a:2,why:'Frameworx combines eTOM (processes), SID (data), and TAM (applications) into a unified reference framework for telecoms.'},

  // ── BLACK BELT — AI-Native & Autonomous Networks ────────
  {b:4,q:'What is TM Forum\'s concept of an "AI-Native" network?',
   opts:['A network using AI only for chatbots','A network where AI/ML is embedded at every layer enabling closed-loop automation across all domains','A network built from AI-generated hardware','Any network with an ML dashboard'],
   a:1,why:'AI-Native means AI isn\'t bolted on — it\'s embedded in the architecture, enabling the network to sense, decide, and act autonomously.'},
  {b:4,q:'TM Forum\'s Autonomous Networks framework defines levels L0–L5. What does L5 represent?',
   opts:['Basic scripted automation','Human-assisted automation','Closed-loop with human approval','Full autonomy — the network self-manages; humans set intent only'],
   a:3,why:'L5 is the ultimate goal — a fully self-managing network where operators set business intent and the network handles everything else.'},
  {b:4,q:'What is a "closed loop" in ODA and autonomous networks?',
   opts:['A physical ring topology','A self-contained automation cycle: sense → analyse → decide → act without human intervention','A closed-source software module','A billing cycle that closes at month end'],
   a:1,why:'Closed loops are the engine of autonomy — they monitor, detect anomalies, decide, and execute changes without waiting for a human.'},
  {b:4,q:'What does "intent-based networking" mean in an ODA context?',
   opts:['Networks that read the operator\'s mind','Operators express desired business outcomes; the network determines and executes how to achieve them','Networks configured entirely in natural language','AI systems that replace human engineers'],
   a:1,why:'Intent-based networking abstracts away the "how" — operators state what they need; the network figures out how to deliver it.'},
  {b:4,q:'Which ODA Canvas layer is most directly associated with AI-native operations?',
   opts:['Business Engagement','Core Commerce Management','Infrastructure Management','Intelligence & Data'],
   a:3,why:'The Intelligence & Data layer hosts AI/ML models — ingesting telemetry from across the ODA Canvas and driving closed-loop decisions.'},
  {b:4,q:'What role do TM Forum Open APIs play in enabling AI-native autonomy?',
   opts:['They prevent AI from making changes to live networks','They allow AI engines to observe and control any ODA component from any vendor through a common interface','AI replaces the need for Open APIs','Each AI model requires its own proprietary API'],
   a:1,why:'Open APIs make AI-native possible at scale — an AI controller can drive any compliant ODA component without bespoke integration.'},
  {b:4,q:'TM Forum\'s "Zero-X" vision for autonomous networks aims for:',
   opts:['Networks with zero customers','Zero human intervention, zero wait time, and zero-touch operations','A network with zero legacy components','Software with zero bugs'],
   a:1,why:'Zero-X captures the end-state of autonomous networks: zero unplanned downtime, zero manual operations, zero-touch provisioning.'},
  {b:4,q:'The SATCOM + 5G Anywhere TM Forum catalyst project demonstrates:',
   opts:['Satellite networks replacing terrestrial infrastructure','Convergence of satellite and 5G managed through ODA standards for seamless connectivity','A new satellite-only Open API standard','5G deployment without ODA components'],
   a:1,why:'SATCOM + 5G Anywhere shows how ODA standards unify satellite and terrestrial 5G — a single standards-based management layer for hybrid networks.'},
];

/* ── Font Injection ────────────────────────────────────── */
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap';
document.head.appendChild(fontLink);

/* ── State ─────────────────────────────────────────────── */
let S = {
  email: '', name: '',
  belt: 0, tokens: 0,
  beltCorrect: 0, beltAnswered: 0,
  queue: [], consecutive: 0, done: false,
};

function shuffle(arr) {
  const a = [...arr]; for (let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a;
}
function beltQs(b) { return shuffle(Qs.map((q,i)=>i).filter(i=>Qs[i].b===b)); }

/* ── Persistence ───────────────────────────────────────── */
function saveLocal() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(S)); } catch(e) {}
}
function loadLocal() {
  try { const d = localStorage.getItem(LS_KEY); if (d) { S = {...S, ...JSON.parse(d)}; return true; } } catch(e) {}
  return false;
}
async function saveRemote() {
  if (!S.email) return;
  try { await fetch(SAVE_WH, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(S)}); } catch(e){}
}
async function loadRemote(email) {
  try {
    const r = await fetch(LOAD_WH, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email})});
    if (!r.ok) return false;
    const d = await r.json();
    if (d && d.belt !== undefined) { S = {...S, ...d}; saveLocal(); return true; }
  } catch(e){}
  return false;
}
async function sendDropout() {
  if (!S.email || S.done) return;
  const b = BELTS[S.belt];
  try { await fetch(DROP_WH, {method:'POST', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({email:S.email, name:S.name, belt:b.name, tokens:S.tokens, topic:b.topic})}); } catch(e){}
}
async function sendAchievement(beltIdx) {
  if (!S.email) return;
  const b = BELTS[beltIdx];
  try { fetch(ACH_WH, {method:'POST', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({email:S.email, name:S.name, belt:b.name, beltEmoji:b.emoji, beltColor:b.color, beltTxt:b.txt, tokens:S.tokens, topic:b.topic})}); } catch(e){}
}

/* ── CSS ───────────────────────────────────────────────── */
const css = document.createElement('style');
css.textContent = `
  #odagame-overlay {
    display:none; position:fixed; inset:0; z-index:10000;
    background:rgba(5,4,30,0.85); backdrop-filter:blur(6px);
    align-items:center; justify-content:center;
    font-family:'DM Sans',sans-serif;
  }
  #odagame-overlay.open { display:flex; }

  #odagame-modal {
    width:100%; max-width:580px; max-height:92vh; overflow-y:auto;
    background:#0D0B4D; color:#fff; border-radius:16px;
    box-shadow:0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08);
    position:relative; overflow:hidden;
    transition: box-shadow 0.6s ease;
  }
  #odagame-modal.belt-glow { box-shadow:0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(var(--belt-glow),0.5), 0 0 0 1px rgba(var(--belt-glow),0.3); }

  #odagame-atm {
    position:absolute; top:0; left:0; right:0; height:220px; pointer-events:none;
    background: radial-gradient(ellipse at 50% -20%, rgba(var(--belt-glow),0.35) 0%, transparent 70%);
    transition: background 0.8s ease;
  }

  #odagame-head {
    position:relative; padding:22px 24px 16px; display:flex; align-items:center; gap:14px;
    border-bottom:1px solid rgba(255,255,255,0.07);
  }
  #odagame-belt-badge {
    display:flex; align-items:center; gap:8px; padding:6px 14px 6px 10px;
    border-radius:30px; flex-shrink:0;
    background:var(--belt-color); color:var(--belt-txt);
    font-family:'Barlow Condensed',sans-serif; font-size:13px; font-weight:700;
    letter-spacing:.08em; text-transform:uppercase;
    box-shadow:0 2px 12px rgba(var(--belt-glow),0.5);
    border:1.5px solid rgba(var(--belt-glow),0.5);
    transition:background 0.6s, color 0.6s, box-shadow 0.6s, border-color 0.6s;
  }
  #odagame-belt-badge .belt-dot {
    width:8px; height:8px; border-radius:50%; background:currentColor; opacity:0.6;
  }
  #odagame-title {
    flex:1; font-family:'Barlow Condensed',sans-serif;
    font-size:18px; font-weight:700; letter-spacing:.04em; text-transform:uppercase;
    color:rgba(255,255,255,0.9);
  }
  #odagame-title span { color:rgba(255,255,255,0.4); font-weight:600; }
  #odagame-tokens {
    display:flex; align-items:center; gap:6px;
    font-family:'DM Mono',monospace; font-size:13px; font-weight:500;
    color:rgba(255,255,255,0.7); cursor:default;
  }
  #odagame-token-count {
    background:rgba(255,255,255,0.1); border-radius:20px; padding:3px 10px;
    font-size:14px; font-weight:600; color:#fff;
    transition:transform 0.15s cubic-bezier(.34,1.56,.64,1);
  }
  #odagame-token-count.pop { transform:scale(1.4); }
  #odagame-reset {
    background:none; border:none; color:rgba(255,255,255,0.22);
    font-size:16px; cursor:pointer; padding:4px; line-height:1;
    transition:color 0.15s; flex-shrink:0;
  }
  #odagame-reset:hover { color:rgba(255,255,255,0.6); }
  #odagame-close {
    background:none; border:none; color:rgba(255,255,255,0.35);
    font-size:22px; cursor:pointer; padding:4px; line-height:1;
    transition:color 0.15s; flex-shrink:0;
  }
  #odagame-close:hover { color:#fff; }

  #odagame-prog-bar {
    height:3px; background:rgba(255,255,255,0.08);
    position:relative; overflow:hidden;
  }
  #odagame-prog-fill {
    height:100%; background:rgba(var(--belt-glow),0.8);
    transition:width 0.5s cubic-bezier(.4,0,.2,1), background 0.6s;
  }
  #odagame-prog-label {
    padding:8px 24px 0; font-size:11px; font-family:'DM Mono',monospace;
    letter-spacing:.08em; text-transform:uppercase; color:rgba(255,255,255,0.35);
    display:flex; justify-content:space-between;
  }

  /* ── Screens ── */
  .odagame-screen { display:none; padding:28px 24px 32px; }
  .odagame-screen.active { display:block; }

  /* Email capture */
  #og-screen-email { text-align:center; }
  .og-logo { font-size:52px; margin-bottom:16px; display:block; }
  .og-headline {
    font-family:'Barlow Condensed',sans-serif; font-size:40px; font-weight:800;
    line-height:1; letter-spacing:-.01em; text-transform:uppercase;
    color:#fff; margin-bottom:6px;
  }
  .og-sub { font-size:14px; color:rgba(255,255,255,0.5); margin-bottom:28px; line-height:1.5; }
  .og-input {
    width:100%; padding:12px 16px; border-radius:8px; border:1.5px solid rgba(255,255,255,0.12);
    background:rgba(255,255,255,0.06); color:#fff; font-family:'DM Sans',sans-serif;
    font-size:14px; outline:none; box-sizing:border-box; margin-bottom:10px;
    transition:border-color 0.2s;
  }
  .og-input::placeholder { color:rgba(255,255,255,0.25); }
  .og-input:focus { border-color:rgba(var(--belt-glow),0.7); }
  .og-btn-primary {
    width:100%; padding:14px; border:none; border-radius:8px; cursor:pointer;
    background:linear-gradient(135deg,rgba(var(--belt-glow),0.9),rgba(var(--belt-glow),0.5));
    color:var(--belt-txt); font-family:'Barlow Condensed',sans-serif;
    font-size:17px; font-weight:700; letter-spacing:.06em; text-transform:uppercase;
    transition:opacity 0.2s, transform 0.15s; margin-top:4px;
  }
  .og-btn-primary:hover { opacity:0.88; transform:translateY(-1px); }
  .og-belt-preview {
    display:flex; justify-content:center; gap:8px; margin-top:22px; flex-wrap:wrap;
  }
  .og-belt-pip {
    display:flex; align-items:center; gap:4px; padding:4px 10px; border-radius:20px;
    font-family:'DM Mono',monospace; font-size:10px; letter-spacing:.06em;
    opacity:0.6;
  }

  /* Question screen */
  #og-screen-q { animation:ogFadeIn 0.3s ease; }
  @keyframes ogFadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }

  .og-q-meta {
    font-family:'DM Mono',monospace; font-size:10px; letter-spacing:.1em;
    text-transform:uppercase; color:rgba(255,255,255,0.3); margin-bottom:16px;
  }
  .og-q-text {
    font-family:'Barlow Condensed',sans-serif; font-size:26px; font-weight:700;
    line-height:1.2; color:#fff; margin-bottom:22px;
  }
  .og-opts { display:flex; flex-direction:column; gap:8px; }
  .og-opt {
    display:flex; align-items:center; gap:12px; padding:13px 16px;
    border-radius:8px; border:1.5px solid rgba(255,255,255,0.1);
    background:rgba(255,255,255,0.04); cursor:pointer;
    font-size:14px; color:rgba(255,255,255,0.85);
    transition:border-color 0.15s, background 0.15s; text-align:left;
    font-family:'DM Sans',sans-serif;
  }
  .og-opt:hover { border-color:rgba(var(--belt-glow),0.6); background:rgba(var(--belt-glow),0.08); }
  .og-opt-letter {
    flex-shrink:0; width:26px; height:26px; border-radius:50%;
    background:rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center;
    font-family:'DM Mono',monospace; font-size:11px; font-weight:500;
    color:rgba(255,255,255,0.4); transition:background 0.15s, color 0.15s;
  }
  .og-opt.correct { border-color:#22c55e!important; background:rgba(34,197,94,0.12)!important; }
  .og-opt.correct .og-opt-letter { background:#22c55e; color:#fff; }
  .og-opt.wrong { border-color:#ef4444!important; background:rgba(239,68,68,0.1)!important; animation:ogShake 0.4s ease; }
  .og-opt.wrong .og-opt-letter { background:#ef4444; color:#fff; }
  .og-opt:disabled, .og-opt[disabled] { cursor:default; pointer-events:none; }
  @keyframes ogShake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }

  .og-feedback {
    margin-top:16px; padding:12px 16px; border-radius:8px;
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08);
    font-size:13px; color:rgba(255,255,255,0.65); line-height:1.55;
    display:none; animation:ogFadeIn 0.3s ease;
  }
  .og-feedback.show { display:block; }
  .og-feedback strong { color:#fff; }

  .og-next {
    margin-top:16px; width:100%; padding:11px; border:none; border-radius:8px;
    background:rgba(var(--belt-glow),0.25); color:#fff; cursor:pointer;
    font-family:'Barlow Condensed',sans-serif; font-size:15px; font-weight:700;
    letter-spacing:.05em; text-transform:uppercase; display:none;
    transition:background 0.2s;
  }
  .og-next:hover { background:rgba(var(--belt-glow),0.4); }

  /* Belt promotion screen */
  #og-screen-promo { text-align:center; }
  .og-promo-belt {
    display:inline-flex; align-items:center; gap:10px;
    padding:10px 24px; border-radius:40px; margin:20px 0;
    font-family:'Barlow Condensed',sans-serif; font-size:28px; font-weight:800;
    letter-spacing:.05em; text-transform:uppercase;
    background:var(--belt-color); color:var(--belt-txt);
    box-shadow:0 4px 24px rgba(var(--belt-glow),0.6);
    animation:ogPulse 1.5s ease infinite;
  }
  @keyframes ogPulse { 0%,100%{box-shadow:0 4px 24px rgba(var(--belt-glow),0.6)} 50%{box-shadow:0 4px 40px rgba(var(--belt-glow),0.9)} }
  .og-promo-title {
    font-family:'Barlow Condensed',sans-serif; font-size:36px; font-weight:800;
    text-transform:uppercase; letter-spacing:.02em; color:#fff; margin-bottom:4px;
  }
  .og-promo-sub { font-size:14px; color:rgba(255,255,255,0.5); margin-bottom:20px; }
  .og-claire-card {
    background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1);
    border-radius:12px; padding:16px; text-align:left; margin-bottom:20px;
  }
  .og-claire-hd {
    display:flex; align-items:center; gap:10px; margin-bottom:10px;
  }
  .og-claire-avatar {
    width:34px; height:34px; border-radius:50%;
    background:linear-gradient(135deg,#0D0B4D,#D91241);
    display:flex; align-items:center; justify-content:center; font-size:14px; flex-shrink:0;
  }
  .og-claire-name { font-size:12px; font-weight:600; color:#fff; }
  .og-claire-role { font-size:10px; color:rgba(255,255,255,0.4); letter-spacing:.05em; text-transform:uppercase; }
  .og-claire-msg { font-size:13.5px; color:rgba(255,255,255,0.8); line-height:1.6; font-style:italic; }
  .og-claire-loading { opacity:0.4; font-size:13px; }

  /* Completion screen */
  #og-screen-done { text-align:center; padding:40px 28px; }
  .og-done-belt { font-size:72px; display:block; margin-bottom:16px; animation:ogSpin 2s ease; }
  @keyframes ogSpin { from{transform:rotateY(0)} to{transform:rotateY(360deg)} }
  .og-done-title {
    font-family:'Barlow Condensed',sans-serif; font-size:42px; font-weight:800;
    text-transform:uppercase; color:var(--belt-color); margin-bottom:8px;
  }
  .og-done-sub { font-size:15px; color:rgba(255,255,255,0.6); line-height:1.6; }

  /* Retry screen */
  #og-screen-retry { text-align:center; }
  .og-retry-icon { font-size:48px; margin-bottom:12px; }
  .og-retry-title { font-family:'Barlow Condensed',sans-serif; font-size:32px; font-weight:700; color:#fff; margin-bottom:6px; }
  .og-retry-sub { font-size:14px; color:rgba(255,255,255,0.5); margin-bottom:20px; line-height:1.5; }

  /* Responsive */
  @media(max-width:600px){
    #odagame-modal{border-radius:0;max-height:100vh;height:100%;}
    #odagame-overlay.open{align-items:flex-end;}
    .og-q-text{font-size:22px;}
  }
`;
document.head.appendChild(css);

/* ── HTML ──────────────────────────────────────────────── */
const overlay = document.createElement('div');
overlay.id = 'odagame-overlay';
overlay.innerHTML = `
<div id="odagame-modal">
  <div id="odagame-atm"></div>

  <div id="odagame-head">
    <div id="odagame-belt-badge"><span class="belt-dot"></span><span id="og-belt-name">White Belt</span></div>
    <div id="odagame-title">The ODA Game <span>· TM Forum</span></div>
    <div id="odagame-tokens">⬡ <span id="odagame-token-count">0</span></div>
    <button id="odagame-reset" aria-label="Restart game" title="Start over">↺</button>
    <button id="odagame-close" aria-label="Close">×</button>
  </div>

  <div id="odagame-prog-bar"><div id="odagame-prog-fill" style="width:0%"></div></div>
  <div id="odagame-prog-label">
    <span id="og-prog-left"></span>
    <span id="og-prog-right"></span>
  </div>

  <!-- Email capture -->
  <div class="odagame-screen active" id="og-screen-email">
    <span class="og-logo">🎯</span>
    <div class="og-headline">Test Your ODA Knowledge</div>
    <div class="og-sub">Earn coloured belts as you master the TM Forum Open Digital Architecture.<br>Enter your details to save progress across sessions.</div>
    <input class="og-input" id="og-name" placeholder="Your name" autocomplete="name"/>
    <input class="og-input" id="og-email" type="email" placeholder="Your email address" autocomplete="email"/>
    <button class="og-btn-primary" id="og-start-btn">Start the Game →</button>
    <div class="og-belt-preview">
      ${BELTS.map(b=>`<div class="og-belt-pip" style="background:rgba(${b.glow},0.12);color:${b.txt==='#0D0B4D'?b.color:b.txt};border:1px solid rgba(${b.glow},0.35)">${b.emoji} ${b.name}</div>`).join('')}
    </div>
  </div>

  <!-- Question -->
  <div class="odagame-screen" id="og-screen-q">
    <div class="og-q-meta" id="og-q-meta"></div>
    <div class="og-q-text" id="og-q-text"></div>
    <div class="og-opts" id="og-opts"></div>
    <div class="og-feedback" id="og-feedback"></div>
    <button class="og-next" id="og-next">Next Question →</button>
  </div>

  <!-- Belt promotion -->
  <div class="odagame-screen" id="og-screen-promo">
    <div class="og-promo-title">Belt Promotion!</div>
    <div class="og-promo-belt" id="og-promo-belt"></div>
    <div class="og-promo-sub" id="og-promo-sub"></div>
    <div class="og-claire-card">
      <div class="og-claire-hd">
        <div class="og-claire-avatar">👋</div>
        <div><div class="og-claire-name">Claire Watson</div><div class="og-claire-role">TM Forum · ODA Specialist</div></div>
      </div>
      <div class="og-claire-msg" id="og-claire-msg"><span class="og-claire-loading">Claire is reviewing your progress…</span></div>
    </div>
    <button class="og-btn-primary" id="og-promo-continue">Continue →</button>
  </div>

  <!-- Retry -->
  <div class="odagame-screen" id="og-screen-retry">
    <div class="og-retry-icon">🔄</div>
    <div class="og-retry-title">So Close!</div>
    <div class="og-retry-sub" id="og-retry-sub"></div>
    <button class="og-btn-primary" id="og-retry-btn">Try Again →</button>
  </div>

  <!-- Done -->
  <div class="odagame-screen" id="og-screen-done">
    <span class="og-done-belt">🖤</span>
    <div class="og-done-title">Black Belt Achieved</div>
    <div class="og-done-sub">You've mastered the full TM Forum Open Digital Architecture.<br>Claire's team will be in touch — this is exactly the kind of expertise operators need.</div>
  </div>
</div>
`;
document.body.appendChild(overlay);

/* ── Helpers ───────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const LETTERS = ['A','B','C','D'];

function setBeltVars(b) {
  const belt = BELTS[b];
  const m = $('odagame-modal');
  m.style.setProperty('--belt-color', belt.color);
  m.style.setProperty('--belt-txt',   belt.txt);
  m.style.setProperty('--belt-glow',  belt.glow);
  $('og-belt-name').textContent = belt.name + ' Belt';
  $('odagame-belt-badge').style.background = belt.color;
  $('odagame-belt-badge').style.color = belt.txt;
  m.classList.add('belt-glow');
}

function updateHeader() {
  const belt = BELTS[S.belt];
  $('odagame-token-count').textContent = S.tokens;
  setBeltVars(S.belt);
  const need = belt.need;
  const pct = Math.min(100, (S.beltCorrect / need) * 100);
  $('odagame-prog-fill').style.width = pct + '%';
  $('og-prog-left').textContent = belt.emoji + ' ' + belt.name + ' Belt — ' + belt.topic;
  $('og-prog-right').textContent = S.beltCorrect + ' / ' + need + ' to advance';
}

function popToken() {
  const el = $('odagame-token-count');
  el.classList.remove('pop');
  void el.offsetWidth;
  el.classList.add('pop');
  setTimeout(()=>el.classList.remove('pop'), 200);
}

function showScreen(id) {
  document.querySelectorAll('.odagame-screen').forEach(s=>s.classList.remove('active'));
  $(id).classList.add('active');
}

/* ── Game Logic ────────────────────────────────────────── */
function initBelt() {
  S.queue = beltQs(S.belt);
  S.beltAnswered = 0;
  S.beltCorrect = 0;
  S.consecutive = 0;
}

function serveQuestion() {
  updateHeader();
  const belt = BELTS[S.belt];
  if (S.beltAnswered >= belt.total) { checkBeltEnd(); return; }

  let qi = S.queue[S.beltAnswered];
  let q  = Qs[qi];
  if (q == null) {
    // Queue is out of sync with beltAnswered — rebuild and start fresh
    initBelt();
    qi = S.queue[0];
    q  = Qs[qi];
  }

  $('og-q-meta').textContent = `Question ${S.beltAnswered + 1} of ${belt.total} · ${belt.name} Belt`;
  $('og-q-text').textContent  = q.q;

  const opts = $('og-opts');
  opts.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'og-opt';
    btn.innerHTML = `<span class="og-opt-letter">${LETTERS[i]}</span><span>${opt}</span>`;
    btn.addEventListener('click', () => handleAnswer(i, q, qi));
    opts.appendChild(btn);
  });

  $('og-feedback').classList.remove('show');
  $('og-next').style.display = 'none';
  showScreen('og-screen-q');
}

function handleAnswer(chosen, q, qi) {
  const allOpts = document.querySelectorAll('.og-opt');
  allOpts.forEach(b => b.setAttribute('disabled',''));

  const correct = chosen === q.a;
  allOpts[q.a].classList.add('correct');
  if (!correct) allOpts[chosen].classList.add('wrong');

  const fb = $('og-feedback');
  fb.innerHTML = `<strong>${correct ? '✓ Correct!' : '✗ Not quite.'}</strong> ${q.why}`;
  fb.classList.add('show');

  if (correct) {
    S.tokens++;
    S.beltCorrect++;
    S.consecutive = 0;
    popToken();
  } else {
    S.consecutive++;
  }
  S.beltAnswered++;
  saveLocal();

  // Claire intervention on 3 consecutive wrong
  if (S.consecutive === 3) {
    S.consecutive = 0;
    callClaire(`The user has just got 3 questions wrong in a row in the ${BELTS[S.belt].name} belt (${BELTS[S.belt].topic}). Give them a very short encouraging message — 2 sentences max, warm and practical.`, msg => {
      $('og-feedback').innerHTML += `<br><br><em style="color:rgba(255,255,255,0.5);font-size:12px">👋 Claire: ${msg}</em>`;
    });
  }

  $('og-next').style.display = 'block';
}

function checkBeltEnd() {
  const belt = BELTS[S.belt];
  const passed = S.beltCorrect >= belt.need;

  if (passed) {
    if (S.belt >= BELTS.length - 1) {
      S.done = true;
      saveLocal();
      saveRemote();
      sendAchievement(S.belt);
      setBeltVars(S.belt);
      showScreen('og-screen-done');
    } else {
      showPromotion();
    }
  } else {
    $('og-retry-sub').textContent = `You got ${S.beltCorrect} of ${belt.need} needed for the ${belt.name} Belt. Shuffle the questions and try again — you're closer than you think.`;
    showScreen('og-screen-retry');
  }
}

function showPromotion() {
  sendAchievement(S.belt);
  const newBeltIdx = S.belt + 1;
  const newBelt = BELTS[newBeltIdx];

  $('og-promo-belt').textContent = newBelt.emoji + ' ' + newBelt.name + ' Belt';
  $('og-promo-belt').style.background = newBelt.color;
  $('og-promo-belt').style.color = newBelt.txt;
  $('og-promo-sub').textContent = `Next up: ${newBelt.topic}`;
  $('og-claire-msg').innerHTML = '<span class="og-claire-loading">Claire is reviewing your progress…</span>';

  showScreen('og-screen-promo');

  const prompt = `The user just earned their ${BELTS[S.belt].name} Belt in the ODA Game on the TM Forum ODA website, having correctly answered ${S.beltCorrect} out of ${BELTS[S.belt].total} questions on ${BELTS[S.belt].topic}. They are now progressing to the ${newBelt.name} Belt covering ${newBelt.topic}. Give a short, enthusiastic, insightful observation — 2 sentences max. Reference something specific about what they've learned and what's coming next.`;

  callClaire(prompt, msg => {
    $('og-claire-msg').textContent = msg;
    S.belt = newBeltIdx;
    initBelt();
    setBeltVars(S.belt);
    saveLocal();
    saveRemote();
    updateHeader();
  });
}

async function callClaire(prompt, cb) {
  try {
    const r = await fetch(CLAIRE_WH, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ message: prompt, sessionId: 'oda-game-' + (S.email || Date.now()) })
    });
    const d = await r.json();
    const msg = d.output || d.message || d.response || '';
    if (msg && cb) cb(msg);
  } catch(e) {
    if (cb) cb('Great work — keep going!');
  }
}

/* ── Open / Init ───────────────────────────────────────── */
function open() {
  overlay.classList.add('open');
  setBeltVars(S.belt);
  updateHeader();

  const local = loadLocal();
  if (local && S.email) {
    setBeltVars(S.belt);
    updateHeader();
    if (S.done) { showScreen('og-screen-done'); }
    else if (S.queue.length === 0) { initBelt(); serveQuestion(); }
    else { serveQuestion(); }
  } else {
    showScreen('og-screen-email');
  }
}

function close() {
  overlay.classList.remove('open');
  saveLocal();
  sendDropout();
}

/* ── Event Listeners ───────────────────────────────────── */
$('odagame-close').addEventListener('click', close);
overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

$('odagame-reset').addEventListener('click', () => {
  if (!confirm('Reset all progress and start over?')) return;
  const oldEmail = S.email;
  S = { email:'', name:'', belt:0, tokens:0, beltCorrect:0, beltAnswered:0, queue:[], consecutive:0, done:false };
  try { localStorage.removeItem(LS_KEY); } catch(e) {}
  if (oldEmail) {
    fetch(SAVE_WH, {method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({...S, email:oldEmail})}).catch(()=>{});
  }
  setBeltVars(0);
  updateHeader();
  showScreen('og-screen-email');
});

$('og-start-btn').addEventListener('click', async () => {
  const name  = $('og-name').value.trim();
  const email = $('og-email').value.trim();
  if (!name || !email || !email.includes('@')) {
    $('og-name').style.borderColor = name ? '' : '#ef4444';
    $('og-email').style.borderColor = email.includes('@') ? '' : '#ef4444';
    return;
  }
  S.name = name; S.email = email;
  $('og-start-btn').textContent = 'Loading…';
  const restored = await loadRemote(email);
  if (!restored) initBelt();
  $('og-start-btn').textContent = 'Start the Game →';
  setBeltVars(S.belt); updateHeader();
  if (S.done) { showScreen('og-screen-done'); return; }
  if (S.queue.length === 0) initBelt();
  serveQuestion();
});

$('og-next').addEventListener('click', serveQuestion);

$('og-promo-continue').addEventListener('click', () => {
  initBelt();
  serveQuestion();
});

$('og-retry-btn').addEventListener('click', () => {
  initBelt();
  serveQuestion();
});

// Expose open function globally for the page button
window.ODAGame = { open };

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && overlay.classList.contains('open')) close();
});

window.addEventListener('beforeunload', sendDropout);

// Init belt vars on load
setBeltVars(0);

})();
