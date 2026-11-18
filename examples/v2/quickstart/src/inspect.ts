// #region inspect
import { inspectIntuitionId } from '@0xintuition/iid';
import { classificationForIid } from '@0xintuition/iid-registry';

const iid = 'int:isrc:USRC17607839';
const inspection = inspectIntuitionId(iid);
if (!inspection.valid) throw new Error(inspection.reason);
const classification = classificationForIid(iid);
console.log(inspection.valid);
console.log(classification?.slug ?? 'No classification match');
// #endregion
