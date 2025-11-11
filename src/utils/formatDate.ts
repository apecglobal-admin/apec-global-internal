export function formatDate(isoString: string) {
    return new Date(isoString).toISOString().split('T')[0];
  }