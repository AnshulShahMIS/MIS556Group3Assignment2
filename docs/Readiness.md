# Career Compass readiness

Reviewed October 29, 2026. Version 0.4.0 connects one AI career coach to the local chat. The assignment is not complete overall because online hosting and final submission/presentation work remain.

| Area | Current state |
| --- | --- |
| Student career web app | Conversational resume review, job comparison, planning and interview coaching implemented locally |
| Upload/entered documents | PDF/DOCX/TXT/MD and pasted resume/job text; extraction limitations disclosed |
| AI-assisted coding | Implemented; group should explain code and design decisions |
| Single agent | Responses API adapter connected to bounded runtime and chat, with five tools and visible actual tool activity |
| RAG | Model-selected BM25 search supplies passages to generation; structured selected IDs are validated and displayed |
| Live AI checks | Small synthetic runs include interview drafting, comparison, planning and an injected document instruction; see evaluation records |
| Automated checks | 83 tests passed; provider protocol tests use mocked HTTP |
| Privacy | AI transmission notice and server-side key loading implemented; keys excluded from release |
| Online hosting | Pending; loopback is not online hosting. Prior deployment-helper input was rejected by automatic approval review |
| Practical usefulness | Student needs inform features, but no actual student feedback collected |
| Presentation | Five-minute draft script; final slides/demo and rehearsal pending |

## Remaining work
Deploy a hosting-compatible backend and frontend, verify instructor access, test broader conversations and citation relevance, collect actual student task feedback if possible, and finalize the presentation and November 5 submission. Model cost should be measured from actual usage and the applicable pricing, rather than inferred from the number of tests. Current responses report token counts and time, not dollar estimates.

Known source IDs do not establish that a source supports a claim. A development test produced a weakly relevant citation during resume review; this remains a quality issue to evaluate. Prompt instructions and tool bounds do not guarantee immunity to malicious document instructions. No job-outcome, fairness, general accuracy or security claims are established.

The document permits one or multiple career needs. Offer evaluation, a job-search database, multiple agents, OCR, accounts and a vector database are optional extensions, not missing explicit requirements. Real student testing strengthens the graduate-level evidence but is not an explicit separate deliverable in the supplied DOCX.
