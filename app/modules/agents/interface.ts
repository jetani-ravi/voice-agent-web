import { Pagination } from "@/types/api";

export interface Agent {
  _id: string;
  agent_config: AgentModel;
  agent_prompts?: Record<string, Record<string, string>>;
  user_id: string;
  agent_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAgentPayload {
  agent_config: AgentModel;
  agent_prompts?: Record<string, Record<string, string>>;
}

export type ListAgentsResponse = {
  agents: Agent[];
  pagination: Pagination;
};

export interface AgentModel {
  agent_name: string;
  agent_type: string;
  tasks: Task[];
  agent_welcome_message?: string;
}

export interface Task {
  tools_config: ToolsConfig;
  toolchain: ToolsChainModel;
  task_type?: string;
  task_config: ConversationConfig;
}

export interface ToolsConfig {
  llm_agent?: LlmAgent | SimpleLlmAgent;
  synthesizer?: Synthesizer;
  transcriber?: Transcriber;
  input?: IOModel;
  output?: IOModel;
  api_tools?: ToolModel;
}

export interface LlmAgent {
  agent_flow_type: string;
  agent_type: string;
  routes?: Routes;
  llm_config:
    | OpenaiAssistant
    | KnowledgebaseAgent
    | LlmAgentGraph
    | MultiAgent
    | SimpleLlmAgent
    | GraphAgentConfig;
}

export interface SimpleLlmAgent extends Llm {
  agent_flow_type?: string;
  routes?: Routes;
  extraction_details?: string;
  summarization_details?: string;
}

export interface Synthesizer {
  provider: string;
  provider_config:
    | PollyConfig
    | ElevenLabsConfig
    | AzureConfig
    | SmallestConfig
    | CartesiaConfig
    | DeepgramConfig
    | OpenAIConfig;
  stream: boolean;
  buffer_size?: number;
  audio_format?: string;
  caching?: boolean;
}

export interface PollyConfig {
  voice: string;
  engine: string;
  language: string;
}

export interface ElevenLabsConfig {
  voice: string;
  voice_id: string;
  model: string;
  temperature?: number;
  similarity_boost?: number;
}

export interface OpenAIConfig {
  voice: string;
  model: string;
}

export interface DeepgramConfig {
  voice: string;
  model: string;
}

export interface CartesiaConfig {
  voice_id: string;
  voice: string;
  model: string;
}

export interface SmallestConfig {
  voice_id: string;
  language: string;
  voice: string;
  model: string;
}

export interface AzureConfig {
  voice: string;
  model: string;
  language: string;
}

export interface Transcriber {
  model?: string;
  language?: string;
  stream: boolean;
  sampling_rate?: number;
  encoding?: string;
  endpointing?: number;
  keywords?: string;
  task?: string;
  provider?: string;
}

export interface IOModel {
  provider: string;
  format?: string;
}

export interface ToolModel {
  tools?: string | ToolDescription[];
  tools_params: Record<string, APIParams>;
}

export interface ToolDescription {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface APIParams {
  url?: string;
  method?: string;
  api_token?: string;
  param?: string;
  header?: string;
}

export interface ToolsChainModel {
  execution: "parallel" | "sequential";
  pipelines: string[][];
}

export interface ConversationConfig {
  optimize_latency?: boolean;
  hangup_after_silence?: number;
  incremental_delay?: number;
  number_of_words_for_interruption?: number;
  interruption_backoff_period?: number;
  hangup_after_llm_call?: boolean;
  call_cancellation_prompt?: string;
  backchanneling?: boolean;
  backchanneling_message_gap?: number;
  backchanneling_start_delay?: number;
  ambient_noise?: boolean;
  ambient_noise_track?: string;
  call_terminate?: number;
  use_fillers?: boolean;
  trigger_user_online_message_after?: number;
  check_user_online_message?: string;
  check_if_user_online?: boolean;
}

export interface Routes {
  embedding_model?: string;
  routes?: Route[];
}

export interface Route {
  route_name: string;
  utterances: string[];
  response: string[] | string;
  score_threshold?: number;
}

export interface OpenaiAssistant {
  name?: string;
  assistant_id?: string;
  max_tokens?: number;
  temperature?: number;
  buffer_size?: number;
  provider?: string;
  model?: string;
}

export interface KnowledgebaseAgent extends Llm {
  vector_store: VectorStore;
  provider?: string;
  model?: string;
}

export interface VectorStore {
  provider: string;
  provider_config: LanceDBProviderConfig | MongoDBProviderConfig;
}

export interface LanceDBProviderConfig {
  vector_id: string;
}

export interface MongoDBProviderConfig {
  connection_string?: string;
  db_name?: string;
  collection_name?: string;
  index_name?: string;
  llm_model?: string;
  embedding_model?: string;
  embedding_dimensions?: number;
}

export interface LlmAgentGraph {
  nodes: Node[];
  edges: Edge[];
}

export interface Node {
  id: string;
  type: string;
  llm: Llm;
  exit_criteria: string;
  exit_response?: string;
  exit_prompt?: string;
  is_root?: boolean;
}

export interface Edge {
  start_node: string;
  end_node: string;
  condition?: [unknown, unknown];
}

export interface GraphAgentConfig extends Llm {
  agent_information: string;
  nodes: GraphNode[];
  current_node_id: string;
  context_data?: Record<string, unknown>;
}

export interface GraphNode {
  id: string;
  description?: string;
  prompt: string;
  edges: GraphEdge[];
  completion_check?: (data: Record<string, unknown>[]) => boolean;
  rag_config?: Record<string, unknown>;
}

export interface GraphEdge {
  to_node_id: string;
  condition: string;
}

export interface MultiAgent {
  agent_map: Record<string, Llm | OpenaiAssistant>;
  agent_routing_config: Record<string, AgentRouteConfig>;
  default_agent: string;
  embedding_model?: string;
}

export interface AgentRouteConfig {
  utterances: string[];
  threshold?: number;
}

export interface Llm {
  model?: string;
  max_tokens?: number;
  family?: string;
  temperature?: number;
  request_json?: boolean;
  stop?: string[];
  top_k?: number;
  top_p?: number;
  min_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  provider?: string;
  base_url?: string;
  routes?: Routes;
}
