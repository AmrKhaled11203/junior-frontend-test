/**
 * Combine address fields into a single display string.
 * Spec: "Combine API address fields into a single string (street, city, zipcode)"
 *
 * @param {{ street?: string, city?: string, zipcode?: string }} address
 * @returns {string} Formatted address string, e.g. "123 Main St, New York, 10001"
 */
export const formatAddress = (address) => {
  if (!address) return 'No address';

  const parts = [address.street, address.city, address.zipcode].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'No address';
};
