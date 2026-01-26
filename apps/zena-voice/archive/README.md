Archive of unreferenced files

Summary
- Total files archived: 68
- Date: 2025-11-26

Grouped counts (top-level under `src/`):
- `src/components/ui/` : 34 files
- `src/components/` (non-ui, non-scroll-narrative): 16 files
- `src/components/scroll-narrative/` : 3 files
- `src/hooks/` : 4 files
- `src/pages/` (top-level pages): 6 files
- `src/pages/admin/` : 1 file
- `src/lib/` : 2 files
- `src/data/` : 1 file
- `src/vite-env.d.ts` : 1 file

What I copied (preserves original paths):

(See `.analysis/find_unused_result.json` for the exact list.)

Why this was done
- A static import/usage scan indicated these files had no static inbound references.
- To avoid accidental breakage I copied them to `archive/unreferenced/` rather than removing originals.

Next recommended steps (choose one):
- Keep archive (safe): do nothing. The repo remains unchanged, but you can inspect or restore files from `archive/unreferenced/src/...`.
- Remove originals (clean): I can remove the original files from `src/` in a single commit. I will only do this after your explicit confirmation.
- Fix lint issues: I can start fixing the top lint errors in active `src/` files to improve code health. (I can run a PR with fixes.)

How to restore a file
- Files are copied; to restore a file, copy it from `archive/unreferenced/src/...` back to `src/...` and commit.

Notes
- I ran `npm run build` (successful) and `npm run lint` (reported 107 issues; many in archived copies). Build succeeded, so the app still compiles.
- If you'd like me to proceed with removals, say: `delete originals now`.
- If you'd like me to start fixing lint, say: `fix lint`.

Contact me with your choice and I will proceed.
