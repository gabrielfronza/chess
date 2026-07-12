# STORY-016 — Observability, security, and auditing

**Status:** ready  
**Dependencies:** STORY-006, STORY-013

## Story

As an operator, I want to detect failures and investigate sensitive actions without exposing private data.

## Scope

- Structured logs with correlation IDs and secret/PII redaction.
- Metrics and alerts for jobs, stuck registrations, and integration failures; financial alerts are extended with the financial stories.
- Rate limiting, CORS, headers, payload limits, and error management.
- Audit logs for administration, result entitlements, account links, and registration reconciliation; financial audit events are added with the financial stories.
- Reconciliation and incident-response runbooks.

## Acceptance criteria

- A journey can be traced by correlation ID.
- Tokens, secrets, full email addresses, and sensitive payloads do not appear in logs.
- Alerts cover persistent integration failures and stuck states.
- Auditing identifies the actor, action, target, time, and safe metadata.

## Verification

Run redaction/rate-limit tests and a documented external-failure simulation.
