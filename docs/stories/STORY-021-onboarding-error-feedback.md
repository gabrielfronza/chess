# STORY-021 — Onboarding error feedback

**Status:** ready  
**Dependencies:** STORY-005

## Story

As a user completing onboarding, I want clear field-level feedback so I know exactly which profile field needs correction.

## Scope

- Improve the `Set up your profile` page error experience.
- Show field-level validation messages for display name, country, and date of birth.
- Preserve a page-level fallback error for unexpected failures.
- Map backend validation errors to the corresponding mobile form fields.
- Keep frontend validation aligned with backend validation instead of inventing separate rules.
- Ensure incomplete required fields are visibly identified before and after submit.

## Out of scope

- Changing onboarding fields or persistence rules.
- Terms acceptance, which belongs to STORY-020.
- Replacing the form with a new design system or form library unless explicitly approved during implementation.

## Acceptance criteria

- Empty required fields show clear messages next to the field that needs input.
- Backend validation failures identify the rejected field whenever the API response provides enough detail.
- Date-of-birth validation communicates the expected format and age-policy failure clearly.
- Country validation explains that users can search by country name or ISO code and must choose a valid country.
- The submit button does not silently fail or show only a generic message when field-specific guidance is available.
- Tests cover frontend-required validation, backend field-error mapping, and the unexpected-error fallback.

## Verification

Run mobile unit tests for the onboarding screen and API validation tests for onboarding profile updates.
