# Onboarding Updates

This document summarizes the onboarding updates made to the 8-step setup flow.

## Step 1 — Your Church

- Collects the church’s basic information, including the church name.
- The church name is reused later in the onboarding flow, including the Connection Card Consent Wording.

## Step 2 — Reading Your Site

- Reviews the church information and service details gathered from the church website.

## Step 3 — What You Need

- Lets the church choose the goals and follow-up needs that matter most during setup.

## Step 4 — Connect Systems

- Handles the church’s connected systems and communication setup.

## Step 5 — Guardrails

- The escalation topics description now says:
  > Choose which topics get routed to a pastor immediately.
- Escalation topics start with nothing selected by default.
- Churches can choose the specific topics that should be routed to a pastor.

## Step 6 — Team & Escalations

### Staff Alerts

- Staff Alerts can be enabled for SMS notifications when escalations occur.
- The section now lets users select the specific staff members who should receive alerts.
- Each selected staff member has an individual editable mobile number field.
- The consent message refers to selected staff members and their listed mobile numbers.

## Step 7 — First Message

### Choose tone

- The section label was changed from “Choose a template” to “Choose tone.”
- Existing message choices and message editing remain available.

### Connection Card Consent Wording

- The consent wording is now editable directly in the onboarding screen.
- The church name comes from the church name entered earlier in Step 1.
- If the church name changes earlier in onboarding, the consent wording updates automatically.
- Edited consent wording is saved with the onboarding state.
- The Copy action copies the current edited consent wording.

## Step 8 — Ready Check

### Approval Mode

- The setup option was renamed from “Start in Shadow Mode” to “Start in Approval Mode.”
- The action label was also changed to “Start in Approval Mode.”
- The approval workflow remains the same: messages are written and held for review before sending.

## Notes for VS Code

- The onboarding flow currently persists its setup state in browser storage.
- The changes are intended to preserve the existing onboarding behavior while making the requested labels, selections, staff alert controls, and consent wording editable.
