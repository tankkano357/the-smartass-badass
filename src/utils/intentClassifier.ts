import { IntentType } from '../types';

const rules: Record<IntentType, RegExp> = {
  PROCEDURE: /\b(how|replace|remove|install|adjust|procedure|steps?)\b/i,
  TORQUE_SPEC: /\b(torque|ft-lb|nm|tighten)\b/i,
  FLUID_SPEC: /\b(fluid|oil|capacity|dot\s?5|viscosity)\b/i,
  DIAGNOSTIC_CODE: /\b(dtc|code|p0\d{3}|diagnostic)\b/i,
  MAINTENANCE_INTERVAL: /\b(interval|service|miles|schedule|due)\b/i,
  PART_REFERENCE: /\b(part|oem|number|reference|seal|gasket)\b/i,
  OTHER: /.*/i
};

export const classifyIntent = (query: string): IntentType => {
  const found = (Object.entries(rules) as Array<[IntentType, RegExp]>).find(
    ([intent, regex]) => intent !== 'OTHER' && regex.test(query)
  );
  return found?.[0] ?? 'OTHER';
};
