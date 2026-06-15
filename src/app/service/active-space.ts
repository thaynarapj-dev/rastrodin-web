let activeSpaceId: string | null = null;

export function setActiveSpaceId(spaceId: string | null) {
  activeSpaceId = spaceId;
}

export function getActiveSpaceId() {
  return activeSpaceId;
}

export function getActiveSpaceFilter() {
  return activeSpaceId ? { space_id: `eq.${activeSpaceId}` } : null;
}

export function withActiveSpace<T extends Record<string, unknown>>(payload: T) {
  return activeSpaceId ? { ...payload, space_id: activeSpaceId } : payload;
}
