export const generateToolName = () => {
  return `tool_${Math.random().toString(36).substring(2, 15)}`;
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
