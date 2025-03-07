import { Pagination } from "@/types/api";

export enum ExecutionStatus {
  PENDING = "pending",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCEL = "cancel",
  BUSY = "busy",
  NO_ANSWER = "no-answer",
  RINGING = "ringing",
  QUEUED = "queued",
  INITIATED = "initiated",
  CANCELLED = "cancelled",
  BALANCE_LOW = "balance-low",
  CALL_DISCONNECTED = "call-disconnected"
}

export interface TelephonyData {
  duration?: string;
  to_number?: string;
  from_number?: string;
  recording_url?: string;
  hosted_telephony?: boolean;
  provider_call_id?: string;
  call_type?: string;
  provider?: string;
  hangup_by?: string;
  hangup_reason?: string;
  hangup_provider_code?: number;
}

export interface TransferCallData {
  provider_call_id?: string;
  status?: string;
  duration?: string;
  cost?: number;
  to_number?: string;
  from_number?: string;
  recording_url?: string;
  hangup_by?: string;
  hangup_reason?: string;
  hangup_provider_code?: number;
}

export interface BatchRunDetails {
  status?: string;
  created_at?: Date;
  updated_at?: Date;
  retried?: number;
}

export interface CostBreakdown {
  llm?: number;
  network?: number;
  platform?: number;
  synthesizer?: number;
  transcriber?: number;
}

export interface ExecutionModel {
  _id: string;
  agent_id: string;
  batch_id?: string;
  conversation_time?: number;
  provider?: string;
  total_cost?: number;
  status: ExecutionStatus;
  answered_by_voice_mail?: boolean;
  transcript?: string;
  created_at?: Date;
  updated_at?: Date;
  cost_breakdown?: CostBreakdown;
  telephony_data?: TelephonyData;
  transfer_call_data?: TransferCallData;
  batch_run_details?: BatchRunDetails;
  summary?: string;
  extracted_data?: Record<string, any>;
  context_details?: Record<string, any>;
}

export type ListCallHistoryResponse = {
  executions: ExecutionModel[];
  pagination: Pagination;
};

export interface ExecutionFilterParams {
  agent_id?: string;
  batch_id?: string;
  status?: ExecutionStatus;
  start_date?: Date;
  end_date?: Date;
}
