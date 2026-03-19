export const nowIso = (): string => new Date().toISOString();

const fallbackRandomId = (): string => {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};

export const createDocumentId = (prefix: string): string => {
  const uuid = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : fallbackRandomId();
  return `${prefix}-${uuid}`;
};
