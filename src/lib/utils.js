// src/lib/utils.js

export function classNames(...a) {
  return a.filter(Boolean).join(" ");
}

export function yandexMapUrl(address) {
  return `https://yandex.ru/maps/?text=${encodeURIComponent(address)}`;
}

export function isValidPhone(phone) {
  if (!phone) return false;

  // Оставляем только цифры
  const cleaned = phone.replace(/[^\d]/g, "");

  // Минимум 10 цифр
  return cleaned.length >= 10;
}
