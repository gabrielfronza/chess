# STORY-022 — Country dropdown

**Status:** ready  
**Dependencies:** STORY-005

## Story

As a user completing onboarding, I want to choose my country from a real dropdown so I do not need to guess the expected country format.

## Scope

- Replace the free-text country input on `Set up your profile` with an accessible dropdown/select experience.
- Keep storing ISO 3166-1 alpha-2 country codes in API requests and persistence.
- Continue using `i18n-iso-countries` as the country-name source unless implementation discovers a better approved option.
- Support searching or filtering countries when the list is long.
- Show the selected country by localized display name while submitting the stable ISO code.
- Preserve compatibility with STORY-021 field-level error feedback when both stories are implemented.

## Out of scope

- Changing the backend country storage format.
- Adding a full app-wide localization system.
- Adding profile fields beyond country selection.

## Acceptance criteria

- The country field is not a plain free-text input.
- Users can select a valid country without knowing its ISO code.
- The submitted payload still sends the ISO alpha-2 code, for example `BR`.
- The selected country remains visible after selection.
- Invalid or missing selection states are accessible and test-covered.
- Mobile unit tests cover opening the dropdown, selecting a country, and submitting the ISO code.

## Verification

Run mobile onboarding screen tests, country helper tests, lint, and the mobile build.
