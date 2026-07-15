# STORY-023 — Language localization

**Status:** ready  
**Dependencies:** STORY-005, STORY-022

## Story

As a user, I want to change the website/app language so all visible labels, messages, and country names are understandable in my preferred language.

## Scope

- Add an application language setting with at least English, Portuguese, and Spanish support.
- Localize public, authenticated, and onboarding screens.
- Review every visible field label, placeholder, button, helper text, validation message, empty state, loading state, and navigation label.
- Localize country names in the onboarding country field/dropdown while still submitting and storing ISO 3166-1 alpha-2 country codes.
- Register and use the relevant `i18n-iso-countries` locales for country labels.
- Persist the selected language locally so reopening the app keeps the same language.
- Provide a fallback language when a translation key is missing.
- Keep API contracts language-neutral unless a response explicitly needs localized text.

## Out of scope

- Translating legal terms content; STORY-020 owns terms acceptance and versioning.
- Translating user-generated content.
- Changing database country storage away from ISO alpha-2 codes.
- Server-side email/template localization unless a later story adds those templates.

## Acceptance criteria

- Users can switch language between English, Portuguese, and Spanish.
- Navigation labels, page titles, form labels, placeholders, helper text, validation errors, loading states, and empty states use translation keys instead of hardcoded copy.
- The country field displays localized country names for the selected language.
- Changing language updates visible copy without changing the stored country code.
- The selected language survives app reload.
- Tests cover language selection, representative screen translations, validation-message translations, and localized country labels.

## Verification

Run mobile unit tests, country helper tests, lint, and the mobile build. Manually verify the onboarding flow in each supported language.
