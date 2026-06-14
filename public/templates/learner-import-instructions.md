# Bulk Learner Import — CSV Template Instructions

This template feeds the **POST /api/esol/learners/bulk-import** endpoint
(brief Function 3). Use it when on-boarding a cohort that already exists
in your MIS — typically 10 to 500 rows per upload.

If you only have a handful of learners, the referral link flow (`/join`)
is faster and the learners do their own data entry. Reach for this CSV
when the data lives in a spreadsheet today and you don't want to send a
link to every individual.

## Quick start

1. Download `learner-import-template.csv` from the org admin dashboard.
2. Keep the header row exactly as shipped — column names are case- and
   underscore-sensitive.
3. One learner per row. UTF-8 encoding. Commas inside a field must be
   wrapped in double quotes (`"O'Connor, Maria"`).
4. Save as `.csv` (not `.xlsx`). Excel's "Save As → CSV UTF-8" is the
   safest option on Windows; LibreOffice and Numbers default to UTF-8.
5. Upload via **Org Admin → Learners → Bulk Import**.

The importer validates every row up-front and refuses the whole file if
any row is invalid. You'll get a per-row error report — fix the rows and
re-upload. No partial commits.

## Column reference

| Column                 | Required                | Format                                                                        | Notes                                                                                                                                                 |
| ---------------------- | ----------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `firstname`            | yes                     | free text, max 80 chars                                                       | trimmed                                                                                                                                               |
| `lastname`             | yes                     | free text, max 80 chars                                                       | trimmed                                                                                                                                               |
| `date_of_birth`        | yes                     | `YYYY-MM-DD`                                                                  | learner must be ≥ 16 on `enrolment_date`                                                                                                              |
| `nationality`          | yes                     | free text                                                                     | country of nationality, not country of birth                                                                                                          |
| `l1_language`          | yes                     | one of: `Arabic`, `Somali`, `Dari`, `Pashto`, `Cantonese`, `English`, `Other` | case-insensitive on import; the wizard uses this to pick the UI language going forward                                                                |
| `postcode_prior`       | yes                     | UK postcode, e.g. `M1 1AE`                                                    | the postcode **before** the learner joined the programme — used for SOF / MCA funding routing. **Do not** put the org's postcode here.                |
| `uln`                  | no                      | exactly 10 digits                                                             | leave blank if not yet known. Row will land with `uln_status = "pending"`.                                                                            |
| `esol_level_at_import` | yes                     | one of: `e1`, `e2`, `e3`, `l1`, `l2`                                          | the learner's ESOL level as last assessed — placement assessment still runs but seeds from this value                                                 |
| `enrolment_date`       | yes                     | `YYYY-MM-DD`                                                                  | the date the learner started with you (not today's upload date). Used as the ILR `Learning Start Date`.                                               |
| `employment_status`    | yes                     | one of: `unemployed`, `employed`, `self_employed`, `not_in_labour_market`     | maps directly to the ILR EmpStat field                                                                                                                |
| `lldd_health_prob`     | **yes — never default** | `1` = yes, `2` = no, `9` = prefer not to say                                  | **must be sourced from the learner** — see warning below                                                                                              |
| `aim_type`             | yes                     | `regulated` or `non_regulated`                                                | determines whether AddHours can later be claimed — see warning below                                                                                  |
| `email`                | no                      | RFC-valid email                                                               | leave blank for learners who don't use email. The importer generates a placeholder `learner-{slug}@esol-placeholder.local` per the registration flow. |

## Critical warnings

### `lldd_health_prob` — never default

The Learning and Skills (LLDD) declaration is a **legal disclosure by the
learner**. If you don't have an answer, leave the cell blank and the
importer will reject the row — **do not** fill in `2` ("no") as a
default. Defaulting to "no" misrepresents the learner's disclosure to
the ESFA and is treated as a data-integrity breach during audit.

If a learner declines to answer, use `9` ("prefer not to say"). That is
a valid answer; `2` is not.

### `aim_type` — pick deliberately

This single column decides whether you can claim AddHours funding for
this learner in a future ILR submission window.

- `regulated`: the learner is enrolled on a regulated qualification
  (e.g. an ESOL qualification on Ofqual's register). AddHours can be
  claimed against this aim per the ASF rules.
- `non_regulated`: the learner is on a non-regulated provision (e.g. a
  community ESOL course not against a regulated qual). AddHours
  **cannot** be claimed and any attempt to add them later will be
  blocked by the green-light validator.

You can switch a learner from non-regulated to regulated later by
adding a regulated aim — but you cannot retroactively claim AddHours on
sessions that completed under a non-regulated aim. Get this right at
import time.

### `postcode_prior` — the postcode the learner lived at before joining

The ASF funding routing (SOF, LDM, MCA) is driven entirely by this
field. If the learner has moved, use the postcode they lived at on the
date they enrolled, **not** their current address. Putting the
organisation's postcode here misroutes funding and triggers a
manual-review hold.

If the postcode isn't in the DfE dataset, the row still imports — the
learner lands with `funding_status = "manual_review"` and the org admin
gets a notification to chase before the next ILR submission window.

## Example row

```csv
firstname,lastname,date_of_birth,nationality,l1_language,postcode_prior,uln,esol_level_at_import,enrolment_date,employment_status,lldd_health_prob,aim_type,email
Aamina,Hassan,1995-04-12,Somali,Somali,M1 1AE,1234567890,e2,2026-01-15,unemployed,2,regulated,aamina.hassan@example.org
```

This learner is a 30-year-old Somali woman, L1 Somali, living at M1 1AE
(Manchester city centre — routes to GMCA), provided her ULN, was last
placed at E2, enrolled on 15 January 2026, currently unemployed,
declared no LLDD condition, enrolled on a regulated ESOL qualification,
contactable by email.

## What happens after upload

1. Importer validates every row. Any failure → whole file rejected,
   per-row error report shown.
2. On success, every row becomes a `User` (role = `student`) attached
   to your org, with the same downstream behaviour as a wizard-onboarded
   learner:
   - postcode → SOF routing
   - `funding_status` set to `fundable` or `manual_review`
   - `AuditLog` entry per learner with action `learner_registered` and
     `reason: "Bulk import"`
   - manual-review learners trigger an org-admin notification
3. Learners receive an email if `email` was provided, with a one-time
   link to set a password and complete the ULN and eligibility steps.
   Learners without an email skip that step — they hit the wizard the
   first time the org admin links them to a session.

## Limits

- Up to **500 rows** per file. Larger cohorts: split into multiple
  files.
- File size capped at **2 MB** at the upload layer.
- One import job per org at a time. The button is disabled while a job
  is in flight.

## Support

Questions or rejected files? Email `support@ambertraining.co.uk` with
the row numbers from the error report — do **not** attach the CSV
itself, it contains personal data.
