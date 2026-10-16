// src/app/heroes/page.tsx
import { redirect } from 'next/navigation';

export default function HeroesRedirect() {
  redirect('/mlbb/heroes');
}
