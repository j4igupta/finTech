# Financial MMO Platform – TODO List

## Pending Tasks

- [ ] Add redirect logic to sign-in/sign-up pages
- [ ] Write tests for core components
- [ ] Add OAuth login support
- [ ] Add AI coach integration
- [ ] Configure Supabase env vars (`.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) — `src/lib/supabaseClient.ts` currently falls back to placeholder credentials so the dev server boots, but all Supabase queries fail silently. `NetWorth` and `PortfolioSummary` will keep showing empty/mocked values until real credentials are wired up.

## Completed Tasks

- [x] Finish Flash-Battle edge function handlers (handleJoinBattle, handlePlayerAction, handleEndBattle)
- [x] Wire up BattleArena UI with real-time updates and countdown timer
- [x] Complete quest system (API routes, XP rewards, streak integration)
- [x] Implement streak increment logic
- [x] Enhance profile page (recent activity, achievements)
- [x] Implement portfolio chart with real data

---
*Last updated: 2026-05-12*
