```typescript
import { createMultivault, createTripleStatement } from '@0xintuition/sdk';

void createMultivault;

type TripleCreatedEvent = Awaited<
  ReturnType<typeof createTripleStatement>
>['state'][number];
declare const event: TripleCreatedEvent;
void event.args.tripleId;
```
