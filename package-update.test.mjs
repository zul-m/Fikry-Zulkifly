/**
 * Tests for the @lucide/astro version bump from 1.16.0 to 1.21.0.
 *
 * Verifies that package.json and package-lock.json are consistent and
 * correctly reflect the upgraded dependency.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const pkg = JSON.parse(readFileSync(resolve(__dirname, "package.json"), "utf8"));
const lockfile = JSON.parse(
  readFileSync(resolve(__dirname, "package-lock.json"), "utf8")
);

const PACKAGE_NAME = "@lucide/astro";
const EXPECTED_VERSION_RANGE = "^1.21.0";
const EXPECTED_EXACT_VERSION = "1.21.0";
const EXPECTED_RESOLVED_URL =
  "https://registry.npmjs.org/@lucide/astro/-/astro-1.21.0.tgz";
const EXPECTED_INTEGRITY =
  "sha512-RSz8xUah+eApcVKuQJXuLzcaYwK++tTLHa34peSln3h8n/RblaohSmsHdOj1JUQT/KutfbXw19u2x5g0zMTT0w==";
const OLD_VERSION = "1.16.0";
const OLD_VERSION_RANGE = "^1.16.0";

describe("package.json — @lucide/astro version bump", () => {
  it("lists @lucide/astro as a dependency", () => {
    assert.ok(
      pkg.dependencies,
      "package.json should have a dependencies field"
    );
    assert.ok(
      Object.prototype.hasOwnProperty.call(pkg.dependencies, PACKAGE_NAME),
      `${PACKAGE_NAME} should be present in dependencies`
    );
  });

  it("specifies the updated version range ^1.21.0", () => {
    assert.equal(
      pkg.dependencies[PACKAGE_NAME],
      EXPECTED_VERSION_RANGE,
      `Expected ${PACKAGE_NAME} to be ${EXPECTED_VERSION_RANGE}`
    );
  });

  it("does not reference the old version range ^1.16.0", () => {
    assert.notEqual(
      pkg.dependencies[PACKAGE_NAME],
      OLD_VERSION_RANGE,
      `${PACKAGE_NAME} should not still be pinned to the old range ${OLD_VERSION_RANGE}`
    );
  });
});

describe("package-lock.json — root package entry", () => {
  const rootEntry = lockfile.packages?.[""];

  it("has a root package entry", () => {
    assert.ok(rootEntry, 'package-lock.json should have a packages[""] entry');
  });

  it("root entry specifies @lucide/astro at ^1.21.0", () => {
    assert.equal(
      rootEntry?.dependencies?.[PACKAGE_NAME],
      EXPECTED_VERSION_RANGE,
      `Root entry ${PACKAGE_NAME} should be ${EXPECTED_VERSION_RANGE}`
    );
  });

  it("root entry does not reference the old version range", () => {
    assert.notEqual(
      rootEntry?.dependencies?.[PACKAGE_NAME],
      OLD_VERSION_RANGE,
      `Root entry should not have old range ${OLD_VERSION_RANGE}`
    );
  });
});

describe("package-lock.json — node_modules/@lucide/astro entry", () => {
  const moduleKey = `node_modules/${PACKAGE_NAME}`;
  const entry = lockfile.packages?.[moduleKey];

  it("has a node_modules entry for @lucide/astro", () => {
    assert.ok(
      entry,
      `package-lock.json should have a packages["${moduleKey}"] entry`
    );
  });

  it("locked version is exactly 1.21.0", () => {
    assert.equal(
      entry?.version,
      EXPECTED_EXACT_VERSION,
      `Locked version should be ${EXPECTED_EXACT_VERSION}`
    );
  });

  it("resolved URL points to the 1.21.0 tarball", () => {
    assert.equal(
      entry?.resolved,
      EXPECTED_RESOLVED_URL,
      "Resolved URL should point to the 1.21.0 release on the npm registry"
    );
  });

  it("integrity hash matches the 1.21.0 release", () => {
    assert.equal(
      entry?.integrity,
      EXPECTED_INTEGRITY,
      "Integrity hash should match the sha512 checksum for 1.21.0"
    );
  });

  it("integrity hash uses sha512 algorithm", () => {
    assert.ok(
      entry?.integrity?.startsWith("sha512-"),
      "Integrity field should use sha512 algorithm"
    );
  });

  it("does not reference the old version 1.16.0 in version field", () => {
    assert.notEqual(
      entry?.version,
      OLD_VERSION,
      `Locked version should not be the old ${OLD_VERSION}`
    );
  });

  it("does not reference old version in the resolved URL", () => {
    assert.ok(
      !entry?.resolved?.includes(OLD_VERSION),
      `Resolved URL should not reference old version ${OLD_VERSION}`
    );
  });

  it("license is ISC", () => {
    assert.equal(entry?.license, "ISC", "@lucide/astro should be ISC licensed");
  });

  it("peerDependency on astro supports v4, v5, and v6", () => {
    assert.equal(
      entry?.peerDependencies?.astro,
      "^4 || ^5 || ^6",
      "peerDependency on astro should support ^4 || ^5 || ^6"
    );
  });
});

describe("package.json and package-lock.json — consistency", () => {
  it("package.json and lock root entry agree on the version constraint", () => {
    const pkgConstraint = pkg.dependencies?.[PACKAGE_NAME];
    const lockConstraint = lockfile.packages?.[""]?.dependencies?.[PACKAGE_NAME];
    assert.equal(
      pkgConstraint,
      lockConstraint,
      "package.json and package-lock.json root entry should specify the same version constraint"
    );
  });

  it("lock root constraint satisfies the locked exact version (semver range check)", () => {
    // ^1.21.0 means >=1.21.0 <2.0.0 — version 1.21.0 must satisfy this
    const [, major, minor, patch] = EXPECTED_EXACT_VERSION.match(
      /^(\d+)\.(\d+)\.(\d+)$/
    );
    const constraint = pkg.dependencies?.[PACKAGE_NAME]; // "^1.21.0"
    const [, cMajor, cMinor] = constraint.match(/^\^(\d+)\.(\d+)\.\d+$/);

    assert.equal(
      major,
      cMajor,
      "Major version of locked package must match constraint major"
    );
    assert.ok(
      Number(minor) >= Number(cMinor),
      "Minor version of locked package must be >= constraint minor"
    );
  });

  it("lockfileVersion is 3", () => {
    assert.equal(
      lockfile.lockfileVersion,
      3,
      "Lockfile should use format version 3 (npm v7+)"
    );
  });
});