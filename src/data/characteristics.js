export const MALE_CHARACTERISTICS = {
  1: { desc: "Keen of eye and ear (예리한 오감)", bonus: { skill: "awareness", value: 5 } },
  2: { desc: "Keen of eye and ear (예리한 오감)", bonus: { skill: "awareness", value: 5 } },
  3: { desc: "Natural healers of wounds (천부적인 상처 응급처치)", bonus: { skill: "firstAid", value: 5 } },
  4: { desc: "Never forget a face or a shield (문장 및 인물 기억)", bonus: { skill: "heraldry", value: 5, skill2: "recognize", value2: 5 } },
  5: { desc: "Born in the saddle (마상의 귀재)", bonus: { skill: "horsemanship", value: 5 } },
  6: { desc: "Born in the saddle (마상의 귀재)", bonus: { skill: "horsemanship", value: 5 } },
  7: { desc: "At home in nature (야생과 자연의 친화)", bonus: { skill: "hunting", value: 5 } },
  8: { desc: "At home in nature (야생과 자연의 친화)", bonus: { skill: "hunting", value: 5 } },
  9: { desc: "Like otters in the river (수중의 수달)", bonus: { skill: "swimming", value: 10 } },
  10: { desc: "Like otters in the river (수중의 수달)", bonus: { skill: "swimming", value: 10 } },
  11: { desc: "Polite, elegant, lovable (품위 and 사교성)", bonus: { skill: "courtesy", value: 10 } },
  12: { desc: "Light-footed and elegant (가벼운 발놀림과 예술)", bonus: { skill: "dancing", value: 10 } },
  13: { desc: "Good speakers and storyteller (유창한 웅변과 전설)", bonus: { skill: "eloquence", value: 10 } },
  14: { desc: "Masters of birds (매 사냥의 대가)", bonus: { skill: "falconry", value: 10 } },
  15: { desc: "Clever at games (체스 및 전략 게임)", bonus: { skill: "gaming", value: 10 } },
  16: { desc: "Surprisingly deductive (예리한 직관과 수색)", bonus: { skill: "intrigue", value: 10 } },
  17: { desc: "Gifted musicians (선천적인 악기 연주)", bonus: { skill: "playInstruments", value: 10 } },
  18: { desc: "Excellent voice (천상의 노랫소리)", bonus: { skill: "singing", value: 10 } },
  19: { desc: "Master tacticians (전술 또는 공성, 택1)", bonus: { skill: "battle", value: 5 } },
  20: { desc: "Player’s choice (기사단 가문 자유 선택)", bonus: { choice: true } }
};

export const FEMALE_CHARACTERISTICS = {
  1: { desc: "Great beauty (절세의 미모)", bonus: { attribute: "app", value: 5 } },
  2: { desc: "Great beauty (절세의 미모)", bonus: { attribute: "app", value: 5 } },
  3: { desc: "Great beauty (절세의 미모)", bonus: { attribute: "app", value: 5 } },
  4: { desc: "Great beauty (절세의 미모)", bonus: { attribute: "app", value: 5 } },
  5: { desc: "Nimble fingers (섬세한 손재주와 공업)", bonus: { skill: "industry", value: 10 } },
  6: { desc: "Natural healers (천부적인 응급처치와 치유)", bonus: { skill: "firstAid", value: 5, skill2: "chirurgery", value2: 5 } },
  7: { desc: "Natural healers (천부적인 응급처치와 치유)", bonus: { skill: "firstAid", value: 5, skill2: "chirurgery", value2: 5 } },
  8: { desc: "Natural healers (천부적인 응급처치와 치유)", bonus: { skill: "firstAid", value: 5, skill2: "chirurgery", value2: 5 } },
  9: { desc: "Natural healers (천부적인 응급처치와 치유)", bonus: { skill: "firstAid", value: 5, skill2: "chirurgery", value2: 5 } },
  10: { desc: "Natural healers (천부적인 응급처치와 치유)", bonus: { skill: "firstAid", value: 5, skill2: "chirurgery", value2: 5 } },
  11: { desc: "Good with animals (동물과의 소통과 사냥)", bonus: { skill: "falconry", value: 5, skill2: "horsemanship", value2: 5 } },
  12: { desc: "Good with animals (동물과의 소통과 사냥)", bonus: { skill: "falconry", value: 5, skill2: "horsemanship", value2: 5 } },
  13: { desc: "Good with animals (동물과의 소통과 사냥)", bonus: { skill: "falconry", value: 5, skill2: "horsemanship", value2: 5 } },
  14: { desc: "Good with animals (동물과의 소통과 사냥)", bonus: { skill: "falconry", value: 5, skill2: "horsemanship", value2: 5 } },
  15: { desc: "Good with animals (동물과의 소통과 사냥)", bonus: { skill: "falconry", value: 5, skill2: "horsemanship", value2: 5 } },
  16: { desc: "Beautiful voice (아름다운 음색과 가창)", bonus: { skill: "eloquence", value: 5, skill2: "singing", value2: 5 } },
  17: { desc: "Beautiful voice (아름다운 음색과 가창)", bonus: { skill: "eloquence", value: 5, skill2: "singing", value2: 5 } },
  18: { desc: "Caretakers (영지 가계와 치안)", bonus: { skill: "stewardship", value: 10 } },
  19: { desc: "Caretakers (영지 가계와 치안)", bonus: { skill: "stewardship", value: 10 } },
  20: { desc: "Player’s choice (가문 숙원 자유 선택)", bonus: { choice: true } }
};

export const getCharacteristicDetails = (roll, gender, choiceSkill, choiceValue, choiceAttribute, characterSkills = {}) => {
  if (!roll) return null;
  const table = gender === 'female' ? FEMALE_CHARACTERISTICS : MALE_CHARACTERISTICS;
  const entry = table[roll];
  if (!entry) return null;

  if (entry.bonus.choice) {
    if (gender === 'female') {
      if (choiceAttribute === 'app') {
        return {
          desc: entry.desc + " (능력치 APP +5 선택)",
          bonusText: "능력치 APP +5",
          effect: { attributes: { app: 5 } }
        };
      } else {
        const skillName = choiceSkill || 'industry';
        const val = choiceValue || 10;
        return {
          desc: entry.desc + ` (스킬 ${skillName} +${val} 선택)`,
          bonusText: `스킬 ${skillName} +${val}`,
          effect: { skills: { [skillName]: val } }
        };
      }
    } else {
      const skillName = choiceSkill || 'awareness';
      const val = choiceValue || 10;
      return {
        desc: entry.desc + ` (스킬 ${skillName} +${val} 선택)`,
        bonusText: `스킬 ${skillName} +${val}`,
        effect: { skills: { [skillName]: val } }
      };
    }
  }

  const effect = { skills: {}, attributes: {} };
  let bonusText = "";

  const b = entry.bonus;
  if (b.skill) {
    effect.skills[b.skill] = b.value;
    bonusText += `스킬 [${b.skill}] +${b.value}`;
  }
  if (b.skill2) {
    effect.skills[b.skill2] = b.value2;
    bonusText += `, 스킬 [${b.skill2}] +${b.value2}`;
  }
  if (b.attribute) {
    effect.attributes[b.attribute] = b.value;
    bonusText += `능력치 [${b.attribute.toUpperCase()}] +${b.value}`;
  }

  return {
    desc: entry.desc,
    bonusText,
    effect
  };
};
