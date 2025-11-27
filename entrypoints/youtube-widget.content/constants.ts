/**
 * Configuration constants for the YouTube Summary Widget
 */

import type { LanguageOption, ModelOption, LengthOption } from "./types";

/**
 * Available languages for summary generation
 * Sorted alphabetically by English name
 */
export const languages: LanguageOption[] = [
  { label: "Afrikaans", value: "af" },
  { label: "አማርኛ", value: "am" }, // Amharic
  { label: "العربية", value: "ar" }, // Arabic
  { label: "Azərbaycan", value: "az" }, // Azerbaijani
  { label: "Bahasa Indonesia", value: "id" }, // Indonesian
  { label: "Bahasa Melayu", value: "ms" }, // Malay
  { label: "বাংলা", value: "bn" }, // Bengali
  { label: "Беларуская", value: "be" }, // Belarusian
  { label: "Bosanski", value: "bs" }, // Bosnian
  { label: "Български", value: "bg" }, // Bulgarian
  { label: "Català", value: "ca" }, // Catalan
  { label: "中文", value: "zh" }, // Chinese
  { label: "Cymraeg", value: "cy" }, // Welsh
  { label: "Čeština", value: "cs" }, // Czech
  { label: "Dansk", value: "da" }, // Danish
  { label: "Deutsch", value: "de" }, // German
  { label: "Eesti", value: "et" }, // Estonian
  { label: "English", value: "en" },
  { label: "Español", value: "es" }, // Spanish
  { label: "Suomi", value: "fi" }, // Finnish
  { label: "Français", value: "fr" }, // French
  { label: "Gaeilge", value: "ga" }, // Irish
  { label: "ქართული", value: "ka" }, // Georgian
  { label: "Ελληνικά", value: "el" }, // Greek
  { label: "ગુજરાતી", value: "gu" }, // Gujarati
  { label: "עברית", value: "he" }, // Hebrew
  { label: "हिन्दी", value: "hi" }, // Hindi
  { label: "Hrvatski", value: "hr" }, // Croatian
  { label: "Magyar", value: "hu" }, // Hungarian
  { label: "Íslenska", value: "is" }, // Icelandic
  { label: "isiZulu", value: "zu" }, // Zulu
  { label: "Italiano", value: "it" }, // Italian
  { label: "日本語", value: "ja" }, // Japanese
  { label: "ಕನ್ನಡ", value: "kn" }, // Kannada
  { label: "Қазақ", value: "kk" }, // Kazakh
  { label: "ខ្មែរ", value: "km" }, // Khmer
  { label: "한국어", value: "ko" }, // Korean
  { label: "Кыргызча", value: "ky" }, // Kyrgyz
  { label: "ລາວ", value: "lo" }, // Lao
  { label: "Latviešu", value: "lv" }, // Latvian
  { label: "Lietuvių", value: "lt" }, // Lithuanian
  { label: "Македонски", value: "mk" }, // Macedonian
  { label: "മലയാളം", value: "ml" }, // Malayalam
  { label: "मराठी", value: "mr" }, // Marathi
  { label: "Монгол", value: "mn" }, // Mongolian
  { label: "မြန်မာ", value: "my" }, // Burmese
  { label: "नेपाली", value: "ne" }, // Nepali
  { label: "Nederlands", value: "nl" }, // Dutch
  { label: "Norsk", value: "no" }, // Norwegian
  { label: "ଓଡ଼ିଆ", value: "or" }, // Odia
  { label: "پښتو", value: "ps" }, // Pashto
  { label: "ਪੰਜਾਬੀ", value: "pa" }, // Punjabi
  { label: "Polski", value: "pl" }, // Polish
  { label: "Português", value: "pt" }, // Portuguese
  { label: "فارسی", value: "fa" }, // Persian
  { label: "Română", value: "ro" }, // Romanian
  { label: "Русский", value: "ru" }, // Russian
  { label: "Shqip", value: "sq" }, // Albanian
  { label: "සිංහල", value: "si" }, // Sinhala
  { label: "Slovenčina", value: "sk" }, // Slovak
  { label: "Slovenščina", value: "sl" }, // Slovenian
  { label: "Soomaali", value: "so" }, // Somali
  { label: "Српски", value: "sr" }, // Serbian
  { label: "Kiswahili", value: "sw" }, // Swahili
  { label: "Svenska", value: "sv" }, // Swedish
  { label: "தமிழ்", value: "ta" }, // Tamil
  { label: "తెలుగు", value: "te" }, // Telugu
  { label: "ไทย", value: "th" }, // Thai
  { label: "Türkçe", value: "tr" }, // Turkish
  { label: "Українська", value: "uk" }, // Ukrainian
  { label: "اردو", value: "ur" }, // Urdu
  { label: "Oʻzbek", value: "uz" }, // Uzbek
  { label: "Tiếng Việt", value: "vi" }, // Vietnamese
];

/**
 * Available AI models for summary generation
 */
export const models: ModelOption[] = [
  {
    label: "Gemini 2.5 Pro",
    value: "gemini-2.5-pro",
    description: "Complex reasoning model.",
  },
  {
    label: "Gemini 2.5 Flash",
    value: "gemini-2.5-flash",
    description: "Balance of price and performance.",
  },
  {
    label: "Gemini 2.5 Flash-Lite",
    value: "gemini-2.5-flash-lite",
    description: "Cost-effective for high-throughput tasks.",
  },
  {
    label: "Gemini 2.0 Flash",
    value: "gemini-2.0-flash",
    description: "Well-rounded with price-performance focus.",
  },
  {
    label: "Gemini 2.0 Flash-Lite",
    value: "gemini-2.0-flash-lite",
    description: "Cost-efficient and low latency.",
  },
];

/**
 * Available summary length options
 */
export const lengths: LengthOption[] = [
  { label: "Concise", value: "short" },
  { label: "Medium", value: "medium" },
  { label: "Detailed", value: "long" },
];

export const GEMINI_MODEL_MAP: Record<string, string> = {
  "gemini-2.5-pro": "gemini-2.5-pro",
  "gemini-2.5-flash": "gemini-2.5-flash",
  "gemini-2.5-flash-lite": "gemini-2.5-flash-lite",
  "gemini-2.0-flash": "gemini-2.0-flash",
  "gemini-2.0-flash-lite": "gemini-2.0-flash-lite",
};

export const SUMMARY_STYLE_COPY: Record<string, string> = {
  short:
    "Provide a concise summary (2-3 sentences) highlighting the top insights.",
  medium:
    "Provide a medium-length summary (3-5 bullet sentences) covering the main sections and key takeaways.",
  long: "Provide a detailed summary (6+ sentences) including context, supporting points, and any action items discussed.",
};

export const MAX_TRANSCRIPT_CHARACTERS = 6000;

export const API_KEY_STORAGE_KEY = "googleAIStudioApiKey";
export const GOOGLE_API_KEY_URL = "https://aistudio.google.com/app/apikey";
