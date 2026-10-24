import { sendTelegram } from './_telegram.js';

const REPO = 'MMajidi1988/majidi.no';

const HELP = [
  'Commands:',
  '/do <task> — Claude edits the site and opens a PR',
  '/help — show this message',
].join('\n');

/**
 * Telegram webhook: accepts commands from the owner's chat only.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  if (req.headers['x-telegram-bot-api-secret-token'] !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return res.status(401).end();
  }

  const message = req.body?.message;
  const chatId = String(message?.chat?.id ?? '');
  const text = (message?.text ?? '').trim();

  // Always answer 200 so Telegram does not retry ignored updates
  if (!text || chatId !== process.env.TELEGRAM_CHAT_ID) {
    return res.status(200).end();
  }

  if (text.startsWith('/do')) {
    const task = text.replace(/^\/do(@\w+)?/, '').trim();
    if (!task) {
      await sendTelegram('Usage: /do <what to change>', chatId);
    } else {
      const ok = await dispatchTask(task);
      await sendTelegram(
        ok
          ? '🛠 Working on it… I will send the PR link when it is ready.'
          : '❌ Could not start the task (GitHub dispatch failed).',
        chatId
      );
    }
  } else {
    await sendTelegram(HELP, chatId);
  }

  return res.status(200).end();
}

async function dispatchTask(task) {
  try {
    const response = await fetch(`https://api.github.com/repos/${REPO}/dispatches`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_DISPATCH_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'majidi-no-telegram-bot',
      },
      body: JSON.stringify({ event_type: 'claude-task', client_payload: { task } }),
    });
    if (!response.ok) console.error('GitHub dispatch failed:', response.status, await response.text());
    return response.ok;
  } catch (error) {
    console.error('GitHub dispatch failed:', error.message);
    return false;
  }
}
