/**
 * nomad.ax/locked — Citadel's lock page (Rami, 2026-10-14: "anyone who sees it gets a Citadel lock
 * page, and he can ask the admin to unlock; we get told in Citadel and choose to unlock for this user
 * or not; he doesn't see us").
 *
 * A cloud-locked file (`<name>.locked.html`, citadel electron/cloudlock.cjs) frames this page with
 * `?embed=1` and hands it its records. Opened directly, the page asks for the file instead (a phone
 * whose file viewer runs no script). Whoever has the file sees only that it is locked: never who
 * locked it. The ways in, in the order a stranger needs them:
 *
 *   the PIN          the file's own, or its owner's Citadel PIN
 *   Ask to open it   an email and a note; the owner is told and decides
 *   I was let in     the email the owner let in, proved by a code sent to it
 *
 * and, while the owner has opened it to everyone, it simply opens. Nothing here is kept: the key and
 * the file live in this tab's memory only.
 */
import { useEffect, useRef, useState } from 'react';
import { Button, CodeField, Field } from 'nomad-design';
import { ask, decrypt, parse, type Header, type Locked } from '../locked/file';
import { Viewer } from '../locked/Viewer';
import '../locked/locked.css';

type Phase =
  | { at: 'wait' }
  | { at: 'choose'; problem?: string }
  | { at: 'gone' }
  | { at: 'locked' }
  | { at: 'opening'; part: number }
  | { at: 'open'; header: Header; blob: Blob; download: boolean };
type Way = 'menu' | 'pin' | 'ask' | 'asked' | 'in' | 'code';

export default function LockedPage() {
  const [phase, setPhase] = useState<Phase>({ at: 'wait' });
  const file = useRef<Locked | null>(null);

  /* Embedded: tell the file this page is ready, and take its records (only from the page holding it). */
  useEffect(() => {
    const embed = new URLSearchParams(location.search).has('embed') && window.parent !== window;
    if (!embed) {
      setPhase({ at: 'choose' });
      return;
    }
    const take = (e: MessageEvent) => {
      if (e.source !== window.parent || !e.data || e.data.type !== 'citadel:file') return;
      const meta = e.data.meta;
      const parts = e.data.parts;
      if (!meta || typeof meta.id !== 'string' || !Array.isArray(parts)) return;
      void start({ meta, parts });
    };
    window.addEventListener('message', take);
    window.parent.postMessage({ type: 'citadel:ready' }, '*');
    return () => window.removeEventListener('message', take);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function start(f: Locked) {
    file.current = f;
    const r = await ask<{ state?: string }>('peek', { id: f.meta.id });
    if (r.state === 'gone') return setPhase({ at: 'gone' });
    if (r.state === 'open') {
      const o = await ask<{ key?: string; download?: boolean }>('open', { id: f.meta.id });
      if (o.key) return void openWith(o.key, o.download !== false);
    }
    setPhase({ at: 'locked' });
  }

  async function openWith(key: string, download: boolean) {
    const f = file.current;
    if (!f) return;
    setPhase({ at: 'opening', part: 0 });
    try {
      const { header, blob } = await decrypt(f, key, (p) => setPhase({ at: 'opening', part: p }));
      setPhase({ at: 'open', header, blob, download });
    } catch {
      setPhase({ at: 'choose', problem: 'This file is damaged and cannot be opened.' });
    }
  }

  if (phase.at === 'open') return <Viewer file={{ name: phase.header.name, type: phase.header.type, blob: phase.blob, folder: phase.header.folder }} download={phase.download} />;

  return (
    <main className="lk">
      <section className="lk-card">
        <img className="lk-icon" src="/assets/icons/citadel-512.webp" width={64} height={64} alt="" />
        {phase.at === 'wait' ? (
          <>
            <h1>Opening…</h1>
            <p className="lk-sub">Checking this file with Citadel.</p>
          </>
        ) : phase.at === 'opening' ? (
          <>
            <h1>Opening…</h1>
            <span className="lk-bar">
              <span style={{ transform: `scaleX(${phase.part})` }} />
            </span>
          </>
        ) : phase.at === 'gone' ? (
          <>
            <h1>This file can't be opened</h1>
            <p className="lk-sub">It was locked with Citadel, and it can no longer be opened by anyone.</p>
          </>
        ) : phase.at === 'choose' ? (
          <Choose problem={phase.problem} onFile={(f) => void start(f)} />
        ) : (
          <Ways id={file.current!.meta.id} onKey={(k, d) => void openWith(k, d)} />
        )}
      </section>
      <footer className="lk-foot">
        Protected with <a href="https://nomad.ax/citadel">Citadel</a> by Nomad
      </footer>
    </main>
  );
}

/** Opened directly: choose the locked file (a phone that could not run the file itself). */
function Choose({ problem, onFile }: { problem?: string; onFile: (f: Locked) => void }) {
  const [error, setError] = useState(problem ?? '');
  const pick = useRef<HTMLInputElement>(null);
  const read = async (f: File | undefined) => {
    if (!f) return;
    const parsed = parse(await f.text());
    if (!parsed) setError('That is not a file locked with Citadel.');
    else onFile(parsed);
  };
  return (
    <>
      <h1>Open a locked file</h1>
      <p className="lk-sub">Choose a file that was locked with Citadel. It opens here, on this device; nothing is uploaded.</p>
      <div
        className="lk-drop"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          void read(e.dataTransfer.files[0]);
        }}
      >
        <Button variant="primary" size="lg" className="lk-bronze" onClick={() => pick.current?.click()}>
          Choose the file
        </Button>
        <small>or drop it here</small>
      </div>
      <input ref={pick} type="file" accept=".html,text/html" hidden onChange={(e) => void read(e.target.files?.[0])} />
      {error ? (
        <p className="lk-error" role="alert">
          {error}
        </p>
      ) : null}
    </>
  );
}

/** The lock itself: nothing about the owner, and the ways in. */
function Ways({ id, onKey }: { id: string; onKey: (key: string, download: boolean) => void }) {
  const [way, setWay] = useState<Way>('menu');
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [said, setSaid] = useState('');
  const go = (w: Way) => (setWay(w), setError(''), setSaid(''));
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  async function tryPin(v: string) {
    setBusy(true);
    const r = await ask<{ key?: string; download?: boolean }>('pin', { id, pin: v });
    setBusy(false);
    if (r.key) return onKey(r.key, r.download !== false);
    setPin('');
    setError(r.error ?? 'That did not work. Try again.');
  }
  async function sendAsk() {
    setBusy(true);
    const r = await ask<{ ok?: boolean; allowed?: boolean }>('ask', { id, email: email.trim(), note: note.trim() });
    setBusy(false);
    if (r.allowed) return void sendCode();
    if (r.error) return setError(r.error);
    go('asked');
  }
  async function sendCode() {
    setBusy(true);
    setError('');
    const r = await ask<{ sent?: boolean; waiting?: boolean; refused?: boolean }>('code', { id, email: email.trim() });
    setBusy(false);
    if (r.sent) return (setWay('code'), setSaid(`A code was sent to ${email.trim()}.`));
    if (r.waiting) return setError('You have not been let in yet. Ask to open it, and you will get an email when you are.');
    if (r.refused) return setError('You cannot open this file.');
    setError(r.error ?? 'The code could not be sent. Try again.');
  }
  async function enter(v: string) {
    setBusy(true);
    const r = await ask<{ key?: string; download?: boolean }>('enter', { id, email: email.trim(), code: v });
    setBusy(false);
    if (r.key) return onKey(r.key, !!r.download);
    setCode('');
    setError(r.error ?? 'That did not work. Try again.');
  }

  return (
    <>
      <h1>This file is locked</h1>
      <p className="lk-sub">
        {way === 'menu'
          ? 'It is protected with Citadel. Only the people its owner lets in can open it.'
          : way === 'pin'
            ? 'Enter the PIN for this file.'
            : way === 'ask'
              ? 'Your email goes to the person who locked it, and they decide. You will get an email if they let you in.'
              : way === 'asked'
                ? 'Asked. If you are let in, an email tells you, and you can open it with “I was let in”.'
                : way === 'in'
                  ? 'Enter the email you were let in with. A code comes to it to confirm it is you.'
                  : said}
      </p>
      <div className="lk-ways">
        {way === 'menu' ? (
          <>
            <Button variant="primary" size="lg" className="lk-bronze" onClick={() => go('pin')}>
              Enter the PIN
            </Button>
            <Button variant="secondary" size="lg" onClick={() => go('ask')}>
              Ask to open it
            </Button>
            <Button variant="ghost" size="lg" onClick={() => go('in')}>
              I was let in
            </Button>
          </>
        ) : way === 'pin' ? (
          <CodeField length={6} mask kind="numeric" value={pin} onChange={(v) => (setPin(v), setError(''))} onComplete={(v) => void tryPin(v)} busy={busy} error={error || null} autoFocus aria-label="PIN" />
        ) : way === 'ask' ? (
          <>
            <Field size="lg" type="email" label="Your email" value={email} onChange={setEmail} autoComplete="email" autoFocus />
            <Field size="lg" label="A note (optional)" value={note} onChange={setNote} onSubmit={() => ok && void sendAsk()} />
            <Button variant="primary" size="lg" className="lk-bronze" loading={busy} disabled={!ok} onClick={() => void sendAsk()}>
              Ask to open it
            </Button>
          </>
        ) : way === 'in' ? (
          <>
            <Field size="lg" type="email" label="Your email" value={email} onChange={setEmail} autoComplete="email" autoFocus onSubmit={() => ok && void sendCode()} />
            <Button variant="primary" size="lg" className="lk-bronze" loading={busy} disabled={!ok} onClick={() => void sendCode()}>
              Send me a code
            </Button>
          </>
        ) : way === 'code' ? (
          <>
            <CodeField length={6} kind="numeric" value={code} onChange={(v) => (setCode(v), setError(''))} onComplete={(v) => void enter(v)} busy={busy} error={error || null} autoFocus aria-label="Code" />
            <Button variant="ghost" size="lg" disabled={busy} onClick={() => void sendCode()}>
              Send a new code
            </Button>
          </>
        ) : null}
        {error && way !== 'pin' && way !== 'code' ? (
          <p className="lk-error" role="alert">
            {error}
          </p>
        ) : null}
        {way !== 'menu' ? (
          <Button variant="ghost" size="lg" onClick={() => go('menu')}>
            Back
          </Button>
        ) : null}
      </div>
    </>
  );
}
