/**
 * Oracles and Rules references for the Paladin Companion.
 * Summarizes the complex Pendragon/Paladin rules for easy access.
 */

export const rollGrades = {
  CRITICAL: {
    title: "Critical Success (대성공)",
    desc: "Roll matches your Skill/Trait value exactly. The action is accomplished with glorious, cinematic style. If in combat, damage is doubled.",
    color: "#2e7d32"
  },
  SUCCESS: {
    title: "Success (성공)",
    desc: "Roll is less than your Skill/Trait value. You accomplish what you set out to do safely.",
    color: "#1b5e20"
  },
  FAILURE: {
    title: "Failure (실패)",
    desc: "Roll is greater than your Skill/Trait value. You fail to achieve your goal, but do not suffer major catastrophe.",
    color: "#6b665f"
  },
  FUMBLE: {
    title: "Fumble (대실패)",
    desc: "Roll is exactly 20 (or 20 when skill is <= 20). You fail spectacularly, potentially dropping weapons, breaking tools, or suffering severe social embarrassment.",
    color: "#992222"
  }
};

export const soloScenariosRef = [
  {
    name: "Crossroad Encounters (교차로에서의 조우)",
    desc: "When traveling, roll d20 on the Crossroad table. Encounters vary from hermits requesting first aid to rival knights demanding a joust of honor.",
    flow: [
      "1-5: A weary pilgrim seeking food or First Aid.",
      "6-10: A local peasant complaining of brigand activities.",
      "11-15: A wandering Squire(종자) carrying letters of romance.",
      "16-19: A Knight(기사) guarding a bridge, demanding a joust.",
      "20: A Faerie(요정) castle appears, promising magic or tests of virtue."
    ]
  },
  {
    name: "The Joust (마상 창시합)",
    desc: "Standard rules for challenging another knight. Resolve using Horsemanship and Lance skills.",
    flow: [
      "1. Both knights roll Lance(마창) vs Lance.",
      "2. Compare outcomes: Critical vs Success, etc.",
      "3. Suffer Damage based on enemy lance. Check SIZ(크기) for Knockdown(낙마) if damage exceeds your Knockdown value.",
      "4. Unhorsed knights must continue on foot using Sword(검) or yield."
    ]
  },
  {
    name: "The Feud (가문의 복수극)",
    desc: "Your family's honor is threatened. Gather your kin, execute search rolls, and confront the enemy lineage.",
    flow: [
      "1. Exhort Your Kin: Roll Love [Family] to recruit lineage men.",
      "2. Reconnaissance: Roll Hunting or Awareness to track your rival.",
      "3. Confrontation: Demanding Honor restitution or fighting a skirmish."
    ]
  },
  {
    name: "The Forest (깊은 숲에서의 미로)",
    desc: "Venturing into dense forests like Ardennes(아르덴). Roll to avoid getting lost.",
    flow: [
      "1. Roll Hunting or Faerie Lore to navigate.",
      "2. If fail: Suffer 1d6 days of travel delay and roll on the Forest Encounter Table.",
      "3. If fumble: Enter the enchanted realm, losing track of years."
    ]
  },
  {
    name: "Romance (로맨스와 구애)",
    desc: "Pursuing a lady or lover in courts. Controlled by Courtly Skills, Traits (Chaste vs Lustful), and Amor Passion.",
    flow: [
      "1. Passionate Declaration: Roll Eloquence or Singig to impress.",
      "2. The Essai (시련): The lady demands a quest (e.g., defeating a giant).",
      "3. Consummation: Roll Amor to forge a lifelong bond."
    ]
  }
];

export const yesNoOracle = [
  { roll: "1-2", result: "No, and... (아니오, 그리고 설상가상으로...)", desc: "The answer is negative, and a negative twist occurs." },
  { roll: "3-8", result: "No (아니오)", desc: "The answer is simply negative." },
  { roll: "9-12", result: "Maybe / Yes with a catch (아마도 / 조건부 예)", desc: "The answer is ambiguous or requires a sacrifice/stipulation." },
  { roll: "13-18", result: "Yes (예)", desc: "The answer is simply affirmative." },
  { roll: "19-20", result: "Yes, and... (예, 그리고 금상첨화로...)", desc: "The answer is highly affirmative, and a positive bonus occurs." }
];
