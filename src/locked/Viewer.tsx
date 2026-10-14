/**
 * What an opened file shows. With download allowed, the browser's own viewers and a Download button;
 * view only (the owner's default for a person they let in), the page draws it itself and offers no
 * way to save it: pictures, PDFs page by page (pdf.js, as Markup draws them), text, sound and video,
 * and a folder's contents one by one. Anything else cannot be shown without being downloaded.
 *
 * View only stops saving through the page; it cannot stop a screenshot, and says nothing it can't do.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from 'nomad-design';
import { kindOf, type Kind } from './file';

type Shown = { name: string; type: string; blob: Blob; folder?: boolean };

export function Viewer({ file, download }: { file: Shown; download: boolean }) {
  const [inner, setInner] = useState<Shown | null>(null);
  const shown = inner ?? file;
  const kind = kindOf({ name: shown.name, folder: shown.folder, type: shown.type });
  return (
    <div className="lk-view" onContextMenu={download ? undefined : (e) => e.preventDefault()}>
      <header className="lk-view-bar">
        {inner ? (
          <button type="button" className="lk-back" onClick={() => setInner(null)}>
            ← {file.name}
          </button>
        ) : null}
        <b title={shown.name}>{shown.name}</b>
        {download ? <Save blob={shown.blob} name={shown.folder ? `${shown.name}.zip` : shown.name} /> : <span className="lk-only">View only</span>}
      </header>
      <div className="lk-stage" data-kind={kind}>
        {kind === 'folder' ? <Folder blob={shown.blob} download={download} onOpen={setInner} /> : <One kind={kind} blob={shown.blob} download={download} />}
      </div>
    </div>
  );
}

function Save({ blob, name }: { blob: Blob; name: string }) {
  return (
    <Button
      variant="primary"
      className="lk-bronze"
      onClick={() => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.append(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 30_000);
      }}
    >
      Download
    </Button>
  );
}

function useUrl(blob: Blob) {
  const url = useMemo(() => URL.createObjectURL(blob), [blob]);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);
  return url;
}

function One({ kind, blob, download }: { kind: Kind; blob: Blob; download: boolean }) {
  const url = useUrl(blob);
  if (kind === 'image') return <img className="lk-img" src={url} alt="" draggable={false} />;
  if (kind === 'video') return <video className="lk-media" src={url} controls controlsList={download ? undefined : 'nodownload noplaybackrate'} disablePictureInPicture={!download} />;
  if (kind === 'audio') return <audio src={url} controls controlsList={download ? undefined : 'nodownload'} />;
  if (kind === 'text') return <Text blob={blob} />;
  if (kind === 'pdf') return download ? <iframe className="lk-frame" src={url} title="The file" /> : <Pdf blob={blob} />;
  return (
    <p className="lk-none">
      {download ? 'This kind of file opens on your device. Download it to open it.' : 'This kind of file cannot be shown here, and the owner has not let you download it.'}
    </p>
  );
}

function Text({ blob }: { blob: Blob }) {
  const [t, setT] = useState('');
  useEffect(() => void blob.text().then((s) => setT(s.slice(0, 2_000_000))), [blob]);
  return <pre className="lk-text">{t}</pre>;
}

/** A PDF drawn page by page on canvases: no file to save, no print button. */
function Pdf({ blob }: { blob: Blob }) {
  const box = useRef<HTMLDivElement>(null);
  const [problem, setProblem] = useState(false);
  useEffect(() => {
    let live = true;
    void (async () => {
      try {
        const [pdfjs, worker] = await Promise.all([import('pdfjs-dist'), import('pdfjs-dist/build/pdf.worker.min.mjs?url')]);
        pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
        const doc = await pdfjs.getDocument({ data: new Uint8Array(await blob.arrayBuffer()), isEvalSupported: false }).promise;
        const width = Math.min(900, (box.current?.clientWidth ?? 800) - 2);
        for (let p = 1; p <= doc.numPages && live; p++) {
          const page = await doc.getPage(p);
          const base = page.getViewport({ scale: 1 });
          const scale = width / base.width;
          const vp = page.getViewport({ scale: scale * Math.min(2, window.devicePixelRatio || 1) });
          const c = document.createElement('canvas');
          c.width = vp.width;
          c.height = vp.height;
          c.style.width = `${base.width * scale}px`;
          c.className = 'lk-page';
          box.current?.append(c);
          await page.render({ canvasContext: c.getContext('2d')!, viewport: vp }).promise;
        }
      } catch {
        if (live) setProblem(true);
      }
    })();
    return () => void (live = false);
  }, [blob]);
  return problem ? <p className="lk-none">This PDF could not be shown.</p> : <div className="lk-pages" ref={box} />;
}

/** A folder's contents (its zip, unpacked here), each one opened in turn. */
function Folder({ blob, download, onOpen }: { blob: Blob; download: boolean; onOpen: (f: Shown) => void }) {
  const [files, setFiles] = useState<{ name: string; data: Uint8Array }[] | null>(null);
  useEffect(() => {
    void (async () => {
      const { unzipSync } = await import('fflate');
      const all = unzipSync(new Uint8Array(await blob.arrayBuffer()));
      setFiles(
        Object.entries(all)
          .filter(([n]) => !n.endsWith('/'))
          .map(([name, data]) => ({ name, data }))
          .sort((a, b) => a.name.localeCompare(b.name)),
      );
    })().catch(() => setFiles([]));
  }, [blob]);
  if (!files) return <p className="lk-none">Opening the folder…</p>;
  if (!files.length) return <p className="lk-none">This folder is empty.</p>;
  return (
    <ul className="lk-files">
      {files.map((f) => {
        const k = kindOf({ name: f.name });
        const can = download || k !== 'other';
        return (
          <li key={f.name}>
            <button type="button" disabled={!can} onClick={() => onOpen({ name: f.name.split('/').pop()!, type: '', blob: new Blob([f.data as BlobPart]) })}>
              <span>{f.name}</span>
              <small>{f.data.length < 1024 ? `${f.data.length} bytes` : f.data.length < 1048576 ? `${(f.data.length / 1024).toFixed(0)} KB` : `${(f.data.length / 1048576).toFixed(1)} MB`}</small>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
