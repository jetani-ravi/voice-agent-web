import { z } from "zod";

// Validation Schema
export const promptsSchema = z.object({
  systemPrompt: z.string().min(1, "System prompt is required"),
  agentWelcomeMessage: z.string().min(1, "Agent welcome message is required"),
});

export type PromptsValues = z.infer<typeof promptsSchema>;

// Validation Schema
export const faqsSchema = z.object({
  route_name: z.string().min(1, "Route name is required"),
  response: z.union([
    z.string().min(1, "Response is required"),
    z.array(z.string()).min(1, "Response is required")
  ]),
  score_threshold: z.number().min(0.7).max(1),
  utterances: z
    .array(z.object({ utterance: z.string().min(1, "Utterance is required") }))
    .min(1, "At least one utterance is required")
    .max(20),
});

export const llmSchema = z.object({
  provider: z.string().nonempty("Provider is required"),
  model: z.string().nonempty("Model is required"),
  tokens: z.number().min(1).max(4096),
  temperature: z.number().min(0.01).max(1),
  knowledgeBase: z.string().optional(),
  faqs: z.array(faqsSchema).optional(),
});

export const transcriberSchema = z.object({
  provider: z.string().nonempty("Provider is required"),
  model: z.string().nonempty("Model is required"),
  keywords: z.string().optional(),
  interruptionWait: z.number().min(1).max(10),
});

export const voiceSchema = z.object({
  provider: z.string().nonempty("Provider is required"),
  model: z.string().nonempty("Model is required"),
  bufferSize: z.number().min(1).max(400),
  endpointing: z.number().min(0).max(5000),
  incrementalDelay: z.number().min(0).max(2500),
  checkIfUserOnline: z.boolean().optional(),
  checkUserOnlineMessage: z.string().optional(),
  triggerCheckUserOnlineMessageAfter: z.number().optional(),
});

export const callSchema = z.object({
  provider: z.string().nonempty("Provider is required"),
  detectVoicemail: z.boolean().optional(),
  hangupAfterSilence: z.number().min(1).max(30),
  callCancellationPrompt: z.string().optional(),
  callHangupMessage: z.string().optional(),
  callTerminate: z.number().min(30).max(1200),
});

export const postCallAnalyticsSchema = z.object({
  summarizeCall: z.boolean().optional(),
  extractCallSummary: z.boolean().optional(),
  extractCallSummaryPrompt: z.string().optional(),
  webhookUrl: z.string().optional(),
});

// Form Values Type
export type LLMValues = z.infer<typeof llmSchema>;

export type FaqsValues = z.infer<typeof faqsSchema>;

export type TranscriberValues = z.infer<typeof transcriberSchema>;

export type VoiceValues = z.infer<typeof voiceSchema>;

export type CallValues = z.infer<typeof callSchema>;

export type PostCallAnalyticsValues = z.infer<typeof postCallAnalyticsSchema>;
