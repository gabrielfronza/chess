# Backlog

Initial status for every story: `ready`, subject to the declared dependencies.

| ID | Title | Depends on |
|---|---|---|
| 001 | Quality, configuration, and contracts | — |
| 002 | Database and model | 001 |
| 003 | Mobile shell and navigation | 001 |
| 004 | Auth0 authentication | 002, 003 |
| 005 | Profile and onboarding | 004 |
| 006 | Lichess OAuth | 005 |
| 007 | Tournament administration | 002, 004 |
| 008 | Marketplace and details | 003, 007 |
| 009 | Wallet and ledger | 002, 004 |
| 010 | Stripe and credit purchases | 009 |
| 011 | Transactional registration | 006, 007, 009 |
| 012 | Authenticated home | 008, 009, 011 |
| 013 | Results and prizes | 011 |
| 014 | History | 003, 013 |
| 015 | Withdrawal request | 009 |
| 016 | Operations, security, and auditing | 006, 010, 013, 015 |
| 017 | E2E and release | 012, 014, 016 |
| 018 | Public landing page | 003 |

Each story includes an objective, scope, acceptance criteria, tasks, and verification. Technical details may change during implementation, but changing invariants or acceptance criteria requires an explicit decision.
