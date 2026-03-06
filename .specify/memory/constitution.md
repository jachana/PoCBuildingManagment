<!--
  Sync Impact Report
  ===================
  Version change: 0.0.0 → 1.0.0 (MAJOR - initial ratification)
  Modified principles: N/A (initial creation)
  Added sections:
    - Core Principles (5 principles)
    - Technology & Platform Constraints
    - Development Workflow
    - Governance
  Removed sections: None
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ no changes needed (already generic)
    - .specify/templates/spec-template.md ✅ no changes needed (already generic)
    - .specify/templates/tasks-template.md ✅ no changes needed (already generic)
  Follow-up TODOs:
    - TECH_STACK: Framework/language decision deferred until evaluation
-->

# SocialBuildingManagment Constitution

## Core Principles

### I. Simplicity First (YAGNI)

- Every feature MUST start with the simplest viable implementation.
- No premature abstractions: code MUST NOT be generalized until a
  concrete second use case exists.
- Dependencies MUST be justified; prefer platform-native APIs over
  third-party libraries when functionality is equivalent.
- Configuration MUST use sensible defaults; expose options only when
  users demonstrably need them.

**Rationale**: A tenant/resident portal serves non-technical end users.
Complexity in the codebase translates directly to slower delivery and
harder maintenance. Build only what is needed now.

### II. Mobile-First Design

- All UI work MUST target mobile (iOS and Android) as the primary
  experience; web/PWA is a secondary development and testing surface.
- Screens MUST be designed for touch interaction, small viewports, and
  variable network conditions before adapting to larger screens.
- Navigation patterns MUST follow platform conventions (iOS Human
  Interface Guidelines, Material Design) rather than inventing custom
  paradigms.

**Rationale**: Residents interact with building services on their
phones. The mobile experience defines product quality.

### III. Resident Data Privacy

- All personally identifiable information (PII) MUST be encrypted at
  rest and in transit.
- Data collection MUST follow the principle of minimal disclosure:
  collect only what is required for a feature to function.
- Resident data MUST NOT be shared with third parties without explicit,
  revocable consent.
- Authentication MUST support secure, modern methods (e.g., OAuth 2.0,
  biometric unlock).

**Rationale**: The app handles sensitive tenant data (names, unit
numbers, payment info, access codes). Privacy is a legal and ethical
obligation.

### IV. Offline-Resilient

- Core read operations (viewing announcements, contacts, building
  info) MUST work without an active network connection using locally
  cached data.
- Write operations performed offline MUST queue and sync when
  connectivity is restored, with clear user feedback on sync status.
- The app MUST NOT crash or show empty screens when the device is
  offline; graceful degradation is required.

**Rationale**: Residents may be in basements, elevators, or areas with
poor connectivity. The app must remain useful in those conditions.

### V. Cross-Platform Consistency

- Business logic MUST be shared across iOS, Android, and Web builds
  to prevent behavioral divergence.
- Visual appearance MAY differ per platform to respect native design
  language, but feature parity MUST be maintained across all supported
  platforms.
- A single test suite MUST validate shared business logic; platform-
  specific tests cover only UI and platform integration.

**Rationale**: Residents in the same building may use different
platforms. Feature gaps between platforms create support burden and
user frustration.

## Technology & Platform Constraints

- **Target platforms**: iOS 16+, Android 13+ (API 33+), modern
  browsers (Chrome, Safari, Edge — last 2 versions) via PWA.
- **Tech stack**: TODO(TECH_STACK): Framework and language to be
  decided after evaluation (candidates: React Native, Flutter, Kotlin
  Multiplatform, or native per platform).
- **Backend**: TODO(BACKEND_STACK): To be decided. MUST expose a
  RESTful or GraphQL API with OpenAPI/schema documentation.
- **Storage**: Local device storage for offline cache; server-side
  database for authoritative data.
- **CI/CD**: Automated build and test pipeline MUST run on every PR.
  Releases MUST be gated by passing tests.

## Development Workflow

- **Branching**: Feature branches off `main`; no direct commits to
  `main`.
- **Code review**: Every PR MUST be reviewed before merge.
- **Testing**: Unit tests for business logic are expected. Integration
  tests for API contracts. E2E tests for critical user journeys (login,
  payments, announcements).
- **Commits**: Use conventional commit messages
  (`feat:`, `fix:`, `docs:`, `chore:`).
- **Documentation**: Public API changes MUST include updated docs.
  User-facing features MUST include updated spec artifacts.

## Governance

- This constitution is the authoritative reference for project
  decisions. When practices conflict with these principles, the
  constitution prevails.
- Amendments require: (1) a written proposal describing the change and
  rationale, (2) review and approval, (3) a migration plan for any
  existing code that violates the new rule.
- Version follows semantic versioning: MAJOR for principle
  removals/redefinitions, MINOR for new principles or material
  expansions, PATCH for clarifications and wording fixes.
- Compliance review: every PR MUST be checked against these principles.
  Violations MUST be resolved or documented in a Complexity Tracking
  table with justification.

**Version**: 1.0.0 | **Ratified**: 2026-03-06 | **Last Amended**: 2026-03-06
