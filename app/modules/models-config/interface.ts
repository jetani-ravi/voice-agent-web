export interface TranscribersConfig {
  name: string;
  canonical_name: string;
  architecture: string;
  languages: string[];
  provider: string;
}

export interface LLMModelsConfig {
  name: string;
}
