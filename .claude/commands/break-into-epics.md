# Break Into Epics

Break a feature or PRD into engineering epics, stories, and tasks.

## Instructions

1. Read the relevant PRD or feature description: $ARGUMENTS
2. Use the **engineering-planner** agent to decompose the work
3. Read the user story template at `docs/templates/USER-STORY.md` for formatting guidance
4. For each epic, produce:
   - Epic title and goal
   - 3-8 user stories with acceptance criteria
   - Complexity estimates (S/M/L/XL)
   - Dependencies between stories
   - Suggested sequencing (what can be parallelized)
5. Identify any technical spikes that need investigation first
6. Save the breakdown to `docs/epics/EPIC-<feature-name>.md`

## Output

Produce a structured epic breakdown. Include a recommended sprint plan or sequencing diagram showing the critical path.
