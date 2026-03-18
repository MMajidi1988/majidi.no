/**
 * majidi.no — AI Chatbot
 * RAG-powered assistant that answers questions about Martin's CV
 * Supports embedded (project card) and floating (corner widget) modes
 */

(function () {
  'use strict';

  const SUGGESTIONS = {
    en: [
      "What's Martin's experience?",
      'Tell me about SmartCrop',
      'Tech stack?',
      'Publications?',
    ],
    no: [
      'Hva er Martins erfaring?',
      'Fortell om SmartCrop',
      'Teknologistack?',
      'Publikasjoner?',
    ],
  };

  const WELCOME = {
    en: "Hi! I'm Martin's AI assistant — a CV-based demo, similar to the HR chatbot I built at Allente. Ask me anything about Martin's experience, skills, or publications!",
    no: 'Hei! Jeg er Martins AI-assistent — en CV-basert demo, lik HR-chatboten jeg bygde hos Allente. Spør meg om erfaring, ferdigheter eller publikasjoner!',
  };

  const PLACEHOLDER = {
    en: 'Ask about Martin...',
    no: 'Spør om Martin...',
  };

  /* ─── Shared utilities ─── */

  function getLang() {
    return document.documentElement.lang === 'no' ? 'no' : 'en';
  }

  function fmtText(text) {
    const safe = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return safe
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  function buildChatHTML() {
    return [
      '<div class="chat-header">',
      '  <div class="chat-title">',
      '    <div class="chat-avatar">M</div>',
      '    <div>',
      '      <div class="chat-name" data-en="Ask Martin\'s AI" data-no="Spør Martins AI">Ask Martin\'s AI</div>',
      '      <div class="chat-status">RAG + GPT-4o-mini</div>',
      '    </div>',
      '  </div>',
      '  <button class="chat-close" aria-label="Close chat">&times;</button>',
      '</div>',
      '<div class="chat-messages"></div>',
      '<div class="chat-input-area">',
      '  <textarea class="chat-input" rows="1"></textarea>',
      '  <button class="chat-send" aria-label="Send message">',
      '    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
      '      <line x1="22" y1="2" x2="11" y2="13"/>',
      '      <polygon points="22 2 15 22 11 13 2 9 22 2"/>',
      '    </svg>',
      '  </button>',
      '</div>',
    ].join('\n');
  }

  function initChatEls(container) {
    return {
      container,
      messages: container.querySelector('.chat-messages'),
      input: container.querySelector('.chat-input'),
      send: container.querySelector('.chat-send'),
      close: container.querySelector('.chat-close'),
    };
  }

  function appendMsg(els, role, text) {
    const wrap = document.createElement('div');
    wrap.className = 'chat-msg ' + role;
    const bubble = document.createElement('div');
    bubble.className = 'chat-msg-bubble';
    if (role === 'assistant') {
      bubble.innerHTML = fmtText(text);
    } else {
      bubble.textContent = text;
    }
    wrap.appendChild(bubble);
    els.messages.appendChild(wrap);
    els.messages.scrollTop = els.messages.scrollHeight;
    return bubble;
  }

  function appendSuggestions(els, items, onSend) {
    const row = document.createElement('div');
    row.className = 'chat-suggestions';
    items.forEach((text) => {
      const chip = document.createElement('button');
      chip.className = 'chat-chip';
      chip.textContent = text;
      chip.addEventListener('click', () => {
        row.remove();
        els.input.value = chip.textContent;
        onSend();
      });
      row.appendChild(chip);
    });
    els.messages.appendChild(row);
    els.messages.scrollTop = els.messages.scrollHeight;
  }

  function showTyping(els) {
    const wrap = document.createElement('div');
    wrap.className = 'chat-msg assistant chat-typing-wrap';
    wrap.innerHTML =
      '<div class="chat-msg-bubble"><div class="chat-typing-dots"><span></span><span></span><span></span></div></div>';
    els.messages.appendChild(wrap);
    els.messages.scrollTop = els.messages.scrollHeight;
    return wrap;
  }

  function createStreamBubble(els) {
    const wrap = document.createElement('div');
    wrap.className = 'chat-msg assistant';
    const bubble = document.createElement('div');
    bubble.className = 'chat-msg-bubble';
    wrap.appendChild(bubble);
    els.messages.appendChild(wrap);
    return bubble;
  }

  function updateChatLang(state, lang) {
    if (!state.els.input) return;
    state.els.input.placeholder = PLACEHOLDER[lang] || PLACEHOLDER.en;

    const firstBubble = state.els.messages?.querySelector(
      '.chat-msg.assistant .chat-msg-bubble'
    );
    if (firstBubble) {
      firstBubble.innerHTML = fmtText(WELCOME[lang] || WELCOME.en);
    }

    const chips = state.els.messages?.querySelectorAll(
      '.chat-suggestions .chat-chip'
    );
    const items = SUGGESTIONS[lang] || SUGGESTIONS.en;
    if (chips && items.length === chips.length) {
      chips.forEach((chip, i) => {
        chip.textContent = items[i];
      });
    }
  }

  async function sendMessage(state) {
    const text = state.els.input.value.trim();
    if (!text || state.streaming) return;

    const sugRow = state.els.messages.querySelector('.chat-suggestions');
    if (sugRow) sugRow.remove();

    appendMsg(state.els, 'user', text);
    state.history.push({ role: 'user', content: text });
    state.els.input.value = '';
    state.els.input.style.height = 'auto';
    state.streaming = true;
    state.els.send.disabled = true;

    const typing = showTyping(state.els);

    try {
      const preferredLang = getLang();
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: state.history,
          preferredLanguage: preferredLang,
        }),
      });

      if (!res.ok) throw new Error(res.statusText);

      typing.remove();
      const bubble = createStreamBubble(state.els);
      let full = '';

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6);
          if (payload === '[DONE]') continue;

          try {
            const parsed = JSON.parse(payload);
            if (parsed.error) throw new Error(parsed.error);
            if (parsed.content) {
              full += parsed.content;
              bubble.innerHTML = fmtText(full);
              state.els.messages.scrollTop = state.els.messages.scrollHeight;
            }
          } catch (e) {
            if (e.message && !e.message.includes('JSON')) throw e;
          }
        }
      }

      if (full) {
        state.history.push({ role: 'assistant', content: full });
      }
    } catch (err) {
      typing.remove();
      appendMsg(
        state.els,
        'assistant',
        getLang() === 'no'
          ? 'Beklager, noe gikk galt. Prøv igjen.'
          : 'Sorry, something went wrong. Please try again.'
      );
    }

    state.streaming = false;
    state.els.send.disabled = false;
    state.els.input.focus();
  }

  function wireInput(state) {
    state.els.send.addEventListener('click', () => sendMessage(state));

    state.els.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(state);
      }
    });

    state.els.input.addEventListener('input', () => {
      state.els.input.style.height = 'auto';
      state.els.input.style.height =
        Math.min(state.els.input.scrollHeight, 80) + 'px';
    });
  }

  function welcomeChat(state) {
    const lang = getLang();
    appendMsg(state.els, 'assistant', WELCOME[lang]);
    appendSuggestions(state.els, SUGGESTIONS[lang], () => sendMessage(state));
  }

  /* ─── Embedded chat (project card) ─── */

  const bot = {
    open: false,
    history: [],
    streaming: false,
    els: {},

    init() {
      const container = document.getElementById('chatEmbed');
      const btn = document.getElementById('chatDemoBtn');
      if (!container || !btn) return;

      container.innerHTML = buildChatHTML();
      this.els = initChatEls(container);
      this.els.btn = btn;
      this.els.input.setAttribute(
        'placeholder',
        PLACEHOLDER[getLang()] || PLACEHOLDER.en
      );

      btn.addEventListener('click', () => this.show());
      this.els.close.addEventListener('click', () => this.hide());
      wireInput(this);
      welcomeChat(this);

      window.addEventListener('langChange', (e) =>
        updateChatLang(this, e.detail.lang)
      );
    },

    show() {
      this.open = true;
      this.els.container.classList.add('open');
      this.els.btn.classList.add('hidden');
      setTimeout(() => {
        this.els.input.focus();
        this.els.container.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }, 350);
    },

    hide() {
      this.open = false;
      this.els.container.classList.remove('open');
      this.els.btn.classList.remove('hidden');
    },
  };

  /* ─── Floating chat (corner widget) ─── */

  const floating = {
    open: false,
    history: [],
    streaming: false,
    els: {},

    init() {
      const container = document.getElementById('floatingChat');
      const toggleBtn = document.getElementById('floatingChatBtn');
      const heroRing = document.getElementById('heroChatRing');
      if (!container) return;

      container.innerHTML = buildChatHTML();
      this.els = initChatEls(container);
      this.els.toggleBtn = toggleBtn;
      this.els.input.setAttribute(
        'placeholder',
        PLACEHOLDER[getLang()] || PLACEHOLDER.en
      );

      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => this.toggle());
        setTimeout(() => toggleBtn.classList.add('visible'), 2000);
      }

      if (heroRing) {
        heroRing.addEventListener('click', () => this.show());
        heroRing.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.show();
          }
        });
      }

      this.els.close.addEventListener('click', () => this.hide());
      wireInput(this);
      welcomeChat(this);

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.open) this.hide();
      });

      window.addEventListener('langChange', (e) =>
        updateChatLang(this, e.detail.lang)
      );
    },

    show() {
      this.open = true;
      this.els.container.classList.add('open');
      if (this.els.toggleBtn) this.els.toggleBtn.classList.add('chat-open');
      setTimeout(() => this.els.input.focus(), 350);
    },

    hide() {
      this.open = false;
      this.els.container.classList.remove('open');
      if (this.els.toggleBtn) this.els.toggleBtn.classList.remove('chat-open');
    },

    toggle() {
      if (this.open) this.hide();
      else this.show();
    },
  };

  /* ─── Initialize ─── */

  function start() {
    bot.init();
    floating.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
