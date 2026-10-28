# Roll20 PC and companion tokens

One circular portrait PNG for every PC in the repository, plus companions and spirit markers: **18 tokens — 11 PCs and 7 companions/markers**, including the original Mira example. Each has an antique-brass rim, a painted portrait inside, and a transparent exterior. The images are square PNGs with an alpha channel; do not convert them to JPEG.

[Download all 18 tokens as a ZIP](../roll20-pc-tokens.zip), or [download just the 7 companion tokens](../roll20-companion-tokens.zip). The original full-download filename is retained so earlier links still work. Extract the ZIP before uploading: Roll20 needs the individual PNG files.

## Gallery

Click a portrait to open the full PNG. On GitHub, use **Download raw file** to save the PNG itself; do not save a screenshot of the gallery or the GitHub page.

| Rowan Ashveil | Mira Fenwick | Mara Ironwake |
| --- | --- | --- |
| [<img src="rowan-ashveil.png" width="180" alt="Rowan Ashveil token">](rowan-ashveil.png) | [<img src="mira-fenwick.png" width="180" alt="Mira Fenwick token">](mira-fenwick.png) | [<img src="mara-ironwake.png" width="180" alt="Mara Ironwake token">](mara-ironwake.png) |

| Torren Ravenmantle | Isolde Mournsong | Sera Dawnwarden |
| --- | --- | --- |
| [<img src="torren-ravenmantle.png" width="180" alt="Torren Ravenmantle token">](torren-ravenmantle.png) | [<img src="isolde-mournsong.png" width="180" alt="Isolde Mournsong token">](isolde-mournsong.png) | [<img src="sera-dawnwarden.png" width="180" alt="Sera Dawnwarden token">](sera-dawnwarden.png) |

| Neris Vale | Elin Voss | Kesh Mossarrow |
| --- | --- | --- |
| [<img src="neris-vale.png" width="180" alt="Neris Vale token">](neris-vale.png) | [<img src="elin-voss.png" width="180" alt="Elin Voss token">](elin-voss.png) | [<img src="kesh-mossarrow.png" width="180" alt="Kesh Mossarrow token">](kesh-mossarrow.png) |

| Bryn Reedwhistle | Lio Glassmere |
| --- | --- |
| [<img src="bryn-reedwhistle.png" width="180" alt="Bryn Reedwhistle token">](bryn-reedwhistle.png) | [<img src="lio-glassmere.png" width="180" alt="Lio Glassmere token">](lio-glassmere.png) |

## Companions and spirits

| Torren's giant ape | Isolde's skeleton archer | Owl familiar option |
| --- | --- | --- |
| [<img src="companion-giant-ape-torren.png" width="180" alt="Giant ape token">](companion-giant-ape-torren.png) | [<img src="companion-skeleton-isolde.png" width="180" alt="Skeleton archer token">](companion-skeleton-isolde.png) | [<img src="companion-owl-familiar.png" width="180" alt="Owl familiar token">](companion-owl-familiar.png) |

| Bryn's wolf summon option | Bryn's Bear Spirit | Bryn's Hawk Spirit |
| --- | --- | --- |
| [<img src="companion-wolf-bryn.png" width="180" alt="Wolf token">](companion-wolf-bryn.png) | [<img src="spirit-bear-bryn.png" width="180" alt="Bear Spirit marker">](spirit-bear-bryn.png) | [<img src="spirit-hawk-bryn.png" width="180" alt="Hawk Spirit marker">](spirit-hawk-bryn.png) |

| Bryn's Unicorn Spirit |
| --- |
| [<img src="spirit-unicorn-bryn.png" width="180" alt="Unicorn Spirit marker">](spirit-unicorn-bryn.png) |

See [companion setup and sizing](COMPANIONS.md). The owl and wolf are useful form/species options; the three Spirit Totems are effect markers, not additional creatures. The artwork does not change the builds' spell, summoning or ownership rules.

## Set up in Roll20

1. Download and extract the ZIP, or download the individual PNGs.
2. Upload the PNGs to your game's **Art Library → My Library**, then drag the desired image onto the **Objects & Tokens** layer.
3. Size a PC token to one grid square. All PCs here are Small or Medium; use one square for both. For companions, use the sizes in [COMPANIONS.md](COMPANIONS.md), especially the Huge ape's **3 × 3 squares**. The transparent square corners will let the map show through.
4. Open the placed token's settings and set **Represents Character** to the matching imported PC. Configure the name, player permissions, HP bar and vision as desired. For a PC whose HP should stay linked, link the chosen bar to that character's `hp` attribute.
5. With the configured token selected, open that character's **Edit** dialog and use the **Default Token** control to save the selected token, then save the character. Labels can vary slightly with Roll20's interface version.
6. Drag the character from the Journal onto the map to check that it creates the configured token. If you later change token settings, save the default token again to retain them for future placements.

You can also use the PNG as the character's avatar, but the avatar and default-token controls are separate. Uploading artwork alone does not bind it to a character or configure HP, sight or permissions. The JSON character importer does not automatically upload or attach these images.

Appearance was based on the character descriptions, classes and equipment, with creative choices for unspecified details. The originals from image generation are retained outside the checkout; these are the individually named copies for play. [tokens.json](tokens.json) maps tokens to their available character imports and records owners, token roles, actual image dimensions and checksums. Options and effect markers without a character import have a null import field.
