# AgentMail API Uses

## Service Summary

AgentMail gives AI agents first-class email inboxes: durable sender/receiver identities that can read, label, thread, draft, send, forward, and reply to email. The MPP service wraps the AgentMail HTTP API at `https://mpp.api.agentmail.to`, while the direct API is documented under `https://api.agentmail.to/v0/`. The researched MPP inventory covers 83 HTTP endpoints across 10 groups.

The highest-value pattern is not "email API as SMTP replacement." It is controlled agent email infrastructure: create inboxes per agent or tenant, constrain who they can contact, preserve message/thread state, route risky outbound mail through drafts and human review, and monitor delivery health. This makes AgentMail especially relevant for customer-support agents, sales/recruiting agents, personal assistants, agent platforms, workflow automation, and multi-tenant SaaS products that need isolated email workspaces.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Inbox Provisioning And Agent Identity | 10 | Create, list, update, and retire organization or pod-scoped inboxes that act as stable agent email identities. | [Details](api-uses/inbox-provisioning-and-agent-identity.md) |
| Message Reading And Labeling | 5 | Read inbox messages, inspect raw and attachment download metadata, and use labels as workflow state. | [Details](api-uses/message-reading-and-labeling.md) |
| Email Sending, Replies, And Forwarding | 4 | Send new messages, reply, reply-all, and forward from an inbox. | [Details](api-uses/email-sending-replies-and-forwarding.md) |
| Draft Review And Scheduled Sending | 13 | Create, review, update, schedule, cancel, and send drafts before email leaves an inbox. | [Details](api-uses/draft-review-and-scheduled-sending.md) |
| Thread Search And Conversation State | 12 | List and fetch conversations across inbox, pod, or organization scope, including messages and attachments. | [Details](api-uses/thread-search-and-conversation-state.md) |
| Recipient Policy Lists | 12 | Manage send, receive, and reply allow/block lists at organization, pod, and inbox scope. | [Details](api-uses/recipient-policy-lists.md) |
| Domain Setup And Deliverability | 13 | Configure custom domains, DNS records, zone files, verification, and feedback behavior. | [Details](api-uses/domain-setup-and-deliverability.md) |
| Usage Metrics And Activity Reporting | 3 | Query time-bucketed sent, delivered, bounced, delayed, rejected, complained, and received counts. | [Details](api-uses/usage-metrics-and-activity-reporting.md) |
| API Key Access Control | 6 | List, create, and delete organization or pod-scoped API keys with least-privilege permissions. | [Details](api-uses/api-key-access-control.md) |
| Pod And Organization Administration | 5 | Inspect organization limits and manage pods as tenant or workspace boundaries. | [Details](api-uses/pod-and-organization-administration.md) |

## Highest-Value Uses

1. Tenant-isolated agent email infrastructure. Create one pod per customer, workspace, or agent team, then provision pod-scoped inboxes, domains, lists, API keys, drafts, threads, and metrics under that boundary.

2. Durable agent identities. Give each agent a persistent `inbox_id`, `email`, `display_name`, and optional `client_id` so it can participate in normal email workflows without borrowing a human mailbox.

3. Human-reviewed outbound automation. Let agents create drafts, attach files, set labels, schedule `send_at`, and route drafts through organization or pod review before a paid send occurs.

4. Controlled autonomous sending. Combine send/reply/forward endpoints with allow/block lists, label-based state, recipient limits, and draft idempotency to reduce duplicate or unauthorized outbound email.

5. Customer-support and account-management workflows. Use threads for full conversation context, labels for queue state, replies for continuity, and metrics for workload and delivery health.

6. Branded deliverability operations. Configure organization or pod-scoped domains, publish DNS records, verify status, monitor record drift, and rotate inboxes across verified domains.

7. Audit, compliance, and debugging. Preserve normalized message fields, raw `.eml` download descriptors, attachment metadata, key inventory, policy lists, and time-bucketed delivery metrics.

## Personal Use Opportunities

- Personal AI mailbox. Create a stable inbox for a personal assistant so services, vendors, or correspondents can email the agent directly.
- Email triage and follow-up. Poll unread messages, fetch full threads, label items as `processed`, `needs-human-review`, or `follow-up`, and draft responses for approval.
- Scheduled reminders through email. Create future-dated drafts for follow-ups, renewals, travel planning, job applications, or household administration, then cancel them if a reply arrives first.
- Safer outbound assistance. Use drafts instead of direct sends for sensitive messages, and use send/reply allowlists so the assistant can only contact approved addresses or domains.
- Personal archive and evidence capture. Record message metadata, raw message descriptors, attachment filenames, sizes, content types, and expiring download URLs for later review.
- Custom-domain agent identity. A personal domain can make an assistant's email address more recognizable than the default shared AgentMail domain, assuming domain limits and DNS setup are acceptable.

## Business Use Opportunities

- Multi-tenant agent platform. Map each customer to a pod, use `client_id` for idempotent provisioning, issue pod-scoped API keys, and isolate customer threads, drafts, domains, metrics, and lists.
- AI customer support. Read inbound messages, classify and label threads, draft or send replies, forward escalations, and monitor response volume by inbox or pod.
- Sales, recruiting, and partnerships. Provision campaign inboxes, use verified domains, constrain outbound recipients with send allowlists, track replies by thread, and use scheduled drafts for follow-ups.
- Compliance-first outbound workflows. Require draft review for regulated or high-risk messages, preserve raw message records, and use label state to prove review and send decisions.
- Deliverability operations. Monitor bounced, complained, rejected, delayed, delivered, sent, and received metrics, then adjust domains, recipient lists, and sending cadence.
- Tenant onboarding and offboarding. Create pods, domains, inboxes, and keys during onboarding; delete or rotate child resources carefully during offboarding.
- Least-privilege operations. Separate runtime mail agents from platform operators by issuing scoped keys with only the permissions needed for message, draft, domain, list, metrics, or pod work.

## Endpoint Group Summaries

### Inbox Provisioning And Agent Identity

This group is the foundation for AgentMail use: it creates and maintains the inbox resource that represents an agent's email identity. It supports organization-wide and pod-scoped inbox CRUD, optional `username` and verified `domain`, human-facing `display_name`, and `client_id` for idempotent provisioning and internal mapping. Full details: [api-uses/inbox-provisioning-and-agent-identity.md](api-uses/inbox-provisioning-and-agent-identity.md).

### Message Reading And Labeling

This group turns inbound email into processable work. Agents can list messages by inbox, filter by labels and time, fetch full content, retrieve attachment/raw-message download descriptors, and patch labels to advance workflow state. It is central for triage, evidence preservation, duplicate-processing guards, and human escalation queues. Full details: [api-uses/message-reading-and-labeling.md](api-uses/message-reading-and-labeling.md).

### Email Sending, Replies, And Forwarding

This group is the direct outbound communication surface. It supports new sends, replies, reply-all, and forwards, returning `message_id` and `thread_id` for downstream tracking. It is valuable for support, sales, recruiting, escalation, and transactional mail, but duplicate-send prevention has to be handled by application state or the draft workflow. Full details: [api-uses/email-sending-replies-and-forwarding.md](api-uses/email-sending-replies-and-forwarding.md).

### Draft Review And Scheduled Sending

This group provides the safest path for agent-written email. Drafts can hold recipients, subject, body, labels, attachments, `client_id`, `in_reply_to`, and `send_at`, then be listed across inbox, organization, or pod scopes for review. Sending a draft returns `message_id` and `thread_id`; deleting a scheduled draft is the documented cancellation path. Full details: [api-uses/draft-review-and-scheduled-sending.md](api-uses/draft-review-and-scheduled-sending.md).

### Thread Search And Conversation State

This group provides conversation-level context across one inbox, one pod, or the whole organization. List endpoints support label and time filters, while get endpoints return ordered `messages[]` for summarization and reply planning. Despite the group name, current fields expose filter-based retrieval rather than free-text or semantic search. Full details: [api-uses/thread-search-and-conversation-state.md](api-uses/thread-search-and-conversation-state.md).

### Recipient Policy Lists

This group is the main safety and governance layer for who agents may send to, receive from, or reply to. Lists operate at organization, pod, and inbox scope, with `send`, `receive`, and `reply` directions and `allow` or `block` types. Scope precedence matters: inbox rules override pod and organization rules, and pod rules override organization rules. Full details: [api-uses/recipient-policy-lists.md](api-uses/recipient-policy-lists.md).

### Domain Setup And Deliverability

This group supports branded and deliverable agent email. It covers custom domain creation, DNS record inspection, binary zone-file downloads, verification triggers, per-record status, and pod-scoped feedback behavior. It is especially important for SaaS tenants, production outreach, and domain reputation monitoring. Full details: [api-uses/domain-setup-and-deliverability.md](api-uses/domain-setup-and-deliverability.md).

### Usage Metrics And Activity Reporting

This group provides read-only activity reporting at organization, pod, and inbox scope. Metrics are time-bucketed counts for message sent, delivered, bounced, delayed, rejected, complained, and received events. The outputs are not billing totals or message-level logs, but they are useful for deliverability dashboards, incident detection, workload reporting, and MPP spend planning. Full details: [api-uses/usage-metrics-and-activity-reporting.md](api-uses/usage-metrics-and-activity-reporting.md).

### API Key Access Control

This group manages organization and pod API keys. Create responses include the one-time `api_key` secret, while list responses expose metadata such as `api_key_id`, `prefix`, `name`, `used_at`, and permissions. The permission model is whitelist-based when `permissions` is present; omitting it grants full access within scope, which is high-risk for autonomous agents. Full details: [api-uses/api-key-access-control.md](api-uses/api-key-access-control.md).

### Pod And Organization Administration

This group supplies the tenant/workspace control plane. Pods provide isolation between an organization and inboxes, while the organization endpoint reports usage counts, optional limits, billing metadata, and authentication metadata. Creating pods with deterministic `client_id` is the cleanest onboarding pattern for SaaS customer workspaces. Full details: [api-uses/pod-and-organization-administration.md](api-uses/pod-and-organization-administration.md).

## Field And Data Themes

- Identity fields: `organization_id`, `pod_id`, `inbox_id`, `email`, `domain_id`, `thread_id`, `message_id`, `draft_id`, `attachment_id`, `api_key_id`, `client_id`, and list `entry`.
- State fields: `labels`, `send_status`, `status`, `records[].status`, `feedback_enabled`, `used_at`, `created_at`, `updated_at`, `timestamp`, `send_at`, `received_timestamp`, and `sent_timestamp`.
- Email content fields: `from`, `reply_to`, `to`, `cc`, `bcc`, `subject`, `preview`, `text`, `html`, `extracted_text`, `extracted_html`, `headers`, `attachments`, `in_reply_to`, and `references`.
- Scope model: most operational surfaces exist at inbox, pod, or organization scope. Pods are the key tenant boundary, while inboxes are the key agent identity boundary.
- Idempotency theme: `client_id` is important for create operations such as inboxes, pods, and drafts. Direct sends do not expose the same duplicate-send guard.
- Label theme: labels act as state for read/unread, processing, escalation, campaign, spam, blocked, trash, scheduled, and custom workflow states.
- Attachment theme: message, thread, and draft attachment reads generally return metadata with `download_url` and `expires_at`; outgoing attachments can use Base64 content and optional file metadata.
- Metrics theme: reporting is count-based and event-type-based, not recipient-level, content-level, or cost-level.
