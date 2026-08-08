import { parseDiceNotation, roundPaladin } from './coreRules.js';
import {
  CHIVALROUS_TRAITS,
  RELIGIOUS_TRAITS,
  ROMANTIC_TRAITS,
  TRAIT_PAIRS,
  adjustOpposedTrait,
  setOpposedTraitValue
} from './personalityRules.js';
import {
  BIRTH_GIFTS,
  CHARACTER_CREATION_STEPS,
  DISTINCTIVE_FEATURES,
  FAMILY_CHARACTERISTICS_FEMALE,
  FAMILY_CHARACTERISTICS_MALE,
  FATHER_CLASSES,
  FATHER_SUBCLASSES,
  FRANKISH_SKILL_FORMULAS,
  MELEE_WEAPON_SKILLS,
  PAGE_EDUCATIONS,
  PATRON_SAINTS,
  RELIC_TYPES,
  SKILL_CATEGORIES,
  STARTING_OUTFITS
} from './characterCreationData.js';
import { SAINT_BLESSINGS } from './lifecycleRules.js';

const SESSION_VERSION = 2;
const SESSION_STATUSES = new Set(['not_started', 'in_progress', 'awaiting_choice', 'completed', 'abandoned']);
const ATTRIBUTE_KEYS = ['siz', 'dex', 'str', 'con', 'app'];
const DEFAULT_ATTRIBUTE_BONUSES = { siz: 0, dex: 0, str: 0, con: 0, app: 0 };
const DEFAULT_FAMILY = {
  name: '', motto: '', battleCry: '', ancestor: '', homeCounty: 'Ardennes', greatNoble: '',
  directedTraits: '', directedPassions: ''
};

const clone = value => JSON.parse(JSON.stringify(value));
const nowIso = now => (typeof now === 'string' ? now : (now || new Date()).toISOString());
const asInt = (value, fallback = 0) => Number.isFinite(Number(value)) ? Math.trunc(Number(value)) : fallback;
const clamp = (value, min, max) => Math.min(max, Math.max(min, asInt(value, min)));
const sum = values => values.reduce((total, value) => total + Number(value || 0), 0);
const getByPath = (object, path) => String(path).split('.').reduce((value, key) => value?.[key], object);

const setByPath = (object, path, value) => {
  const keys = String(path).split('.');
  let cursor = object;
  keys.slice(0, -1).forEach(key => {
    if (!cursor[key] || typeof cursor[key] !== 'object' || Array.isArray(cursor[key])) cursor[key] = {};
    cursor = cursor[key];
  });
  cursor[keys.at(-1)] = value;
};

const findByRange = (entries, value) => entries.find(entry => value >= entry.range[0] && value <= entry.range[1]);

const isFamilySuccessor = session => ['same_family', 'prepared_second'].includes(session.successorContext?.successorMode);

const parseStoredEffects = value => {
  if (value && typeof value === 'object' && !Array.isArray(value)) return clone(value);
  try {
    const parsed = JSON.parse(String(value || '{}'));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
};

const hashSeed = seed => {
  let hash = 2166136261;
  for (const char of String(seed)) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const randomAt = (seed, index) => {
  let value = (hashSeed(seed) + Math.imul(index + 1, 0x9e3779b9)) >>> 0;
  value ^= value >>> 16;
  value = Math.imul(value, 0x21f0aaad);
  value ^= value >>> 15;
  value = Math.imul(value, 0x735a2d97);
  value ^= value >>> 15;
  return (value >>> 0) / 4294967296;
};

const makeRollResult = ({ notation, rawRolls, modifier, key, label, stepId, ruleId, source, rollIndex, sourcePage }) => {
  const parsed = parseDiceNotation(notation);
  if (!Array.isArray(rawRolls) || rawRolls.length !== parsed.count) {
    throw new RangeError(`${notation} requires ${parsed.count} physical die result(s).`);
  }
  rawRolls.forEach(roll => {
    const sides = parsed.sides === 3 ? 6 : parsed.sides;
    if (!Number.isInteger(Number(roll)) || Number(roll) < 1 || Number(roll) > sides) {
      throw new RangeError(`${notation} physical dice must be between 1 and ${sides}.`);
    }
  });
  const convertedRolls = rawRolls.map(roll => parsed.sides === 3 ? Math.ceil(Number(roll) / 2) : Number(roll));
  const baseModifier = parsed.modifier + Number(modifier || 0);
  const subtotal = sum(convertedRolls);
  return {
    key,
    label,
    stepId,
    ruleId,
    sourcePage,
    notation: parsed.notation,
    rollIndex,
    source,
    rawResult: rawRolls.map(Number),
    convertedResult: convertedRolls,
    subtotal,
    modifier: baseModifier,
    modifiedResult: subtotal + baseModifier,
    tableResult: null
  };
};

const writeRoll = (session, spec, rawRolls, source) => {
  const next = clone(session);
  const result = makeRollResult({
    ...spec,
    rawRolls,
    source,
    rollIndex: next.rollIndex
  });
  next.rollIndex += rawRolls.length;
  next.rolls[spec.key] = result;
  next.rollLog = [...next.rollLog.filter(entry => entry.key !== spec.key), result];
  next.updatedAt = nowIso();
  return next;
};

const recordAutomaticRoll = (session, spec) => {
  const parsed = parseDiceNotation(spec.notation);
  const rawRolls = [];
  for (let index = 0; index < parsed.count; index += 1) {
    const sides = parsed.sides === 3 ? 6 : parsed.sides;
    rawRolls.push(Math.floor(randomAt(session.seed, session.rollIndex + index) * sides) + 1);
  }
  return writeRoll(session, spec, rawRolls, 'automatic');
};

const addUnresolved = (draft, item) => {
  if (!draft.unresolvedChoices.some(existing => existing.id === item.id)) {
    draft.unresolvedChoices.push({ blocking: true, ...item });
  }
};

const logModifier = (draft, { stepId, ruleId, sourceLabel, targetGroup, targetKey, before, amount, after, cap = null }) => {
  draft.modifierLog.push({
    stepId,
    ruleId,
    sourceLabel,
    targetGroup,
    targetKey,
    before,
    amount,
    after,
    cap
  });
};

const applyTraitModifier = (draft, traits, key, amount, sourceLabel, stepId, ruleId, maximum = Number.MAX_SAFE_INTEGER) => {
  const before = Number(traits[key] || 0);
  const adjusted = adjustOpposedTrait(traits, key, amount, maximum);
  const after = Number(adjusted[key] || 0);
  logModifier(draft, { stepId, ruleId, sourceLabel, targetGroup: 'traits', targetKey: key, before, amount, after, cap: maximum === Number.MAX_SAFE_INTEGER ? null : maximum });
  return adjusted;
};

const applyNumberModifier = (draft, target, key, amount, sourceLabel, stepId, ruleId, capValue = Number.MAX_SAFE_INTEGER, group = 'skills') => {
  const before = Number(target[key] || 0);
  const after = Math.min(capValue, Math.max(0, before + Number(amount || 0)));
  target[key] = after;
  logModifier(draft, { stepId, ruleId, sourceLabel, targetGroup: group, targetKey: key, before, amount, after, cap: capValue === Number.MAX_SAFE_INTEGER ? null : capValue });
};

const getRollValue = (session, key) => {
  const entry = session.rolls?.[key];
  return entry ? Number(entry.subtotal || 0) + Number(entry.modifier || 0) : undefined;
};
const hasRoll = (session, key) => Number.isFinite(getRollValue(session, key));

const resolveFamilyCharacteristic = (session, draft) => {
  if (isFamilySuccessor(session)) {
    const stored = session.successorContext?.family?.characteristic;
    if (!stored) return null;
    return {
      key: stored.key || 'inheritedFamilyCharacteristic',
      label: stored.label || stored.name || stored.desc || 'Inherited family characteristic',
      effects: parseStoredEffects(stored.effects || stored.bonusText),
      inherited: true
    };
  }
  const roll = getRollValue(session, 'family.characteristic');
  if (!roll) return null;
  const useFemaleTable = session.choices.gender === 'female' && session.choices.femaleGeneration === 'femaleSpecific';
  const table = useFemaleTable ? FAMILY_CHARACTERISTICS_FEMALE : FAMILY_CHARACTERISTICS_MALE;
  let result = findByRange(table, roll);
  if (result?.choice === 'battleOrSiege') {
    const target = session.choices.familyCharacteristicBattleSkill;
    if (!['battle', 'siege'].includes(target)) {
      addUnresolved(draft, { id: 'family-characteristic-19', stepId: 'familyCharacteristic', ruleId: useFemaleTable ? 'CHAR-FAMCHAR-F-001' : 'CHAR-FAMCHAR-M-001', label: 'Choose Battle or Siege for Master tacticians.' });
    } else {
      result = { ...result, effects: { skills: { [target]: 5 } }, selectedTarget: target };
    }
  }
  if (result?.choice === 'familyCharacteristic') {
    const selectedKey = session.choices.familyCharacteristicChoice;
    const selected = table.find(entry => entry.key === selectedKey && !entry.choice);
    if (!selected) {
      addUnresolved(draft, { id: 'family-characteristic-20', stepId: 'familyCharacteristic', ruleId: useFemaleTable ? 'CHAR-FAMCHAR-F-001' : 'CHAR-FAMCHAR-M-001', label: 'Choose one printed family characteristic.' });
    } else {
      result = { ...selected, rolledResult: result, selectedByChoice: true };
    }
  }
  return result;
};

const resolveSaint = (session, draft) => {
  if (isFamilySuccessor(session)) {
    const family = session.successorContext?.family || {};
    const stored = PATRON_SAINTS.find(entry => entry.label === family.patronSaint || entry.key === family.patronSaintKey);
    return stored ? { ...stored, inherited: true } : family.patronSaint ? {
      key: family.patronSaintKey || 'inheritedPatronSaint',
      label: family.patronSaint,
      effects: parseStoredEffects(family.patronSaintEffects),
      inherited: true
    } : null;
  }
  const roll = getRollValue(session, 'family.saint');
  if (!roll) return null;
  let result = PATRON_SAINTS[roll - 1];
  if (result?.choice) {
    const chosen = PATRON_SAINTS.find(entry => entry.key === session.choices.saintChoice && !entry.choice);
    if (!chosen) {
      addUnresolved(draft, { id: 'saint-20', stepId: 'saint', ruleId: 'CHAR-SAINT-001', label: 'Choose one printed patron saint.' });
    } else {
      result = { ...chosen, rolledResult: result, selectedByChoice: true };
    }
  }
  return result;
};

const resolveFather = (session, draft) => {
  if (isFamilySuccessor(session)) {
    const key = session.choices.successorFatherClass;
    if (!key) return null;
    if (key === 'lord') return { ...FATHER_SUBCLASSES.find(entry => entry.key === 'lord'), detail: session.choices.lordType || 'Lord', inheritedContext: true };
    const source = FATHER_CLASSES.find(entry => entry.key === key);
    return source ? { ...source, inheritedContext: true } : null;
  }
  const classRoll = getRollValue(session, 'father.class');
  if (!classRoll) return null;
  const base = findByRange(FATHER_CLASSES, classRoll);
  let result = base;
  if (base?.subtable) {
    const subRoll = getRollValue(session, 'father.subclass');
    if (!subRoll) return { ...base, pendingSubtable: true };
    const subclass = findByRange(FATHER_SUBCLASSES, subRoll);
    result = { ...subclass, parentClass: base.key, classRoll, subRoll };
    if (subclass?.key === 'lord') {
      if (!subclass.detailChoice.includes(session.choices.lordType)) {
        addUnresolved(draft, { id: 'father-lord-type', stepId: 'father', ruleId: 'CHAR-FATHER-001', label: 'Choose Count, Duke, Lay Bishop, or Lay Abbot.' });
      } else {
        result.detail = session.choices.lordType;
      }
    }
    if (subclass?.officer) {
      const patronRoll = getRollValue(session, 'father.officerPatron');
      if (patronRoll) {
        result.officerPatron = patronRoll === 1 ? 'Count or Duke' : patronRoll === 2 ? 'Lay Bishop or Lay Abbot' : 'Knight Banneret';
        result.outfit = patronRoll === 1 ? 3 : 2;
      }
    }
  }
  if (result?.choice === 'mercenaryMelee' && !MELEE_WEAPON_SKILLS.filter(key => key !== 'sword').includes(session.choices.mercenaryMelee)) {
    addUnresolved(draft, { id: 'father-mercenary-weapon', stepId: 'father', ruleId: 'CHAR-FATHER-001', label: 'Choose the mercenary father bonus melee weapon.' });
  }
  return result;
};

const resolveFatherSurvival = session => {
  if (isFamilySuccessor(session)) {
    const status = session.successorContext?.predecessor?.status;
    return status === 'deceased'
      ? { key: 'deceased', label: 'Father deceased', inheritedContext: true }
      : status === 'retired'
        ? { key: 'living', label: 'Father retired and living', inheritedContext: true }
        : { key: 'living', label: 'Household father living', inheritedContext: true };
  }
  const roll = getRollValue(session, 'father.survival');
  if (!roll) return null;
  if (roll <= 13) return { key: 'living', label: 'Father living', roll };
  if (roll <= 17) return { key: 'deceased', label: 'Father deceased', roll };
  if (roll <= 19) return { key: 'bedridden', label: 'Father alive, but bedridden', roll };
  return { key: 'missing', label: 'Father missing', roll, missingYears: getRollValue(session, 'father.missingYears') || null };
};

const resolveSonNumber = (session, father) => {
  if (session.choices.sonNumberMethod === 'first') return 1;
  if (!father) return null;
  const roll = getRollValue(session, 'sonNumber.order');
  if (!roll) return null;
  return clamp(roll, 1, 6);
};

const resolvePageEducation = (session, father, sonNumber) => {
  if (session.choices.pageEducationMethod === 'fatherCourt') {
    let key = null;
    if (father?.key === 'lord') {
      key = ['Lay Bishop', 'Lay Abbot'].includes(father.detail)
        ? session.choices.pageAutomaticChoice
        : 'greatNobleCourt';
    } else if (father?.officerPatron === 'Count or Duke') key = 'greatNobleCourt';
    else if (father?.officerPatron === 'Knight Banneret') key = 'banneretCourt';
    else if (father?.officerPatron === 'Lay Bishop or Lay Abbot') key = session.choices.pageAutomaticChoice;
    const result = PAGE_EDUCATIONS.find(entry => entry.key === key);
    return result ? { ...result, automatic: true, rawRoll: null, modifier: null, modifiedRoll: null } : null;
  }
  const rawRoll = getRollValue(session, 'page.education');
  if (!rawRoll || !father || !sonNumber) return null;
  const modifier = Number(father.pageModifier || 0) + Number(sonNumber);
  const modifiedRoll = rawRoll + modifier;
  return { ...findByRange(PAGE_EDUCATIONS, modifiedRoll), rawRoll, modifier, modifiedRoll };
};

const createIdentityAndFamily = (session, draft) => {
  const successorContext = session.successorContext;
  const campaignYear = Number(successorContext?.predecessor?.personal?.campaignYear || 767);
  draft.personal = {
    name: String(session.choices.name || '').trim(),
    gender: session.choices.gender,
    age: 15,
    campaignYear,
    sonNumber: null,
    blessing: '',
    homeland: successorContext?.predecessor?.personal?.homeland || 'Ardennes',
    home: successorContext?.predecessor?.personal?.home || 'Bastogne',
    culture: successorContext?.predecessor?.personal?.culture || 'Frankish',
    lineage: String(session.choices.family?.name || '').trim(),
    liegeLord: successorContext?.predecessor?.personal?.liegeLord || 'Duke Thierry',
    fathersClass: '',
    personalClass: 'Squire',
    maintenance: 'ordinary',
    features: []
  };
  draft.family = {
    ...DEFAULT_FAMILY,
    ...(session.choices.family || {}),
    characteristic: resolveFamilyCharacteristic(session, draft),
    patronSaint: resolveSaint(session, draft),
    muster: isFamilySuccessor(session) ? clone(successorContext?.family?.muster || {}) : {
      oldKnights: hasRoll(session, 'muster.old') ? Math.max(0, getRollValue(session, 'muster.old') - 5) : null,
      middleAgedKnights: hasRoll(session, 'muster.middle') ? Math.max(0, getRollValue(session, 'muster.middle') - 2) : null,
      youngKnights: hasRoll(session, 'muster.young') ? getRollValue(session, 'muster.young') + 1 : null,
      otherLineageMen: hasRoll(session, 'muster.men') ? getRollValue(session, 'muster.men') + 5 : null
    },
    honor: isFamilySuccessor(session) ? Number(successorContext?.family?.honor || 0) : getRollValue(session, 'family.honor') || null,
    standings: isFamilySuccessor(session) ? clone(successorContext?.family?.standings || {}) : {
      charlemagne: getRollValue(session, 'family.standingCharlemagne') || null,
      church: getRollValue(session, 'family.standingChurch') || null,
      commoners: getRollValue(session, 'family.standingCommoners') || null
    }
  };
};

const createAttributes = (session, draft) => {
  const femaleSpecific = session.choices.gender === 'female' && session.choices.femaleGeneration === 'femaleSpecific';
  const formulas = femaleSpecific
    ? { siz: 1, dex: 4, str: 1, con: 4, app: 5 }
    : { siz: 3, dex: 3, str: 3, con: 3, app: 3 };
  const attributes = {};
  ATTRIBUTE_KEYS.forEach(key => {
    const rolled = getRollValue(session, `attribute.${key}`);
    attributes[key] = rolled === undefined ? 0 : rolled + formulas[key] - 3;
    attributes[key] += Number(session.choices.attributeBonuses?.[key] || 0);
  });
  const familyAttributeEffects = draft.family.characteristic?.effects?.attributes || {};
  Object.entries(familyAttributeEffects).forEach(([key, amount]) => {
    const before = attributes[key] || 0;
    attributes[key] = before + amount;
    logModifier(draft, { stepId: 'attributes', ruleId: session.choices.gender === 'female' ? 'CHAR-FAMCHAR-F-001' : 'CHAR-FAMCHAR-M-001', sourceLabel: draft.family.characteristic.label, targetGroup: 'attributes', targetKey: key, before, amount, after: attributes[key] });
  });
  attributes.currentHp = attributes.siz + attributes.con;
  return attributes;
};

const createTraits = (session, draft, father, page) => {
  let traits = {};
  TRAIT_PAIRS.forEach(([virtue]) => {
    const base = getRollValue(session, `trait.${virtue}`);
    traits = setOpposedTraitValue(traits, virtue, base || 0);
  });

  Object.entries(father?.effects?.traits || {}).forEach(([key, amount]) => {
    traits = applyTraitModifier(draft, traits, key, amount, `Father: ${father.label}`, 'traits', 'CHAR-FATHER-001');
  });
  Object.entries(page?.effects?.traits || {}).forEach(([key, amount]) => {
    traits = applyTraitModifier(draft, traits, key, amount, `Page education: ${page.label}`, 'traits', 'CHAR-PAGE-001');
  });
  ['energetic', 'generous', 'valorous'].forEach(key => {
    const amount = getRollValue(session, `culture.${key}`) || 0;
    traits = applyTraitModifier(draft, traits, key, amount, 'Frankish culture', 'cultureHomeland', 'CHAR-CULTURE-001');
  });
  RELIGIOUS_TRAITS.forEach(key => {
    traits = applyTraitModifier(draft, traits, key, 1, 'Frankish Christian culture', 'cultureHomeland', 'CHAR-CULTURE-001');
  });
  ['temperate', 'modest'].forEach(key => {
    const amount = getRollValue(session, `homeland.${key}`) || 0;
    traits = applyTraitModifier(draft, traits, key, amount, 'Ardennes homeland', 'cultureHomeland', 'CHAR-HOMELAND-001');
  });
  traits = applyTraitModifier(draft, traits, 'suspicious', getRollValue(session, 'homeland.suspicious') || 0, 'Ardennes homeland', 'cultureHomeland', 'CHAR-HOMELAND-001');
  Object.entries(draft.family.patronSaint?.effects?.traits || {}).forEach(([key, amount]) => {
    traits = applyTraitModifier(draft, traits, key, amount, `Patron saint: ${draft.family.patronSaint.label}`, 'traits', 'CHAR-SAINT-001');
  });
  return traits;
};

const createPassions = (session, draft, page) => {
  const passions = {
    honor: roundPaladin((Number(draft.traits.generous || 0) + Number(draft.traits.just || 0) + Number(draft.traits.valorous || 0)) / 3),
    loveCharlemagne: getRollValue(session, 'passion.loveCharlemagne') || 0,
    loveFamily: (getRollValue(session, 'passion.loveFamily') || 0) + 10 - Number(draft.personal.sonNumber || 1),
    loveGod: Math.min(...RELIGIOUS_TRAITS.map(key => Number(draft.traits[key] || 0)))
  };
  applyNumberModifier(draft, passions, 'honor', 1, 'Frankish culture', 'passions', 'CHAR-CULTURE-001', Number.MAX_SAFE_INTEGER, 'passions');
  applyNumberModifier(draft, passions, 'loveGod', 1, 'Frankish culture', 'passions', 'CHAR-CULTURE-001', Number.MAX_SAFE_INTEGER, 'passions');
  Object.entries(page?.effects?.passions || {}).forEach(([key, amount]) => {
    applyNumberModifier(draft, passions, key, amount, `Page education: ${page.label}`, 'passions', 'CHAR-PAGE-001', Number.MAX_SAFE_INTEGER, 'passions');
  });
  Object.entries(draft.family.patronSaint?.effects?.passions || {}).forEach(([key, amount]) => {
    applyNumberModifier(draft, passions, key, amount, `Patron saint: ${draft.family.patronSaint.label}`, 'passions', 'CHAR-SAINT-001', Number.MAX_SAFE_INTEGER, 'passions');
  });
  draft.passionCalculations = {
    honor: `(Generous ${draft.traits.generous} + Just ${draft.traits.just} + Valorous ${draft.traits.valorous}) / 3, rounded, +1 Frankish`,
    loveCharlemagne: `2d6+3 = ${getRollValue(session, 'passion.loveCharlemagne') || 0}`,
    loveFamily: `1d6 + 10 - son number ${draft.personal.sonNumber}`,
    loveGod: `lowest Religious trait ${Math.min(...RELIGIOUS_TRAITS.map(key => draft.traits[key]))} + 1 Frankish`
  };
  return passions;
};

const createStandings = draft => ({
  charlemagne: Math.min(...CHIVALROUS_TRAITS.map(key => Number(draft.traits[key] || 0))),
  liegeLord: Number(draft.traits.valorous || 0),
  family: Number(draft.passions.honor || 0),
  retinue: Number(draft.traits.generous || 0),
  church: Number(draft.passions.loveGod || 0),
  commoners: Number(draft.traits.merciful || 0)
});

const createSkills = (session, draft, father, page) => {
  const profile = session.choices.gender === 'female' && session.choices.femaleGeneration === 'femaleSpecific' ? 'female' : 'male';
  const formulas = FRANKISH_SKILL_FORMULAS[profile];
  const skills = {};
  Object.entries(formulas).forEach(([key, formula]) => {
    if (typeof formula === 'number') skills[key] = formula;
    else if (formula === 'halfDex') skills[key] = roundPaladin(Number(draft.attributes.dex || 0) / 2);
    else skills[key] = getRollValue(session, `skill.${key}`) || 0;
  });

  const fatherSkillEffects = { ...(father?.effects?.skills || {}) };
  if (father?.choice === 'mercenaryMelee' && session.choices.mercenaryMelee) fatherSkillEffects[session.choices.mercenaryMelee] = 3;
  Object.entries(fatherSkillEffects).forEach(([key, amount]) => {
    applyNumberModifier(draft, skills, key, amount, `Father: ${father.label}`, 'skills', 'CHAR-FATHER-001');
  });
  Object.entries(page?.effects?.skills || {}).forEach(([key, amount]) => {
    applyNumberModifier(draft, skills, key, amount, `Page education: ${page.label}`, 'skills', 'CHAR-PAGE-001');
  });
  applyNumberModifier(draft, skills, 'hunting', getRollValue(session, 'homeland.hunting') || 0, 'Ardennes homeland', 'skills', 'CHAR-HOMELAND-001');

  Object.keys(skills).forEach(key => {
    if (skills[key] > 15) {
      const before = skills[key];
      skills[key] = 15;
      logModifier(draft, { stepId: 'skills', ruleId: 'CHAR-SKILL-ORDER-001', sourceLabel: 'Pre-training creation cap', targetGroup: 'skills', targetKey: key, before, amount: 0, after: 15, cap: 15 });
    }
  });

  draft.skillsBeforeTraining = { ...skills };

  const allocations = session.choices.skillTraining || {};
  Object.entries(allocations).forEach(([key, amount]) => {
    const points = Math.max(0, asInt(amount));
    if (points > 0 && Number(skills[key] || 0) > 0) {
      applyNumberModifier(draft, skills, key, points, 'Father class skill-point training', 'skills', 'CHAR-SKILL-ORDER-001', 15);
    }
  });

  Object.entries(draft.family.characteristic?.effects?.skills || {}).forEach(([key, amount]) => {
    applyNumberModifier(draft, skills, key, amount, `Family characteristic: ${draft.family.characteristic.label}`, 'skills', 'CHAR-FAMCHAR-M-001', 20);
  });
  Object.entries(draft.family.patronSaint?.effects?.skills || {}).forEach(([key, amount]) => {
    applyNumberModifier(draft, skills, key, amount, `Patron saint: ${draft.family.patronSaint.label}`, 'skills', 'CHAR-SAINT-001', 20);
  });
  const available = Number(father?.skillPoints || 0);
  const allocated = sum(Object.values(allocations).map(value => Math.max(0, asInt(value))));
  draft.skillTrainingSummary = { available, allocated, remaining: available - allocated };
  return skills;
};

const applyLegacyGroup = (session, draft, group, scores) => {
  const transfers = session.successorContext?.successorMode === 'same_family'
    ? session.successorContext?.availableScoreTransfers || []
    : [];
  transfers.filter(entry => entry.group === group).forEach(entry => {
    if (!Object.hasOwn(scores, entry.key)) return;
    const before = Number(scores[entry.key] || 0);
    const inherited = Math.min(Number(entry.predecessorValue || 0), Number(entry.cap || Number.MAX_SAFE_INTEGER));
    const after = Math.max(before, inherited);
    if (group === 'traits') {
      const adjusted = setOpposedTraitValue(scores, entry.key, after);
      Object.assign(scores, adjusted);
    } else {
      scores[entry.key] = after;
    }
    const applied = { ...entry, successorBefore: before, successorAfter: Number(scores[entry.key]), appliedAtStep: group };
    draft.legacyApplication.push(applied);
    logModifier(draft, {
      stepId: group === 'attributes' ? 'attributes' : group,
      ruleId: 'LIFE-LEGACY-001',
      sourceLabel: `Legacy score transfer from ${session.successorContext?.predecessor?.name || 'predecessor'}`,
      targetGroup: group,
      targetKey: entry.key,
      before,
      amount: Number(scores[entry.key]) - before,
      after: Number(scores[entry.key]),
      cap: entry.cap
    });
  });
  return scores;
};

const applySameFamilyAttributeBonus = (session, draft, attributes) => {
  if (session.successorContext?.successorMode !== 'same_family') return attributes;
  const predecessorGlory = Number(session.successorContext?.predecessor?.gear?.gloryTotal || 0);
  const amount = Math.min(10, Math.max(0, Math.floor(predecessorGlory / 1000)));
  applyNumberModifier(draft, attributes, 'app', amount, 'Same-family predecessor Glory', 'attributes', 'LIFE-NEWCHAR-001', Number.MAX_SAFE_INTEGER, 'attributes');
  return attributes;
};

const applySameFamilyValorousBonus = (session, draft, traits) => {
  if (session.successorContext?.successorMode !== 'same_family') return traits;
  const predecessorValorous = Number(session.successorContext?.predecessor?.traits?.valorous || 0);
  const amount = Math.max(0, predecessorValorous - 15);
  return applyTraitModifier(draft, traits, 'valorous', amount, 'Same-family predecessor Valorous', 'traits', 'LIFE-NEWCHAR-001');
};

const getQualification = draft => {
  const courtlyAtTen = SKILL_CATEGORIES.courtly.filter(key => Number(draft.skills[key] || 0) >= 10);
  const meleeAtThirteen = MELEE_WEAPON_SKILLS.filter(key => Number(draft.skills[key] || 0) >= 13);
  const requiresLance = Number(draft.personal.campaignYear || 767) >= 768;
  const requirements = [
    { key: 'valorous', label: 'Valorous 13', met: Number(draft.traits.valorous || 0) >= 13 },
    { key: 'honor', label: 'Honor 10', met: Number(draft.passions.honor || 0) >= 10 },
    { key: 'lordStanding', label: 'Standing [lord] 10', met: Number(draft.standings.liegeLord || 0) >= 10 },
    { key: 'firstAid', label: 'First Aid 10', met: Number(draft.skills.firstAid || 0) >= 10 },
    { key: 'horsemanship', label: 'Horsemanship 10', met: Number(draft.skills.horsemanship || 0) >= 10 },
    { key: 'courtly', label: 'Two courtly skills 10', met: courtlyAtTen.length >= 2, matches: courtlyAtTen },
    { key: 'battle', label: 'Battle 10', met: Number(draft.skills.battle || 0) >= 10 },
    { key: 'melee', label: 'Two melee weapon skills 13', met: meleeAtThirteen.length >= 2, matches: meleeAtThirteen },
    { key: 'lance', label: 'Phase 1+: Lance 10', met: !requiresLance || Number(draft.skills.lance || 0) >= 10, applies: requiresLance }
  ];
  return { qualified: requirements.every(item => item.met), requirements, courtlyAtTen, meleeAtThirteen };
};

const applySquireYears = (session, draft) => {
  const histories = [];
  let qualification = getQualification(draft);
  let age = 15;
  for (const yearPlan of session.squireYears || []) {
    if (qualification.qualified) break;
    age += 1;
    const changes = [];
    for (const category of yearPlan.categories || []) {
      if (category === 'attribute' && ATTRIBUTE_KEYS.includes(yearPlan.attributeKey)) {
        const key = yearPlan.attributeKey;
        const before = draft.attributes[key];
        draft.attributes[key] = Math.min(20, before + 1);
        changes.push({ group: 'attributes', key, before, after: draft.attributes[key] });
      }
      if (category === 'score' && ['traits', 'passions', 'standings'].includes(yearPlan.scoreGroup)) {
        const group = yearPlan.scoreGroup;
        const key = yearPlan.scoreKey;
        const before = Number(draft[group]?.[key] || 0);
        if (group === 'traits') draft.traits = adjustOpposedTrait(draft.traits, key, 1, 15);
        else if (draft[group] && Object.hasOwn(draft[group], key)) draft[group][key] = Math.min(15, before + 1);
        changes.push({ group, key, before, after: Number(draft[group]?.[key] || 0) });
      }
      if (category === 'skills') {
        Object.values(yearPlan.skills || {}).forEach(key => {
          if (!Object.hasOwn(draft.skills, key)) return;
          const before = Number(draft.skills[key] || 0);
          draft.skills[key] = Math.min(15, before + 1);
          changes.push({ group: 'skills', key, before, after: draft.skills[key] });
        });
      }
    }
    draft.personal.age = age;
    qualification = getQualification(draft);
    histories.push({ year: Number(draft.personal.campaignYear) - (draft.personal.age - age), age, categories: yearPlan.categories, changes, qualification });
  }
  draft.personal.age = age;
  draft.personal.personalClass = qualification.qualified ? 'Knight' : 'Squire';
  draft.squireYearHistory = histories.map((history, index) => ({
    ...history,
    year: Number(draft.personal.campaignYear || 767) - histories.length + index + 1
  }));
  draft.qualification = qualification;
};

const calculateDerived = attributes => ({
  damage: roundPaladin((Number(attributes.siz || 0) + Number(attributes.str || 0)) / 6),
  healingRate: roundPaladin((Number(attributes.con || 0) + Number(attributes.str || 0)) / 10),
  movementRate: roundPaladin((Number(attributes.str || 0) + Number(attributes.dex || 0)) / 10),
  totalHitPoints: Number(attributes.con || 0) + Number(attributes.siz || 0),
  unconscious: roundPaladin((Number(attributes.con || 0) + Number(attributes.siz || 0)) / 4),
  majorWound: Number(attributes.con || 0)
});

const calculateIdeals = (session, draft) => {
  const romanticPassion = Number(session.choices.romanticPassionValue || 0);
  const entries = {
    chivalrous: {
      key: 'chivalrous', label: 'Chivalrous', traitTotal: sum(CHIVALROUS_TRAITS.map(key => draft.traits[key])),
      passion: 'Honor', passionValue: draft.passions.honor
    },
    religious: {
      key: 'religious', label: 'Religious', traitTotal: sum(RELIGIOUS_TRAITS.map(key => draft.traits[key])),
      passion: 'Love [God]', passionValue: draft.passions.loveGod
    },
    romantic: {
      key: 'romantic', label: 'Romantic', traitTotal: sum(ROMANTIC_TRAITS.map(key => draft.traits[key])),
      passion: 'Amor or Love', passionValue: romanticPassion
    }
  };
  return Object.fromEntries(Object.entries(entries).map(([key, entry]) => [key, {
    ...entry,
    eligible: entry.traitTotal >= 90 && entry.passionValue >= 16,
    selected: (session.choices.selectedIdeals || []).includes(key)
  }]));
};

export const calculateCumulativeScoreGlory = score => {
  const value = Math.max(0, asInt(score));
  return value <= 15 ? 0 : ((value * (value + 1)) / 2) - 120;
};

const scoreGroupsForGlory = draft => ({
  attributes: Object.fromEntries(ATTRIBUTE_KEYS.map(key => [key, draft.attributes[key]])),
  traits: draft.traits,
  passions: draft.passions,
  standings: draft.standings,
  skills: draft.skills
});

const calculateScoreLedger = (draft, appliedAtStep = 'glory') => {
  const ledger = [];
  Object.entries(scoreGroupsForGlory(draft)).forEach(([group, values]) => {
    Object.entries(values).forEach(([key, value]) => {
      const amount = calculateCumulativeScoreGlory(value);
      if (amount > 0) {
        ledger.push({
          sourceRuleId: 'CHAR-GLORY-001',
          sourceLabel: `${group}.${key} at ${value}`,
          amount,
          calculation: `16 + ... + ${value}`,
          appliedAtStep,
          reversible: true,
          sourcePage: '36'
        });
      }
    });
  });
  return ledger;
};

const giftForRoll = roll => findByRange(BIRTH_GIFTS, roll);

const resolveGiftTree = (session, draft, path, roll, state, options = {}) => {
  const gift = giftForRoll(roll);
  if (!gift) return;
  if (gift.special === 'rollTwice') {
    if (options.ignoreNineteen) {
      const rerollKey = `${path}.ignore19`;
      const reroll = getRollValue(session, rerollKey);
      if (!reroll) draft.gifts.pendingRolls.push({ key: rerollKey, notation: '1d20', label: 'Reroll ignored 19', stepId: 'birthGift', ruleId: 'CHAR-GIFT-001', sourcePage: '40' });
      else resolveGiftTree(session, draft, rerollKey, reroll, state, options);
      return;
    }
    ['a', 'b'].forEach(suffix => {
      const childKey = `${path}.${suffix}`;
      const childRoll = getRollValue(session, childKey);
      if (!childRoll) draft.gifts.pendingRolls.push({ key: childKey, notation: '1d20', label: `Birth gift ${path} extra roll ${suffix.toUpperCase()}`, stepId: 'birthGift', ruleId: 'CHAR-GIFT-001', sourcePage: '40' });
      else resolveGiftTree(session, draft, childKey, childRoll, state, { ignoreNineteen: true });
    });
    return;
  }
  if (gift.key === 'playerChoice') {
    const chosenRoll = asInt(session.choices.birthGiftChoices?.[path], 0);
    if (chosenRoll < 1 || chosenRoll > 19) {
      addUnresolved(draft, { id: `gift-choice-${path}`, stepId: 'birthGift', ruleId: 'CHAR-GIFT-001', label: `Choose a printed inheritance for ${path}.` });
      return;
    }
    resolveGiftTree(session, draft, `${path}.choice`, chosenRoll, state);
    return;
  }
  if (gift.special === 'outfitUpgrade') {
    if (state.outfitUpgrades > 0) {
      const rerollKey = `${path}.duplicate15`;
      const reroll = getRollValue(session, rerollKey);
      if (!reroll) draft.gifts.pendingRolls.push({ key: rerollKey, notation: '1d20', label: 'Reroll additional outfit-upgrade result', stepId: 'birthGift', ruleId: 'CHAR-GIFT-001', sourcePage: '40' });
      else resolveGiftTree(session, draft, rerollKey, reroll, state, options);
      return;
    }
    state.outfitUpgrades += 1;
  }

  const resolved = { path, roll, ...gift };
  if (gift.key === 'sacredRelic') {
    const relicRollKey = `${path}.relicType`;
    const relicRoll = getRollValue(session, relicRollKey);
    const trait = session.choices.relicTraits?.[path];
    if (!relicRoll) draft.gifts.pendingRolls.push({ key: relicRollKey, notation: '1d6', label: `Sacred relic type for ${path}`, stepId: 'birthGift', ruleId: 'CHAR-GIFT-001', sourcePage: '40' });
    else resolved.relicType = RELIC_TYPES[relicRoll - 1];
    if (!RELIGIOUS_TRAITS.includes(trait)) {
      addUnresolved(draft, { id: `gift-relic-${path}`, stepId: 'birthGift', ruleId: 'CHAR-GIFT-001', label: `Choose one printed Religious trait for ${path}.` });
    } else resolved.religiousTrait = trait;
  }
  if (gift.key === 'exceptionalWeapon') {
    const weapon = session.choices.exceptionalWeapons?.[path];
    if (!MELEE_WEAPON_SKILLS.includes(weapon)) {
      addUnresolved(draft, { id: `gift-weapon-${path}`, stepId: 'birthGift', ruleId: 'CHAR-GIFT-001', label: `Choose an exceptional melee weapon for ${path}.` });
    } else resolved.weapon = weapon;
  }
  state.entries.push(resolved);
};

const resolveBirthGifts = (session, draft, giftRollCount) => {
  draft.gifts = { entries: [], pendingRolls: [], outfitUpgrades: 0 };
  const state = { entries: [], outfitUpgrades: 0 };
  for (let index = 1; index <= Number(giftRollCount || 0); index += 1) {
    const key = `gift.${index}`;
    const roll = getRollValue(session, key);
    if (!roll) draft.gifts.pendingRolls.push({ key, notation: '1d20', label: `Birth gift roll ${index}`, stepId: 'birthGift', ruleId: 'CHAR-GIFT-001', sourcePage: '40' });
    else resolveGiftTree(session, draft, key, roll, state);
  }
  draft.gifts.entries = state.entries;
  draft.gifts.outfitUpgrades = state.outfitUpgrades;
};

const applyBirthGiftEffects = (draft, snapshotBeforeGifts) => {
  draft.gearExtras = { cash: 0, possessions: [], conditionalModifiers: [], annualStipend: 0, extraHorses: {} };
  draft.gifts.entries.forEach(gift => {
    if (gift.cash) draft.gearExtras.cash += gift.cash;
    if (gift.annualStipend) draft.gearExtras.annualStipend += gift.annualStipend;
    if (gift.conditionalModifier) draft.gearExtras.conditionalModifiers.push({ ...gift.conditionalModifier, source: gift.label, sourceRuleId: 'CHAR-GIFT-001' });
    if (gift.key === 'extraPalfrey') draft.gearExtras.extraHorses.palfrey = (draft.gearExtras.extraHorses.palfrey || 0) + 1;
    if (gift.key === 'extraCharger') draft.gearExtras.extraHorses.charger = (draft.gearExtras.extraHorses.charger || 0) + 1;
    if (gift.key === 'sacredRelic' && gift.religiousTrait) {
      draft.traits = applyTraitModifier(draft, draft.traits, gift.religiousTrait, 2, `Birth gift: ${gift.label}`, 'birthGift', 'CHAR-GIFT-001');
    }
    if (gift.key === 'exceptionalWeapon' && gift.weapon) {
      const amount = gift.weapon === 'sword' ? 1 : 3;
      applyNumberModifier(draft, draft.skills, gift.weapon, amount, `Birth gift: ${gift.label}`, 'birthGift', 'CHAR-GIFT-001');
    }
    if (['decoratedSaddle', 'magnificentCloak', 'blessedSpear', 'blessedSword', 'goldenRing', 'sacredRelic', 'exceptionalWeapon', 'healingPotion'].includes(gift.key)) {
      draft.gearExtras.possessions.push(gift.relicType ? `${gift.label} (${gift.relicType})` : gift.label);
    }
  });
  draft.giftScoreGlory = Math.max(0,
    sum(calculateScoreLedger(draft, 'birthGift').map(entry => entry.amount)) -
    sum(calculateScoreLedger(snapshotBeforeGifts, 'glory').map(entry => entry.amount))
  );
};

const createOutfit = (draft, father) => {
  if (!father?.outfit) return null;
  const sonPenalty = Number(draft.personal.sonNumber || 1) > 1 ? 1 : 0;
  const rank = clamp(Number(father.outfit) - sonPenalty + Number(draft.gifts?.outfitUpgrades || 0), 1, 6);
  const phase = Number(draft.personal.campaignYear || 767) >= 801 ? 4 : Number(draft.personal.campaignYear || 767) >= 790 ? 3 : Number(draft.personal.campaignYear || 767) >= 779 ? 2 : Number(draft.personal.campaignYear || 767) >= 768 ? 1 : 0;
  const source = STARTING_OUTFITS[rank];
  const horses = { ...source.horses };
  if (rank === 6 && phase >= 3) {
    horses.charger -= 1;
    horses.destrier = 1;
  }
  Object.entries(draft.gearExtras?.extraHorses || {}).forEach(([key, value]) => {
    horses[key] = (horses[key] || 0) + value;
  });
  return { rank, baseRank: father.outfit, sonPenalty, giftUpgrades: draft.gifts?.outfitUpgrades || 0, phase, ...source, horses, armor: source.armorByPhase[phase] };
};

const createGloryLedger = (session, draft, father, page, beforeGifts) => {
  const sameFamilyGlory = session.successorContext?.successorMode === 'same_family';
  const fatherAmount = sameFamilyGlory
    ? roundPaladin(Number(session.successorContext?.predecessor?.gear?.gloryTotal || 0) / 10)
    : session.choices.glorySource === 'fatherHistory'
    ? roundPaladin(Number(session.choices.fatherHistoryGlory || 0) / 10)
    : Number(father?.glory || 0);
  const ledger = [
    { sourceRuleId: sameFamilyGlory ? 'LIFE-NEWCHAR-001' : 'CHAR-FATHER-001', sourceLabel: sameFamilyGlory ? 'One tenth of predecessor Glory' : session.choices.glorySource === 'fatherHistory' ? 'One tenth of father history Glory' : `Father class: ${father?.label || 'Unresolved'}`, amount: fatherAmount, calculation: sameFamilyGlory ? `${Number(session.successorContext?.predecessor?.gear?.gloryTotal || 0)} / 10` : session.choices.glorySource === 'fatherHistory' ? `${Number(session.choices.fatherHistoryGlory || 0)} / 10` : 'Table 1-4 or 1-5', appliedAtStep: 'glory', reversible: true, sourcePage: sameFamilyGlory ? '42-43' : '30-31, 36' },
    { sourceRuleId: 'CHAR-PAGE-001', sourceLabel: `Page education: ${page?.label || 'Unresolved'}`, amount: Number(page?.glory || 0), calculation: 'Table 1-7', appliedAtStep: 'glory', reversible: true, sourcePage: '31-32, 36' },
    ...calculateScoreLedger(beforeGifts, 'glory')
  ];
  if (draft.qualification?.qualified) {
    ledger.push({ sourceRuleId: 'CHAR-GLORY-001', sourceLabel: 'Knighthood', amount: 1000, calculation: 'Printed knighting award', appliedAtStep: 'glory', reversible: false, sourcePage: '36' });
  }
  if (draft.giftScoreGlory > 0) {
    ledger.push({ sourceRuleId: 'CHAR-GIFT-001', sourceLabel: 'Birth-gift increase to scores over 15', amount: draft.giftScoreGlory, calculation: 'Post-gift cumulative score Glory minus pre-gift cumulative score Glory', appliedAtStep: 'birthGift', reversible: true, sourcePage: '36, 40' });
  }
  return ledger;
};

const annotateRollLog = (session, draft) => {
  const tableResults = {
    'family.characteristic': draft.family.characteristic?.label,
    'family.saint': draft.family.patronSaint?.label,
    'father.class': draft.father?.label,
    'father.subclass': draft.father?.parentClass ? draft.father.label : null,
    'father.survival': draft.fatherSurvival?.label,
    'page.education': draft.pageEducation?.label,
    'feature.category': draft.distinctiveFeature?.categoryLabel,
    'legacy.blessing': draft.legacyBlessing?.label
  };
  draft.gifts?.entries.forEach(gift => { tableResults[gift.path] = gift.label; });
  return session.rollLog.map(entry => ({
    ...entry,
    modifiedResult: entry.key === 'page.education' && draft.pageEducation ? draft.pageEducation.modifiedRoll : entry.modifiedResult,
    tableResult: tableResults[entry.key] || entry.tableResult || null
  }));
};

const getStepIssues = (session, draft, stepId) => {
  const issues = [];
  const requireRolls = keys => keys.forEach(key => { if (!hasRoll(session, key)) issues.push(`Roll ${key}.`); });
  if (stepId === 'mode') {
    if (!String(session.choices.name || '').trim()) issues.push('Enter one Frankish name.');
    if (session.choices.gender === 'female' && session.choices.femaleGeneration === 'femaleSpecific') {
      issues.push('The female-specific son-number ordering is source-ambiguous and awaits user confirmation; use the printed male-equivalent route for now.');
    }
  }
  if (stepId === 'family') {
    if (!isFamilySuccessor(session)) {
      ['name', 'motto', 'battleCry', 'ancestor', 'homeCounty', 'greatNoble'].forEach(key => {
        if (!String(session.choices.family?.[key] || '').trim()) issues.push(`Enter family ${key}.`);
      });
    }
  }
  if (stepId === 'familyCharacteristic' && !isFamilySuccessor(session)) requireRolls(['family.characteristic']);
  if (stepId === 'saint' && !isFamilySuccessor(session)) requireRolls(['family.saint']);
  if (stepId === 'father') {
    if (isFamilySuccessor(session)) {
      if (!session.choices.successorFatherClass) issues.push('Choose the predecessor or household father class at career end or knighting.');
      if (session.choices.successorFatherClass === 'lord' && !session.choices.lordType) issues.push('Choose the father lord type.');
    } else {
      requireRolls(['muster.old', 'muster.middle', 'muster.young', 'muster.men', 'family.honor', 'family.standingCharlemagne', 'family.standingChurch', 'family.standingCommoners', 'father.class', 'father.survival']);
    }
    if (draft.father?.pendingSubtable) issues.push('Roll the Lord or Officer subtable.');
    if (draft.father?.officer && !hasRoll(session, 'father.officerPatron')) issues.push("Roll the officer's patron rank.");
    if (draft.fatherSurvival?.key === 'missing' && !draft.fatherSurvival.missingYears) issues.push('Roll missing years.');
  }
  if (stepId === 'sonNumber' && !draft.personal.sonNumber) issues.push('Resolve son number.');
  if (stepId === 'pageEducation' && !draft.pageEducation) issues.push('Roll Page Education.');
  if (stepId === 'pageEducation' && session.choices.pageEducationMethod === 'fatherCourt') {
    const eligible = draft.father?.key === 'lord' || draft.father?.officer;
    if (!eligible) issues.push("This father has no printed automatic Page Education option; use the table roll.");
    const religiousPatron = ['Lay Bishop', 'Lay Abbot'].includes(draft.father?.detail) || draft.father?.officerPatron === 'Lay Bishop or Lay Abbot';
    if (religiousPatron && !['greatMonastery', 'smallMonastery'].includes(session.choices.pageAutomaticChoice)) issues.push('Choose monastery or great monastery training.');
  }
  if (stepId === 'cultureHomeland') requireRolls(['culture.energetic', 'culture.generous', 'culture.valorous', 'homeland.hunting', 'homeland.temperate', 'homeland.modest', 'homeland.suspicious']);
  if (stepId === 'attributes') {
    requireRolls(ATTRIBUTE_KEYS.map(key => `attribute.${key}`));
    const bonuses = session.choices.attributeBonuses || {};
    if (sum(ATTRIBUTE_KEYS.map(key => bonuses[key])) !== 5) issues.push('Allocate exactly 5 attribute points.');
    if (ATTRIBUTE_KEYS.some(key => Number(bonuses[key] || 0) < 0 || Number(bonuses[key] || 0) > 3)) issues.push('No attribute may receive more than +3.');
  }
  if (stepId === 'feature') {
    if (session.choices.featureMode === 'roll') requireRolls(['feature.category']);
    else if (!DISTINCTIVE_FEATURES.some(item => item.key === session.choices.featureCategory)) issues.push('Choose a printed feature category.');
  }
  if (stepId === 'traits') requireRolls(TRAIT_PAIRS.map(([virtue]) => `trait.${virtue}`));
  if (stepId === 'passions') requireRolls(['passion.loveCharlemagne', 'passion.loveFamily']);
  if (stepId === 'standings' && !draft.standings) issues.push('Resolve traits and passions first.');
  if (stepId === 'skills') {
    const profile = session.choices.gender === 'female' && session.choices.femaleGeneration === 'femaleSpecific' ? 'female' : 'male';
    requireRolls(Object.entries(FRANKISH_SKILL_FORMULAS[profile]).filter(([, formula]) => typeof formula === 'string' && formula !== 'halfDex').map(([key]) => `skill.${key}`));
    const availablePoints = Number(draft.father?.skillPoints || 0);
    const allocations = session.choices.skillTraining || {};
    const allocated = sum(Object.values(allocations).map(value => Math.max(0, asInt(value))));
    if (allocated !== availablePoints) issues.push(`Allocate exactly ${availablePoints} father-class skill points.`);
    Object.entries(allocations).forEach(([key, amount]) => {
      if (Number(amount || 0) > 0 && Number(draft.skillsBeforeTraining?.[key] || 0) <= 0) issues.push(`Training cannot raise ${key} from 0.`);
      if (Number(amount || 0) > 0 && Number(draft.skillsBeforeTraining?.[key] || 0) + Number(amount || 0) > 15) issues.push(`Training allocation for ${key} exceeds the creation cap of 15.`);
    });
  }
  if (stepId === 'squireYears' && !draft.qualification?.qualified) issues.push('Add one squire year at a time until every knighthood requirement is met.');
  if (stepId === 'ideals') {
    (session.choices.selectedIdeals || []).forEach(key => { if (!draft.ideals?.[key]?.eligible) issues.push(`${key} is selected but is not eligible.`); });
  }
  if (stepId === 'glory' && !draft.qualification?.qualified) issues.push('Initial Glory is finalized only after knighthood qualification.');
  if (stepId === 'outfit') {
    if (draft.inheritedEquipment?.length && typeof session.choices.inheritEquipmentInsteadOfOutfit !== 'boolean') issues.push('Choose inherited equipment or Table 1-14 outfit.');
    if (!draft.outfit && !draft.usesInheritedEquipment) issues.push('Resolve father class and son number first.');
  }
  if (stepId === 'birthGift') {
    if (draft.gifts.pendingRolls.length) issues.push('Resolve every required Birth Gift roll and reroll.');
    if (session.successorContext?.blessingGrant && !session.successorContext.blessingGrant.consumed && !draft.legacyBlessing) issues.push('Resolve the granted Table 1-17 blessing roll.');
  }
  if (stepId === 'review') {
    if (!String(session.choices.story || '').trim()) issues.push('Record the character story before completion.');
    CHARACTER_CREATION_STEPS.slice(0, -1).forEach(step => {
      const prior = getStepIssues(session, draft, step.id);
      if (prior.length) issues.push(`${step.shortTitle}: ${prior[0]}`);
    });
  }
  draft.unresolvedChoices.filter(item => item.stepId === stepId).forEach(item => issues.push(item.label));
  return [...new Set(issues)];
};

export const recomputeCharacterCreationSession = rawSession => {
  const session = clone(rawSession);
  const draft = { modifierLog: [], unresolvedChoices: [], legacyApplication: [] };
  createIdentityAndFamily(session, draft);
  draft.father = resolveFather(session, draft);
  draft.fatherSurvival = resolveFatherSurvival(session);
  draft.personal.sonNumber = resolveSonNumber(session, draft.father);
  draft.personal.fathersClass = draft.father?.detail || draft.father?.label || '';
  draft.pageEducation = resolvePageEducation(session, draft.father, draft.personal.sonNumber);
  draft.attributes = applyLegacyGroup(session, draft, 'attributes', applySameFamilyAttributeBonus(session, draft, createAttributes(session, draft)));
  draft.traits = applyLegacyGroup(session, draft, 'traits', applySameFamilyValorousBonus(session, draft, createTraits(session, draft, draft.father, draft.pageEducation)));
  draft.passions = applyLegacyGroup(session, draft, 'passions', createPassions(session, draft, draft.pageEducation));
  draft.standings = applyLegacyGroup(session, draft, 'standings', createStandings(draft));
  draft.skills = applyLegacyGroup(session, draft, 'skills', createSkills(session, draft, draft.father, draft.pageEducation));
  applySquireYears(session, draft);
  if (Number(session.successorContext?.candidate?.age) > Number(draft.personal.age)) {
    draft.personal.age = Number(session.successorContext.candidate.age);
  }
  draft.derived = calculateDerived(draft.attributes);
  draft.attributes.currentHp = draft.derived.totalHitPoints;
  draft.ideals = calculateIdeals(session, draft);
  const categoryRoll = getRollValue(session, 'feature.category');
  const category = session.choices.featureMode === 'choose'
    ? DISTINCTIVE_FEATURES.find(item => item.key === session.choices.featureCategory)
    : DISTINCTIVE_FEATURES.find(item => item.roll === categoryRoll);
  draft.distinctiveFeature = category ? { category: category.key, categoryLabel: category.label, sourceText: category.label, userText: String(session.choices.featureText || '').trim() } : null;
  if (draft.distinctiveFeature) draft.personal.features = [draft.distinctiveFeature.userText || draft.distinctiveFeature.categoryLabel];
  const beforeGifts = clone(draft);
  const legacyGiftCount = session.successorContext?.successorMode === 'same_family' && !session.successorContext?.birthGiftGrant?.consumed
    ? Number(session.successorContext?.birthGiftGrant?.count || 0)
    : 0;
  resolveBirthGifts(session, draft, Number(draft.father?.giftRolls || 0) + legacyGiftCount);
  applyBirthGiftEffects(draft, beforeGifts);
  draft.inheritedEquipment = session.successorContext?.successorMode === 'same_family'
    ? clone(session.successorContext?.inheritedEquipment || [])
    : [];
  draft.inheritedManors = session.successorContext?.successorMode === 'same_family'
    ? clone(session.successorContext?.inheritedManors || [])
    : [];
  draft.usesInheritedEquipment = draft.inheritedEquipment.length > 0 && session.choices.inheritEquipmentInsteadOfOutfit === true;
  draft.outfit = draft.usesInheritedEquipment ? null : createOutfit(draft, draft.father);
  const blessingRoll = getRollValue(session, 'legacy.blessing');
  draft.legacyBlessing = blessingRoll ? { roll: blessingRoll, ...findByRange(SAINT_BLESSINGS, blessingRoll) } : null;
  draft.gloryLedger = createGloryLedger(session, draft, draft.father, draft.pageEducation, beforeGifts);
  draft.gloryTotal = sum(draft.gloryLedger.map(entry => entry.amount));
  draft.story = String(session.choices.story || '');
  draft.manualOverrides = clone(session.choices.manualOverrides || []);
  draft.rulebookDeviations = session.choices.gender === 'female' && session.choices.femaleGeneration === 'femaleSpecific'
    ? [{ ruleId: 'CHAR-FEMALE-001', note: 'Female-specific son-number ordering awaits source interpretation confirmation.' }]
    : [];

  const stepStates = Object.fromEntries(CHARACTER_CREATION_STEPS.map(step => {
    const issues = getStepIssues(session, draft, step.id);
    return [step.id, { resolved: issues.length === 0, canAdvance: issues.length === 0, issues }];
  }));
  let maxUnlockedStep = 0;
  for (let index = 0; index < CHARACTER_CREATION_STEPS.length - 1; index += 1) {
    if (!stepStates[CHARACTER_CREATION_STEPS[index].id].resolved) break;
    maxUnlockedStep = index + 1;
  }
  session.draftCharacter = draft;
  session.modifierLog = draft.modifierLog;
  session.unresolvedChoices = draft.unresolvedChoices;
  session.stepStates = stepStates;
  session.maxUnlockedStep = maxUnlockedStep;
  session.rollLog = annotateRollLog(session, draft);
  session.rolls = Object.fromEntries(session.rollLog.map(entry => [entry.key, entry]));
  const currentStep = CHARACTER_CREATION_STEPS[clamp(session.currentStep, 0, CHARACTER_CREATION_STEPS.length - 1)];
  if (session.status !== 'completed' && session.status !== 'abandoned') {
    session.status = stepStates[currentStep.id].issues.some(issue => issue.toLowerCase().includes('choose') || issue.toLowerCase().includes('enter') || issue.toLowerCase().includes('allocate') || issue.toLowerCase().includes('record'))
      ? 'awaiting_choice'
      : 'in_progress';
  }
  return session;
};

export const createCharacterCreationSession = ({ seed, mode = 'core', existingFamily = null, successorContext = null, now = new Date() } = {}) => {
  const createdAt = nowIso(now);
  const normalizedSeed = String(seed || `paladin-${createdAt}`);
  const session = {
    id: `cc-${hashSeed(`${normalizedSeed}:${createdAt}`).toString(16)}`,
    version: SESSION_VERSION,
    status: 'in_progress',
    mode,
    successorContext: successorContext ? clone(successorContext) : null,
    sourceEdition: 'Paladin core rulebook, 2018 PDF',
    seed: normalizedSeed,
    rollIndex: 0,
    currentStep: 0,
    createdAt,
    updatedAt: createdAt,
    completedAt: null,
    completionId: null,
    choices: {
      name: successorContext?.candidate?.name || '',
      gender: 'male',
      femaleGeneration: 'maleEquivalent',
      familyMode: existingFamily?.name ? 'reuse' : 'new',
      family: existingFamily?.name ? {
        name: existingFamily.name || '',
        motto: existingFamily.motto || '',
        battleCry: existingFamily.battleCry || '',
        ancestor: existingFamily.ancestor || '',
        homeCounty: existingFamily.homeCounty || existingFamily.homeCountry || 'Ardennes',
        greatNoble: existingFamily.notableMembers || ''
      } : { ...DEFAULT_FAMILY },
      familyCharacteristicBattleSkill: '',
      familyCharacteristicChoice: '',
      saintChoice: '',
      lordType: '',
      successorFatherClass: '',
      mercenaryMelee: '',
      sonNumberMethod: 'first',
      pageEducationMethod: 'roll',
      pageAutomaticChoice: '',
      attributeBonuses: { ...DEFAULT_ATTRIBUTE_BONUSES },
      featureMode: 'roll',
      featureCategory: '',
      featureText: '',
      skillTraining: {},
      selectedIdeals: [],
      romanticPassionValue: 0,
      glorySource: 'fatherClass',
      fatherHistoryGlory: 0,
      inheritEquipmentInsteadOfOutfit: successorContext?.inheritedEquipment?.length ? null : false,
      birthGiftChoices: {},
      relicTraits: {},
      exceptionalWeapons: {},
      story: '',
      manualOverrides: []
    },
    rolls: {},
    rollLog: [],
    choiceLog: [],
    modifierLog: [],
    invalidationLog: [],
    unresolvedChoices: [],
    squireYears: [],
    draftCharacter: {},
    stepStates: {}
  };
  return recomputeCharacterCreationSession(session);
};

const rollSpecsForStep = (session, stepId) => {
  const draft = session.draftCharacter || {};
  const specs = [];
  const add = (key, notation, label, ruleId, sourcePage) => specs.push({ key, notation, label, stepId, ruleId, sourcePage });
  if (stepId === 'familyCharacteristic' && !isFamilySuccessor(session)) add('family.characteristic', '1d20', 'Family Characteristic', session.choices.gender === 'female' && session.choices.femaleGeneration === 'femaleSpecific' ? 'CHAR-FAMCHAR-F-001' : 'CHAR-FAMCHAR-M-001', '28');
  if (stepId === 'saint' && !isFamilySuccessor(session)) add('family.saint', '1d20', 'Family Patron Saint', 'CHAR-SAINT-001', '28-29');
  if (stepId === 'father' && !isFamilySuccessor(session)) {
    add('muster.old', '1d6', 'Old family knights', 'CHAR-MUSTER-001', '29');
    add('muster.middle', '1d6', 'Middle-aged family knights', 'CHAR-MUSTER-001', '29');
    add('muster.young', '1d6', 'Young family knights', 'CHAR-MUSTER-001', '29');
    add('muster.men', '3d6', 'Other lineage men', 'CHAR-MUSTER-001', '29');
    add('family.honor', '2d6+3', 'Family Honor', 'CHAR-FAMILY-001', '30');
    add('family.standingCharlemagne', '2d6', 'Family Standing [Charlemagne]', 'CHAR-FAMILY-001', '30');
    add('family.standingChurch', '2d6', 'Family Standing [Church]', 'CHAR-FAMILY-001', '30');
    add('family.standingCommoners', '2d6', 'Family Standing [Commoners]', 'CHAR-FAMILY-001', '30');
    add('father.class', '1d20', "Father's Class", 'CHAR-FATHER-001', '30');
    add('father.survival', '1d20', "Father's Survival", 'CHAR-FATHER-SURV-001', '31');
    if (findByRange(FATHER_CLASSES, getRollValue(session, 'father.class'))?.subtable) add('father.subclass', '1d20', 'Lord or Officer Father', 'CHAR-FATHER-001', '31');
    if (draft.father?.officer) add('father.officerPatron', '1d6', "Officer's patron rank", 'CHAR-FATHER-001', '31');
    if (draft.fatherSurvival?.key === 'missing') add('father.missingYears', '2d6', 'Years father has been missing', 'CHAR-FATHER-SURV-001', '31');
  }
  if (stepId === 'sonNumber' && session.choices.sonNumberMethod !== 'first') {
    const die = ['banneret', 'lord'].includes(draft.father?.key) ? '1d6' : '1d3';
    add('sonNumber.order', die, 'Son Number', 'CHAR-SON-001', '31');
  }
  if (stepId === 'pageEducation' && session.choices.pageEducationMethod !== 'fatherCourt') add('page.education', '1d20', 'Page Education', 'CHAR-PAGE-001', '31-32');
  if (stepId === 'cultureHomeland') {
    ['energetic', 'generous', 'valorous'].forEach(key => add(`culture.${key}`, '1d3', `Frankish ${key}`, 'CHAR-CULTURE-001', '32'));
    ['hunting', 'temperate', 'modest', 'suspicious'].forEach(key => add(`homeland.${key}`, '1d3', `Ardennes ${key}`, 'CHAR-HOMELAND-001', '32'));
  }
  if (stepId === 'attributes') ATTRIBUTE_KEYS.forEach(key => add(`attribute.${key}`, '2d6+3', key.toUpperCase(), 'CHAR-ATTR-001', '32'));
  if (stepId === 'feature' && session.choices.featureMode === 'roll') add('feature.category', '1d6', 'Distinctive Feature category', 'CHAR-FEATURE-001', '33');
  if (stepId === 'traits') TRAIT_PAIRS.forEach(([virtue]) => add(`trait.${virtue}`, '2d6+3', virtue, 'CHAR-TRAIT-001', '33-34'));
  if (stepId === 'passions') {
    add('passion.loveCharlemagne', '2d6+3', 'Love [Charlemagne]', 'CHAR-PASSION-001', '34');
    add('passion.loveFamily', '1d6', 'Love [family] die', 'CHAR-PASSION-001', '34');
  }
  if (stepId === 'skills') {
    const profile = session.choices.gender === 'female' && session.choices.femaleGeneration === 'femaleSpecific' ? 'female' : 'male';
    Object.entries(FRANKISH_SKILL_FORMULAS[profile]).forEach(([key, formula]) => {
      if (typeof formula === 'string' && formula !== 'halfDex') add(`skill.${key}`, formula, key, profile === 'female' ? 'CHAR-SKILL-F-001' : 'CHAR-SKILL-M-001', '35');
    });
  }
  if (stepId === 'birthGift') {
    specs.push(...(draft.gifts?.pendingRolls || []));
    if (session.successorContext?.blessingGrant && !session.successorContext.blessingGrant.consumed && !hasRoll(session, 'legacy.blessing')) {
      add('legacy.blessing', '1d20', 'Table 1-17 saint blessing', 'LIFE-SAINT-001', '42, Table 1-17');
    }
  }
  return specs;
};

export const getCreationRollRequests = (rawSession, stepId = null) => {
  const session = recomputeCharacterCreationSession(rawSession);
  const id = stepId || CHARACTER_CREATION_STEPS[session.currentStep]?.id;
  return rollSpecsForStep(session, id).filter(spec => !hasRoll(session, spec.key));
};

export const rollCharacterCreationStep = (rawSession, stepId = null) => {
  let session = recomputeCharacterCreationSession(rawSession);
  const id = stepId || CHARACTER_CREATION_STEPS[session.currentStep]?.id;
  let guard = 0;
  while (guard < 100) {
    const pending = getCreationRollRequests(session, id);
    if (!pending.length) break;
    pending.forEach(spec => { session = recordAutomaticRoll(session, spec); });
    session = recomputeCharacterCreationSession(session);
    guard += 1;
  }
  return recomputeCharacterCreationSession(session);
};

export const recordManualCharacterCreationRoll = (rawSession, spec, rawRolls) => (
  recomputeCharacterCreationSession(writeRoll(recomputeCharacterCreationSession(rawSession), spec, rawRolls.map(Number), 'manual'))
);

export const updateCharacterCreationChoice = (rawSession, path, value, stepId = null) => {
  const session = clone(rawSession);
  const before = getByPath(session.choices, path);
  setByPath(session.choices, path, value);
  const sourceStep = stepId || CHARACTER_CREATION_STEPS[session.currentStep]?.id || 'mode';
  const stepIndex = CHARACTER_CREATION_STEPS.findIndex(step => step.id === sourceStep);
  if (stepIndex >= 0 && stepIndex < session.currentStep) session.currentStep = stepIndex;
  session.choiceLog.push({ path, before, after: clone(value), stepId: sourceStep, changedAt: nowIso() });
  session.invalidationLog.push({ fromStep: sourceStep, fromStepIndex: stepIndex, reason: `${path} changed`, invalidatedAt: nowIso() });
  session.updatedAt = nowIso();
  return recomputeCharacterCreationSession(session);
};

const validateSquireYearPlan = (plan, draft) => {
  const categories = Array.isArray(plan?.categories) ? [...new Set(plan.categories)] : [];
  if (categories.length !== 2 || categories.some(key => !['attribute', 'score', 'skills'].includes(key))) return 'Choose exactly two different benefit types.';
  if (categories.includes('attribute')) {
    if (!ATTRIBUTE_KEYS.includes(plan.attributeKey)) return 'Choose one attribute.';
    if (Number(draft.attributes[plan.attributeKey] || 0) >= 20) return 'The selected attribute is already at 20.';
  }
  if (categories.includes('score')) {
    if (!['traits', 'passions', 'standings'].includes(plan.scoreGroup) || !Object.hasOwn(draft[plan.scoreGroup] || {}, plan.scoreKey)) return 'Choose one trait, passion, or standing.';
    if (Number(draft[plan.scoreGroup][plan.scoreKey] || 0) >= 15) return 'The selected trait, passion, or standing is already at 15.';
  }
  if (categories.includes('skills')) {
    const selections = plan.skills || {};
    if (!SKILL_CATEGORIES.common.includes(selections.common)) return 'Choose one common skill.';
    if (!SKILL_CATEGORIES.courtly.includes(selections.courtly)) return 'Choose one courtly skill.';
    if (!SKILL_CATEGORIES.combat.includes(selections.combat)) return 'Choose one combat skill.';
    if (!Object.hasOwn(draft.skills, selections.free)) return 'Choose one other skill.';
    if (new Set(Object.values(selections)).size !== 4) return 'The four squire-year skill benefits must name four different skills.';
    if (Object.values(selections).some(key => Number(draft.skills[key] || 0) >= 15)) return 'A selected skill is already at 15.';
    if (Number(draft.skills[selections.common] || 0) <= 0) return 'A common skill of 0 cannot be raised.';
  }
  return null;
};

export const addCharacterCreationSquireYear = (rawSession, plan) => {
  const session = recomputeCharacterCreationSession(rawSession);
  if (session.draftCharacter.qualification?.qualified) return { session, added: false, error: 'The character already qualifies and must be knighted immediately.' };
  const error = validateSquireYearPlan(plan, session.draftCharacter);
  if (error) return { session, added: false, error };
  const next = clone(session);
  next.squireYears.push(clone(plan));
  next.choiceLog.push({ path: `squireYears.${next.squireYears.length - 1}`, before: null, after: clone(plan), stepId: 'squireYears', changedAt: nowIso() });
  next.updatedAt = nowIso();
  return { session: recomputeCharacterCreationSession(next), added: true, error: null };
};

export const removeLastCharacterCreationSquireYear = rawSession => {
  const next = clone(rawSession);
  if (!next.squireYears?.length) return recomputeCharacterCreationSession(next);
  const removed = next.squireYears.pop();
  next.choiceLog.push({ path: 'squireYears', before: removed, after: null, stepId: 'squireYears', changedAt: nowIso() });
  next.updatedAt = nowIso();
  return recomputeCharacterCreationSession(next);
};

export const goToCharacterCreationStep = (rawSession, index) => {
  const session = clone(rawSession);
  session.currentStep = clamp(index, 0, CHARACTER_CREATION_STEPS.length - 1);
  session.updatedAt = nowIso();
  return recomputeCharacterCreationSession(session);
};

export const advanceCharacterCreationStep = rawSession => {
  const session = recomputeCharacterCreationSession(rawSession);
  const step = CHARACTER_CREATION_STEPS[session.currentStep];
  if (!session.stepStates[step.id]?.canAdvance) return session;
  return goToCharacterCreationStep(session, session.currentStep + 1);
};

export const retreatCharacterCreationStep = rawSession => goToCharacterCreationStep(rawSession, Number(rawSession.currentStep || 0) - 1);

const formatHorseList = horses => Object.entries(horses || {}).filter(([, count]) => count > 0).map(([type, count]) => `${type} x${count}`);

const formatEffectSummary = effects => Object.entries(effects || {}).flatMap(([group, values]) => (
  Object.entries(values || {}).map(([key, amount]) => `${group}.${key} ${Number(amount) >= 0 ? '+' : ''}${amount}`)
)).join(', ');

const buildCompletedFamily = (currentCharacter, session, draft) => {
  const baseId = session.id.replace(/[^a-z0-9]/gi, '_');
  const currentYear = Number(draft.personal.campaignYear || 767);
  const fatherStatus = draft.fatherSurvival?.key === 'deceased' ? '사망' : draft.fatherSurvival?.key === 'missing' ? '실종' : draft.fatherSurvival?.key === 'bedridden' ? '질병' : '생존';
  const generatedMembers = [
    { id: `${baseId}_ancestor`, name: draft.family.ancestor, relation: '조부', generation: 1, status: '사망', lifeYears: '', note: 'Founding ancestor recorded during character creation.', gender: 'male' },
    { id: `${baseId}_father`, name: String(session.choices.fatherName || 'Father'), relation: '부친', generation: 2, status: fatherStatus, lifeYears: '724~', note: `${draft.father?.label || ''}; ${draft.fatherSurvival?.label || ''}`, gender: 'male' },
    { id: `${baseId}_self`, name: draft.personal.name, relation: '본인', generation: 3, status: '생존', lifeYears: `${currentYear - draft.personal.age}~`, note: `Core Rules Character created for ${currentYear}.`, parentId: `${baseId}_father`, gender: session.choices.gender }
  ];
  if (isFamilySuccessor(session) && Array.isArray(currentCharacter.family?.members)) {
    const candidateId = session.successorContext?.candidate?.id;
    const predecessorId = session.successorContext?.sourceCharacterId;
    let foundCandidate = false;
    const preserved = currentCharacter.family.members.map(member => {
      if (member.id === candidateId) {
        foundCandidate = true;
        return {
          ...member,
          name: draft.personal.name,
          relation: '본인',
          status: '생존',
          lifecycleStatus: 'active',
          successorOf: predecessorId || null,
          lifeYears: member.lifeYears || `${currentYear - draft.personal.age}~`,
          note: `${member.note ? `${member.note} ` : ''}${currentYear}년 정식 캐릭터 생성 완료.`
        };
      }
      if (member.id === predecessorId || member.relation === '본인') {
        return { ...member, relation: '전임 기사' };
      }
      return member;
    });
    return foundCandidate ? preserved : [...preserved, { ...generatedMembers[2], id: candidateId || generatedMembers[2].id }];
  }
  if (session.choices.familyMode === 'reuse' && Array.isArray(currentCharacter.family?.members)) {
    const preserved = currentCharacter.family.members.map(member => member.relation === '본인' ? { ...member, relation: '전임 기사' } : member);
    return [...preserved, generatedMembers[2]];
  }
  return generatedMembers;
};

export const completeCharacterCreation = (currentCharacter, rawSession, now = new Date()) => {
  const session = recomputeCharacterCreationSession(rawSession);
  const reviewState = session.stepStates.review;
  if (!reviewState?.canAdvance) return { character: currentCharacter, session, completed: false, issues: reviewState?.issues || ['Creation is incomplete.'] };
  const completionId = session.completionId || `character-creation:${session.id}`;
  if (currentCharacter?.campaign?.completedCreationIds?.includes(completionId)) {
    return { character: currentCharacter, session: { ...session, status: 'completed', completionId }, completed: false, duplicate: true, issues: [] };
  }

  const draft = session.draftCharacter;
  const successorContext = session.successorContext;
  const isSuccessor = Boolean(successorContext);
  const isPreparedSecond = successorContext?.successorMode === 'prepared_second';
  const isSameFamily = successorContext?.successorMode === 'same_family';
  const isNewFamily = successorContext?.successorMode === 'new_family';
  const completionYear = Number(draft.personal.campaignYear || currentCharacter.personal?.campaignYear || 767);
  const completedAt = nowIso(now);
  const next = clone(currentCharacter);
  const previousSnapshot = {
    archivedAt: completedAt,
    personal: clone(currentCharacter.personal || {}),
    gloryTotal: Number(currentCharacter.gear?.gloryTotal || 0),
    familyName: currentCharacter.family?.name || ''
  };
  next.personal = { ...next.personal, ...draft.personal };
  if (draft.legacyBlessing) next.personal.blessing = draft.legacyBlessing.label;
  next.attributes = { ...draft.attributes };
  next.traits = { ...draft.traits };
  next.skills = { ...draft.skills };
  next.skillsChecked = {};
  next.traitsChecked = {};
  next.passions = { ...draft.passions };
  next.passionsChecked = {};
  next.standings = { ...draft.standings };
  next.standingsChecked = {};
  next.family = {
    ...(!isNewFamily ? next.family : {}),
    name: draft.family.name,
    motto: draft.family.motto,
    battleCry: draft.family.battleCry,
    ancestor: draft.family.ancestor,
    homeCountry: draft.family.homeCounty,
    notableMembers: draft.family.greatNoble,
    directedTraits: draft.family.directedTraits,
    directedPassions: draft.family.directedPassions,
    patronSaint: draft.family.patronSaint?.label || '',
    patronSaintRoll: getRollValue(session, 'family.saint'),
    patronSaintBenefit: formatEffectSummary(draft.family.patronSaint?.effects),
    characteristic: draft.family.characteristic ? {
      name: draft.family.characteristic.label,
      desc: draft.family.characteristic.label,
      bonusText: JSON.stringify(draft.family.characteristic.effects || {}),
      applied: true
    } : null,
    muster: draft.family.muster,
    honor: draft.family.honor,
    standings: draft.family.standings,
    members: buildCompletedFamily(currentCharacter, session, draft)
  };
  const outfit = draft.outfit;
  next.squire = outfit?.squires
    ? { ...(!isSuccessor ? next.squire || {} : {}), name: '', age: 15 }
    : { ...(!isSuccessor ? next.squire || {} : {}), name: '', age: 0 };
  next.horses = {
    ...(!isSuccessor ? next.horses || {} : {}),
    warhorse: { ...(!isSuccessor ? next.horses?.warhorse || {} : {}), type: formatHorseList(outfit?.horses).join(', ') },
    inventory: clone(outfit?.horses || {})
  };
  const inheritedGear = Object.fromEntries((draft.inheritedEquipment || [])
    .filter(item => item.id?.startsWith('gear.') && item.key !== 'conditionalModifiers')
    .map(item => [item.key, clone(item.value)]));
  const inheritedConditionalModifiers = (draft.inheritedEquipment || [])
    .filter(item => item.id === 'gear.conditionalModifiers' && Array.isArray(item.value))
    .flatMap(item => clone(item.value));
  const inheritedHorse = (draft.inheritedEquipment || []).find(item => item.id === 'horses');
  if (inheritedHorse) next.horses = clone(inheritedHorse.value);
  next.gear = {
    ...(!isSuccessor ? next.gear || {} : {}),
    armorShield: outfit ? `${outfit.armor}; ${outfit.shields} shield(s)` : '',
    clothing: outfit?.clothes || '',
    personalGear: [...(outfit?.weapons || []), ...(draft.gearExtras?.possessions || [])].join(', '),
    cash: Number(outfit?.cash || 0) + Number(draft.gearExtras?.cash || 0),
    gloryThisGame: 0,
    gloryTotal: draft.gloryTotal,
    startingOutfit: outfit ? `Outfit ${outfit.rank}` : '',
    startingOutfitInventory: clone(outfit || {}),
    birthGifts: clone(draft.gifts.entries),
    conditionalModifiers: [...clone(draft.gearExtras?.conditionalModifiers || []), ...inheritedConditionalModifiers],
    annualStipend: Number(draft.gearExtras?.annualStipend || 0),
    gloryLedger: clone(draft.gloryLedger),
    ...inheritedGear,
    inheritanceProvenance: (draft.inheritedEquipment || []).map(item => ({
      itemId: item.id,
      inheritedFrom: successorContext?.sourceCharacterId,
      inheritedAt: completedAt,
      predecessorStatus: successorContext?.predecessor?.status,
      sourceRuleId: 'LIFE-NEWCHAR-001'
    }))
  };
  if (draft.inheritedManors?.length) {
    next.family.manors = draft.inheritedManors.reduce((total, manor) => total + Number(manor.count || 0), 0);
    next.family.manorInheritance = draft.inheritedManors.map(manor => ({
      ...manor,
      inheritedFrom: successorContext?.sourceCharacterId,
      inheritedAt: completedAt,
      sourceRuleId: 'LIFE-NEWCHAR-001'
    }));
  }
  const priorJournal = next.journal || {};
  const existingEntry = priorJournal[completionYear]?.text ? `${priorJournal[completionYear].text}\n\n` : '';
  next.journal = {
    ...priorJournal,
    [completionYear]: { text: `${existingEntry}${draft.story}${isSuccessor ? `\n\n[계승] ${draft.personal.name}의 생성과 활성 캐릭터 전환을 완료했습니다.${draft.qualification?.qualified ? ' 기사 자격을 충족해 기사 서임을 기록했습니다.' : ''}` : ''}`.trim(), updatedAt: completedAt }
  };
  const completedSession = {
    ...session,
    status: 'completed',
    currentStep: CHARACTER_CREATION_STEPS.length - 1,
    completedAt,
    completionId
  };
  const previousLifecycle = clone(next.campaign?.lifecycle || {});
  const activeCharacterId = isFamilySuccessor(session)
    ? successorContext.candidate?.id || `${session.id.replace(/[^a-z0-9]/gi, '_')}_self`
    : `${session.id.replace(/[^a-z0-9]/gi, '_')}_self`;
  const lifecycleEvents = Array.isArray(previousLifecycle.events) ? previousLifecycle.events : [];
  const transitionEventId = `lifecycle:active-character:${session.id}`;
  const creationEventId = `lifecycle:successor-created:${session.id}`;
  const knightingEventId = `lifecycle:knighting:${session.id}`;
  const creationEvent = {
    lifecycleEventId: creationEventId,
    sourceRuleId: isNewFamily ? 'LIFE-NEWFAMILY-001' : isPreparedSecond ? 'LIFE-001' : isSameFamily ? 'LIFE-NEWCHAR-001' : 'CHAR-STORY-001',
    previousStatus: previousLifecycle.status || 'active',
    nextStatus: 'successor_in_creation',
    cause: isSuccessor ? 'successor_creation_completed' : 'character_creation_completed',
    year: completionYear,
    age: draft.personal.age,
    sourcePage: isSuccessor ? 'Chapter 1 pp. 42-43' : 'Chapter 1 p. 41',
    triggeringEvent: isSuccessor ? 'successor_creation' : 'character_creation',
    unresolvedChoices: [],
    appliedEffectIds: [completionId, creationEventId],
    journalEntryId: `journal:${creationEventId}`,
    timestamp: completedAt
  };
  const knightingEvent = draft.qualification?.qualified ? {
    lifecycleEventId: knightingEventId,
    sourceRuleId: 'CHAR-KNIGHT-QUAL-001',
    previousStatus: 'successor_in_creation',
    nextStatus: 'successor_in_creation',
    cause: 'printed_knight_qualification_met',
    year: completionYear,
    age: draft.personal.age,
    sourcePage: 'Chapter 1 p. 35',
    triggeringEvent: 'knighting',
    unresolvedChoices: [],
    appliedEffectIds: [knightingEventId],
    journalEntryId: `journal:${knightingEventId}`,
    timestamp: completedAt
  } : null;
  const transitionEvent = {
    lifecycleEventId: transitionEventId,
    sourceRuleId: isNewFamily ? 'LIFE-NEWFAMILY-001' : isPreparedSecond ? 'LIFE-001' : isSameFamily ? 'LIFE-NEWCHAR-001' : 'CHAR-STORY-001',
    previousStatus: previousLifecycle.status || 'active',
    nextStatus: 'active',
    cause: isPreparedSecond ? 'prepared_second_character' : isSuccessor ? 'successor_creation' : 'character_creation',
    year: completionYear,
    age: draft.personal.age,
    sourcePage: isSuccessor ? 'Chapter 1 pp. 41-43' : 'Chapter 1 p. 40',
    triggeringEvent: draft.qualification?.qualified ? 'successor_creation_and_knighting' : 'character_creation',
    unresolvedChoices: [],
    appliedEffectIds: [completionId, transitionEventId],
    journalEntryId: `journal:${transitionEventId}`,
    timestamp: completedAt
  };
  const completionEvents = [creationEvent, knightingEvent, transitionEvent].filter(Boolean);
  const completionChronicleEvents = completionEvents.map(event => {
    const isKnighting = event.triggeringEvent === 'knighting';
    const isSuccession = String(event.triggeringEvent).includes('successor');
    return {
      ...event,
      id: event.lifecycleEventId,
      type: isKnighting ? 'knighting' : isSuccession ? 'succession' : 'character',
      title: isKnighting ? `${draft.personal.name}의 기사 서임` : isSuccession ? `${draft.personal.name}의 계승` : `${draft.personal.name}의 연대기 시작`,
      narrative: isKnighting ? '기사 자격을 충족하고 서임을 받아 1,000 영광을 얻었습니다.' : isSuccession ? '선대의 유산을 이어 새 활성 캐릭터가 되었습니다.' : draft.story
    };
  });
  const creationGloryLedger = draft.gloryLedger.filter(entry => Number(entry.amount || 0) !== 0).map((entry, index) => ({
    id: `glory:${activeCharacterId}:creation:${index}`,
    year: completionYear,
    characterId: activeCharacterId,
    characterName: draft.personal.name,
    title: entry.sourceLabel,
    narrative: entry.calculation,
    amount: Number(entry.amount || 0),
    status: 'posted',
    sourceRuleId: entry.sourceRuleId,
    sourcePage: entry.sourcePage,
    createdAt: completedAt
  }));
  const birthYear = completionYear - Number(draft.personal.age || 0);
  const creationFamilyTimeline = [
    {
      id: `family:${activeCharacterId}:birth`, year: birthYear, type: 'birth', memberId: activeCharacterId,
      characterId: activeCharacterId, characterName: draft.personal.name, title: `${draft.personal.name} 탄생`,
      narrative: `${draft.family.name} 가문의 새 세대로 태어났습니다.`, sourceRuleId: 'CHAR-STORY-001', sourcePage: 'Chapter 1 pp. 39-40', createdAt: completedAt
    },
    ...(draft.qualification?.qualified ? [{
      id: `family:${activeCharacterId}:knighting`, year: completionYear, type: 'knighting', memberId: activeCharacterId,
      characterId: activeCharacterId, characterName: draft.personal.name, title: `${draft.personal.name} 기사 서임`,
      narrative: '기사 자격을 모두 갖추고 정식으로 서임되었습니다.', sourceRuleId: 'CHAR-KNIGHT-QUAL-001', sourcePage: 'Chapter 1 p. 35', createdAt: completedAt
    }] : []),
    ...(isSuccessor ? [{
      id: `family:${activeCharacterId}:succession`, year: completionYear, type: 'succession', memberId: activeCharacterId,
      relatedMemberId: successorContext.sourceCharacterId || null, characterId: activeCharacterId, characterName: draft.personal.name,
      title: `${draft.personal.name} 계승`, narrative: '선대의 삶이 끝난 뒤 가문의 연대와 캠페인을 이어받았습니다.',
      sourceRuleId: isNewFamily ? 'LIFE-NEWFAMILY-001' : 'LIFE-NEWCHAR-001', sourcePage: 'Chapter 1 pp. 42-43', createdAt: completedAt
    }] : [])
  ];
  let completedLegacy = clone(previousLifecycle.legacy || successorContext?.pendingLegacy || null);
  if (completedLegacy && isSameFamily) {
    completedLegacy.consumed = true;
    completedLegacy.consumedAt = completedAt;
    completedLegacy.consumedByCharacterId = activeCharacterId;
    if (completedLegacy.birthGiftGrant) completedLegacy.birthGiftGrant.consumed = true;
    if (completedLegacy.blessingGrant) {
      completedLegacy.blessingGrant.consumed = Boolean(draft.legacyBlessing);
      completedLegacy.blessingGrant.roll = draft.legacyBlessing?.roll || null;
      completedLegacy.blessingGrant.blessing = clone(draft.legacyBlessing || null);
    }
  } else if (completedLegacy && isNewFamily) {
    completedLegacy.consumed = true;
    completedLegacy.consumedAt = completedAt;
    completedLegacy.consumedAs = 'forfeited_new_family';
  }
  next.campaign = {
    ...(next.campaign || {}),
    schemaVersion: 6,
    saveRevision: Number(next.campaign?.saveRevision || 0) + 1,
    characterCreationSession: completedSession,
    completedCreationIds: [...new Set([...(next.campaign?.completedCreationIds || []), completionId])],
    characterArchives: [...(next.campaign?.characterArchives || []), previousSnapshot].slice(-25),
    preparedCharacter: isPreparedSecond ? {
      primaryCharacterSnapshot: clone(successorContext.primaryCharacterSnapshot),
      preparedCharacterId: activeCharacterId,
      activatedAt: completedAt,
      sourceRuleId: 'LIFE-001'
    } : next.campaign?.preparedCharacter || null,
    legacyHistory: completedLegacy ? [...(next.campaign?.legacyHistory || []), completedLegacy].slice(-25) : next.campaign?.legacyHistory || [],
    lifecycle: {
      ...previousLifecycle,
      status: 'active',
      careerStatus: 'active',
      activeRole: isPreparedSecond ? 'prepared_second' : 'primary',
      activeCharacterId,
      primaryCharacterId: isPreparedSecond ? successorContext.sourceCharacterId : activeCharacterId,
      predecessorId: isSuccessor ? successorContext.sourceCharacterId : previousLifecycle.predecessorId || null,
      pendingSuccession: false,
      pendingCareerEnd: null,
      salvation: isPreparedSecond ? previousLifecycle.salvation || null : null,
      legacy: null,
      successor: null,
      unresolvedChoices: [],
      events: [...lifecycleEvents, ...completionEvents].slice(-250)
    },
    chronicleEvents: [...(next.campaign?.chronicleEvents || []), ...completionChronicleEvents].slice(-500),
    gloryLedger: [
      ...(isSameFamily || isPreparedSecond ? next.campaign?.gloryLedger || [] : []),
      ...creationGloryLedger
    ].slice(-1000),
    standingLedger: (isSameFamily || isPreparedSecond ? next.campaign?.standingLedger || [] : []).slice(-1000),
    familyTimeline: [
      ...(isSameFamily || isPreparedSecond ? next.campaign?.familyTimeline || [] : []),
      ...creationFamilyTimeline
    ].slice(-500),
    gloryBonusClaimedThreshold: 0,
    appliedEvents: {
      ...(next.campaign?.appliedEvents || {}),
      [completionId]: { appliedAt: completedAt, year: completionYear, label: isSuccessor ? 'Successor character creation completed' : 'Core Rules Character creation completed' },
      ...Object.fromEntries(completionEvents.map(event => [event.lifecycleEventId, { appliedAt: completedAt, year: completionYear, label: event.triggeringEvent, sourceRuleId: event.sourceRuleId }]))
    },
    creationTrace: {
      sessionId: session.id,
      sourceEdition: session.sourceEdition,
      seed: session.seed,
      rollLog: clone(session.rollLog),
      choiceLog: clone(session.choiceLog),
      modifierLog: clone(session.modifierLog),
      gloryLedger: clone(draft.gloryLedger),
      successorContext: clone(successorContext),
      legacyApplication: clone(draft.legacyApplication),
      inheritedEquipment: clone(draft.inheritedEquipment),
      inheritedManors: clone(draft.inheritedManors),
      blessing: clone(draft.legacyBlessing),
      manualOverrides: clone(draft.manualOverrides),
      rulebookDeviations: clone(draft.rulebookDeviations)
    }
  };
  return { character: next, session: completedSession, completed: true, duplicate: false, issues: [] };
};

export const sanitizeCharacterCreationSession = value => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const source = clone(value);
  const defaults = createCharacterCreationSession({
    seed: source.seed || 'restored-session',
    mode: source.mode || 'core',
    existingFamily: source.successorContext?.family || null,
    successorContext: source.successorContext || null,
    now: source.createdAt || new Date()
  });
  const safe = {
    ...defaults,
    ...source,
    version: SESSION_VERSION,
    status: SESSION_STATUSES.has(source.status) ? source.status : 'in_progress',
    currentStep: clamp(source.currentStep, 0, CHARACTER_CREATION_STEPS.length - 1),
    rollIndex: Math.max(0, asInt(source.rollIndex)),
    rolls: source.rolls && typeof source.rolls === 'object' ? source.rolls : {},
    rollLog: Array.isArray(source.rollLog) ? source.rollLog.slice(-1000) : [],
    choiceLog: Array.isArray(source.choiceLog) ? source.choiceLog.slice(-1000) : [],
    modifierLog: Array.isArray(source.modifierLog) ? source.modifierLog.slice(-2000) : [],
    invalidationLog: Array.isArray(source.invalidationLog) ? source.invalidationLog.slice(-500) : [],
    squireYears: Array.isArray(source.squireYears) ? source.squireYears.slice(0, 100) : [],
    successorContext: source.successorContext && typeof source.successorContext === 'object' ? source.successorContext : null,
    choices: source.choices && typeof source.choices === 'object' ? { ...defaults.choices, ...source.choices } : defaults.choices
  };
  try {
    return recomputeCharacterCreationSession(safe);
  } catch {
    return createCharacterCreationSession({ seed: source.seed || 'recovered-session', mode: source.mode || 'core', existingFamily: source.successorContext?.family || null, successorContext: source.successorContext || null });
  }
};
