import { CreateAgentPayload } from "@/app/modules/agents/interface";

export const generateToolName = (prefix?: string) => {
  const randomPart = Math.random().toString(36).substring(2, 15);
  if (prefix) {
    return `${prefix}_${randomPart}`;
  }
  return `tool_${randomPart}`;
};

// constants.ts
export const API_TOOLS = {
  CALENDAR_AVAILABILITY: {
    key: "check_availability_of_slots",
    method: "GET",
    baseUrl: "https://api.cal.com/v1/slots",
    description:
      "Fetch the available free slots of appointment booking before booking the appointment.",
    parameters: {
      type: "object",
      properties: {
        startTime: {
          type: "string",
          description:
            "It is an ISO FORMATTED DATE on which time user is available (convert it automatically to hr:min such as 3:30 PM is 15:30)",
        },
        endTime: {
          type: "string",
          description:
            "It is an ISO FORMATTED DATE. endDate is always 30 minutes more than startDate always i.e. increment one day to the startDate. such if startDate is 2024-05-15T16:30:00.000 then endDate is 2024-05-15T16:45:00.000",
        },
      },
      required: ["startTime", "endTime"],
    },
  },
  BOOK_APPOINTMENT: {
    key: "book_appointment",
    method: "POST",
    baseUrl: "https://api.cal.com/v1/bookings",
    description:
      "Use this tool to book an appointment with given details and save the appointment in the calendar.",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "name of the person.",
        },
        preferred_time: {
          type: "string",
          description:
            "Preferred time provided by the person, ask the time when users wants to book an appointment such as 9am or 10:30am and convert it to python readable format for example if users said 9am then it is 09:00 or 1:30PM then it 13:30 i.e. in hr:min",
        },
        address: {
          type: "string",
          description: "address name of the person.",
        },
        email: {
          type: "string",
          description: "email name of the person.",
        },
        preferred_date: {
          type: "string",
          description:
            "Preferred date provided by the person, ask the date when user wants to book an appointment such as tomorrow or day after tomorrow. and convert the user's response into a python readable format i.e. yyyy-mm-dd",
        },
      },
      required: [
        "name",
        "email",
        "address",
        "preferred_date",
        "preferred_time",
      ],
    },
  },
  TRANSFER_CALL: {
    key: "transfer_call",
    method: "POST",
    baseUrl: undefined,
    description: "Use this tool to transfer the call",
    parameters: {
      type: "object",
      properties: {
        call_sid: {
          type: "string",
          description: "unique call id",
        },
      },
      required: ["call_sid"],
    },
  },
  CUSTOM_FUNCTION: {
    name: "test",
    description: "This is a test description",
    parameters: {
      type: "object",
      properties: {
        startTime: {
          type: "string",
          description: "",
        },
        endTime: {
          type: "string",
          description: "",
        },
      },
      required: ["startTime", "endTime"],
    },
    key: "custom_function",
    value: {
      method: "GET",
      param: "{}",
      url: "",
      api_token: "",
    },
  },
};

export const SUMMARIZATION_TASK = {
  tools_config: {
    output: null,
    input: null,
    synthesizer: null,
    llm_agent: {
      agent_type: "simple_llm_agent",
      agent_flow_type: "streaming",
      routes: null,
      llm_config: {
        max_tokens: 100.0,
        presence_penalty: 0.0,
        summarization_details: null,
        base_url: null,
        extraction_details: "",
        top_p: 0.9,
        request_json: true,
        routes: null,
        agent_flow_type: "streaming",
        min_p: 0.1,
        frequency_penalty: 0.0,
        stop: null,
        provider: "openai",
        top_k: 0.0,
        temperature: 0.1,
        model: "gpt-4o-mini",
        family: "openai",
      },
    },
    transcriber: null,
    api_tools: null,
  },
  task_config: {
    voicemail: false,
    backchanneling: false,
    optimize_latency: true,
    call_hangup_message: null,
    incremental_delay: 100.0,
    ambient_noise_track: "convention_hall",
    trigger_user_online_message_after: 10.0,
    check_if_user_online: true,
    hangup_after_LLMCall: false,
    call_terminate: 90.0,
    hangup_after_silence: 10.0,
    ambient_noise: true,
    use_fillers: false,
    interruption_backoff_period: 100.0,
    backchanneling_start_delay: 5.0,
    call_cancellation_prompt: null,
    check_user_online_message: "Hey, are you still there",
    number_of_words_for_interruption: 1.0,
    backchanneling_message_gap: 5.0,
  },
  task_type: "summarization",
  toolchain: {
    execution: "parallel",
    pipelines: [["llm"]],
  },
};

export const EXTRACTON_TASK = {
  tools_config: {
    output: null,
    input: null,
    synthesizer: null,
    llm_agent: {
      agent_type: "simple_llm_agent",
      agent_flow_type: "streaming",
      routes: null,
      llm_config: {
        extraction_json: "",
        max_tokens: 100.0,
        presence_penalty: 0.0,
        summarization_details: null,
        base_url: null,
        extraction_details: "",
        top_p: 0.9,
        request_json: true,
        routes: null,
        agent_flow_type: "streaming",
        min_p: 0.1,
        frequency_penalty: 0.0,
        stop: null,
        provider: "openai",
        top_k: 0.0,
        temperature: 0.1,
        model: "gpt-4o-mini",
        family: "openai",
      },
    },
    transcriber: null,
    api_tools: null,
  },
  task_config: {
    voicemail: false,
    backchanneling: false,
    optimize_latency: true,
    call_hangup_message: null,
    incremental_delay: 100.0,
    ambient_noise_track: "convention_hall",
    trigger_user_online_message_after: 10.0,
    check_if_user_online: true,
    hangup_after_LLMCall: false,
    call_terminate: 90.0,
    hangup_after_silence: 10.0,
    ambient_noise: true,
    use_fillers: false,
    interruption_backoff_period: 100.0,
    backchanneling_start_delay: 5.0,
    call_cancellation_prompt: null,
    check_user_online_message: "Hey, are you still there",
    number_of_words_for_interruption: 1.0,
    backchanneling_message_gap: 5.0,
  },
  task_type: "extraction",
  toolchain: {
    execution: "parallel",
    pipelines: [["llm"]],
  },
};

export const DEFAULT_AGENT: CreateAgentPayload = {
  agent_config: {
    agent_welcome_message: "Hello from Voice Agent",
    agent_name: "New Agent",
    agent_type: "conversation",
    tasks: [
      {
        tools_config: {
          output: {
            format: "wav",
            provider: "twilio",
          },
          input: {
            format: "wav",
            provider: "twilio",
          },
          synthesizer: {
            audio_format: "wav",
            provider: "deepgram",
            stream: true,
            caching: true,
            provider_config: {
              voice: "Asteria",
              model: "aura-asteria-en",
            },
            buffer_size: 150,
          },
          llm_agent: {
            agent_type: "simple_llm_agent",
            agent_flow_type: "streaming",
            routes: undefined,
            llm_config: {
              max_tokens: 150,
              presence_penalty: 0,
              base_url: undefined,
              top_p: 0.9,
              request_json: false,
              routes: undefined,
              context_data: {},
              min_p: 0.1,
              frequency_penalty: 0,
              stop: undefined,
              provider: "openai",
              top_k: 0,
              temperature: 0.2,
              model: "gpt-3.5-turbo",
              family: "openai",
              agent_information: "simple_llm_agent",
            },
          },
          transcriber: {
            sampling_rate: 16000,
            endpointing: 700,
            task: "transcribe",
            keywords: "",
            stream: true,
            provider: "deepgram",
            model: "nova-2",
            language: "en",
            encoding: "linear16",
          },
          api_tools: undefined,
        },
        task_config: {
          backchanneling: false,
          optimize_latency: true,
          incremental_delay: 1200,
          ambient_noise_track: "office-ambience",
          trigger_user_online_message_after: 6,
          check_if_user_online: true,
          hangup_after_LLMCall: false,
          call_terminate: 300,
          hangup_after_silence: 10,
          ambient_noise: false,
          use_fillers: false,
          interruption_backoff_period: 0,
          backchanneling_start_delay: 5,
          call_cancellation_prompt: "",
          check_user_online_message: "Hey, are you still there",
          number_of_words_for_interruption: 2,
          backchanneling_message_gap: 5,
          call_hangup_message: "",
        },
        task_type: "conversation",
        toolchain: {
          execution: "parallel",
          pipelines: [["transcriber", "llm", "synthesizer"]],
        },
      },
    ],
  },
  agent_prompts: {
    task_1: {
      system_prompt:
        "You will keep your sentences short and crisp. You will never reply with more than 2 sentences at a time. You will stick to context throughout.",
    },
  },
};

export const GRAPH_NODE = {
  edges: [],
  description: null,
  id: "root",
  rag_config: {
    temperature: 0.2,
    model: "gpt-3.5-turbo",
    provider: "qdrant",
    max_tokens: 150.0,
    provider_config: {
      vector_id: "",
      similarity_top_k: 10.0,
    },
  },
  prompt: "",
  completion_check: null,
};

export const VECTOR_DB = {
  LANCEDB: "lancedb",
  QDRANT: "qdrant",
};
