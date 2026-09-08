# Problem Solving workspace QA

Source visual truth: `public/reference/step-1.png` (2048 × 1124 pixels) and `public/reference/step-2.png` (1936 × 1216 pixels).

Browser-rendered evidence: `qa/problem-step1-v5-final.jpg`, `qa/problem-step2-v5-final.jpg`, and `qa/problem-doc-v5.jpg`. Intermediate card comparison: `qa/problem-step2-v5.jpg`.

Viewport: 1363 × 936 CSS pixels, devicePixelRatio 1; captures are 1363 × 936 pixels. The supplied Step 2 image is a content-pane capture without chat. Comparisons account for the narrower browser, the added step navigation, and independently scrolled left pane; these are responsive comparisons, not a claim of pixel-identical dimensions. Source and implementation were opened together in the same comparison input.

## Findings and comparison history

- Initial P2: the sample Pareto preview clipped labels and the secondary axis. Corrected crop bounds and preserved the source aspect ratio. The subsequent full-view and readable card-region comparison in `problem-step2-v5-final.jpg` shows both axes and all labels inside the card. Resolved.
- The initial Time Series placeholder displayed the Pareto sample. Replaced it with an explicitly named graph placeholder. Graph functionality is excluded from this iteration by the user.
- The development browser's outbound Gemini request returned a preview-runtime connection error. Both compiled server endpoints were separately exercised with the real Gemini service: the board summary correctly described supplied event content; the document summary correctly recovered a synthetic 20-minute delay. Connection errors now use a readable recoverable message. End-to-end cloud-preview Gemini networking is a residual environment limitation, not treated as a successful browser chat test.

## Fidelity surfaces

- Typography: Arial/Helvetica fallback, dark teal headings, 15–16px form text, restrained muted secondary labels. Exact source font metadata was unavailable. No unintended text truncation in form fields; long card titles intentionally ellipsize and remain available on opening.
- Spacing/layout: white bordered step panel, five Step 1 fields, single large Step 2 field, pale attachment section, independently scrollable left side, persistent right chat. Added navigation and Save & close controls serve the requested flow. No horizontal document overflow at the tested desktop viewport. Bottom cards are reached by left-pane scrolling, while chat stays fixed.
- Colors/tokens: white surfaces, soft gray page and attachment backgrounds, dark desaturated teal text, green Done state, teal primary editor action match the supplied visual hierarchy.
- Images: actual supplied screenshot regions used for sample chart previews; the corrected crops retain labels and aspect ratio. Dynamic whiteboard thumbnails derive from saved nodes and edges; document cards reflect saved text. User images are displayed with contain sizing. The screenshot's monitor attachment is not pre-seeded because its independent source file was not supplied; uploads create real attachment cards.
- Copy: user method names and Step 1/Step 2 assignments retained. Example graph status is explicit. No unsupported AI-autofilled badge, microphone or implied attachment-reading ability. Chat explains it can read method text; Gemini receives content only on send.

## Primary interactions tested

- Switch between Step 1 and Step 2; select from step-filtered method picker.
- Add Timeline; edit its title and first event; Save & close updates the saved card; reload and reopen preserve both values.
- Add Interviews; edit title and content; Save & close updates document preview; reload and reopen preserve content.
- Change a saved document then leave: discard confirmation appears; discarding preserves the last saved content.
- Excalidraw experiment button opens the earlier studio with Excalidraw selected and working drawing controls, then closes back to the case.
- Separate board/document method instances persist without replacing each other. Server tests also verify two independent instances of the same method type.
- Server tests exercise actual SQLite statements for saved work, stale-save conflict rejection, distinct owner isolation, upload bytes, retrieval, and attachment access rejection for another owner and anonymous requests.
- Production build passes. Ten focused persistence/board/render/auth tests pass. Existing starter CSS assertion for scrollbar-width:none remains outside the focused gate; it predates this change. TypeScript has pre-existing missing Cloudflare runtime declarations; Vite import metadata is declared for the new development-only helper.

Console errors checked: browser extension metadata errors and the preview Gemini connection failure described above. No React render or editor exceptions observed in the tested flow.

## Remaining test scope

Mobile-specific browser interaction, actual Office application editing, graph editing, and attachment file-picker automation were not part of this desktop verification. Upload and retrieval are covered at the route level. Saved work uses platform D1 and files use R2; preview test data is separate from production case data.

Final result: passed

## Follow-up: Step 2 only and actual saved previews

Removed Step 1 navigation and defaulted the workspace to Step 2. Existing stored records remain compatible. Replaced the modal method picker with an anchored Select dropdown. Whiteboard cards now use React Flow with the editor's actual node components, saved geometry, highlights, edge types and ports. Documents now render the saved Tiptap content with headings, tables, lists and formatting at a scaled page width. Previews are inert and cannot change the saved content.

Browser verification at 1363 × 936: no Step 1 navigation; dropdown lists the Step 2 methods; selected VoC Matrix from the dropdown, saved it, and inspected the actual formatted table in its card. Existing saved timeline renders chevrons, highlight color and connectors. Existing interview retains its saved heading formatting. Evidence: qa/problem-previews-v6.jpg. Production build passed.

Final result: passed


## Version 7 — all methods and document export
- Step 2 dropdown exposes all 23 catalog entries; original step metadata retained.
- Browser verified selection of Defense Analysis (original Step 4), document editor, Fishbone creation and Save & close.
- Docs offer Edit in app and Download from cards; editor Download uses the current draft, including unsaved edits.
- DOCX generation uses editor structure. Generated fixture rendered and inspected: table, checked/unchecked tasks, bold/italic text preserved. Browser export completed its generation callback without app error, but the cloud browser download event timed out; end-to-end file receipt remains unverified in this environment.
- Graphs and Prioritization Matrix retain explicit existing-UI placeholders.
- Eight board/storage tests passed.
