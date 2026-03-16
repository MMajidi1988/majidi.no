/**
 * majidi.no — AI Chatbot embedded in HR Chatbot project card
 * RAG-powered assistant that answers questions about Martin's CV
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

  const bot = {
    open: false,
    history: [],
    streaming: false,
    els: {},

    lang() {
      return document.documentElement.lang === 'no' ? 'no' : 'en';
    },

    init() {
      const container = document.getElementById('chatEmbed');
      const btn = document.getElementById('chatDemoBtn');
      if (!container || !btn) return;

      this.buildInside(container);
      this.els.btn = btn;

      btn.addEventListener('click', () => this.show());
      this.els.close.addEventListener('click', () => this.hide());
      this.els.send.addEventListener('click', () => this.send());

      this.els.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.send();
        }
      });

      this.els.input.addEventListener('input', () => {
        this.els.input.style.height = 'auto';
        this.els.input.style.height =
          Math.min(this.els.input.scrollHeight, 80) + 'px';
      });

      this.welcome();

      window.addEventListener('langChange', (e) => this.updateLang(e.detail.lang));
    },

    updateLang(lang) {
      if (!this.els.input) return;
      this.els.input.placeholder = PLACEHOLDER[lang] || PLACEHOLDER.en;

      const firstBubble = this.els.messages?.querySelector('.chat-msg.assistant .chat-msg-bubble');
      if (firstBubble) {
        firstBubble.innerHTML = this.fmt(WELCOME[lang] || WELCOME.en);
      }

      const chips = this.els.messages?.querySelectorAll('.chat-suggestions .chat-chip');
      const items = SUGGESTIONS[lang] || SUGGESTIONS.en;
      if (chips && items.length === chips.length) {
        chips.forEach((chip, i) => { chip.textContent = items[i]; });
      }
    },

    buildInside(container) {
      container.innerHTML = [
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

      const lang = document.documentElement.lang === 'no' ? 'no' : 'en';

      this.els = {
        container,
        messages: container.querySelector('.chat-messages'),
        input: container.querySelector('.chat-input'),
        send: container.querySelector('.chat-send'),
        close: container.querySelector('.chat-close'),
      };

      this.els.input.setAttribute('placeholder', PLACEHOLDER[lang] || PLACEHOLDER.en);
    },

    show() {
      this.open = true;
      this.els.container.classList.add('open');
      this.els.btn.classList.add('hidden');
      setTimeout(() => {
        this.els.input.focus();
        this.els.container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 350);
    },

    hide() {
      this.open = false;
      this.els.container.classList.remove('open');
      this.els.btn.classList.remove('hidden');
    },

    welcome() {
      const lang = this.lang();
      this.appendMsg('assistant', WELCOME[lang]);
      this.appendSuggestions(SUGGESTIONS[lang]);
    },

    appendMsg(role, text) {
      const wrap = document.createElement('div');
      wrap.className = 'chat-msg ' + role;
      const bubble = document.createElement('div');
      bubble.className = 'chat-msg-bubble';
      if (role === 'assistant') {
        bubble.innerHTML = this.fmt(text);
      } else {
        bubble.textContent = text;
      }
      wrap.appendChild(bubble);
      this.els.messages.appendChild(wrap);
      this.scroll();
      return bubble;
    },

    appendSuggestions(items) {
      const row = document.createElement('div');
      row.className = 'chat-suggestions';
      items.forEach((text) => {
        const chip = document.createElement('button');
        chip.className = 'chat-chip';
        chip.textContent = text;
        chip.addEventListener('click', () => {
          row.remove();
          this.els.input.value = chip.textContent;
          this.send();
        });
        row.appendChild(chip);
      });
      this.els.messages.appendChild(row);
      this.scroll();
    },

    showTyping() {
      const wrap = document.createElement('div');
      wrap.className = 'chat-msg assistant chat-typing-wrap';
      wrap.innerHTML =
        '<div class="chat-msg-bubble"><div class="chat-typing-dots"><span></span><span></span><span></span></div></div>';
      this.els.messages.appendChild(wrap);
      this.scroll();
      return wrap;
    },

    createStreamBubble() {
      const wrap = document.createElement('div');
      wrap.className = 'chat-msg assistant';
      const bubble = document.createElement('div');
      bubble.className = 'chat-msg-bubble';
      wrap.appendChild(bubble);
      this.els.messages.appendChild(wrap);
      return bubble;
    },

    scroll() {
      this.els.messages.scrollTop = this.els.messages.scrollHeight;
    },

    fmt(text) {
      const safe = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return safe
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
    },

    async send() {
      const text = this.els.input.value.trim();
      if (!text || this.streaming) return;

      const sugRow = this.els.messages.querySelector('.chat-suggestions');
      if (sugRow) sugRow.remove();

      this.appendMsg('user', text);
      this.history.push({ role: 'user', content: text });
      this.els.input.value = '';
      this.els.input.style.height = 'auto';
      this.streaming = true;
      this.els.send.disabled = true;

      const typing = this.showTyping();

      try {
        const preferredLang = document.documentElement.lang === 'no' ? 'no' : 'en';
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: this.history, preferredLanguage: preferredLang }),
        });

        if (!res.ok) throw new Error(res.statusText);

        typing.remove();
        const bubble = this.createStreamBubble();
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
                bubble.innerHTML = this.fmt(full);
                this.scroll();
              }
            } catch (e) {
              if (e.message && !e.message.includes('JSON')) throw e;
            }
          }
        }

        if (full) {
          this.history.push({ role: 'assistant', content: full });
        }
      } catch (err) {
        typing.remove();
        const lang = this.lang();
        this.appendMsg(
          'assistant',
          lang === 'no'
            ? 'Beklager, noe gikk galt. Prøv igjen.'
            : 'Sorry, something went wrong. Please try again.'
        );
      }

      this.streaming = false;
      this.els.send.disabled = false;
      this.els.input.focus();
    },
  };

  function start() {
    bot.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
