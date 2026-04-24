import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
const DONOR_REGISTRATION_DRAFT_STORAGE_KEY = "blood_donation:donor_registration_draft";
const DEFAULT_DONOR_REGISTRATION_DRAFT = {
  country: "",
  state: "",
  district: "",
  subdivision: "",
  blockPostalCode: "",
  fullName: "",
  gender: "",
  email: "",
  phoneNumber: "",
  birthDay: "",
  birthMonth: "",
  birthYear: "",
  bloodGroup: "",
  idProof: null,
  useCurrentLocation: false,
  quickLocateRequestedAt: null,
  stepOneSavedAt: null,
  stepTwoSavedAt: null,
  updatedAt: null,
};

export function RequestSearchProvider({ children }) {
  const [hasSeenSplash, setHasSeenSplash] = useState(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const [unitsNeeded, setUnitsNeeded] = useState(DEFAULT_UNITS_NEEDED);
  const [selectedDistrictKey, setSelectedDistrictKeyState] = useState("");
  const [selectedTownKey, setSelectedTownKeyState] = useState("");
  const [donorRegistrationDraft, setDonorRegistrationDraft] = useState(
    DEFAULT_DONOR_REGISTRATION_DRAFT,
  );
  const [isDonorRegistrationDraftReady, setIsDonorRegistrationDraftReady] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function hydrateDonorRegistrationDraft() {
      try {
        const storedValue = await AsyncStorage.getItem(DONOR_REGISTRATION_DRAFT_STORAGE_KEY);

        if (!storedValue || !isActive) {
          return;
        }

        setDonorRegistrationDraft({
          ...DEFAULT_DONOR_REGISTRATION_DRAFT,
          ...JSON.parse(storedValue),
        });
      } catch {
        // Keep the in-memory default when local draft hydration fails.
      } finally {
        if (isActive) {
          setIsDonorRegistrationDraftReady(true);
        }
      }
    }

    hydrateDonorRegistrationDraft();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!isDonorRegistrationDraftReady) {
      return;
    }

    AsyncStorage.setItem(
      DONOR_REGISTRATION_DRAFT_STORAGE_KEY,
      JSON.stringify(donorRegistrationDraft),
    ).catch(() => {
      // Keep the in-memory draft if persistence fails.
    });
  }, [donorRegistrationDraft, isDonorRegistrationDraftReady]);

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

  const updateDonorRegistrationField = useCallback((field, value) => {
    setDonorRegistrationDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const requestDonorCurrentLocation = useCallback(() => {
    const timestamp = new Date().toISOString();

    setDonorRegistrationDraft((currentDraft) => ({
      ...currentDraft,
      useCurrentLocation: true,
      quickLocateRequestedAt: timestamp,
      updatedAt: timestamp,
    }));
  }, []);

  const saveDonorRegistrationStepOne = useCallback(() => {
    const timestamp = new Date().toISOString();

    setDonorRegistrationDraft((currentDraft) => ({
      ...currentDraft,
      stepOneSavedAt: timestamp,
      updatedAt: timestamp,
    }));
  }, []);

  const saveDonorRegistrationStepTwo = useCallback(() => {
    const timestamp = new Date().toISOString();

    setDonorRegistrationDraft((currentDraft) => ({
      ...currentDraft,
      stepTwoSavedAt: timestamp,
      updatedAt: timestamp,
    }));
  }, []);

  const resetDonorRegistrationDraft = useCallback(() => {
    setDonorRegistrationDraft(DEFAULT_DONOR_REGISTRATION_DRAFT);
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
      donorRegistrationDraft,
      updateDonorRegistrationField,
      requestDonorCurrentLocation,
      saveDonorRegistrationStepOne,
      saveDonorRegistrationStepTwo,
      resetDonorRegistrationDraft,
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
      donorRegistrationDraft,
      dismissSplash,
      hasSeenSplash,
      requestDonorCurrentLocation,
      resetDonorRegistrationDraft,
      saveDonorRegistrationStepOne,
      saveDonorRegistrationStepTwo,
      decrementUnits,
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
      updateDonorRegistrationField,
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
