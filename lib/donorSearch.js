import donorIndex from "../data/donors.json";

const BLOOD_GROUP_ORDER = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function cleanValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeForMatch(value) {
  return cleanValue(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const donors = donorIndex.donors.map((donor) => {
  const districtKey = normalizeForMatch(donor.district);
  const townKey = normalizeForMatch(donor.town);
  const blockKey = normalizeForMatch(donor.block);
  const addressKey = normalizeForMatch(donor.address);
  const stateKey = normalizeForMatch(donor.state);

  return {
    ...donor,
    districtKey,
    townKey,
    blockKey,
    addressKey,
    stateKey,
    locationKey: normalizeForMatch(
      [donor.town, donor.block, donor.address, donor.district, donor.state]
        .filter(Boolean)
        .join(" "),
    ),
  };
});

const districtMap = new Map();

for (const donor of donors) {
  if (!donor.districtKey) {
    continue;
  }

  if (!districtMap.has(donor.districtKey)) {
    districtMap.set(donor.districtKey, {
      key: donor.districtKey,
      label: donor.district,
      count: 0,
    });
  }

  districtMap.get(donor.districtKey).count += 1;
}

const districtOptions = Array.from(districtMap.values()).sort((left, right) =>
  left.label.localeCompare(right.label),
);

function scoreTownMatch(donor, townKey) {
  if (!townKey) {
    return 0;
  }

  let score = 0;

  if (donor.townKey === townKey) {
    score += 6;
  }

  if (donor.blockKey === townKey) {
    score += 5;
  }

  if (donor.townKey.startsWith(townKey)) {
    score += 4;
  }

  if (donor.blockKey.startsWith(townKey)) {
    score += 3;
  }

  if (donor.townKey.includes(townKey)) {
    score += 2;
  }

  if (donor.blockKey.includes(townKey)) {
    score += 2;
  }

  if (donor.addressKey.includes(townKey)) {
    score += 1;
  }

  return score;
}

export function searchDonors({ districtKey, townQuery, bloodGroup }) {
  const normalizedTown = normalizeForMatch(townQuery);

  return donors
    .filter((donor) => {
      if (bloodGroup && donor.bloodGroup !== bloodGroup) {
        return false;
      }

      if (districtKey && donor.districtKey !== districtKey) {
        return false;
      }

      if (normalizedTown && !donor.locationKey.includes(normalizedTown)) {
        return false;
      }

      return true;
    })
    .sort((left, right) => {
      const scoreDifference =
        scoreTownMatch(right, normalizedTown) - scoreTownMatch(left, normalizedTown);

      if (scoreDifference !== 0) {
        return scoreDifference;
      }

      const townCompare = left.town.localeCompare(right.town);

      if (townCompare !== 0) {
        return townCompare;
      }

      return left.name.localeCompare(right.name);
    });
}

export function getTownSuggestions(districtKey, townQuery = "", limit = 8) {
  const queryKey = normalizeForMatch(townQuery);
  const suggestionMap = new Map();

  for (const donor of donors) {
    if (districtKey && donor.districtKey !== districtKey) {
      continue;
    }

    const labels = [donor.town, donor.block].filter(Boolean);
    const seen = new Set();

    for (const label of labels) {
      const key = normalizeForMatch(label);

      if (!key || seen.has(key)) {
        continue;
      }

      seen.add(key);

      if (queryKey && !key.includes(queryKey)) {
        continue;
      }

      if (!suggestionMap.has(key)) {
        suggestionMap.set(key, {
          key,
          label,
          count: 0,
        });
      }

      suggestionMap.get(key).count += 1;
    }
  }

  return Array.from(suggestionMap.values())
    .sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }

      return left.label.localeCompare(right.label);
    })
    .slice(0, limit);
}

export function formatPhoneNumber(phone) {
  const cleaned = cleanValue(phone);

  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }

  return cleaned;
}

export const donorMeta = donorIndex.meta;
export const bloodGroups = BLOOD_GROUP_ORDER;
export const totalDonors = donorIndex.meta.donorCount;
export const totalDistricts = districtOptions.length;
export { districtOptions };
