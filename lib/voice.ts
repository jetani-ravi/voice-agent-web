import {
  Synthesizer,
  SYNTHESIZER_PROVIDERS,
  ElevenLabsConfig,
  OpenAIConfig,
  AzureConfig,
  CartesiaConfig,
  DeepgramConfig,
  PollyConfig,
  SynthesizerConfig,
  SmallestConfig,
} from "@/app/modules/agents/interface";
import { Voice } from "@/app/modules/voice-library/interface";
import { VoiceValues } from "@/app/modules/agents/validation";

export const getProviderConfig = (
  synthesizer?: Synthesizer
): SynthesizerConfig | null => {
  if (!synthesizer) return null;
  // use switch statement
  switch (synthesizer.provider) {
    case SYNTHESIZER_PROVIDERS.elevenlabs:
      return synthesizer.provider_config as ElevenLabsConfig;
    case SYNTHESIZER_PROVIDERS.openai:
      return synthesizer.provider_config as OpenAIConfig;
    case SYNTHESIZER_PROVIDERS.azure:
      return synthesizer.provider_config as AzureConfig;
    case SYNTHESIZER_PROVIDERS.smallest:
      return synthesizer.provider_config as SmallestConfig;
    case SYNTHESIZER_PROVIDERS.cartesia:
      return synthesizer.provider_config as CartesiaConfig;
    case SYNTHESIZER_PROVIDERS.deepgram:
      return synthesizer.provider_config as DeepgramConfig;
    case SYNTHESIZER_PROVIDERS.polly:
      return synthesizer.provider_config as PollyConfig;
    default:
      return null;
  }
};

export const getModel = (providerConfig?: SynthesizerConfig | null): string => {
  if (!providerConfig) return "";
  if ("voice_id" in providerConfig) {
    return providerConfig.voice_id;
  }
  if ("model" in providerConfig) {
    return providerConfig.model;
  }
  if ("voice" in providerConfig) {
    return providerConfig.voice;
  }
  return "";
};

export const getSynthProviderConfig = (
  data: VoiceValues,
  selectedVoice: Voice
): SynthesizerConfig | null => {
  switch (data.provider) {
    case SYNTHESIZER_PROVIDERS.elevenlabs:
      return {
        voice: selectedVoice.name,
        voice_id: selectedVoice.voice_id,
        model: selectedVoice.model,
      } as ElevenLabsConfig;

    case SYNTHESIZER_PROVIDERS.openai:
      return {
        voice: selectedVoice.name,
        model: selectedVoice.model,
      } as OpenAIConfig;

    case SYNTHESIZER_PROVIDERS.azure:
      return {
        voice: selectedVoice.name,
        model: selectedVoice.model,
        language: selectedVoice.language_code,
      } as AzureConfig;

    case SYNTHESIZER_PROVIDERS.smallest:
      return {
        voice: selectedVoice.name,
        voice_id: selectedVoice.voice_id,
        model: selectedVoice.model,
        language: selectedVoice.language_code,
      } as SmallestConfig;

    case SYNTHESIZER_PROVIDERS.cartesia:
      return {
        voice_id: selectedVoice.voice_id,
        voice: selectedVoice.name,
        model: selectedVoice.model,
      } as CartesiaConfig;

    case SYNTHESIZER_PROVIDERS.deepgram:
      return {
        voice: selectedVoice.name,
        model: selectedVoice.model,
      } as DeepgramConfig;

    case SYNTHESIZER_PROVIDERS.polly:
      return {
        voice: selectedVoice.name,
        engine: selectedVoice.model,
        language: selectedVoice.language_code,
      } as PollyConfig;

    default:
      return null;
  }
};

export const getSynthModelForCostCalculation = (
  providerConfig: SynthesizerConfig | undefined
) => {
  if (!providerConfig) return "";
  if ("model" in providerConfig) {
    return providerConfig.model;
  }
  if ("engine" in providerConfig) {
    return providerConfig.engine;
  }
  return "";
};
