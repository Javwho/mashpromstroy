// src/config/config.js

export const TG = {
  USE_PROXY: false,
  WEBHOOK_URL: "",
  BOT_TOKEN: "DO_NOT_USE_IN_CLIENT", // вынести в ENV на проде
  CHAT_ID: "DO_NOT_USE_IN_CLIENT",
};

export const CONFIG = {
  BRAND: "Машпромстрой",
  SLOGAN: "Чистые газы. Чистая эффективность.",
  PRICE_FROM: "от 1 500 ₽",
  DEFAULT_REGION: "Москва и область",

  PHONE_DISPLAY: "+7 926 975 8404",
  PHONE_TEL: "tel:+79269758404",
  OFFICE_ADDR: "МО, Балашиха, ул. Разинское ш. 5, офис 321",
  PROD_ADDR: "МО, г. Подольск, ул. Рощинская 53А",

  MAP_IFRAME_SRC:
    "https://yandex.ru/map-widget/v1/?ll=37.591341%2C55.422252&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgo0MTM2MDc4MjI2EmjQoNC-0YHRgdC40Y8sINCc0L7RgdC60L7QstGB0LrQsNGPINC-0LHQu9Cw0YHRgtGMLCDQn9C-0LTQvtC70YzRgdC6LCDQoNC-0YnQuNC90YHQutCw0Y8g0YPQu9C40YbQsCwgNTPQkCIKDYhdFkIVY7BdQg%2C%2C&z=16",
};
