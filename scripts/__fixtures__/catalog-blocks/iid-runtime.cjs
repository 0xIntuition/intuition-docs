// Small test double whose definitions are written by the fixture builder.
const { schemes, examples } = require('./definitions.json');
exports.SCHEME_NAMES = Object.keys(schemes);
exports.SCHEMES = Object.fromEntries(
  Object.entries(schemes).map(([scheme, meta]) => [
    scheme,
    {
      scheme,
      class: meta.class,
      canonicalize(value) {
        return examples[scheme] === value ? value : undefined;
      },
    },
  ]),
);
exports.inspectIntuitionId = (iid) => ({
  iid,
  valid: Object.entries(examples).some(
    ([scheme, raw]) => iid === `int:${scheme}:${raw}`,
  ),
  class: 'D',
  anchorEligible: false,
  anchorIneligibilityReason: 'provider-local',
});
