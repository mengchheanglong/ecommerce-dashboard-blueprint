# Angkoro Admin Prototype v2 — Dogfood QA Report

## Scope

Source-traced QA and production smoke verification for `admin/prototype-v2` against the PRD v5.3 rules, with focus on state mutation, permissions, auditability, record integrity, navigation, and sensitive workflows.

The prototype remains mock-only: no backend, authentication, persistence, or real money movement is introduced. State resets on refresh by design.

## Resolved findings

| ID | Finding | Result |
|---|---|---|
| BUG-1 | Store and settlement record pages read stale seed data | Fixed: list/detail/merchant-view paths use live mock state. |
| BUG-2 | Admin could not view Plans because the page required `plan.manage` | Fixed: `plan.view` is separate; editing remains `plan.manage` / Super Admin. |
| BUG-3 | No Banned lifecycle action | Fixed: scoped Ban/Restore controls with reason, permission, audit, and session handling. |
| BUG-4 | Case IDs depended on mutable array length | Fixed: next numeric suffix is allocated from the current maximum. |
| BUG-5 | Multi-kind user status actions could cascade across access types | Fixed: access-kind selection and scoped status mutation preserve R3.13. |
| BUG-6 | DataTable row links were mouse-only | Fixed: href rows expose keyboard focus, link semantics, and Enter/Space activation. |
| BUG-7 | Order Issues had no reachable investigation/correction action | Fixed: live rows, permission `orderissue.correct`, audited `Open → Investigating → Resolved` transitions, and reasoned confirmation dialogs. |
| BUG-8 | Controlled export hook had no UI caller | Assessed as a prototype limitation: `runExport` and `export.run` remain audit/permission seams, while actual file generation is explicitly out of scope. No standalone Export module was invented. |
| BUG-9 | Recovery/order records referenced missing support cases | Fixed: `CASE-4402` and `CASE-4415` now exist in seed data and resolve through links. |

Additional hardening included payment matching, merchant-refund recording without money movement, billing correction guards, settlement evidence validation, recovery evidence/session guards, admin self-disable protection, administrator re-enable, duplicate invite rejection, audit session labeling, double-submit protection, reason length limits, and session-count updates after revocation.

## Verification

Canonical project gates, run independently after the final fix:

- `npm run typecheck` — exit 0
- `npm run lint` — exit 0
- `npm run build` — exit 0

The production build generated all 17 routes. It emits one known Recharts warning about a chart container reporting width/height `-1`; this does not fail the build.

## Production route smoke

A clean `next start` server was run on port `3030`.

Expected-valid routes returned `200`, including:

- `/`
- `/users`, `/users/USR-2331`
- `/support`, `/support/CASE-4417`
- `/stores`, `/stores/STR-1158`, `/stores/STR-1158/merchant-view`
- `/payments`, `/billing`, `/plans`, `/analytics`, `/order-issues`
- `/settlements`, `/settlements/STL-3081`, `/settlement-accounts`
- `/admin-accounts`, `/security`, `/account-recovery`, `/operational-health`

Expected-invalid routes returned `404`:

- `/users/USR-9999`
- `/support/CASE-0000`
- `/stores/STR-0000`
- `/settlements/SET-0000`
- `/support-access`

No non-404 failures, application-error markers, or Next.js digest markers were found in the sweep.

## Security/source checks

The staged prototype snapshot was checked for:

- hardcoded secret assignments — none found
- shell injection patterns — none found
- dangerous `eval`/`exec` calls — none found
- unsafe pickle deserialization — none found
- `.env`, build, dependency, coverage, or QA artifacts accidentally staged — none found

## Limitations

- Typed browser interaction testing could not be completed because the isolated browser process did not expose a bindable native window; the existing user Chrome window was not modified. Therefore this report does not claim complete visual or button-by-button browser coverage.
- File-generation exports remain intentionally out of scope for this UI prototype.
- The parent worktree contains unrelated documentation/visual changes; they were deliberately excluded from the prototype commit.
