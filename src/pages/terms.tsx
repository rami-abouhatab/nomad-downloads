import { Layout } from '../ui/Layout';
import { CorpHeader, LegalBody } from '../ui/corp';

/* Legal text, unchanged from the 2026-10-08 draft. Bracketed placeholders are
   still to be filled by Rami (entity, governing law, contact). */
/* the contents down the left (Rami, 2026-10-18: the corporate layout) */
const TOC = [
  { id: 'account', label: 'Your account' },
  { id: 'files', label: 'Your files are yours' },
  { id: 'plans', label: 'Plans and payment' },
  { id: 'fair-use', label: 'Fair use' },
  { id: 'availability', label: 'Availability' },
  { id: 'ending', label: 'Ending' },
  { id: 'law', label: 'Changes and law' },
];

const Todo = ({ children }: { children: string }) => <span className="todo">{children}</span>;

export default function TermsPage() {
  return (
    <Layout page="terms">
      <div data-light="neutral" className="corp">
        <CorpHeader eyebrow="Legal" title="Terms" lede="Last updated 8 October 2026" />
        <LegalBody toc={TOC}>
          <p>
            These terms are the agreement between you and Origins ("we") for using Nomad's products: MeridianOS, Polaris
            Browser, Reach, Drift and Nomad Office. By creating a Nomad account you accept them.
          </p>

          <h2 id="account">Your account</h2>
          <p>
            One Nomad account signs you in to every Nomad product. You need one, free or paid, to use MeridianOS, Reach, Drift, Citadel and
            Nomad Office; Polaris Browser browses without one, and these terms apply to it whether or not you sign in. You sign in with your email and a passkey or a password. Keep your password and PIN to yourself; what happens in your
            account is your responsibility. You must be old enough to agree to these terms where you live.
          </p>

          <h2 id="files">Your files are yours</h2>
          <p>
            Everything you put in Nomad stays yours. You give us only the permission we need to store it, sync it, and show it to the people
            you choose to share it with (with Drift, guest links or Reach). You can take it all out at any time from Settings › Accounts ›
            Export my data.
          </p>

          <h2 id="plans">Plans and payment</h2>
          <p>
            We sell MeridianOS (Meridian Starter, Meridian Pro and Meridian Ultra), Reach Premium, Drift Premium and Nomad Office, each paid monthly or yearly, in
            advance, and renewing until you cancel. Polaris Browser, Reach and Drift on the web are free. Plans, payments, receipts and
            cancelling happen only at billing.nomad.ax; nothing is sold inside our apps.
          </p>
          <p>
            What you buy is recorded on your Nomad account as an entitlement: which product you have, and until when. Each app checks your
            entitlements to decide what it unlocks. Every MeridianOS plan includes Nomad Office; Meridian Pro and Meridian Ultra also include Reach Premium and
            Drift Premium. These are the apps inside MeridianOS. An app you buy on its own is a separate subscription, and unlocks that app wherever you
            use it, your MeridianOS desktop included: buying, changing or cancelling one never ends, refunds or credits the other.
          </p>
          <p>
            Meridian Starter can begin with a 14-day free trial. Cancelling stops the next renewal; your plan runs to the end of the period you paid
            for. Changing plan is priced on the spot, with credit for what is left of the current one. If a payment fails we will tell you and
            try again; a plan that stays unpaid falls back to its limits, and nothing is deleted without warning. When a subscription ends, what
            it held is kept for one year, downloadable from your account, and then deleted; the Privacy policy says what that covers.
          </p>

          <h2 id="fair-use">Fair use</h2>
          <p>
            Do not use Nomad to break the law, to harm others, to share what you have no right to share, to send spam or malware, or to attack
            or overload Nomad or anyone else. We may suspend an account that does, and will tell you why unless the law stops us.
          </p>

          <h2 id="availability">Availability</h2>
          <p>
            We work to keep Nomad up and your data safe, but no service is perfect. Keep copies of anything you cannot afford to lose. To the
            extent the law allows, we are not liable for indirect losses, and our total liability is limited to what you paid us in the twelve
            months before the claim.
          </p>

          <h2 id="ending">Ending</h2>
          <p>
            You can delete your Nomad account at any time in Settings › Accounts. We may end a product with reasonable notice, and if we do,
            you will have time to export your data.
          </p>

          <h2 id="law">Changes and law</h2>
          <p>
            If these terms change in a way that matters, we will tell you before it takes effect. These terms are governed by the law of{' '}
            <Todo>[GOVERNING LAW / JURISDICTION]</Todo>.
          </p>

          <p>
            Questions: <Todo>[CONTACT EMAIL]</Todo>.
          </p>
        </LegalBody>
      </div>
    </Layout>
  );
}
