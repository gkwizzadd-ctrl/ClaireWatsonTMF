/* ODA Expert Chat Widget — Claire Watson TMF */
(function () {
  const CHAT_WH = 'https://n8n.srv1739004.hstgr.cloud/webhook/claire-agent';
  const FORM_WH = 'https://n8n.srv1739004.hstgr.cloud/webhook/custom-contact';
  const SESSION = 'cw-' + Math.random().toString(36).slice(2, 10);

  const TOPICS = [
    { icon: '🏛️', label: 'What is ODA?',              desc: 'Overview of the Open Digital Architecture',          value: 'Give me a concise overview of the TM Forum Open Digital Architecture and why it matters for telecoms.' },
    { icon: '⚙️', label: 'BSS/OSS Modernisation',     desc: 'Replacing legacy stacks with composable architecture', value: 'How does TM Forum ODA help modernise legacy BSS and OSS systems?' },
    { icon: '🗺️', label: 'ODA Transformation Roadmap',desc: 'Planning your adoption journey step by step',         value: 'How do I build an ODA transformation roadmap from maturity assessment through to full adoption?' },
    { icon: '🔗', label: 'Open APIs',                 desc: 'Zero-touch interoperability across your ecosystem',    value: 'Explain TM Forum Open APIs and how they enable interoperability and zero-touch integration.' },
    { icon: '🤖', label: 'AI-Native Operations',      desc: 'Autonomous networks and AI orchestration',            value: 'How does ODA enable AI-native and autonomous network operations?' },
    { icon: '✉️', label: 'Contact Claire',            desc: 'Get in touch with Claire\'s team directly',           value: '__contact__' },
  ];

  const SYSTEM_CONTEXT = `You are Claire's team at TM Forum. You speak exclusively about TM Forum's Open Digital Architecture. Every answer must draw only from TM Forum standards: the ODA canvas and components, eTOM Business Process Framework, SID Information Framework, TM Forum Open APIs, ODA maturity models, and AI-native network operations. If asked about any specific vendor platform or product, redirect the conversation back to the relevant TM Forum standard. Keep every response to 2 sentences maximum. No bullet points, no lists, no headers — plain prose only. If more detail is needed, invite the user to contact Claire directly.`;

  const CSS = `
    #oda-chat-btn {
      position: fixed; bottom: 28px; right: 28px; z-index: 9998;
      background: linear-gradient(135deg, #0D0B4D 0%, #D91241 100%);
      color: #fff; border: none; border-radius: 32px;
      padding: 14px 22px; cursor: pointer;
      font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
      letter-spacing: 0.04em;
      box-shadow: 0 4px 24px rgba(13,11,77,0.35), 0 1px 6px rgba(217,18,65,0.2);
      transition: transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s;
      display: flex; align-items: center; gap: 9px;
    }
    #oda-chat-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(13,11,77,0.4), 0 2px 8px rgba(217,18,65,0.3); }
    #oda-chat-btn svg { flex-shrink: 0; }

    #oda-chat-modal {
      position: fixed; bottom: 88px; right: 28px; z-index: 9999;
      width: 380px; max-width: calc(100vw - 40px);
      background: #fff; border-radius: 16px;
      box-shadow: 0 24px 64px rgba(13,11,77,0.22), 0 4px 16px rgba(0,0,0,0.08);
      display: none; flex-direction: column; overflow: hidden;
      font-family: 'DM Sans', sans-serif;
      border: 1px solid rgba(13,11,77,0.1);
    }
    #oda-chat-modal.open { display: flex; }

    #oda-chat-header {
      background: linear-gradient(135deg, #0D0B4D 0%, #2E0C4B 60%, #8A1035 100%);
      padding: 18px 20px; display: flex; align-items: center; gap: 12px;
    }
    #oda-chat-header .hd-avatar {
      width: 38px; height: 38px; border-radius: 50%;
      background: rgba(217,18,65,0.25); border: 2px solid rgba(217,18,65,0.5);
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; flex-shrink: 0;
    }
    #oda-chat-header .hd-text { flex: 1; }
    #oda-chat-header .hd-name { color: #fff; font-weight: 700; font-size: 14px; }
    #oda-chat-header .hd-sub  { color: rgba(255,255,255,0.6); font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase; margin-top: 2px; }
    #oda-chat-close {
      background: none; border: none; color: rgba(255,255,255,0.6);
      cursor: pointer; font-size: 20px; line-height: 1; padding: 4px;
      transition: color 0.15s;
    }
    #oda-chat-close:hover { color: #fff; }
    #oda-contact-shortcut {
      background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18);
      color: rgba(255,255,255,0.8); border-radius: 20px;
      padding: 4px 11px; font-family: 'DM Sans', sans-serif;
      font-size: 11px; font-weight: 600; letter-spacing: 0.03em;
      cursor: pointer; white-space: nowrap; transition: background 0.15s, color 0.15s, border-color 0.15s;
    }
    #oda-contact-shortcut:hover { background: rgba(217,18,65,0.35); color: #fff; border-color: rgba(217,18,65,0.5); }

    #oda-chat-body {
      flex: 1; overflow-y: auto; padding: 16px;
      max-height: 320px; display: flex; flex-direction: column; gap: 10px;
    }

    .oda-msg { max-width: 86%; padding: 10px 14px; border-radius: 12px; font-size: 13.5px; line-height: 1.5; }
    .oda-msg.bot { background: #F4F5FA; color: #0D0B4D; align-self: flex-start; border-bottom-left-radius: 4px; }
    .oda-msg.user { background: linear-gradient(135deg, #0D0B4D, #2E0C4B); color: #fff; align-self: flex-end; border-bottom-right-radius: 4px; }

    #oda-topics { padding: 0 12px 12px; display: flex; flex-direction: column; gap: 5px; }
    .oda-topic {
      font-family: 'DM Sans', sans-serif; width: 100%;
      display: flex; align-items: center; gap: 10px;
      padding: 9px 12px; cursor: pointer; text-align: left;
      background: #fff; border: 1px solid rgba(13,11,77,0.1);
      border-left: 3px solid transparent; border-radius: 6px;
      transition: border-left-color 0.15s, background 0.15s;
    }
    .oda-topic:hover { border-left-color: #D91241; background: rgba(217,18,65,0.03); }
    .oda-topic-icon {
      width: 28px; height: 28px; flex-shrink: 0; border-radius: 4px;
      background: rgba(217,18,65,0.08); display: flex; align-items: center; justify-content: center; font-size: 13px;
    }
    .oda-topic-text { flex: 1; }
    .oda-topic-label { display: block; font-size: 12.5px; font-weight: 600; color: #0D0B4D; line-height: 1.2; }
    .oda-topic-desc  { display: block; font-size: 10.5px; color: #9699A5; margin-top: 2px; line-height: 1.2; }
    .oda-topic-arr   { color: rgba(13,11,77,0.2); font-size: 12px; flex-shrink: 0; transition: transform 0.15s, color 0.15s; }
    .oda-topic:hover .oda-topic-arr { color: #D91241; transform: translateX(2px); }

    #oda-chat-form { display: flex; gap: 8px; padding: 12px 16px; border-top: 1px solid rgba(13,11,77,0.08); }
    #oda-chat-input {
      flex: 1; border: 1px solid rgba(13,11,77,0.15); border-radius: 8px;
      padding: 9px 13px; font-family: 'DM Sans', sans-serif; font-size: 13px;
      color: #0D0B4D; outline: none; transition: border-color 0.15s;
      resize: none;
    }
    #oda-chat-input:focus { border-color: #D91241; }
    #oda-chat-send {
      background: linear-gradient(135deg, #0D0B4D, #D91241);
      border: none; border-radius: 8px; color: #fff;
      width: 38px; height: 38px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: opacity 0.15s;
    }
    #oda-chat-send:hover { opacity: 0.85; }

    #oda-contact-form { padding: 16px; display: none; flex-direction: column; gap: 10px; }
    #oda-contact-form.visible { display: flex; }
    .oda-cf-field {
      border: 1px solid rgba(13,11,77,0.15); border-radius: 8px;
      padding: 9px 13px; font-family: 'DM Sans', sans-serif; font-size: 13px;
      color: #0D0B4D; outline: none; width: 100%; box-sizing: border-box;
    }
    .oda-cf-field:focus { border-color: #D91241; }
    #oda-cf-submit {
      background: linear-gradient(135deg, #0D0B4D, #D91241);
      color: #fff; border: none; border-radius: 8px;
      padding: 11px; font-family: 'DM Sans', sans-serif;
      font-size: 13px; font-weight: 600; cursor: pointer; transition: opacity 0.15s;
    }
    #oda-cf-submit:hover { opacity: 0.85; }
    .oda-cf-back { color: #0D0B4D; font-size: 12px; cursor: pointer; text-decoration: underline; text-align: center; }

    .oda-followup { align-self: flex-start; max-width: 100%; margin-top: 6px; }
    .oda-followup-lbl {
      font-family: 'DM Mono', monospace; font-size: 9.5px; letter-spacing: 0.1em;
      text-transform: uppercase; color: #9699A5; display: block; margin-bottom: 6px;
    }
    .oda-followup-chips { display: flex; flex-wrap: wrap; gap: 5px; }
    .oda-followup-chip {
      font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600;
      padding: 5px 12px; border-radius: 20px; cursor: pointer;
      border: 1px solid rgba(13,11,77,0.15); color: #0D0B4D;
      background: #fff; transition: background 0.15s, color 0.15s, border-color 0.15s;
    }
    .oda-followup-chip:hover { background: #D91241; color: #fff; border-color: #D91241; }

    .oda-nudge {
      margin-top: 10px; padding: 10px 12px;
      background: linear-gradient(135deg, rgba(13,11,77,0.04), rgba(217,18,65,0.04));
      border: 1px solid rgba(217,18,65,0.2); border-radius: 8px;
      font-size: 12.5px; color: #0D0B4D; line-height: 1.45;
    }
    .oda-nudge-btn {
      display: inline-block; margin-top: 8px;
      background: linear-gradient(135deg, #0D0B4D, #D91241);
      color: #fff; border: none; border-radius: 6px;
      padding: 7px 16px; font-family: 'DM Sans', sans-serif;
      font-size: 12px; font-weight: 600; cursor: pointer;
      letter-spacing: 0.03em; transition: opacity 0.15s;
    }
    .oda-nudge-btn:hover { opacity: 0.85; }

    /* AI response option chips */
    .oda-option-wrap { margin-top: 8px; }
    .oda-option-chips { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 7px; }
    .oda-option-chip {
      font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600;
      padding: 5px 12px; border-radius: 20px; cursor: pointer;
      border: 1px solid rgba(13,11,77,0.15); color: #0D0B4D;
      background: #fff; transition: background 0.15s, color 0.15s, border-color 0.15s;
    }
    .oda-option-chip:hover { background: rgba(217,18,65,0.08); border-color: #D91241; }
    .oda-option-chip.selected { background: linear-gradient(135deg, #0D0B4D, #D91241); color: #fff; border-color: #0D0B4D; }
    .oda-option-confirm {
      background: linear-gradient(135deg, #0D0B4D, #D91241);
      color: #fff; border: none; border-radius: 8px;
      padding: 6px 16px; font-family: 'DM Sans', sans-serif;
      font-size: 11.5px; font-weight: 600; cursor: pointer;
      letter-spacing: 0.03em; transition: opacity 0.15s;
    }
    .oda-option-confirm:hover { opacity: 0.85; }
  `;

  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  const btn = document.createElement('button');
  btn.id = 'oda-chat-btn';
  btn.innerHTML = `<svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 3C6.477 3 2 6.925 2 11.75c0 2.19.9 4.185 2.38 5.724L3 21l4.162-1.383C8.53 20.185 10.212 20.5 12 20.5c5.523 0 10-3.925 10-8.75S17.523 3 12 3Z" fill="white"/></svg> Ask Claire's Team`;
  document.body.appendChild(btn);

  const modal = document.createElement('div');
  modal.id = 'oda-chat-modal';
  modal.innerHTML = `
    <div id="oda-chat-header">
      <div class="hd-avatar">👋</div>
      <div class="hd-text">
        <div class="hd-name">Claire's Team</div>
        <div class="hd-sub">Claire Watson · TM Forum</div>
      </div>
      <button id="oda-contact-shortcut">Contact Claire</button>
      <button id="oda-chat-close">×</button>
    </div>
    <div id="oda-chat-body"></div>
    <div id="oda-topics"></div>
    <div id="oda-contact-form">
      <input class="oda-cf-field" id="oda-cf-name" placeholder="Your name" />
      <input class="oda-cf-field" id="oda-cf-email" placeholder="Email address" type="email" />
      <input class="oda-cf-field" id="oda-cf-org" placeholder="Organisation" />
      <textarea class="oda-cf-field" id="oda-cf-msg" rows="3" placeholder="How can Claire help you?"></textarea>
      <button id="oda-cf-submit">Send message</button>
      <div class="oda-cf-back" id="oda-cf-back">← Back to chat</div>
    </div>
    <form id="oda-chat-form">
      <textarea id="oda-chat-input" rows="1" placeholder="Ask about ODA, eTOM, Open APIs…"></textarea>
      <button type="submit" id="oda-chat-send">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </form>
  `;
  document.body.appendChild(modal);

  const body    = modal.querySelector('#oda-chat-body');
  const topicsEl= modal.querySelector('#oda-topics');
  const form    = modal.querySelector('#oda-chat-form');
  const input   = modal.querySelector('#oda-chat-input');
  const cfPanel = modal.querySelector('#oda-contact-form');
  const chatArea= modal.querySelector('#oda-chat-form');

  let chatHistory = [];
  let responseCount = 0;
  let contactPromptShown = false;
  let usedTopics = new Set();

  function parseAITags(text) {
    const m = text.match(/`?\[(OPTIONS|MULTI):\s*([^\]]+)\]`?/i);
    if (!m) return { clean: text, type: null, options: [] };
    return {
      clean:   text.replace(m[0], '').replace(/\n{3,}/g, '\n\n').trim(),
      type:    m[1].toLowerCase() === 'multi' ? 'multi' : 'options',
      options: m[2].split('|').map(s => s.trim()).filter(Boolean)
    };
  }

  function addMsg(text, role) {
    const div = document.createElement('div');
    div.className = `oda-msg ${role}`;
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  function renderChips(parsed) {
    if (!parsed.type || !parsed.options.length) return;
    const wrap = document.createElement('div');
    wrap.className = 'oda-option-wrap';
    const chipsDiv = document.createElement('div');
    chipsDiv.className = 'oda-option-chips';

    if (parsed.type === 'options') {
      parsed.options.forEach(o => {
        const chip = document.createElement('button');
        chip.className = 'oda-option-chip';
        chip.textContent = o;
        chip.onclick = () => { wrap.remove(); sendMessage(o); };
        chipsDiv.appendChild(chip);
      });
      wrap.appendChild(chipsDiv);
    } else {
      const selected = new Set();
      parsed.options.forEach(o => {
        const chip = document.createElement('button');
        chip.className = 'oda-option-chip';
        chip.textContent = o;
        chip.onclick = () => {
          if (selected.has(o)) { selected.delete(o); chip.classList.remove('selected'); }
          else                 { selected.add(o);    chip.classList.add('selected'); }
        };
        chipsDiv.appendChild(chip);
      });
      const confirm = document.createElement('button');
      confirm.className = 'oda-option-confirm';
      confirm.textContent = 'Confirm →';
      confirm.onclick = () => {
        if (!selected.size) return;
        wrap.remove();
        sendMessage([...selected].join(', '));
      };
      wrap.appendChild(chipsDiv);
      wrap.appendChild(confirm);
    }

    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }

  function showTopics() {
    topicsEl.innerHTML = '';
    TOPICS.forEach(t => {
      const b = document.createElement('button');
      b.className = 'oda-topic';
      b.innerHTML = `
        <div class="oda-topic-icon">${t.icon}</div>
        <div class="oda-topic-text">
          <span class="oda-topic-label">${t.label}</span>
          <span class="oda-topic-desc">${t.desc}</span>
        </div>
        <span class="oda-topic-arr">→</span>`;
      b.onclick = () => handleTopic(t);
      topicsEl.appendChild(b);
    });
  }

  function showFollowUpChips(excludeLabel) {
    const remaining = TOPICS.filter(t => t.value !== '__contact__' && !usedTopics.has(t.label));
    if (remaining.length === 0) return;
    const wrap = document.createElement('div');
    wrap.className = 'oda-followup';
    wrap.innerHTML = `<span class="oda-followup-lbl">Explore another topic</span><div class="oda-followup-chips"></div>`;
    const chips = wrap.querySelector('.oda-followup-chips');
    remaining.forEach(t => {
      const btn = document.createElement('button');
      btn.className = 'oda-followup-chip';
      btn.textContent = t.label;
      btn.onclick = () => { wrap.remove(); handleTopic(t); };
      chips.appendChild(btn);
    });
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }

  function showContactNudge() {
    const div = document.createElement('div');
    div.className = 'oda-msg bot';
    div.innerHTML = `<div class="oda-nudge">
      Looks like you're digging into this — would you like to speak with Claire directly?
      <br><button class="oda-nudge-btn" id="oda-nudge-btn">Get in touch with Claire →</button>
    </div>`;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    div.querySelector('#oda-nudge-btn').onclick = showContactForm;
  }

  function showContactForm() {
    cfPanel.classList.add('visible');
    topicsEl.style.display = 'none';
    chatArea.style.display = 'none';
  }

  function hideContactForm() {
    cfPanel.classList.remove('visible');
    topicsEl.style.display = '';
    chatArea.style.display = '';
  }

  async function handleTopic(t) {
    if (t.value === '__contact__') { showContactForm(); return; }
    topicsEl.innerHTML = '';
    usedTopics.add(t.label);
    await sendMessage(t.value);
  }

  async function sendMessage(text) {
    addMsg(text, 'user');
    chatHistory.push({ role: 'user', content: text });
    const thinking = document.createElement('div');
    thinking.className = 'oda-msg bot';
    thinking.textContent = '…';
    body.appendChild(thinking);
    body.scrollTop = body.scrollHeight;

    try {
      const res = await fetch(CHAT_WH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: SYSTEM_CONTEXT + '\n\nUser: ' + text, sessionId: SESSION })
      });
      const data = await res.json();
      const raw = data.output || data.message || data.response || 'Thank you for your question. Claire will be in touch shortly.';
      const parsed = parseAITags(raw);
      thinking.textContent = parsed.clean;
      renderChips(parsed);
      responseCount++;
      if (!parsed.type) setTimeout(showFollowUpChips, 400);
      if (responseCount === 2 && !contactPromptShown) {
        contactPromptShown = true;
        setTimeout(showContactNudge, 800);
      }
    } catch {
      thinking.textContent = 'Sorry, I\'m having trouble connecting right now. Please try the contact form.';
    }
    body.scrollTop = body.scrollHeight;
  }

  btn.onclick = () => {
    modal.classList.toggle('open');
    if (modal.classList.contains('open') && body.children.length === 0) {
      addMsg('Hi there! This is Claire\'s team. We\'re here to help you explore the TM Forum Open Digital Architecture and how it can transform your BSS/OSS operations. What would you like to know?', 'bot');
      showTopics();
    }
  };

  modal.querySelector('#oda-chat-close').onclick = () => modal.classList.remove('open');
  modal.querySelector('#oda-contact-shortcut').onclick = showContactForm;

  form.onsubmit = async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    await sendMessage(text);
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.dispatchEvent(new Event('submit')); }
  });

  modal.querySelector('#oda-cf-back').onclick = hideContactForm;

  modal.querySelector('#oda-cf-submit').onclick = async () => {
    const name  = modal.querySelector('#oda-cf-name').value.trim();
    const email = modal.querySelector('#oda-cf-email').value.trim();
    const org   = modal.querySelector('#oda-cf-org').value.trim();
    const msg   = modal.querySelector('#oda-cf-msg').value.trim();
    if (!name || !email) { alert('Please enter your name and email.'); return; }
    try {
      await fetch(FORM_WH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, organisation: org, message: msg, source: 'ClaireWatsonTMF' })
      });
      cfPanel.innerHTML = '<p style="color:#0D0B4D;font-size:14px;text-align:center;padding:20px">✓ Message sent. Claire will be in touch shortly.</p>';
    } catch {
      alert('Sorry, there was an error. Please try again.');
    }
  };
})();
