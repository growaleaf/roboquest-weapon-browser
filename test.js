// Headless known-answer / structural tests. Run: node test.js
var data = require("./data.js");
var fs = require("fs");

var failures = 0;

function assert(cond, label) {
  if (!cond) {
    failures++;
    console.log("FAIL " + label);
  } else {
    console.log("PASS " + label);
  }
}

var CATEGORIES = ["Assault", "Precision", "Technology", "Demolition", "Close Combat"];
var EXPECTED_COUNTS = { "Assault": 17, "Precision": 16, "Technology": 18, "Demolition": 16, "Close Combat": 15 };

// ───────────────────────────────── structural

assert(data.WEAPONS.length === 82, "82 weapons present (17+16+18+16+15 across 5 categories)");

CATEGORIES.forEach(function (cat) {
  var count = data.WEAPONS.filter(function (w) { return w.category === cat; }).length;
  assert(count === EXPECTED_COUNTS[cat], cat + " has exactly " + EXPECTED_COUNTS[cat] + " weapons (got " + count + ")");
});

data.WEAPONS.forEach(function (w) {
  assert(typeof w.name === "string" && w.name.length > 0, "weapon has a non-empty name");
  assert(CATEGORIES.indexOf(w.category) !== -1, w.name + " has a valid category");
  assert(typeof w.baseDamageRaw === "string" && w.baseDamageRaw.length > 0, w.name + " has a non-empty baseDamageRaw");
  assert(typeof w.fireRateRaw === "string" && w.fireRateRaw.length > 0, w.name + " has a non-empty fireRateRaw");
  assert(Array.isArray(w.ambiguous), w.name + " has an ambiguous array (possibly empty)");
  // The honesty rule this build is built around: a null *Value must always come with a named
  // reason in `ambiguous` for that exact field — never a silent gap.
  if (w.baseDamageValue === null) {
    assert(w.ambiguous.some(function (a) { return a.indexOf("baseDamage") === 0; }), w.name + " has baseDamageValue null only with a matching ambiguous note");
  }
  if (w.fireRateValue === null) {
    assert(w.ambiguous.some(function (a) { return a.indexOf("fireRate") === 0; }), w.name + " has fireRateValue null only with a matching ambiguous note");
  }
});

// Exactly 6 weapons carry an ambiguous flag — the garbled/unresolved cells found in the actual
// fetch (Kramer ammo, Arctic Rifle damage, Voltaic Cannon damage, Flak Cannon damage+impact,
// Power Fists ammo, Shuriken damage+impact).
var ambiguousWeapons = data.WEAPONS.filter(function (w) { return w.ambiguous.length > 0; });
assert(ambiguousWeapons.length === 6, "exactly 6 weapons carry an ambiguous-cell flag (got " + ambiguousWeapons.length + ")");

["Kramer", "Arctic Rifle", "Voltaic Cannon", "Flak Cannon", "Power Fists", "Shuriken"].forEach(function (name) {
  var found = ambiguousWeapons.filter(function (w) { return w.name === name; })[0];
  assert(found !== undefined, name + " is flagged ambiguous");
});

// ───────────────────────────────── known-answer DPS

(function knownAnswerDPS() {
  var fox = data.WEAPONS.filter(function (w) { return w.name === "Fox Gun"; })[0];
  assert(data.computeDPS(fox) === 80, "Fox Gun DPS est. = 16 base damage x 5 fire rate = 80");

  var hornet = data.WEAPONS.filter(function (w) { return w.name === "Hornet Bow"; })[0];
  assert(data.computeDPS(hornet) === 131.04, "Hornet Bow DPS est. = 72 x 1.82 = 131.04");

  var meteor = data.WEAPONS.filter(function (w) { return w.name === "Meteor Cannon"; })[0];
  assert(data.computeDPS(meteor) === 210, "Meteor Cannon DPS est. = 105 x 2 = 210");

  // Ambiguous base damage must never be silently coerced into a DPS number.
  var arctic = data.WEAPONS.filter(function (w) { return w.name === "Arctic Rifle"; })[0];
  assert(data.computeDPS(arctic) === null, "Arctic Rifle (garbled '2x10)' damage) ships DPS as null, not a guessed number");

  var voltaic = data.WEAPONS.filter(function (w) { return w.name === "Voltaic Cannon"; })[0];
  assert(data.computeDPS(voltaic) === null, "Voltaic Cannon (unresolved '2x9' damage) ships DPS as null");

  var flak = data.WEAPONS.filter(function (w) { return w.name === "Flak Cannon"; })[0];
  assert(data.computeDPS(flak) === null, "Flak Cannon (unresolved '4x19.5' damage) ships DPS as null");

  var shuriken = data.WEAPONS.filter(function (w) { return w.name === "Shuriken"; })[0];
  assert(data.computeDPS(shuriken) === null, "Shuriken (unresolved '2x24' damage) ships DPS as null");
})();

// Weapons with a missing ammo number (Kramer, Power Fists) still have a computable DPS, since
// DPS depends only on base damage and fire rate, not ammo.
(function dpsIndependentOfAmmoGap() {
  var kramer = data.WEAPONS.filter(function (w) { return w.name === "Kramer"; })[0];
  assert(data.computeDPS(kramer) === Math.round(17 * 6.67 * 100) / 100, "Kramer's ammo gap does not block its DPS estimate");

  var powerFists = data.WEAPONS.filter(function (w) { return w.name === "Power Fists"; })[0];
  assert(data.computeDPS(powerFists) === Math.round(56 * 3.33 * 100) / 100, "Power Fists' ammo gap does not block its DPS estimate");
})();

// The Handgun must never appear — the source table genuinely has no row for it.
assert(data.WEAPONS.every(function (w) { return w.name !== "Handgun"; }), "Handgun is not fabricated into the weapon list (source table has no row for it)");

// ───────────────────────────────── copy discipline (T0/T1 liability tier)

var BANNED_WORDS = ["best", "optimal", "strongest", "guaranteed", "approved", "certified", "compliant", "safe", "s-tier", "meta"];

function stripToVisibleText(html) {
  var visible = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  visible = visible.replace(/<style[\s\S]*?<\/style>/gi, "");
  visible = visible.replace(/<[^>]+>/g, " ");
  return visible;
}

(function checkIndexHtmlVisibleCopy() {
  var raw = fs.readFileSync(__dirname + "/index.html", "utf8");
  var visible = stripToVisibleText(raw).toLowerCase();
  BANNED_WORDS.forEach(function (w) {
    var re = new RegExp("\\b" + w.replace("-", "\\-") + "\\b");
    assert(!re.test(visible), "index.html rendered copy (tags+scripts+styles stripped) does not contain banned word '" + w + "'");
  });
})();

data.WEAPONS.forEach(function (row) {
  var text = JSON.stringify(row).toLowerCase();
  BANNED_WORDS.forEach(function (w) {
    var re = new RegExp("\\b" + w.replace("-", "\\-") + "\\b");
    assert(!re.test(text), "WEAPONS/" + row.name + " data does not contain banned word '" + w + "'");
  });
});

// No emoji anywhere in source files (S1/S2 — a flag is a real image or it is nothing; emoji
// never carries meaning alone).
(function noEmoji() {
  var emojiRe = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
  ["index.html", "data.js"].forEach(function (f) {
    var raw = fs.readFileSync(__dirname + "/" + f, "utf8");
    assert(!emojiRe.test(raw), f + " contains no emoji");
  });
})();

if (failures > 0) {
  console.log(failures + " test(s) failed.");
  process.exit(1);
} else {
  console.log("All tests passed.");
}
