import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.dirname(fileURLToPath(import.meta.url));
const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const qa=read('qa-report.json'),source=read('source-checks.json'),shots=read('screenshot-manifest.json');
const body=`# Bounded browser and visual report

Recorded local run: ${qa.timestamp}, ${qa.browser}. These136 browser and55 source checks were completed before public integration. Real standalone entry [index.html](index.html) was opened in installed Chrome; no state-setter, fake DOM or alternate capture screen was used. No public runtime was deployed. Fresh public-source checks are reported separately in [PUBLIC_INTEGRATION.md](PUBLIC_INTEGRATION.md).

## Results

- Browser/input/geometry: **${qa.totals.passed} passed, ${qa.totals.failed} failed**. [Machine report](qa-report.json), [actual input → snapshot records](input-output-log.json), [control geometry](render-geometry.json).
- Source/contracts: **${source.totals.passed} passed, ${source.totals.failed} failed**. [Source report](source-checks.json). This checks JSON/runtime parity, input domains, syntax, local links, key token contrast and preservation; it is distinct from browser QA.
- ${shots.screenshots.length} full-page runtime captures, with original PNG dimensions, byte counts and SHA-256 in [screenshot manifest](screenshot-manifest.json). [Desktop contact sheet](contact-sheet-desktop.png) and [mobile contact sheet](contact-sheet-mobile.png) only scale/layer labeled originals; [sheet manifest](contact-sheets-manifest.json) maps their source hashes.
- Local visual inspection separately examined desktop minimap/inventory, portrait minimap/detail, landscape confirmations/pause and Play view. It found and corrected caption/control overlap. Native-browser geometry then included that caption and passed the same states. No external screenshot reviewer was run.

## Coverage and boundaries

Actual browser viewports:1440×1000,1165×747,844×390,390×844 and320×568 CSS pixels. Internal390px portrait and bounded844px landscape frames were checked separately. The editor view permits vertical scrolling. Portrait inventory uses a sequential collection/detail flow. Play view removes the editor; landscape movement/combat primary controls fit the844×390 viewport, and portrait Equip/Back/Close remain reachable. Internal frame choices are not device emulation.

Minimap checks include north/heading rotation, zoom, square/circle, offscreen hide/show, enemy visibility, marker scale, map-specific objectives, full-frame disabling and stationary terrain, movement, area-map goal selection and Escape/focus return. Inventory checks include sort/filter/grid/list, signed gear comparison, rank blocking, supply/material detail, equip idempotence and retained loadout. Shop checks include insufficient balance, quantity limits, review-without-debit, Cancel/Escape, duplicate confirm, receipt, owned count, common-supply route and natural stock depletion.

Supporting checks cover actual hit/heal/cooldown, pause/inactive freeze, natural win/loss/retry, dialogue reward inspection, early quest return, sample cap and one-time claim. Native Enter/Space, scoped movement, visible focus, reduced motion, JSON download and emulated touch select/equip were checked. Native dialog Tab stops did not focus background controls; one Chrome browser-boundary stop reports BODY. This is a bounded keyboard observation, not an exhaustive trap or screen-reader audit.

Two duplicate-event probes dispatch twice on the actual rendered Confirm/Claim button; other flows use native clicks, keys and settings input. The public snapshot function only clones state. Export contains settings, not economy/progress. Reload resets fixtures. No console/page errors or failed requests occurred in the final covered run.

## Screens

| Capture | Browser viewport | Full-page pixels |
| --- | --- | --- |
${shots.screenshots.map(s=>`| [${s.name}](${s.file}) | ${s.viewport.width}×${s.viewport.height} | ${s.width}×${s.height} |`).join('\n')}

## Not run

${qa.notRun.map(x=>'- '+x).join('\n')}

The broader overlooked-game-detail goal remains open. These are the first three core components plus two small supporting slices; richer damage direction/response, interaction priority, pickup presentation, checkpoint return, save/reconnect and tutorial re-entry are not implemented. No ordinary/guided A/B trial, participant study, measured usability improvement, commercial-readiness claim or design approval was produced. Official sources are game-specific/historical observations; [source notes](sources.json) preserve the Halo detail-fetch limitation. Earlier tool/harness failures and repaired versions are retained in [repair log](REPAIR_LOG.md), first-pass/ and check-history/.

Public source/capture publication was authorized after this local run. Public report copies redact machine paths; original local records remain outside the public tree. Existing game/web implementation and evidence bytes are unchanged. Navigation, provenance, release validation and file inventories are updated separately for Git integration. Site deployment, external review and user design approval are not performed.
`;
fs.writeFileSync(path.join(root,'BROWSER_REPORT.md'),body);
function inventory(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?inventory(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const files=inventory(root).filter(f=>!f.endsWith('package-manifest.json')).map(f=>{const bytes=fs.readFileSync(f);return {file:path.relative(root,f).replaceAll('\\','/'),bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')};});
fs.writeFileSync(path.join(root,'package-manifest.json'),JSON.stringify({timestamp:new Date().toISOString(),baseCommit:'bdd696ffcde02808759fc009ac2dfa26e3834b5c',artifactType:'authored-design-proposal',files},null,2)+'\n');console.log('Browser report and package hash inventory finalized.');
