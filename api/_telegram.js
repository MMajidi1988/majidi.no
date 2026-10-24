/**
 * Telegram helper shared by the API functions.
 * The leading underscore keeps Vercel from exposing this file as an endpoint.
 */

const TELEGRAM_API = 'https://api.telegram.org';

export async function sendTelegram(text, chatId = process.env.TELEGRAM_CHAT_ID) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || !chatId) return;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);
  try {
    await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text.slice(0, 4000),
        disable_web_page_preview: true,
      }),
      signal: controller.signal,
    });
  } catch (error) {
    console.error('Telegram notify failed:', error.message);
  } finally {
    clearTimeout(timer);
  }
}
