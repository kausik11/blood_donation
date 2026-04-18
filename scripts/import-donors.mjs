import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import XLSX from "xlsx";

const DEFAULT_SOURCE = "C:/Users/DELL/Downloads/Blood March 2021.xlsx";
const OUTPUT_PATH = path.resolve(process.cwd(), "data", "donors.json");

const DISTRICT_RULES = [
  {
    label: "North 24 Parganas",
    patterns: [
      /24\s*(pgs?|parganas?)\s*(north|n)\b/u,
      /\bnorth\s*24\s*(pgs?|parganas?)\b/u,
      /24\s*পরগনা.*উত্তর/u,
    ],
  },
  {
    label: "South 24 Parganas",
    patterns: [
      /24\s*(pgs?|parganas?)\s*south\b/u,
      /\bsouth\s*24\s*(pgs?|parganas?)\b/u,
      /24\s*পরগনা.*দক্ষিণ/u,
    ],
  },
  {
    label: "Murshidabad",
    patterns: [/\bmurshidabad\b/u, /\bmsd\b/u],
  },
  {
    label: "Howrah",
    patterns: [/\bhowrah\b/u, /\bhawrah\b/u],
  },
  {
    label: "Hooghly",
    patterns: [/\bhooghly\b/u, /\bhugli\b/u],
  },
  {
    label: "Purba Bardhaman",
    patterns: [/\beast\s+burdwan\b/u, /\bburdwan\s+east\b/u, /\bpurba\s+bardhaman\b/u],
  },
  {
    label: "Paschim Bardhaman",
    patterns: [/\bwest\s+burdwan\b/u, /\bburdwan\s+west\b/u, /\bpaschim\s+bardhaman\b/u],
  },
  {
    label: "Cooch Behar",
    patterns: [/\bcooch\s*behar\b/u, /\bcoochbehar\b/u, /\bcoochbher\b/u],
  },
  {
    label: "Jalpaiguri",
    patterns: [/\bjalpai\s*guri\b/u, /\bjalpaiguri\b/u],
  },
  {
    label: "Uttar Dinajpur",
    patterns: [/\bnorth\s+dinajpur\b/u, /\bdinajpur\s+uttar\b/u, /\buttar\s+dinajpur\b/u],
  },
  {
    label: "Dakshin Dinajpur",
    patterns: [
      /\bsouth\s+dinajpur\b/u,
      /\bdinajpur\s+dakshin\b/u,
      /\bdakshin\s+dinajpur\b/u,
    ],
  },
];

const SHEET_DISTRICT_FALLBACKS = {
  MSD: "Murshidabad",
  RNG: "Murshidabad",
};

function cleanValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).replace(/\s+/g, " ").trim();
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

function toTitleCase(value) {
  const cleaned = cleanValue(value);

  if (!cleaned) {
    return "";
  }

  if (/[a-z]/.test(cleaned) && /[A-Z]/.test(cleaned)) {
    return cleaned;
  }

  return cleaned
    .toLowerCase()
    .replace(/\b\p{L}/gu, (letter) => letter.toUpperCase());
}

function isInvalidDistrict(value) {
  return /\bkm\b|किलोमीटर/iu.test(value);
}

function canonicalizeDistrict(rawDistrict, sheetName) {
  const cleaned = cleanValue(rawDistrict);
  const normalized = normalizeForMatch(cleaned);

  if (cleaned && !isInvalidDistrict(cleaned)) {
    for (const rule of DISTRICT_RULES) {
      if (rule.patterns.some((pattern) => pattern.test(normalized))) {
        return {
          label: rule.label,
          inferred: false,
        };
      }
    }

    return {
      label: toTitleCase(cleaned),
      inferred: false,
    };
  }

  if (SHEET_DISTRICT_FALLBACKS[sheetName]) {
    return {
      label: SHEET_DISTRICT_FALLBACKS[sheetName],
      inferred: true,
    };
  }

  return {
    label: "",
    inferred: false,
  };
}

function pickFirstNonEmpty(values) {
  for (const value of values) {
    const cleaned = cleanValue(value);

    if (cleaned) {
      return cleaned;
    }
  }

  return "";
}

function normalizeBloodGroup(value) {
  return cleanValue(value).toUpperCase().replace(/\s+/g, "");
}

function normalizePhone(value) {
  return cleanValue(value).replace(/\D/g, "");
}

function chooseBetterValue(currentValue, nextValue) {
  if (!nextValue) {
    return currentValue;
  }

  if (!currentValue) {
    return nextValue;
  }

  return nextValue.length > currentValue.length ? nextValue : currentValue;
}

function mergeDonor(existing, incoming) {
  existing.name =
    existing.name === "Name unavailable" && incoming.name !== "Name unavailable"
      ? incoming.name
      : chooseBetterValue(existing.name, incoming.name);
  existing.town = chooseBetterValue(existing.town, incoming.town);
  existing.block = chooseBetterValue(existing.block, incoming.block);
  existing.address = chooseBetterValue(existing.address, incoming.address);
  existing.state = chooseBetterValue(existing.state, incoming.state);

  if (!existing.district && incoming.district) {
    existing.district = incoming.district;
    existing.districtInferred = incoming.districtInferred;
  } else if (existing.districtInferred && incoming.district && !incoming.districtInferred) {
    existing.district = incoming.district;
    existing.districtInferred = false;
  }

  for (const sheetName of incoming.sourceSheets) {
    if (!existing.sourceSheets.includes(sheetName)) {
      existing.sourceSheets.push(sheetName);
    }
  }
}

function createDonor(row, sheetName) {
  const bloodGroup = normalizeBloodGroup(
    pickFirstNonEmpty([row.Blood, row["Blood Group"], row["BLOOD GROUP"]]),
  );
  const phone = normalizePhone(
    pickFirstNonEmpty([row["Mobile Number "], row["Mobile Number"], row["Phone Number"]]),
  );

  if (!bloodGroup || !phone) {
    return null;
  }

  const districtInfo = canonicalizeDistrict(
    pickFirstNonEmpty([row.District, row.DISTRICT]),
    sheetName,
  );

  return {
    bloodGroup,
    name:
      pickFirstNonEmpty([row.Name, row.NAME, row["YOUR NAME"]]) || "Name unavailable",
    phone,
    district: districtInfo.label,
    districtInferred: districtInfo.inferred,
    town: pickFirstNonEmpty([row.Town, row["Village/Town"]]),
    block: pickFirstNonEmpty([row.BLOCK, row.Block]),
    address: pickFirstNonEmpty([row.Address]),
    state: pickFirstNonEmpty([row["RESIDENT OF"]]),
    sourceSheets: [sheetName],
  };
}

function buildWorkbookIndex(workbook) {
  const donorMap = new Map();

  for (const sheetName of workbook.SheetNames) {
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      defval: "",
    });

    for (const row of rows) {
      const donor = createDonor(row, sheetName);

      if (!donor) {
        continue;
      }

      const donorKey = [
        donor.bloodGroup,
        normalizeForMatch(donor.name),
        donor.phone,
      ].join("|");

      if (!donorMap.has(donorKey)) {
        donorMap.set(donorKey, donor);
        continue;
      }

      mergeDonor(donorMap.get(donorKey), donor);
    }
  }

  return Array.from(donorMap.values())
    .sort((left, right) => {
      const districtCompare = left.district.localeCompare(right.district);

      if (districtCompare !== 0) {
        return districtCompare;
      }

      const townCompare = left.town.localeCompare(right.town);

      if (townCompare !== 0) {
        return townCompare;
      }

      return left.name.localeCompare(right.name);
    })
    .map((donor, index) => ({
      id: `donor-${String(index + 1).padStart(5, "0")}`,
      ...donor,
      sourceSheets: donor.sourceSheets.sort(),
    }));
}

function main() {
  const sourcePath = process.argv[2]
    ? path.resolve(process.cwd(), process.argv[2])
    : DEFAULT_SOURCE;

  if (!fs.existsSync(sourcePath)) {
    console.error(`Source workbook not found: ${sourcePath}`);
    process.exit(1);
  }

  const workbook = XLSX.readFile(sourcePath);
  const donors = buildWorkbookIndex(workbook);
  const districts = [...new Set(donors.map((donor) => donor.district).filter(Boolean))];

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(
    OUTPUT_PATH,
    JSON.stringify(
      {
        meta: {
          generatedAt: new Date().toISOString(),
          sourceFile: sourcePath,
          donorCount: donors.length,
          districtCount: districts.length,
          inferredDistrictSheets: SHEET_DISTRICT_FALLBACKS,
        },
        donors,
      },
      null,
      2,
    ),
  );

  console.log(`Imported ${donors.length} unique donors into ${OUTPUT_PATH}`);
}

main();
