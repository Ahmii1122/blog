export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const STATUSES = [
  { value: "unsolved", label: "Unsolved" },
  { value: "solved", label: "Solved" },
  { value: "ongoing", label: "Ongoing" },
] as const;

export const PERSON_ROLES = [
  { value: "victim", label: "Victim" },
  { value: "suspect", label: "Suspect" },
  { value: "investigator", label: "Investigator" },
  { value: "witness", label: "Witness" },
  { value: "other", label: "Other" },
] as const;

export function statusLabel(status: string) {
  return STATUSES.find((item) => item.value === status)?.label ?? status;
}

export function roleLabel(role: string) {
  return PERSON_ROLES.find((item) => item.value === role)?.label ?? role;
}
