export function filterUndefinedFields(data: Record<string, any>): Record<string, any> {
  return Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== undefined));
}