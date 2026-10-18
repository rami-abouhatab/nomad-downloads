/**
 * The fine print at the top of the footer, apple.com's way (Rami, 2026-10-11: "info as texts in the
 * footer on top of what's already there, like Apple does, on all pages"; then "real texts, long and
 * detailed"; "only general Nomad info"): full paragraphs that hold on every page.
 *
 * General Nomad information only, the same on every page, and only what the site already says
 * elsewhere (its plans, questions and policies).
 */
import type { PageId } from './pages';


const EVERYWHERE = [
  'All prices are in US dollars. One Nomad account signs you in to every Nomad product, and the account itself is free. MeridianOS, Reach, Drift, Citadel and Nomad Office need one, free or paid. Polaris Browser browses without one; signing in with your Nomad account is how it joins the rest of Nomad.',
  'Each subscription is its own. A Meridian plan covers the Nomad apps on your Meridian desktop; an app’s own subscription, such as Reach Premium, Drift Premium, Citadel Premium or Nomad Office, covers that app when you use it on its own, outside Meridian. One does not cancel, replace or credit the other, and what you make in an app is the same in both places.',
  'Plans, payments, receipts, changes and cancelling all happen in your Nomad account on the web, at account.nomad.ax. Nothing is ever bought or paid for inside an app. Card numbers go to our payment provider; Nomad keeps only the card’s brand, its last four digits and its expiry date.',
  'Nomad does not show ads, does not sell, rent or share your data with advertisers, and does not use your files, mail or chats to train any AI model. How your data is kept, and what you can do with it, is set out in the Privacy policy; the terms of every plan are in the Terms.',
];

/** The same general notes on every page (Rami, 2026-10-11: "I only want general Nomad info"). */
export function footnotesFor(_page: PageId): string[] {
  return EVERYWHERE;
}
