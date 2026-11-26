---
name: release-to-pr
description: Check whether a release broke something, and when it did, hand the evidence to the pull request that shipped it. Activate when a request names a deploy, a release, a commit or a pull request, or asks "did my last deploy break anything".
---

# From a release to its pull request

## Procedure

### 1. What did the release change?

Call Clearlook's `compare_release` for the release (or the newest one when none is named). It compares errors, conversions, page speed and server failures before and after, and names what got worse.

If nothing got worse beyond chance, say so in one line and stop.

### 2. Why?

For each thing that got worse, call `investigate` on that metric over the window since the release. Use its ranked causes and evidence numbers. Record each decision-relevant finding with `evidence_record` (source type `clearlook`, the URL from the evidence).

### 3. Which change?

Clearlook's release names a commit. With GitHub tools, find the pull request that merged it, then the files it touched that match the evidence: the page, the error's file and function, the API path that fails. Read only the relevant line ranges. Record the link between the evidence and the change.

### 4. Hand it over

When the cause is validated or strongly supported, offer to comment on the pull request:

- First line: what broke, for whom, since when, in one sentence.
- Then up to five evidence lines, each with its Clearlook link.
- Then the suspected change: file and lines, and why.
- End with: "Found by the Clearlook production context agent."

Call `addPullRequestComment` only after the person approves it. Never comment on a pull request when the evidence is weak; say what is missing instead.
