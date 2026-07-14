# Claire Watson — TM Forum Prospecting Engine

Three-agent pipeline that researches a target operator and produces a prospect brief + outreach email ready for Claire to use.

## How to Run

Open Claude Code in the `ClaireWatsonTMF` directory and run the three agents in sequence:

**Step 1 — Research**
```
Use the tmf-researcher agent to research [Company Name]
```

**Step 2 — Strategy**
```
Use the tmf-strategist agent to build a strategy for [Company Name]
```

**Step 3 — Write**
```
Use the tmf-writer agent to produce the brief and email for [Company Name]
```

Each step must complete before the next begins — each agent reads the previous agent's output.

## Output Location
All files land in `prospecting/prospects/[company-slug]/`:
- `01-research.md` — intelligence brief + prospect score
- `02-strategy.md` — ODA mission fit, entry point, objections
- `03-brief.md` — one-page call prep reference
- `04-email.md` — ready-to-send outreach email in Claire's voice

## Context Files
- `context/tmf-value-prop.md` — TM Forum's full value proposition
- `context/ideal-prospect-profile.md` — scoring model for prospect quality
- `context/claires-voice.md` — Claire's tone and email writing rules
