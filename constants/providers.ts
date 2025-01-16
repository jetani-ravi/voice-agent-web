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
    models: [{ key: "aura-asteria-en", label: "Asteria" }],
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
