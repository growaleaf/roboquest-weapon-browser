# Roboquest Weapon & Affix Stat Browser (GCT-030)

Single static page, `index.html`, no build step, no dependencies, no backend, no account/login.

## What it does

A sortable, filterable table of all 82 weapons currently listed on the wiki's stats page — 17
Assault, 16 Precision, 18 Technology, 16 Demolition, 15 Close Combat — with base damage, fire
rate, range, crit multiplier, ammo/energy cost, affixes, altfire, impact and reload time. Sort by
clicking any of the Weapon/Type/Base Damage/Fire Rate/DPS est. column headers; filter by category
or by name. It is a browser, not a verdict generator: no "best weapon" claim, no tier list, no
S-tier language anywhere in the shipped copy — enforced by a grep assertion in `test.js` against
both the rendered page and the data file, and by `Tools/slop_lint.py`.

## The core discipline: every garbled or unresolved cell ships labeled, never guessed

The source page (`roboquest.wiki.gg/wiki/Weapons`) states, verbatim: *"Stats are currently in the
process of being updated"* and *"Updated stats are in green, non-green stats are still to be
revised."* This fetch cannot preserve that color coding, so the on-page notice surfaces both
quotes directly rather than hiding the caveat.

Six weapons hit a genuinely garbled or unresolved cell in the direct fetch, and each ships with
the raw source text plus a named reason instead of a guessed number:

- **Arctic Rifle** — base damage printed as `2x10)`, a stray closing parenthesis with no opening
  one. This is the exact cell the orchestrator's own fetch had already flagged in `CHARTER.md`.
- **Voltaic Cannon**, **Shuriken** — base damage printed as `2x9` / `2x24` with no resolved total,
  unlike the page's own well-formed `"NN (AxB)"` pattern used elsewhere (e.g. `48 (4x12)`).
  Shuriken's impact cell (`2x10`) has the same problem.
- **Flak Cannon** — base damage `4x19.5` with no total, and an impact value (`4.19`) suspiciously
  close in digits to it; shipped verbatim, not reconciled.
- **Kramer**, **Power Fists** — ammo/energy cell printed only `(Energy)` with no leading number.

The DPS-estimate column (base damage × fire rate, a straight multiplication, labeled an estimate)
ships as "unconfirmed" rather than a computed number for any weapon whose base damage is one of
the unresolved cells above — `data.js`'s `computeDPS()` checks this explicitly, and `test.js`
asserts it by name for all four affected weapons.

The **Handgun** — the player's default starting weapon per the wiki's own intro text — has no row
in the stats table at all. It is disclosed on the page as a source gap, not silently dropped or
folded into another weapon's row.

## Sourcing

One source: `https://roboquest.wiki.gg/wiki/Weapons`, fetched via `WebFetch` 2026-10-28 (confirmed
reachable per the charter; raw curl is blocked the same as other wiki.gg properties this lane has
hit). The page's own last-edit stamp — *"This page was last edited on 25 November 2024, at
16:05"* — is shown on the page as additional, unreconciled context; it does not override the
page's own "mid-update" notice, both are shown as-is.

## Tests

`node test.js` — structural + content tests: 82 weapons across the 5 expected category counts;
every weapon with a `null` baseDamageValue/fireRateValue carries a matching named entry in its
`ambiguous` array (no silent gaps); known-answer DPS checks (Fox Gun 16×5=80, Hornet Bow
72×1.82=131.04, Meteor Cannon 105×2=210) and the 4 ambiguous-damage weapons (Arctic Rifle, Voltaic
Cannon, Flak Cannon, Shuriken) assert DPS is `null`, not a guess; confirms an ammo-cell gap (Kramer,
Power Fists) does not block their DPS estimate since DPS only needs damage and fire rate; confirms
"Handgun" is never fabricated into the list; banned-word grep against the rendered page (scripts +
styles stripped) and against every weapon row's own JSON; no-emoji check on both shipped files.
All passing.

`python3 Tools/slop_lint.py Products/RoboquestWeaponBrowser/` — clean, 0 findings.

No headless Chrome available in this CLI session (no Chrome MCP, per the Think Gate's own
delegation rules). Substituted: served the folder with `python3 -m http.server`, curled both
`index.html` and `data.js`, and byte-diffed the curled `index.html` against the source file on
disk — identical. The in-page inline-script self-test (mirroring `test.js`) runs in-browser and
reports 5/5 when actually opened.

## Not built (out of scope for this session)

No Stripe/Pro paywall. No deploy, no registry write, no git commit — reserved for the orchestrator
per the charter's acceptance criteria.
