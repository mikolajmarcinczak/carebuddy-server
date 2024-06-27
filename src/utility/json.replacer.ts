export function replacer(key: string, value: any) {
  if (typeof value === 'bigint') {
    // Convert BigInt to string:
    return value.toString();
  } else {
    return value;
  }
}