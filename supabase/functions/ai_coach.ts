/**
 * Placeholder for AI Coach edge function.
 * This will eventually call the AI service layer to generate coaching insights.
 */
export const handler = async (req: Request) => {
  return new Response(JSON.stringify({ message: 'AI coach not implemented yet.' }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
