import {
  CHARACTER_CULTURES,
  CHAPTER17_CULTURES,
  CHAPTER17_RELIGIONS,
  FRANKISH_CULTURE,
  LEGENDARY_LANDS
} from '../data/chapter17Cultures.js';
import { MARKET_CATALOG } from './economyRules.js';
import { getChapter18Creature } from './chapter18Rules.js';

export { CHARACTER_CULTURES, CHAPTER17_CULTURES, CHAPTER17_RELIGIONS, FRANKISH_CULTURE, LEGENDARY_LANDS };

const ATTRIBUTE_KEYS = ['siz', 'dex', 'str', 'con', 'app'];
const clone = value => JSON.parse(JSON.stringify(value));

export const getCulture = cultureId => CHARACTER_CULTURES.find(entry => entry.id === cultureId) || FRANKISH_CULTURE;
export const getChapter17Culture = cultureId => CHAPTER17_CULTURES.find(entry => entry.id === cultureId) || null;
export const getPlayableCultures = () => CHARACTER_CULTURES.filter(entry => entry.playable).map(clone);
export const isFrankishCulture = cultureId => getCulture(cultureId).id === 'frankish';

export const resolveCultureReligion = (cultureId, selectedReligionId = '') => {
  const culture = getCulture(cultureId);
  const candidate = selectedReligionId || culture.defaultReligionId;
  if (!candidate || !culture.religionOptions.includes(candidate)) return null;
  return CHAPTER17_RELIGIONS[candidate] || null;
};

export const applyCultureAttributeModifiers = (attributesValue, cultureId) => {
  const attributes = { ...attributesValue };
  const culture = getCulture(cultureId);
  ATTRIBUTE_KEYS.forEach(key => {
    attributes[key] = Number(attributes[key] || 0) + Number(culture.attributeModifiers?.[key] || 0);
  });
  return attributes;
};

const resolveChoice = (entry, selection) => {
  if (entry.id) return entry.id;
  if (!Array.isArray(entry.oneOf) || !entry.oneOf.length) return null;
  return entry.oneOf.includes(selection) ? selection : null;
};

const readEquipmentChoice = (choices, group, index) => {
  const flatKey = `${group}.${index}`;
  if (Object.hasOwn(choices || {}, flatKey)) return choices[flatKey];
  return choices?.[group]?.[index];
};

export const getCultureEquipmentProfile = (cultureId, profileId) => (
  getChapter17Culture(cultureId)?.equipmentProfiles.find(entry => entry.id === profileId) || null
);

export const getCultureEquipmentChoiceRequests = (cultureId, profileId) => {
  const profile = getCultureEquipmentProfile(cultureId, profileId);
  if (!profile) return [];
  return ['items', 'mounts', 'horseArmor'].flatMap(group => (profile[group] || []).flatMap((entry, index) => (
    entry.oneOf ? [{ id: `${group}.${index}`, group, index, options: [...entry.oneOf] }] : []
  )));
};

export const resolveCultureEquipment = (cultureId, profileId, choices = {}) => {
  const profile = getCultureEquipmentProfile(cultureId, profileId);
  if (!profile) return { profile: null, itemIds: [], mountIds: [], horseArmorIds: [], unresolved: ['profile'] };
  const resolved = { items: [], mounts: [], horseArmor: [] };
  const unresolved = [];
  Object.keys(resolved).forEach(group => {
    (profile[group] || []).forEach((entry, index) => {
      const id = resolveChoice(entry, readEquipmentChoice(choices, group, index));
      if (id) resolved[group].push(id);
      else unresolved.push(`${group}.${index}`);
    });
  });
  return {
    profile: clone(profile),
    itemIds: resolved.items,
    mountIds: resolved.mounts,
    horseArmorIds: resolved.horseArmor,
    allMarketItemIds: [...resolved.items, ...resolved.mounts, ...resolved.horseArmor],
    unresolved
  };
};

export const validateChapter17Registry = () => {
  const errors = [];
  const mountRegistryBoundaries = [];
  const cultureIds = new Set();
  const marketIds = new Set(MARKET_CATALOG.map(entry => entry.id));
  CHAPTER17_CULTURES.forEach(culture => {
    if (cultureIds.has(culture.id)) errors.push(`duplicate culture id: ${culture.id}`);
    cultureIds.add(culture.id);
    if (!culture.playable || culture.permission !== 'gm') errors.push(`${culture.id}: invalid playable policy`);
    if (!culture.sourcePage || !culture.homeland) errors.push(`${culture.id}: missing source metadata`);
    if (ATTRIBUTE_KEYS.some(key => !Number.isFinite(Number(culture.attributeModifiers?.[key])))) errors.push(`${culture.id}: incomplete Table 17-1 row`);
    if (!culture.religionOptions.length || culture.religionOptions.some(id => !CHAPTER17_RELIGIONS[id])) errors.push(`${culture.id}: invalid religion options`);
    if (!culture.equipmentProfiles.length) errors.push(`${culture.id}: no source equipment boundary`);
    culture.equipmentProfiles.forEach(profile => {
      if (!profile.id || !profile.sourceText || !profile.sourcePage) errors.push(`${culture.id}/${profile.id}: incomplete profile source`);
      ['items', 'mounts', 'horseArmor'].forEach(group => (profile[group] || []).forEach(entry => {
        const ids = entry.id ? [entry.id] : entry.oneOf || [];
        ids.forEach(id => {
          if (!marketIds.has(id)) errors.push(`${culture.id}/${profile.id}: unknown market item ${id}`);
          if (group === 'mounts' && !getChapter18Creature(id)) {
            const marketMount = MARKET_CATALOG.find(entry => entry.id === id && entry.category === 'mount');
            if (marketMount) {
              mountRegistryBoundaries.push({ cultureId: culture.id, profileId: profile.id, mountId: id, runtime: 'chapter12' });
            } else {
              errors.push(`${culture.id}/${profile.id}: unknown canonical mount ${id}`);
            }
          }
        });
      }));
    });
  });
  if (CHAPTER17_CULTURES.length !== 15) errors.push(`expected 15 cultures, found ${CHAPTER17_CULTURES.length}`);
  if (LEGENDARY_LANDS.length !== 2 || LEGENDARY_LANDS.some(entry => entry.playable)) errors.push('legendary lands must remain two reference-only entries');
  return {
    valid: errors.length === 0,
    errors,
    cultureCount: CHAPTER17_CULTURES.length,
    playableCultureCount: CHAPTER17_CULTURES.filter(entry => entry.playable).length,
    referenceOnlyCount: LEGENDARY_LANDS.length,
    equipmentProfileCount: CHAPTER17_CULTURES.reduce((total, culture) => total + culture.equipmentProfiles.length, 0),
    tableCount: 1,
    mountRegistryBoundaries
  };
};
