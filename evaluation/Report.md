# Career Compass regression evaluation

22 authored synthetic regression cases. Cases were used during development; this is not a held-out benchmark, model evaluation, or student usability study.

Positive-evidence checks: baseline 11/22; updated 22/22.
Evidence-status checks: 22/22.
Average measured local comparison time: 1.695 ms.
One local run per case, excluding file parsing, browser rendering, network and AI. Hardware dependent; not a production SLA.

No AI calls, citation-grounded generation evaluation, or actual student usability sessions were performed.

| Case | Baseline | Updated | Status |
| --- | --- | --- | --- |
| explicit-no-experience | Fail | Pass | Pass |
| list-negation | Fail | Pass | Pass |
| never-used | Fail | Pass | Pass |
| unfamiliar | Fail | Pass | Pass |
| do-not-know | Fail | Pass | Pass |
| learning-intent | Fail | Pass | Pass |
| listed-skill | Pass | Pass | Pass |
| project-example | Pass | Pass | Pass |
| contrast-positive | Pass | Pass | Pass |
| contrast-negative | Fail | Pass | Pass |
| conflicting-evidence | Fail | Pass | Pass |
| analysis-alias | Fail | Pass | Pass |
| dashboard-alias | Fail | Pass | Pass |
| team-alias | Fail | Pass | Pass |
| language-boundary | Pass | Pass | Pass |
| nosql-boundary | Pass | Pass | Pass |
| cplusplus-symbol | Pass | Pass | Pass |
| csharp-symbol | Pass | Pass | Pass |
| absent-skill | Pass | Pass | Pass |
| preferred-heading | Pass | Pass | Pass |
| required-heading | Pass | Pass | Pass |
| optional-inline | Pass | Pass | Pass |

These results demonstrate regression behavior on known examples, not general accuracy. Complex negation and ambiguous evidence remain manual-review cases.