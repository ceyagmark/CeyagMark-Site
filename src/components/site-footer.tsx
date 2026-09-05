import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Link className="brand" href="/">
              <img className="brand-mark mark-light" src="/img/logo-mark-light.svg" alt="" width={34} height={34} />
              <img className="brand-mark mark-dark" src="/img/logo-mark.svg" alt="" width={34} height={34} />{" "}
              <span>
                Ceyag<b>mark</b>
              </span>
            </Link>
            <p className="tagline">
              A web development and performance marketing agency in Sri Lanka. We build the site and run the
              marketing on it, so the conversions are ours to prove.
            </p>
          </div>
          <div>
            <h4>Agency</h4>
            <ul>
              <li>
                <Link href="/services">Services</Link>
              </li>
              <li>
                <Link href="/consulting">Consulting</Link>
              </li>
              <li>
                <Link href="/approach">Approach</Link>
              </li>
              <li>
                <Link href="/portfolio">Portfolio</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Start</h4>
            <ul>
              <li>
                <Link href="/growth-audit">Free Growth Audit</Link>
              </li>
              <li>
                <Link href="/consulting">Book a consulting session</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Reach us</h4>
            <ul>
              <li>
                <a href="mailto:growth@ceyagmark.com">growth@ceyagmark.com</a>
              </li>
              <li>
                <a href="https://wa.me/94703727895" target="_blank" rel="noopener">
                  WhatsApp +94 70 372 7895
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/ceyagmark/" target="_blank" rel="noopener">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} CeyagMark. All rights reserved.</span>
          <span>Performance marketing, measured in money.</span>
        </div>
        <div className="footer-bottom" style={{ marginTop: -32, borderTop: "none", paddingTop: 0 }}>
          <span>
            <Link href="/privacy">Privacy Policy</Link> &middot; <Link href="/terms">Terms of Service</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
