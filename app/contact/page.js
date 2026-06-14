import { redirect } from 'next/navigation';

/* /contact merged into the About chapter — keep the old URL alive. */
export default function ContactPage() {
  redirect('/about#contact');
}
