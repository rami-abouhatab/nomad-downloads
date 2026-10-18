/* The home hero (Rami, 2026-10-18): a contained block, as microsoft.com's, in the old hero's
   sky-to-sand gradient, with the words on the left and a laptop seen straight on at the right (the
   Meridian section's own), cut out of its picture so it sits on the block's own gradient; its screen is the
   real Meridian desk (4K capture, corner-pinned). Its entrance is still to be designed. */

export function HeroFilm() {
  return (
    <section className="film" aria-labelledby="film-title">
      <div className="film-note">
        <div className="film-note-inner">
          <h1 id="film-title" className="film-note-title">
            Made to go where you go.
          </h1>
          <p className="film-note-body">
            Nomad makes the apps you work in every day, and keeps everything you make with you, on whichever computer you sit down at.
          </p>
          <a className="film-note-link" href="#tiles-title">
            See what we make
          </a>
        </div>
      </div>

      {/* The laptop, cut out of its picture, floating over a soft shadow the page draws. */}
      <div className="film-device" aria-hidden="true">
        <span className="film-device-shadow" />
        <img
          className="film-device-img"
          src="/assets/hero/laptop-front-1x.webp"
          srcSet="/assets/hero/laptop-front-1x.webp 1006w, /assets/hero/laptop-front.webp 2013w"
          sizes="(max-width: 880px) 92vw, 46vw"
          alt=""
          decoding="async"
        />
      </div>
    </section>
  );
}
