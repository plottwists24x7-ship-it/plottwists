export type ClassValue = string | number | boolean | undefined | null | Record<string, boolean>;

/**
 * Clean, lightweight classname concatenator supporting conditional objects and strings.
 */
export function cn(...inputs: ClassValue[]): string {
  const result: string[] = [];
  for (const c of inputs) {
    if (!c) continue;
    if (typeof c === "string") {
      result.push(c);
    } else if (typeof c === "number") {
      result.push(String(c));
    } else if (typeof c === "object") {
      for (const [key, value] of Object.entries(c)) {
        if (value) {
          result.push(key);
        }
      }
    }
  }
  return result.filter(Boolean).join(" ");
}
