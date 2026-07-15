# Backlog

Stories begin as `ready`, subject to their declared dependencies. Their individual files are the source of truth for current status.

| ID | Title | Depends on |
|---|---|---|
| 001 | Quality, configuration, and contracts (`done`) | — |
| 002 | Database and model | 001 |
| 003 | Mobile shell and navigation | 001 |
| 004 | Auth0 authentication | 002, 003 |
| 005 | Profile and onboarding (`done`) | 004 |
| 006 | Lichess OAuth | 005 |
| 007 | Tournament administration | 002, 004 |
| 008 | Marketplace and details | 003, 007 |
| 009 | Wallet and ledger | 002, 004, 017 |
| 010 | Stripe and credit purchases | 009 |
| 011 | Free tournament registration | 006, 007 |
| 012 | Authenticated home | 008, 011 |
| 013 | Results and prize entitlements | 011 |
| 014 | History | 003, 013 |
| 015 | Withdrawal request | 009 |
| 016 | Operations, security, and auditing | 006, 013 |
| 017 | E2E and release | 012, 014, 016 |
| 018 | Public landing page | 003 |
| 019 | Paid tournament registration rollout | 009, 010, 011, 013, 016, 017 |
| 020 | Terms acceptance | 005 |
| 021 | Onboarding error feedback | 005 |
| 022 | Country dropdown | 005 |
| 023 | Language localization | 005, 022 |
| 024 | Mobile UI copy and header cleanup | 003, 004, 005 |

Each story includes an objective, scope, acceptance criteria, tasks, and verification. Technical details may change during implementation, but changing invariants or acceptance criteria requires an explicit decision.
