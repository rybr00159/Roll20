# Four more level-7 PCs

Four more builds under the same campaign rules: **2014 5e, standard array, no feat-granting background, no ability-score increase from the house-rule starting feat, at least one actual Grim Hollow: Player Pack option, one Rare and one Uncommon item, normal starting equipment plus 638 gp**.

| Character | Class / subclass | House-rule feat | Player Pack option | HP / unbuffed AC | Remaining gp |
| --- | --- | --- | --- | --- | ---: |
| [Elin Voss](elin-voss-level7.md) | Inquisition Domain Cleric 7 | War Caster | Inquisition Domain | 52 / 19 | 12 |
| [Kesh Mossarrow](kesh-mossarrow-level7.md) | Gloom Stalker Ranger 7 | Sharpshooter | Carvaloth Scale Armor | 60 / 16 | 420 |
| [Bryn Reedwhistle](bryn-reedwhistle-level7.md) | Circle of the Shepherd Druid 7 | War Caster | Telltale Heart | 66 / 16 | 147 |
| [Lio Glassmere](lio-glassmere-level7.md) | School of Divination Wizard 7 | Alert | Ring of Hidden Desire | 37 / 12 | 299 |

## Build choices

- **Elin:** armored anti-spell cleric. Spell Shield protects its temporary-HP holder against spells; Witch Hunter's Strike punishes concentration. The source omits Rebuke Invoker's save DC, so the guide explicitly proposes DC 16 and flags it for the GM rather than silently borrowing boosted spell DC 18.
- **Kesh:** bugbear opening-round archer. MPMM Surprise Attack can apply to multiple hits against creatures that have not taken a combat turn. Carvaloth camouflage is handled alongside the armor's normal Stealth disadvantage, so it does not invent blanket advantage.
- **Bryn:** Shepherd summoner and healer. The heart protects against fear, while an Amulet of Health supports concentration and survivability. Bear temporary HP apply once when its spirit appears; Conjure Animals species are GM-selected under the official guidance.
- **Lio:** initiative +7 and Portent support early battlefield control. The grimoire boosts spell DC to 18 and improves recovery. The ring reveals information at its own fixed DC 13; it is not mind control. AC starts at 12 and becomes 15 only after spending a slot on Mage Armor.

The racial/earned half-feats are separate from the house-rule feat. Elin and Lio take Fey Touched through Custom Lineage; Bryn takes Skill Expert through Custom Lineage; Kesh earns Piercer at Ranger 4. All four house-rule choices use their original 2014 versions and grant no stat increase. No background grants a feat.

## Import files

- [Elin Voss JSON](../../examples/pc-elin-voss-level7.json)
- [Kesh Mossarrow JSON](../../examples/pc-kesh-mossarrow-level7.json)
- [Bryn Reedwhistle JSON](../../examples/pc-bryn-reedwhistle-level7.json)
- [Lio Glassmere JSON](../../examples/pc-lio-glassmere-level7.json)

Paste one complete JSON into Description & Notes of a saved private handout named **GPT Import**, then run:

```text
!gpt-check-handout GPT Import
!gpt-import-handout GPT Import
```

Repeat for each character. Each guide lists its manual settings: remaining gold for all, Dread Ambusher initiative for Kesh, Alert initiative and active Mage Armor for Lio, and conditional features/resource tracking. No pre-cast buffs, familiars or summoned creatures are assumed.

## Verification

The payloads are locally validated and their stat arithmetic, original feat versions, background restrictions, actual Player Pack records, item rarities/attunement, spell counts, prices and cash balances are audited. [Audit manifest](grim-hollow-four-more-audit.json). Validation does not establish live Roll20 behavior.

[Earlier five-character roster](grim-hollow-five.md) · [Exact Player Pack](https://5e.tools/book.html#grimhollowplayerpack,1). The three new official subclasses meet the Grim Hollow requirement through permitted pack magic items; Elin uses the remaining pack subclass.
