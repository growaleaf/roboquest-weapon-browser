// Roboquest — Weapon & Affix Stat Browser data.
// Source: https://roboquest.wiki.gg/wiki/Weapons, fetched via WebFetch 2026-10-28.
// That page states, verbatim: "Stats are currently in the process of being updated." and
// "Updated stats are in green, non-green stats are still to be revised." This fetch cannot
// preserve the page's color formatting, so every value below ships exactly as the wiki's text,
// with that caveat shown on-page rather than hidden. Page's own last-edit stamp (unrelated to the
// stats-update note above): "This page was last edited on 25 November 2024, at 16:05."
//
// Every weapon carries baseDamageRaw / fireRateRaw exactly as the wiki prints them. Where a
// number parses cleanly, the matching *Value field holds it (used for sorting and the DPS
// estimate). Where it does not — a stray character, an unresolved "NxM" with no printed total,
// or a missing figure — the *Value field is null and the weapon's `ambiguous` array names which
// field(s) and why, instead of guessing a number.
//
// The Handgun (the player's default starting weapon, per the page's own intro text) has NO row
// in the wiki's stats table at all — it is not silently folded into another weapon here.

(function (root) {
  "use strict";

  var SOURCE_URL = "https://roboquest.wiki.gg/wiki/Weapons";
  var FETCHED = "2026-10-28";

  function w(fields) {
    return {
      name: fields[0],
      category: fields[1],
      baseDamageRaw: fields[2],
      baseDamageValue: fields[3],
      fireRateRaw: fields[4],
      fireRateValue: fields[5],
      rangeRaw: fields[6],
      critRaw: fields[7],
      ammoRaw: fields[8],
      affixesRaw: fields[9],
      altfireRaw: fields[10],
      impactRaw: fields[11],
      reloadRaw: fields[12],
      ambiguous: fields[13] || []
    };
  }

  var WEAPONS = [
    // ───────────────────────────────────────────────────────── Assault (17)
    w(["Fox Gun", "Assault", "16", 16, "5", 5, "12m", "1.5x", "15 (Mag.)", "Sidekick", "-", "12", "1"]),
    w(["Raptor SMG", "Assault", "10.5", 10.5, "11.11", 11.11, "12m", "1.5x", "30 (Mag.)", "Havoc", "-", "9", "1.55"]),
    w(["Dual Uzis", "Assault", "8", 8, "20", 20, "9m", "1.25x", "50 (Mag.)", "Dual", "-", "4", "1.35"]),
    w(["Quasar SMG", "Assault", "11.5", 11.5, "10", 10, "16m", "1.25x", "2.25% (Energy)", "Bounce Havoc", "-", "9", "1.65"]),
    w(["Junk Rifle", "Assault", "13", 13, "10", 10, "16m", "1.5x", "30 (Mag.)", "-", "Grenade", "10", "1.55"]),
    w(["Windmill Rifle", "Assault", "15", 15, "7.14", 7.14, "16m", "1.25x", "60 (Mag.)", "Warmup", "-", "13", "1.5"]),
    w(["Cosmo Gun", "Assault", "24", 24, "5.56", 5.56, "16m", "1.25x", "4.5% (Energy)", "Bounce Sidekick", "-", "-", "1.65"]),
    w(["Rhino LMG", "Assault", "15.5", 15.5, "10", 10, "16m", "1.25x", "50 (Mag.)", "Heavy", "-", "15", "1.85"]),
    w(["Tommy Gun", "Assault", "10", 10, "11.36", 11.36, "16m", "1.25x", "45 (Mag.)", "Buckshot", "-", "10", "1.5"]),
    w(["Dual Rascals", "Assault", "10", 10, "13.16/s", 13.16, "12m", "x1.5", "40 (Mag.)", "Dual", "-", "9", "1.47"]),
    w(["Hurricane Rifle", "Assault", "11", 11, "11.36/s", 11.36, "16m", "1.25x", "2.25% (Energy)", "Overclocking Bounce", "-", "9", "1.65"]),
    w(["Valkyrie Rifle", "Assault", "11.5", 11.5, "12.12/s", 12.12, "16m", "1.5x", "35 (Mag.)", "-", "-", "11", "1.5"]),
    w(["Dual LMGs", "Assault", "13", 13, "11.76/s", 11.76, "16m", "x1.25", "60 (Mag.)", "Dual Heavy", "-", "12", "1.55"]),
    w(["Dual Vipers", "Assault", "24", 24, "5.56/s", 5.56, "16m", "x1.25", "24 (Mag.)", "Dual", "-", "25", "1.18"]),
    w(["Vulture Rifle", "Assault", "18", 18, "8.33/s", 8.33, "16m", "1.5x", "32 (Mag.)", "-", "-", "16", "1.45"]),
    w(["Typhoon Minigun", "Assault", "11.5", 11.5, "12.5/s", 12.5, "16m", "-", "1.4% (Energy)", "Heavy Seeker", "-", "8", "1.65"]),
    w(["Mammoth Minigun", "Assault", "10.5", 10.5, "11.11/s", 11.11, "16m", "1.25x", "80 (Mag.)", "Heavy Warmup", "-", "10", "2.25"]),

    // ───────────────────────────────────────────────────────── Precision (16)
    w(["Hornet Bow", "Precision", "72", 72, "1.82/s", 1.82, "23m", "1.75x", "6 (Mag.)", "Ballista", "-", "70", "1"]),
    w(["Dart Spitter", "Precision", "20", 20, "5.88/s", 5.88, "16m", "1.5x", "24 (Mag.)", "Bounce", "-", "16", "1.43"]),
    w(["Bandito Gun", "Precision", "52", 52, "2/s", 2, "16m", "1.75x", "6 (Mag.)", "Bullseye", "-", "46", "1.55"]),
    w(["Dual Stingers", "Precision", "42", 42, "3.12/s", 3.12, "16m", "2x", "10 (Mag.)", "Dual Bounce", "-", "42", "1.55"]),
    w(["Kunai", "Precision", "30", 30, "2.38/s", 2.38, "16m", "3.75x", "6 (Mag.)", "Bounce", "-", "16", "0.9"]),
    w(["Sheriff's Carbine", "Precision", "56", 56, "1.89/s", 1.89, "16m", "1.5x", "12 (Mag.)", "Volatile", "-", "48", "1.55"]),
    w(["Scout Sniper", "Precision", "60", 60, "1.18/s", 1.18, "23m", "2.5x", "6 (Mag.)", "-", "Scope", "60", "1.55"]),
    w(["Junk Arquebus", "Precision", "40", 40, "2.63/s", 2.63, "23m", "2x", "10% (Energy)", "-", "Scope", "40", "1.65"]),
    w(["Shark Sniper", "Precision", "98", 98, "0.74/s", 0.74, "23m", "2x", "4 (Mag.)", "-", "Scope", "86", "1.9"]),
    w(["Ionic Sniper", "Precision", "46", 46, "2.56/s", 2.56, "23m", "2x", "10% (Energy)", "-", "Scope", "42", "1.65"]),
    w(["Lynx Rifle", "Precision", "46", 46, "2.78/s", 2.78, "23m", "2x", "12 (Mag.)", "-", "-", "46", "1.55"]),
    w(["Cobra .50", "Precision", "54", 54, "2.63/s", 2.63, "12m", "1.25x", "7 (Mag.)", "Sidekick", "-", "54", "1.25"]),
    w(["Dual Hellions", "Precision", "42", 42, "3.57/s", 3.57, "12m", "1.5x", "6% (Energy)", "Dual", "-", "38", "1.65"]),
    w(["Mantis Crossbow", "Precision", "58", 58, "2/s", 2, "23m", "1.75x", "8 (Mag.)", "Ballista", "-", "62", "1.5"]),
    w(["Boomerang", "Precision", "46", 46, "2", 2, "16", "-", "4 (Mag.)", "-", "-", "46", "0.8"]),
    w(["Gauss Rifle", "Precision", "82", 82, "3.33", 3.33, "23", "1.5x", "16% (Energy)", "Ballista", "-", "76", "1.65"]),

    // ───────────────────────────────────────────────────────── Technology (18)
    w(["Buddybot", "Technology", "12", 12, "5.56", 5.56, "16", "1.25x", "3.5% (Energy)", "Sidekick Bounce", "Summon", "12", "1.65"]),
    w(["Kramer", "Technology", "17", 17, "6.67/s", 6.67, "9m", "-", "(Energy)", "Burn Heavy", "-", "-", "-",
      ["ammo — source cell printed only \"(Energy)\" with no leading number; shipped as-is, not guessed"]]),
    w(["Igniter Gun", "Technology", "15", 15, "5.26/s", 5.26, "12m", "-", "4% (Energy)", "Burn Seeker", "-", "-", "1.65"]),
    w(["Beluga Cannon", "Technology", "50", 50, "2/s", 2, "2.2m", "-", "12% (Energy)", "Explosive Cryo Heavy", "-", "-", "1.65"]),
    w(["Arctic Rifle", "Technology", "2x10)", null, "5.56/s", 5.56, "16m", "-", "3.5% (Energy)", "Cryo Shatter", "-", "-", "1.65",
      ["baseDamage — source cell printed \"2x10)\" with a stray closing parenthesis and no opening one; this is the exact garbled cell the orchestrator's own fetch already flagged in CHARTER.md. Shown verbatim, not resolved to a number."]]),
    w(["Tesla Rifle", "Technology", "8", 8, "10/s", 10, "16m", "-", "2.25% (Energy)", "Shock Ricochet", "-", "-", "1.65"]),
    w(["Voltaic Cannon", "Technology", "2x9", null, "7.69/s", 7.69, "12m", "-", "3% (Energy)", "Shock Heavy", "-", "-", "1.65",
      ["baseDamage — source cell printed \"2x9\" (two hits of 9?) with no printed total unlike the \"NN (AxB)\" pattern used elsewhere on this page (e.g. \"48 (4x12)\"); not resolved to a single number."]]),
    w(["Splasher Rifle", "Technology", "17", 17, "8.33/s", 8.33, "16m", "-", "2% (Energy)", "Bounce Fork", "-", "16", "1.65"]),
    w(["Volcano Rifle", "Technology", "36", 36, "2.78/s", 2.78, "1.2m", "-", "7% (Energy)", "Burn Explosive", "-", "-", "1.65"]),
    w(["Junk Beam", "Technology", "8.5", 8.5, "15.38/s", 15.38, "16m", "1.25x", "1.25% (Energy)", "Heavy Overclocking", "-", "-", "1.65"]),
    w(["Ionic Palms", "Technology", "23", 23, "5/s", 5, "12m", "-", "3% (Energy)", "Dual Seeker", "-", "18", "1.65"]),
    w(["Cyclone Rifle", "Technology", "51", 51, "2.22/s", 2.22, "16m", "1.25x", "10% (Energy)", "Pierce", "Unstable Orb", "46", "1.65"]),
    w(["Meteor Cannon", "Technology", "105", 105, "2/s", 2, "16m", "-", "26% (Energy)", "Heavy Ballista", "-", "96", "1.65"]),
    w(["Kangaroo Sentry", "Technology", "20", 20, "5/s", 5, "16m", "1.25x", "25 (Mag.)", "Heavy", "Sentry", "-", "-"]),
    w(["Sonic Crossbow", "Technology", "44", 44, "2.78/s", 2.78, "12m", "-", "13% (Energy)", "Pierce", "-", "-", "-"]),
    w(["Mini Cricket", "Technology", "180", 180, "1.25", 1.25, "12", "-", "1 (Mag.)", "Slack", "-", "-", "3"]),
    w(["Minion Box", "Technology", "26", 26, "3.33", 3.33, "1.7", "-", "Infinite (Mag.)", "Brawl", "Rally", "55", "-"]),
    w(["Bee Cannon", "Technology", "13", 13, "1.33", 1.33, "16", "-", "14% (Energy)", "Heavy Seeker Ticking", "-", "4", "1.65"]),

    // ───────────────────────────────────────────────────────── Demolition (16)
    w(["Thumper", "Demolition", "56", 56, "2.22/s", 2.22, "2.1m", "-", "8 (Mag.)", "Explosive, Bounce", "-", "-", "-"]),
    w(["Flare Gun", "Demolition", "38", 38, "0.8/s", 0.8, "2.3m", "-", "None", "Explosive, Mark", "-", "-", "-"]),
    w(["Mine Launcher", "Demolition", "34", 34, "4.55/s", 4.55, "1.4m", "-", "18 (Mag.)", "Explosive, Amplify, Detonator", "-", "-", "-"]),
    w(["Elephant Gun", "Demolition", "48 (4x12)", 48, "2.38/s", 2.38, "0.9m", "-", "4 (Mag.)", "Explosive", "-", "-", "-"]),
    w(["Dragoon Mortar", "Demolition", "80", 80, "2/s", 2, "2.3m", "-", "6 (Mag.)", "Explosive, Heavy", "-", "-", "-"]),
    w(["Torpedo Rifle", "Demolition", "20", 20, "6.67/s", 6.67, "0.7m", "-", "24 (Mag.)", "Explosive, Seeker", "-", "-", "-"]),
    w(["Comet Cannon", "Demolition", "50", 50, "2.22/s", 2.22, "1.6m", "-", "15 (Energy)", "Heavy, Explosive", "-", "-", "-"]),
    w(["Kaboon Grenade", "Demolition", "85", 85, "1.82/s", 1.82, "3.8m", "-", "None", "Explosive, Sidekick", "-", "-", "-"]),
    w(["Gorilla Bolter", "Demolition", "44", 44, "3.03/s", 3.03, "0.8m", "1.5x", "20 (Mag.)", "Explosive", "-", "46", "1.55"]),
    w(["Patator", "Demolition", "68", 68, "1.92/s", 1.92, "1.2m", "-", "8 (Mag.)", "Heavy, Explosive", "-", "80", "2"]),
    w(["Buffalo Cannon", "Demolition", "96", 96, "1.25/s", 1.25, "2.2m", "-", "4 (Mag.)", "Heavy, Explosive", "-", "100", "2"]),
    w(["Flak Cannon", "Demolition", "4x19.5", null, "1.89/s", 1.89, "12m", "-", "12 (Mag.)", "Heavy, Wreck, Bounce", "Flak Grenade", "4.19", null,
      ["baseDamage — source cell printed \"4x19.5\" with no printed total, flagged ambiguous by the fetch itself", "impact — source cell printed \"4.19\", suspiciously close in digits to the baseDamage cell; shipped verbatim, not reconciled"]]),
    w(["Pulsar Rifle", "Demolition", "16", 16, "8/s", 8, "-", "-", "2.5% (Energy)", "Explosive, Seeker, Amplify", "-", "14", "1.65"]),
    w(["Dual Boomsticks", "Demolition", "30", 30, "4.55/s", 4.55, "-", "-", "16 (Mag.)", "Dual, Explosive", "-", "27", "1.25"]),
    w(["Sling Gun", "Demolition", "48", 48, "1.82", 1.82, "-", "-", "8 (Mag.)", "Explosive, Ricochet, Echo", "-", "56", "1.5"]),
    w(["Missile Battery", "Demolition", "24", 24, "4", 4, "-", "-", "36 (Mag.)", "Heavy, Warmup, Explosive", "-", "26", "2.05"]),

    // ───────────────────────────────────────────────────────── Close Combat (15)
    w(["The Shovel", "Close Combat", "45", 45, "2", 2, "1.7", "-", "Infinite", "Brawl Crusher", "-", "75", "-"]),
    w(["Bull Shotgun", "Close Combat", "70 (5x14)", 70, "1.59/s", 1.59, "9m", "1.25x", "7 (Mag.)", "-", "-", "-", "-"]),
    w(["Grandma's Shotgun", "Close Combat", "60 (4x15)", 60, "1.82/s", 1.82, "9m", "1.25x", "8 (Mag.)", "Wreck", "-", "-", "-"]),
    w(["Blunderbuzz", "Close Combat", "50 (5x10)", 50, "2.22/s", 2.22, "12m", "1.25x", "11% (Energy)", "Bounce", "-", "-", "-"]),
    w(["Power Fists", "Close Combat", "56", 56, "3.33/s", 3.33, "1.7m", "-", "(Energy)", "Brawl Dual", "-", "-", "-",
      ["ammo — source cell printed only \"(Energy)\" with no leading number; shipped as-is, not guessed"]]),
    w(["Shredder", "Close Combat", "20", 20, "11.11/s", 11.11, "1.5m", "-", "100 (Mag.)", "Brawl Heavy", "-", "-", "-"]),
    w(["Tomahawk", "Close Combat", "66", 66, "2/s", 2, "16m", "1.25x", "4 (Mag.)", "Riot", "-", "-", "-"]),
    w(["Dual Sawed-Offs", "Close Combat", "50 (5x10)", 50, "2.22/s", 2.22, "9m", "1.25x", "8 (Mag.)", "Dual", "-", "-", "-"]),
    w(["Ram Shotgun", "Close Combat", "45 (5x9)", 45, "2.94/s", 2.94, "9m", "1.25x", "18 (Mag.)", "-", "-", "-", "-"]),
    w(["Behemoth Shotgun", "Close Combat", "72 (4x18)", 72, "1.82/s", 1.82, "9m", "1.25x", "3 (Mag.)", "Heavy Wreck Refund", "-", "-", "-"]),
    w(["Orbital Shotgun", "Close Combat", "60 (5x12)", 60, "2.13/s", 2.13, "12m", "1.25x", "10% (Energy)", "Bounce", "-", "-", "-"]),
    w(["Sulfator Shotgun", "Close Combat", "50 (5x10)", 50, "2.17/s", 2.17, "9m", "1.25x", "16 (Mag.)", "Heavy Wreck Warmup", "-", "-", "-"]),
    w(["Razor Launcher", "Close Combat", "14", 14, "3.12/s", 3.12, "16m", "-", "15% (Energy)", "Ticking", "-", "-", "-"]),
    w(["Rapier", "Close Combat", "45", 45, "2.22", 2.22, "4.7", "3.25x", "Infinite (Mag.)", "Brawl", "-", "80", "-"]),
    w(["Shuriken", "Close Combat", "2x24", null, "2.86", 2.86, "9", "-", "8 (Mag.)", "Surprise Sharp", "-", "2x10", "1",
      ["baseDamage — source cell printed \"2x24\" with no printed total, same unresolved pattern as Voltaic Cannon/Flak Cannon", "impact — source cell printed \"2x10\", same unresolved pattern; not reconciled to a single number"]])
  ];

  var CATEGORY_ORDER = { "Assault": 0, "Precision": 1, "Technology": 2, "Demolition": 3, "Close Combat": 4 };

  function computeDPS(weapon) {
    if (weapon.baseDamageValue == null || weapon.fireRateValue == null) return null;
    if (weapon.ambiguous && weapon.ambiguous.some(function (a) { return a.indexOf("baseDamage") === 0 || a.indexOf("fireRate") === 0; })) return null;
    return Math.round(weapon.baseDamageValue * weapon.fireRateValue * 100) / 100;
  }

  var api = {
    SOURCE_URL: SOURCE_URL,
    FETCHED: FETCHED,
    WEAPONS: WEAPONS,
    CATEGORY_ORDER: CATEGORY_ORDER,
    computeDPS: computeDPS
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.ROBOQUEST_DATA = api;
  }
})(typeof window !== "undefined" ? window : this);
