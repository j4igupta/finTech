import { redirect } from 'next/navigation';

// Redirect the root URL to the main dashboard page
export default function Home() {
  redirect('/dashboard');
  // The component never renders because of the redirect, but we return null for type safety
  return null;
}
