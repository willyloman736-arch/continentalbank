/**
 * Continental Bank — DEMO secure message threads
 *
 * Each thread holds the conversation between a client and the private
 * office. Replaces the older single-shot support ticket model with a
 * proper threaded conversation + (mock) attachments.
 */

import { demoAdminProfile, demoClientProfile, demoClientRoster } from "./data";

export type MessageSenderRole = "client" | "officer";
export type MessageThreadStatus = "open" | "awaiting_client" | "resolved" | "closed";

export type MessageAttachment = {
  id: string;
  name: string;
  size: string;
  /** e.g. "PDF", "PNG" */
  kind: string;
};

export type Message = {
  id: string;
  thread_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: MessageSenderRole;
  body: string;
  attachments?: MessageAttachment[];
  created_at: string;
};

export type MessageThread = {
  id: string;
  user_id: string;
  subject: string;
  status: MessageThreadStatus;
  /** Officer assigned (for admin view). */
  assigned_to?: { id: string; full_name: string } | null;
  last_message_at: string;
  unread_for_client: boolean;
  unread_for_officer: boolean;
  created_at: string;
  messages: Message[];
};

const ISO = (d: string) => new Date(d).toISOString();

const officer = {
  id: demoAdminProfile.id,
  name: demoAdminProfile.full_name,
};

const client = {
  id: demoClientProfile.id,
  name: demoClientProfile.full_name,
};

export const demoClientThreads: MessageThread[] = [
  {
    id: "thr-q3-statement",
    user_id: client.id,
    subject: "Q3 consolidated statement — for my Lugano counsel",
    status: "resolved",
    assigned_to: { id: officer.id, full_name: officer.name },
    last_message_at: ISO("2026-05-04T14:48:00Z"),
    unread_for_client: false,
    unread_for_officer: false,
    created_at: ISO("2026-05-04T10:11:00Z"),
    messages: [
      {
        id: "msg-q3-1",
        thread_id: "thr-q3-statement",
        sender_id: client.id,
        sender_name: client.name,
        sender_role: "client",
        body:
          "Could you please prepare a consolidated Q3 statement across all three portfolios in PDF? My counsel in Lugano needs it before the 8th.",
        created_at: ISO("2026-05-04T10:11:00Z"),
      },
      {
        id: "msg-q3-2",
        thread_id: "thr-q3-statement",
        sender_id: officer.id,
        sender_name: officer.name,
        sender_role: "officer",
        body:
          "Madame, of course. The Q3 consolidated statement has been delivered to your secure file vault and the copy to your assistant in Lugano. Please confirm receipt.",
        attachments: [
          {
            id: "att-1",
            name: "Q3-Consolidated-Statement-CB491072820314.pdf",
            size: "284 KB",
            kind: "PDF",
          },
        ],
        created_at: ISO("2026-05-04T13:32:00Z"),
      },
      {
        id: "msg-q3-3",
        thread_id: "thr-q3-statement",
        sender_id: client.id,
        sender_name: client.name,
        sender_role: "client",
        body: "Received, thank you. Closing the thread.",
        created_at: ISO("2026-05-04T14:48:00Z"),
      },
    ],
  },
  {
    id: "thr-singapore-travel",
    user_id: client.id,
    subject: "Travel notice — Singapore, June 4–12",
    status: "open",
    assigned_to: null,
    last_message_at: ISO("2026-05-18T07:30:00Z"),
    unread_for_client: false,
    unread_for_officer: true,
    created_at: ISO("2026-05-18T07:30:00Z"),
    messages: [
      {
        id: "msg-sgp-1",
        thread_id: "thr-singapore-travel",
        sender_id: client.id,
        sender_name: client.name,
        sender_role: "client",
        body:
          "I will be in Singapore the second week of June. Please flag the Asia desk so any urgent matter can be routed locally. I prefer the Raffles office contact.",
        created_at: ISO("2026-05-18T07:30:00Z"),
      },
    ],
  },
  {
    id: "thr-beneficiary-add",
    user_id: client.id,
    subject: "Add a new beneficiary — Frankfurt counsel",
    status: "awaiting_client",
    assigned_to: { id: officer.id, full_name: officer.name },
    last_message_at: ISO("2026-05-19T11:14:00Z"),
    unread_for_client: true,
    unread_for_officer: false,
    created_at: ISO("2026-05-15T09:02:00Z"),
    messages: [
      {
        id: "msg-ben-1",
        thread_id: "thr-beneficiary-add",
        sender_id: client.id,
        sender_name: client.name,
        sender_role: "client",
        body:
          "Please add a new EUR beneficiary for my counsel in Frankfurt. I will share the IBAN once I have confirmation.",
        created_at: ISO("2026-05-15T09:02:00Z"),
      },
      {
        id: "msg-ben-2",
        thread_id: "thr-beneficiary-add",
        sender_id: officer.id,
        sender_name: officer.name,
        sender_role: "officer",
        body:
          "Understood. For amounts above 250 K EUR we will require dual-officer authorisation and a signed mandate addendum (template attached). You may return it through this thread.",
        attachments: [
          {
            id: "att-2",
            name: "Mandate-Addendum-Template.pdf",
            size: "62 KB",
            kind: "PDF",
          },
        ],
        created_at: ISO("2026-05-19T11:14:00Z"),
      },
    ],
  },
];

export const demoAdminThreads: MessageThread[] = [
  ...demoClientThreads,
  // A second client's thread — surfaces in the admin inbox
  {
    id: "thr-mayfair-compliance",
    user_id: "demo-client-0002",
    subject: "Quarterly compliance pack — addendum required",
    status: "open",
    assigned_to: null,
    last_message_at: ISO("2026-05-18T15:32:00Z"),
    unread_for_client: false,
    unread_for_officer: true,
    created_at: ISO("2026-05-18T15:32:00Z"),
    messages: [
      {
        id: "msg-may-1",
        thread_id: "thr-mayfair-compliance",
        sender_id: "demo-client-0002",
        sender_name: "Marcus Ainsworth",
        sender_role: "client",
        body:
          "My counsel in Mayfair has flagged an addendum needed for the Q1 compliance pack. May we coordinate a brief call this week?",
        created_at: ISO("2026-05-18T15:32:00Z"),
      },
    ],
  },
];

export function threadClient(thread: MessageThread) {
  return (
    demoClientRoster.find((p) => p.id === thread.user_id) ?? {
      id: thread.user_id,
      full_name: "—",
      email: "",
      account_number: null,
    }
  );
}

export const MESSAGE_STATUS_LABEL: Record<MessageThreadStatus, string> = {
  open: "Open",
  awaiting_client: "Awaiting reply",
  resolved: "Resolved",
  closed: "Closed",
};
