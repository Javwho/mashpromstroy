export default async function handler(event, context) {
  // Разрешаем только POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const { name, phone, message } = JSON.parse(event.body || "{}");

    // Достаём токен и chat_id из переменных окружения
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error("Нет TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID");
      return {
        statusCode: 500,
        body: "Server configuration error",
      };
    }

    const text =
      `🚀 Новый запрос с сайта mashpromstroy.ru\n\n` +
      `Имя: ${name || "-"}\n` +
      `Телефон: ${phone || "-"}\n` +
      (message ? `Сообщение: ${message}\n` : "");

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      console.error("Ошибка телеграма:", data);
      return {
        statusCode: 500,
        body: "Telegram API error",
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error("Ошибка в send-telegram:", err);
    return {
      statusCode: 500,
      body: "Server error",
    };
  }
}
