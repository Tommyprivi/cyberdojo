import type { Metadata } from "next";
import { Suspense } from "react";
import { SocialApp, type SocialData } from "@/components/social/social-app";
import { requireMember } from "@/lib/session";
import * as social from "@/lib/social/service";
import { resetLabel, weekBounds } from "@/lib/social/week";

export const metadata: Metadata = { title: "Social", robots: { index: false } };

export default function SocialPage() {
  return (
    <Suspense fallback={<div className="h-96 rounded-lg bg-surface-muted" aria-busy="true" aria-label="Carico il social" />}>
      <SocialContent />
    </Suspense>
  );
}

async function SocialContent() {
  const { user } = await requireMember("/social");
  const now = new Date();
  const settings = await social.getSettings(user.id);

  // Chi non ha ancora un soprannome non ha nulla da mostrare (e nulla da leggere): niente altre query.
  let data: SocialData = {
    settings,
    resetIn: resetLabel(now, weekBounds(now).end),
    leaderboard: [],
    friends: [],
    groups: [],
    challenges: [],
    wins: 0,
  };
  if (settings.hasProfile) {
    const [board, friends, groups, challenges] = await Promise.all([
      social.getLeaderboard(user.id, now),
      social.getFriends(user.id, now),
      social.getGroups(user.id, now),
      social.getChallenges(user.id, now),
    ]);
    data = { ...data, leaderboard: board.rows, friends, groups, challenges: challenges.list, wins: challenges.wins };
  }
  return <SocialApp data={data} />;
}
