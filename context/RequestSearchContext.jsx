import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  bloodGroups,
  buildNotifyMessage,
  districtOptions,
  getSearchSummary,
  getTownOptions,
  searchDonors,
} from "../lib/donorSearch";

const RequestSearchContext = createContext(null);
const DEFAULT_UNITS_NEEDED = 2;
const MAX_VISIBLE_DONORS = 12;

export function RequestSearchProvider({ children }) {
  const [hasSeenSplash, setHasSeenSplash] = useState(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const [unitsNeeded, setUnitsNeeded] = useState(DEFAULT_UNITS_NEEDED);
  const [selectedDistrictKey, setSelectedDistrictKeyState] = useState("");
  const [selectedTownKey, setSelectedTownKeyState] = useState("");

  const townOptions = useMemo(
    () => getTownOptions(selectedDistrictKey),
    [selectedDistrictKey],
  );

  const selectedDistrict = useMemo(
    () => districtOptions.find((option) => option.key === selectedDistrictKey) ?? null,
    [selectedDistrictKey],
  );

  const selectedTown = useMemo(
    () => townOptions.find((option) => option.key === selectedTownKey) ?? null,
    [selectedTownKey, townOptions],
  );

  const hasRequiredFilters = Boolean(
    selectedBloodGroup && selectedDistrictKey && selectedTownKey,
  );

  const matchedDonors = useMemo(() => {
    if (!hasRequiredFilters) {
      return [];
    }

    return searchDonors({
      districtKey: selectedDistrictKey,
      townKey: selectedTownKey,
      bloodGroup: selectedBloodGroup,
    });
  }, [hasRequiredFilters, selectedBloodGroup, selectedDistrictKey, selectedTownKey]);

  const visibleDonors = useMemo(
    () => matchedDonors.slice(0, MAX_VISIBLE_DONORS),
    [matchedDonors],
  );

  const summary = useMemo(
    () =>
      getSearchSummary({
        districtKey: selectedDistrictKey,
        townKey: selectedTownKey,
        bloodGroup: selectedBloodGroup,
        unitsNeeded,
        resultCount: matchedDonors.length,
      }),
    [matchedDonors.length, selectedBloodGroup, selectedDistrictKey, selectedTownKey, unitsNeeded],
  );

  const setSelectedDistrictKey = useCallback((districtKey) => {
    setSelectedDistrictKeyState(districtKey);
    setSelectedTownKeyState((currentTownKey) => {
      if (!districtKey) {
        return "";
      }

      const nextTownOptions = getTownOptions(districtKey);
      return nextTownOptions.some((option) => option.key === currentTownKey) ? currentTownKey : "";
    });
  }, []);

  const incrementUnits = useCallback(() => {
    setUnitsNeeded((currentUnits) => Math.min(currentUnits + 1, 9));
  }, []);

  const decrementUnits = useCallback(() => {
    setUnitsNeeded((currentUnits) => Math.max(currentUnits - 1, 1));
  }, []);

  const resetRequest = useCallback(() => {
    setSelectedBloodGroup("");
    setUnitsNeeded(DEFAULT_UNITS_NEEDED);
    setSelectedDistrictKeyState("");
    setSelectedTownKeyState("");
  }, []);

  const dismissSplash = useCallback(() => {
    setHasSeenSplash(true);
  }, []);

  const buildNotifyMessageForDonor = useCallback(
    (donor) =>
      buildNotifyMessage({
        donor,
        districtLabel: selectedDistrict?.label,
        townLabel: selectedTown?.label,
        bloodGroup: selectedBloodGroup,
        unitsNeeded,
      }),
    [selectedBloodGroup, selectedDistrict?.label, selectedTown?.label, unitsNeeded],
  );

  const value = useMemo(
    () => ({
      hasSeenSplash,
      dismissSplash,
      bloodGroups,
      districtOptions,
      selectedBloodGroup,
      setSelectedBloodGroup,
      unitsNeeded,
      incrementUnits,
      decrementUnits,
      selectedDistrictKey,
      setSelectedDistrictKey,
      selectedDistrict,
      townOptions,
      selectedTownKey,
      setSelectedTownKey: setSelectedTownKeyState,
      selectedTown,
      hasRequiredFilters,
      matchedDonors,
      visibleDonors,
      resultCount: matchedDonors.length,
      visibleResultCount: visibleDonors.length,
      hasMoreResults: matchedDonors.length > visibleDonors.length,
      summary,
      buildNotifyMessageForDonor,
      resetRequest,
    }),
    [
      buildNotifyMessageForDonor,
      decrementUnits,
      dismissSplash,
      hasSeenSplash,
      hasRequiredFilters,
      incrementUnits,
      matchedDonors,
      resetRequest,
      selectedBloodGroup,
      selectedDistrict,
      selectedDistrictKey,
      selectedTown,
      selectedTownKey,
      summary,
      townOptions,
      unitsNeeded,
      visibleDonors,
    ],
  );

  return <RequestSearchContext.Provider value={value}>{children}</RequestSearchContext.Provider>;
}

export function useRequestSearch() {
  const context = useContext(RequestSearchContext);

  if (!context) {
    throw new Error("useRequestSearch must be used within a RequestSearchProvider");
  }

  return context;
}
