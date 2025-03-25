import { ModelsConfig, ProvidersWithConnection } from "../app/modules/providers/interface";

export interface ModelCost {
  input?: number;
  output?: number;
  price?: number;
}

export interface CostBreakdown {
  llm: number;
  transcriber: number;
  synthesizer: number;
  platform: number;
  total: number;
}

export interface CostBreakdownItem {
  provider: string;
  model: string;
}

// Calculate cost per minute based on selected models
export const calculateCostPerMinute = (
  llm: CostBreakdownItem | undefined,
  transcriber: CostBreakdownItem | undefined,
  synthesizer: CostBreakdownItem | undefined,
  systemProviders: ProvidersWithConnection[]
): CostBreakdown => {
  // Default values
  let llmCost = 0;
  let transcriberCost = 0;
  let synthesizerCost = 0;
  let platformCost = 0;

  const platformProvider = systemProviders.find((provider) => provider.name === "Platform");
  if (platformProvider) {
    platformCost = platformProvider.models?.[0]?.price as number || 0;
  }

  // Calculate LLM cost (assuming 8000 tokens per minute, with 5000 input and 3000 output)
  // LLM price is per 1M tokens, so divide by 1,000,000 to get per-token cost
  if (llm && systemProviders.length > 0) {
    const provider = systemProviders.find((provider) => provider.name.toLowerCase() === llm.provider.toLowerCase());
    if (provider) {
      const model = provider.models?.find((m: ModelsConfig) => m.value === llm.model);
      if (model) {
        if (typeof model.price === 'number') {
          // Convert from per 1M tokens to per token, then multiply by tokens per minute
          llmCost = (model.price / 1000000) * 8000;
        } else if (model.price) {
          // If price is an object with input/output costs
          const inputCost = (model.price.input / 1000000) * 5000;
          const outputCost = (model.price.output / 1000000) * 3000;
          llmCost = inputCost + outputCost;
        }
      }
    }
  }

  // Calculate transcriber cost (price is already per minute)
  if (transcriber && systemProviders.length > 0) {
    const provider = systemProviders.find((provider) => provider.name.toLowerCase() === transcriber.provider.toLowerCase());
    if (provider) {
      const model = provider.models?.find((m: ModelsConfig) => m.value === transcriber.model);
      if (model && model.price) {
        transcriberCost = model.price as number;
      }
    }
  }

  // Calculate synthesizer cost (price is per character, assuming 450 characters per minute)
  // Average of 5 characters per word, 90 words per minute = 450 characters
  if (synthesizer && systemProviders.length > 0) {
    const provider = systemProviders.find((provider) => provider.name.toLowerCase() === synthesizer.provider.toLowerCase());
    if (provider) {
      const model = provider.models?.find((m: ModelsConfig) => m.value === synthesizer.model || synthesizer.model.startsWith(m.value));
      if (model && model.price) {
        synthesizerCost = (model.price as number) * 450;
      }
    }
  }

  const total = llmCost + transcriberCost + synthesizerCost + platformCost;

  return {
    llm: llmCost,
    transcriber: transcriberCost,
    synthesizer: synthesizerCost,
    platform: platformCost,
    total
  };
}; 