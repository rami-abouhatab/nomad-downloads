import { Layout } from '../ui/Layout';

/* Legal text, unchanged from the 2026-10-08 draft. Bracketed placeholders are
   still to be filled by Rami (entity, contact). */
const Todo = ({ children }: { children: string }) => <span className="todo">{children}</span>;

export default function PrivacyPage() {
  return (
    <Layout page="privacy">
      <article className="legal wrap">
        <h1>Privacy</h1>
        <p className="when">Last updated 8 October 2026</p>

        <p>
          Nomad makes AX, a desktop that lives in your account, and the apps Polaris Browser, Reach, Drift and Nomad Office. One Nomad
          account signs you in to all of them. To bring your desk back on another machine, AX keeps your files, your desks and your settings
          on our servers. This page says what we keep, why, who helps us keep it, and what you can do about it.
        </p>

        <h2 id="who">Who we are</h2>
        <p>
          Nomad is run by <Todo>[LEGAL ENTITY NAME, REGISTERED ADDRESS]</Todo>. For anything on this page, write to{' '}
          <Todo>[PRIVACY CONTACT EMAIL]</Todo>.
        </p>

        <h2 id="what-we-keep">What we keep</h2>
        <ul>
          <li>
            <strong>Your Nomad account:</strong> your name, email address, and how you sign in: a passkey, or a password we never see in
            plain text. We do not offer sign-in with Google, Apple or Microsoft.
          </li>
          <li>
            <strong>What you put in AX:</strong> your files, their earlier versions, your desks, their layouts, snapshots, wallpapers,
            installed apps and settings.
          </li>
          <li>
            <strong>Reach:</strong> your messages, contacts and meetings, and recordings if you make them. If you connect Gmail or Outlook,
            we keep the access Google or Microsoft gives us so Reach can read and send mail for you. If you set up mail at your own domain,
            that mailbox is hosted for you by Zoho.
          </li>
          <li>
            <strong>Drift:</strong> the files you send, until shortly after their link expires.
          </li>
          <li>
            <strong>Connected services:</strong> if you connect Google Drive, OneDrive or Dropbox, we keep the access that service gives us
            and a copy of your files from it, so they appear in Nomad as a folder you can edit and stay in sync both ways. If you connect
            GitHub, we keep the access GitHub gives us and copy the folders you choose into private repositories in your own GitHub account.
          </li>
          <li>
            <strong>Plans and payments:</strong> what your account includes and until when (your entitlements), your payments and your
            receipts. Payments are taken only at billing.nomad.ax. Card numbers go to our payment provider; we keep only the brand, the last
            four digits and the expiry.
          </li>
          <li>
            <strong>This machine:</strong> some things stay on the computer and never reach us: clipboard history, the window positions on
            that screen, and the PIN you type (we keep only a protected form of it).
          </li>
        </ul>

        <h2 id="why">Why we keep it</h2>
        <p>
          To run Nomad's products for you: to bring your desk back on any machine, to sync it, to deliver your mail, messages and calls, to
          send what you ask Drift to send, to know which products your account includes and bill for them, and to email you about your
          account (sign-in codes, receipts, PIN resets). We do not sell your data, we do not show you ads, and we do not use your files to
          train anything.
        </p>

        <h2 id="connected">Google, Microsoft, Dropbox and GitHub data</h2>
        <p>
          When you connect Google Drive, Nomad reads, creates, changes and removes files in your Google Drive only to keep the Cloud › Google
          Drive folder in Nomad and your Google Drive the same. The same holds for OneDrive and Dropbox. Nomad never uses this data for
          advertising, never sells it, never lets people read it except when you ask us to help with your account or the law requires it,
          and never uses it to train any model. You can disconnect any of them at any time in Settings › Connections; disconnecting stops
          the sync and removes our access.
        </p>
        <p>
          Nomad's use and transfer to any other app of information received from Google APIs will adhere to the{' '}
          <a href="https://developers.google.com/terms/api-services-user-data-policy">Google API Services User Data Policy</a>, including the
          Limited Use requirements.
        </p>

        <h2 id="who-helps">Who helps us</h2>
        <ul>
          <li>
            <strong>Supabase</strong> stores your account and your files, in Frankfurt, Germany.
          </li>
          <li>
            <strong>Cloudflare</strong> serves our websites and carries Drift's download links.
          </li>
          <li>
            <strong>MontyPay</strong> takes card payments at billing.nomad.ax.
          </li>
          <li>
            <strong>Resend</strong> sends our emails.
          </li>
          <li>
            <strong>Zoho</strong>, only if you set up mail at your own domain with Reach Premium.
          </li>
          <li>
            <strong>Google and Microsoft</strong>, only if you connect their mail, Google Drive or OneDrive.
          </li>
          <li>
            <strong>Dropbox</strong>, only if you connect it.
          </li>
          <li>
            <strong>GitHub</strong>, only if you connect it, to keep the folders you choose in private repositories in your own account.
          </li>
        </ul>

        <h2 id="how-long">How long</h2>
        <p>
          As long as you have a Nomad account. Earlier versions of files are kept for as long as your AX plan's history allows: 30 days, a
          year, or for as long as you keep the plan. Drift files are deleted soon after their link expires. When you delete your account,
          everything above is erased from our servers, except payments, receipts and the record of what you bought, which tax law requires us
          to keep.
        </p>

        <h2 id="what-you-can-do">What you can do</h2>
        <ul>
          <li>
            <strong>See and take your data:</strong> Settings › Accounts › Export my data copies every file, and your account data as a file,
            to your computer.
          </li>
          <li>
            <strong>Correct it:</strong> change your name in Settings › Accounts, and anything else you made, in Nomad itself.
          </li>
          <li>
            <strong>Delete it:</strong> Settings › Accounts › Delete your Nomad account.
          </li>
          <li>
            <strong>Ask us:</strong> write to the address above. If you are in the EU or UK you may also complain to your data protection
            authority.
          </li>
        </ul>

        <h2 id="changes">Changes</h2>
        <p>If this page changes in a way that matters, we will tell you before it takes effect.</p>
      </article>
    </Layout>
  );
}
