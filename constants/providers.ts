export const PROVIDERS = [
  {
    category: "llm",
    key: "openai",
    label: "OpenAI",
    models: [
      { key: "gpt-4o", label: "GPT-4o", family: "openai" },
      { key: "gpt-4o-mini", label: "GPT-4o Mini", family: "openai" },
      { key: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", family: "openai" },
    ],
  },
  {
    category: "llm",
    key: "anthropic",
    label: "Anthropic",
    models: [
      {
        key: "claude-3-5-sonnet-20240620",
        label: "Claude 3.5 Sonnet",
        family: "anthropic",
      },
    ],
  },
  {
    category: "llm",
    key: "groq",
    label: "Groq",
    models: [
      {
        key: "meta-llama-3-8b-instruct",
        label: "Meta Llama 3.8B Instruct",
        family: "llama",
      },
    ],
  },
  {
    category: "llm",
    key: "deepinfra",
    label: "DeepInfra",
    models: [
      {
        key: "deepinfra/meta-llama/Meta-Llama-3.1-405B-Instruct",
        label: "Meta Llama 3.1 405B Instruct",
        family: "llama",
      },
    ],
  },
  {
    category: "transcriber",
    key: "whisper",
    label: "Whisper",
    models: [
      { key: "whisper-1", label: "Whisper Model 1", family: "whisper" },
      { key: "whisper-2", label: "Whisper Model 2", family: "whisper" },
    ],
  },
  {
    category: "transcriber",
    key: "deepgram",
    label: "Deepgram",
    models: [
      { key: "nova-2", label: "Nova 2", family: "deepgram" },
      {
        key: "nova-2-phonecall",
        label: "Nova 2 Phonecall",
        family: "deepgram",
      },
    ],
  },
  {
    category: "synthesizer",
    key: "deepgram",
    label: "Deepgram",
    models: [{ key: "aura-asteria-en", label: "Asteria", family: "deepgram" }],
  },
  {
    category: "telephony",
    key: "twilio",
    label: "Twilio",
  },
  {
    category: "telephony",
    key: "plivo",
    label: "Plivo",
  },
];

export const VOICE_PROVIDERS = [
  {
    label: "All",
    value: "",
    key: "all",
  },
  {
    label: "Elevenlabs",
    value: "elevenlabs",
    key: "elevenlabs",
  },
  {
    label: "Deepgram",
    value: "deepgram",
    key: "deepgram",
  },
  {
    label: "Cartesia",
    value: "cartesia",
    key: "cartesia",
  },
];

export const LANGUAGES = [
  { label: "All", value: "", key: "all" },
  { label: "English", value: "en", key: "en" },
  { label: "French", value: "fr", key: "fr" },
  { label: "German", value: "de", key: "de" },
  { label: "Spanish", value: "es", key: "es" },
  { label: "Portuguese", value: "pt", key: "pt" },
  { label: "Chinese", value: "zh", key: "zh" },
  { label: "Japanese", value: "ja", key: "ja" },
  { label: "Hindi", value: "hi", key: "hi" },
  { label: "Italian", value: "it", key: "it" },
  { label: "Korean", value: "ko", key: "ko" },
  { label: "Dutch", value: "nl", key: "nl" },
  { label: "Polish", value: "pl", key: "pl" },
  { label: "Russian", value: "ru", key: "ru" },
  { label: "Swedish", value: "sv", key: "sv" },
  { label: "Turkish", value: "tr", key: "tr" },
];

export const GENDERS = [
  {
    label: "All",
    value: "",
    key: "all",
  },
  {
    label: "Male",
    value: "male",
    key: "male",
  },
  {
    label: "Female",
    value: "female",
    key: "female",
  },
];

export const PROVIDERS_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type ProvidersStatus =
  (typeof PROVIDERS_STATUS)[keyof typeof PROVIDERS_STATUS];
