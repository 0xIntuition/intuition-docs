```mermaid
flowchart LR
  primitives["Protocol primitives"] --> identity["Intuition Identifier"] --> processing["Classification and enrichment"] --> writes["Protocol writes"] --> querying["Indexing and querying"]
  semantic["Semantic / data modeling"] -.-> primitives
  builders["Builder helpers"] -.-> primitives
  ids["Identity packages"] -.-> identity
  runtime["Pipeline runtime"] -.-> processing
  atoms["Atom processing"] -.-> processing
  app["Application integration"] -.-> writes
  protocol["Protocol plumbing"] -.-> writes
  core["Intuition Core"] -.-> querying
  core -.-> processing
```

Protocol primitives is ladder Tier 1, Intuition Identifier is Tier 2 (Identity), Classification and enrichment spans Tiers 3 and 4 (Meaning, Processing), and Protocol writes and Indexing and querying are Tier 5 (Data flow).
