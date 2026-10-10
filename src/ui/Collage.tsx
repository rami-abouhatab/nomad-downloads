/**
 * The collage (Rami, 2026-10-11: "this style of collage", after his own portfolio's project list:
 * two columns of big pictures, the right one set lower so they stagger, and under each picture a
 * small spaced label, a large title and one quiet line; "add more screenshots").
 *
 * Every picture is a real capture of the shell (design-assets/meridian-shots-2026-10-10/cards.py):
 * squares cut from the desk, and portrait close-ups of a window on the sunset. Words are never on
 * the pictures.
 *
 * The first law: static images; each item rises in on its own view timeline (opacity and transform,
 * no script); without view timelines or under reduced motion they are simply there.
 */
export type CollageItem = {
  /** `sq-…` squares or `row-…` portraits in /assets/shots/meridian */
  name: string;
  label: string;
  title: string;
  body: string;
  alt: string;
};

function Item({ item, n }: { item: CollageItem; n: number }) {
  const tall = item.name.startsWith('row-');
  return (
    <article className={tall ? 'cg-item tall' : 'cg-item'}>
      <div className="cg-pic">
        <img
          src={`/assets/shots/meridian/${item.name}-1200.webp`}
          srcSet={`/assets/shots/meridian/${item.name}-800.webp 800w, /assets/shots/meridian/${item.name}-1200.webp 1200w`}
          sizes="(min-width: 761px) 46vw, 100vw"
          alt={item.alt}
          loading="lazy"
          decoding="async"
        />
      </div>
      <p className="cg-label">
        {String(n).padStart(2, '0')} · {item.label}
      </p>
      <h3 className="cg-title">{item.title}</h3>
      <p className="cg-body">{item.body}</p>
    </article>
  );
}

export function Collage({ items, label }: { items: CollageItem[]; label: string }) {
  const left = items.filter((_, i) => i % 2 === 0);
  const right = items.filter((_, i) => i % 2 === 1);
  return (
    <section className="cg" aria-label={label}>
      <div className="cg-cols">
        <div className="cg-col">
          {left.map((it) => (
            <Item key={it.name} item={it} n={items.indexOf(it) + 1} />
          ))}
        </div>
        <div className="cg-col cg-col-low">
          {right.map((it) => (
            <Item key={it.name} item={it} n={items.indexOf(it) + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
