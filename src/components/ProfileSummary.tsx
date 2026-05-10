export function ProfileSummary() {
  // TODO: fetch profile data from Supabase
  const placeholder = {
    username: 'player1',
    rank: 'Bronze',
    xp: 250,
    netWorth: 12345,
    avatarUrl: null,
  };

  return (
    <section className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-white mb-4">{placeholder.username}</h2>
      <p className="text-gray-300 mb-2">Rank: {placeholder.rank}</p>
      <p className="text-gray-300 mb-2">XP: {placeholder.xp}</p>
      <p className="text-gray-300 mb-2">Net Worth: ${placeholder.netWorth.toLocaleString()}</p>
      {/* Avatar placeholder */}
      <div className="w-24 h-24 rounded-full bg-gray-600 mt-4" />
    </section>
  );
}
