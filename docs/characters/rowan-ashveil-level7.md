# Rowan Ashveil, the Last Lantern

**Level 7 Twilight Cleric; Custom Lineage; Rewarded background; neutral good; devotee of Selûne.** Rowan is a small, dusk-eyed traveler who escorts people through dangerous nights. After surviving a shipwreck by following a mysterious lantern, they regard every person brought home alive as repayment of that debt.

This build prioritizes party protection, concentration, area control and reliable spellcasting. Staying Cleric 7 preserves 4th-level spells, seven prepared-class levels, and the full Twilight Sanctuary benefit. It uses the **2014 Player's Handbook rules**, Tasha's pre-2024 options, and the 2014 versions of spells and feats. All named sourcebooks are official. No setting-specific supernatural gift, additional magic-item reward, or unlisted starting wealth is assumed.

The complete importer payload is [pc-rowan-ashveil-level7.json](../../examples/pc-rowan-ashveil-level7.json). The JSON validates against the current importer. Import and manual setup instructions appear below.

## Ability scores and advancement

| Ability | Standard array | Lineage | Level 1 feats | Cleric 4 ASI | Final |
| --- | ---: | ---: | ---: | ---: | ---: |
| Strength | 12 | — | — | — | **12 (+1)** |
| Dexterity | 14 | — | — | — | **14 (+2)** |
| Constitution | 13 | — | +1 Resilient | — | **14 (+2)** |
| Intelligence | 8 | — | — | — | **8 (−1)** |
| Wisdom | 15 | +2 | +1 Telekinetic | +2 | **20 (+5)** |
| Charisma | 10 | — | — | — | **10 (+0)** |

- **Custom Lineage feat:** Telekinetic, increasing Wisdom. Its bonus-action shove helps position enemies for Spirit Guardians and frees allies from melee without opportunity attacks.
- **Your free level 1 feat:** Resilient (Constitution), increasing Constitution and granting Constitution saving throw proficiency. This makes concentration much more dependable.
- **Rewarded background feature:** the original **Lucky** feat, giving three luck points per long rest. This is a third, separate feat source from *The Book of Many Things*, which your “any official book” permission allows. It does not consume the house-rule feat. It is not the revised 2024 Lucky feat.
- **Cleric 4:** +2 Wisdom rather than another feat. Wisdom 20 improves spell DCs, healing, preparations and Telekinetic.
- **Custom Lineage Variable Trait:** Perception proficiency. Choose the skill option; Twilight already supplies much better darkvision than the lineage's alternative.

The lineage is mechanically **Small, humanoid**, with a 30-foot walking speed. Its appearance grants no additional racial traits. Languages: Common, Elvish and Celestial. Tool proficiency: playing cards. Class skills are Medicine and Religion; background skills are Insight and Persuasion; lineage skill is Perception.

## Numbers at level 7

| Statistic | Value |
| --- | --- |
| HP | **52**, using maximum first Hit Die and fixed average increases: 8 + 6×5 + 7×2 |
| Hit Dice | 7d8 |
| AC | **19**: scale mail 14 + Dex 2 + shield 2 + cloak 1 |
| Proficiency bonus | +3 |
| Initiative | +2; **advantage on the next roll** after using Vigilant Blessing |
| Walking speed | 30 ft. |
| Flight | 30 ft. for 1 minute via Steps of Night, activated in dim light/darkness; 3 uses per long rest |
| Spell attacks | **+10**: PB 3 + Wis 5 + amulet 2 |
| Spell save DC | **18**: 8 + PB 3 + Wis 5 + amulet 2 |
| Telekinetic shove DC | **16 Strength**; the amulet does not improve a feat's non-spell DC |
| Passive Perception | 18 |
| Spell slots | **4 / 3 / 3 / 1** of levels 1–4 |
| Attunement | 2 of 3 slots used |

With the attuned cloak, saves are **Str +2, Dex +3, Con +6, Int +0, Wis +9, Cha +4**. Death saves gain +1. Skill bonuses: Insight +8, Medicine +8, Perception +8, Persuasion +3, Religion +2. Scale mail imposes **disadvantage on Stealth**.

A normal DC 10 concentration save succeeds on 4 or better with +6: **85%**. Spending Lucky on a poor initial roll, before the outcome is determined, can improve the chance for that check to 97.75%, at the cost of a luck point when needed. Higher-DC checks have different odds. Taking damage into temporary HP still requires concentration checks.

## Magic items

| Allocation | Item | Reason |
| --- | --- | --- |
| **Rare** | **+2 Amulet of the Devout** — attuned | +2 to spell attacks and spell save DCs, plus one Channel Divinity activation per dawn without spending a normal use. Strong both offensively and defensively. |
| **Uncommon** | **Cloak of Protection** — attuned | +1 AC and every saving throw, including concentration and death saves. |

These are the original *Tasha's Cauldron of Everything* and 2014 *Dungeon Master's Guide* items. Neither has a Renaissance or Futuristic tag. The amulet adds no damage/healing bonus and does not increase Dispel Magic ability checks. The cloak is already included in the listed AC; its save bonus requires the Roll20 setting below.

## Starting equipment and exact spending

Assumption: “additional 638 gp” supplements normal class/background starting equipment. Cleric equipment: **warhammer, scale mail, light crossbow with 20 bolts, explorer's pack, shield and holy symbol**. Twilight grants the proficiency needed to choose the warhammer. Rewarded supplies its listed writing kit, playing cards, signet ring, fine clothes, pouch, and **18 gp**. No starting gear is sold.

| Purchase | Quantity | Unit price | Total |
| --- | ---: | ---: | ---: |
| Diamond for Revivify | 1 | 300 gp | 300 gp |
| Reusable marked tokens for Augury | 1 set | 25 gp | 25 gp |
| Incense/offering for Divination | 1 set | 25 gp | 25 gp |
| Potion of Healing, 2014 | 2 | 50 gp | 100 gp |
| Holy water | 1 flask | 25 gp | 25 gp |
| Healer's kit | 1 | 5 gp | 5 gp |
| Manacles | 1 set | 2 gp | 2 gp |
| Caltrops | 1 bag | 1 gp | 1 gp |
| Ball bearings | 1 bag | 1 gp | 1 gp |
| Crowbar | 1 | 2 gp | 2 gp |
| Dagger | 1 | 2 gp | 2 gp |
| **Spent** | | | **488 gp** |

**638 + 18 − 488 = 168 gp remaining.** The two allocated magic items cost no gold. Potions are additional common consumables with an explicit 50 gp PHB price, permitted by your priced-item shopping rule. Component values are explicitly listed in their spells. The diamond and Divination offering are consumed on use; Augury tokens are reusable. Conservatively reserve the full holy-water flask for one Protection from Evil and Good casting.

Scale mail already reaches the same AC as a 400 gp breastplate; a breastplate's advantage would be removing Stealth disadvantage. Keeping the free armor leaves room for the Revivify diamond. Half plate costs 750 gp and is outside the budget. Upgrade to half plate later for +1 AC, or a breastplate if quiet movement matters more.

Standard carrying capacity is 180 lb from Strength 12, with Small size using the same multiplier as Medium. This load fits under standard capacity; the optional variant encumbrance rule would require reducing carried equipment. Do not count the pack's contents twice.

## Spells

**Four cleric cantrips:** Guidance, Sacred Flame, Toll the Dead, Thaumaturgy. **Mage Hand** is an additional cantrip from Telekinetic, cast without verbal/somatic components and optionally invisible. It has the normal 30-foot range because Rowan did not already know it.

**12 default cleric preparations:**

| Level | Prepared spells |
| --- | --- |
| 1st | Bless, Healing Word, Sanctuary, Protection from Evil and Good |
| 2nd | Aid, Lesser Restoration, Spiritual Weapon |
| 3rd | Spirit Guardians, Dispel Magic, Revivify |
| 4th | Death Ward, Freedom of Movement |

**Eight always-prepared Twilight spells**, additional to those 12:

| Acquired at cleric level | Spells |
| --- | --- |
| 1 | Faerie Fire, Sleep |
| 3 | Moonbeam, See Invisibility |
| 5 | Aura of Vitality, Leomund's Tiny Hut |
| 7 | Aura of Life, Greater Invisibility |

Augury and Divination are also included as **unprepared** cards, since their components have been bought. Swap them in after a long rest when needed; clerics must have a ritual prepared to cast it. Tiny Hut is already prepared through the domain. Do not count those two unprepared utility cards against today's 12 preparations, and do not cast them before swapping them in.

Spell cards contain short play reminders, not every exception in the full spell. The payload uses 2014 **Spiritual Weapon without concentration**, 2014 **Sleep's hit-point pool**, and 2014 **Spirit Guardians' entry/turn-start triggers**. All 27 cards include their original casting time, components and concentration/ritual state, with Telekinetic's explicit component exception for Mage Hand.

## How to play Rowan

1. **Between fights:** reapply Vigilant Blessing to yourself or the party member most likely to decide an encounter. This affects one creature's next initiative roll, not the whole party. Share 300-foot darkvision before a dark expedition if needed.
2. **First turn of a hard fight:** activate **Twilight Sanctuary** and position its 30-foot sphere to cover allies. A creature receives its benefit when it ends its own turn inside, not automatically at activation. Grant **1d6+7 temporary HP** or end one charm/fear effect. Temporary HP refresh rather than accumulate.
3. **Next turn:** cast **Spirit Guardians**, normally with a 3rd-level slot, or the one 4th-level slot for **4d8 radiant** per trigger. If positioning permits, bonus-action Telekinetic pulls an enemy from outside into the aura. The shove uses DC 16 Strength; the resulting spell save is DC 18 Wisdom. Do not assume the shove always succeeds.
4. **Later turns:** Dodge while maintaining Spirit Guardians; use Telekinetic to reposition enemies or free allies, or Healing Word to get an unconscious ally back up. Use a damaging cantrip when defense is less urgent. Flight helps against melee enemies, but altitude can put them outside the aura; taking flight also consumes the bonus action.
5. **After combat:** Aura of Vitality can provide up to ten 2d6 heals over a full minute, averaging 70 HP. It requires concentration, so doing this ends Spirit Guardians. Ritual Tiny Hut supports safer rests where the situation permits.

Important 2014 limits: moving the Spirit Guardians aura onto an enemy does **not** itself cause entry damage. Forced movement of the creature into a stationary aura can; the enemy's next turn-start is a separate trigger. Do not repeatedly sweep the aura around for damage as if using revised 2024 triggers. You also cannot maintain Bless, Spirit Guardians, Aura of Vitality, Moonbeam, or Greater Invisibility together: choose one concentration spell.

Spiritual Weapon is available when its extra attack is useful, but spending both a slot and recurring bonus actions is often less efficient than Telekinetic alongside Spirit Guardians. Its +10 attack deals **1d8+5 force**, with no +2 amulet damage bonus. A 4th-level casting deals 2d8+5, but competes with other uses of the only 4th-level slot.

Healing Word and Spiritual Weapon are bonus-action spells. Under 2014 rules, if one is cast, another spell that turn can only be a cantrip with a casting time of one action. Telekinetic and Twilight Sanctuary are features and do not themselves impose that spell restriction. Sanctuary on a creature dealing ongoing Spirit Guardians damage will end when that damage occurs; do not assume both protections persist together.

Normal Channel Divinity has **two uses per short/long rest**, shared between Twilight Sanctuary, Turn Undead and optional Harness Divine Power. The amulet adds **one activation per dawn** without spending a normal use. Harness Divine Power is an optional Tasha feature included here: at level 7, it recovers an expended 1st- or 2nd-level slot, uses a bonus action, consumes Channel Divinity, and is separately capped at **twice per long rest**. Steps of Night is **three** uses per long rest, not five.

Keep the shield wielded and the other hand empty for somatic/material components. The worn amulet serves as a holy symbol. Backup weapons are normally stowed. Doffing a shield takes an action; using the crossbow while wielding the shield is not allowed.

## Bring Rowan into Roll20

1. Paste the complete [JSON file](../../examples/pc-rowan-ashveil-level7.json) into **Description & Notes** of your private handout named **GPT Import**, then save.
2. Run the following commands as GM:

```text
!gpt-check-handout GPT Import
!gpt-import-handout GPT Import
```

3. Open the imported sheet and let its workers finish. AC 19, HP 52, spell DC 18, spell attacks +10, casting modifiers, feats, traits and inventory are in the payload.
4. **Enter 168 gp in the gold counter.** The inventory's gold-coins row records this same money; it is not a second purse.
5. **Enable the sheet's global saving throw modifier field and add an enabled entry named “Cloak of Protection” with value `1`.** This supplies the cloak's +1 on rolls, including death saves. The current importer has no save-bonus field, so its displayed base saves initially omit this item bonus. Do not add both a global modifier and individual modifiers. A Constitution save should resolve as base +5 plus global +1, for +6 total; death saves should total d20+1. Check the actual chat roll, since the base number displayed on the sheet may remain unchanged.
6. **Stealth rolls have disadvantage** from scale mail. Select advantage for the next initiative roll after using Vigilant Blessing; it is not permanently part of the +2 modifier. The importer initially sets normal rolls, so explicitly apply these states in Roll20's roll options/settings when appropriate.
7. Track Channel Divinity, the amulet's daily activation, Lucky's three points, flight's three uses and consumed materials. Spell cards do not spend slots or apply effects automatically. Mark the two magic items attuned and retain one free attunement slot.

The importer deliberately preserves this character as a snapshot. Later leveling or equipment changes require updating its fixed values. No automated test has connected to your live game; use these expected totals for the first in-game check.

## Rules references

The rules were checked against the public 5etools data mirror's **PHB/DMG/TCE/XGE/BMT** entries, excluding **XPHB/XDMG** and subclasses attached to the revised Cleric. These site links identify the original source editions:

- [2014 Player's Handbook](https://5e.tools/book.html#phb): Cleric pp.56–59; equipment pp.145–154; Lucky p.167; Resilient p.168; spell entries. Fixed-average HP is the class-table option.
- [Tasha's Cauldron of Everything](https://5e.tools/book.html#tce): Custom Lineage p.8; optional cleric features p.30; Twilight Domain pp.34–35; Telekinetic p.81; Amulet of the Devout p.119.
- [2014 Dungeon Master's Guide](https://5e.tools/book.html#dmg): Cloak of Protection p.159. The ordinary Potion of Healing also has its 50 gp purchase price in the PHB.
- [The Book of Many Things](https://5e.tools/book.html#bmt): Rewarded background p.57, granting the original Lucky feat and 18 gp among its equipment.
- [Xanathar's Guide to Everything](https://5e.tools/book.html#xge): Toll the Dead p.169.
- [2014 Spirit Guardians](https://5e.tools/spells.html#spirit%20guardians_phb): first entry on a turn or turn-start; movement of the aura itself is not a new entry by the creature.
- [Public source data used for the cross-check](https://github.com/5etools-mirror-3/5etools-src/tree/main/data): class, race, background, feat, item and original-source spell data. The prose in the import is summarized rather than copied wholesale from the books.
