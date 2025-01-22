import { Pagination } from "@/types/api";

export type InitiateCall = {
  recipient_phone_number: string;
  agent_id: string;
};

export interface TwilioCredentials {
  account_sid: string;
  auth_token: string;
}

export interface PhoneNumberCapabilities {
  voice?: boolean;
  sms?: boolean;
  mms?: boolean;
  fax?: boolean;
}

export interface PhoneNumberProperties {
  friendly_name?: string;
  status: string;
}

export interface PhoneNumber {
  _id: string;
  phoneNumber: string;
  price?: number;
  location?: string;
  twilio_sid?: string;
  agent_id?: string;
  user_id: string;
  capabilities?: PhoneNumberCapabilities;
  properties?: PhoneNumberProperties;
  purchased?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  isDeleted?: boolean;
}

export type AvailablePhoneNumbers = {
  phoneNumber: string;
  location: string;
  capabilities: {
    voice: boolean;
    sms: boolean;
    mms: boolean;
  };
};

export type SyncPhoneNumbersResponse = {
  synced_numbers: PhoneNumber[];
  total_synced: number;
  account_sid: string;
};

export type ListPhoneNumbersResponse = {
  phone_numbers: PhoneNumber[];
  pagination: Pagination;
};
