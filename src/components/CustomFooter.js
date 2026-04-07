import React, { useState } from 'react';

/* ── tiny helper: link with inline hover ───────────────────────────── */
function HoverLink({ href, children, external = false, style = {} }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      style={{
        color: hovered ? '#f39132' : 'rgba(255, 255, 255, 0.78)',
        textDecoration: 'none',
        transition: 'color 0.25s ease',
        fontSize: '0.95rem',
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  );
}

/* ── social badge ──────────────────────────────────────────────────── */
function SocialBadge({ href, imgSrc, imgAlt, label, emoji }) {
  const [hovered, setHovered] = useState(false);
  return (
    <li style={{ listStyle: 'none' }}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.7rem',
          textDecoration: 'none',
          color: hovered ? '#f39132' : '#fff',
          backgroundColor: hovered
            ? 'rgba(255, 255, 255, 0.12)'
            : 'rgba(255, 255, 255, 0.06)',
          padding: '0.55rem 0.85rem',
          borderRadius: '10px',
          transition: 'all 0.25s ease',
          fontWeight: 500,
          fontSize: '0.95rem',
          width: '100%',
          boxSizing: 'border-box',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span
          style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            flexShrink: 0,
            fontSize: '1.1rem',
          }}
        >
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={imgAlt}
              style={{ width: '20px', height: '20px', display: 'block' }}
            />
          ) : (
            emoji
          )}
        </span>
        <span>{label}</span>
      </a>
    </li>
  );
}

/* ── heading style (reused across columns) ─────────────────────────── */
const sectionHeading = {
  fontWeight: 700,
  fontSize: '0.8rem',
  color: '#bc2e7d',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  marginTop: 0,
  marginBottom: '1.25rem',
};

/* ── main component ────────────────────────────────────────────────── */
export default function CustomFooter() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ width: '100%' }}>
      {/* ─ gradient top border ─ */}
      <div
        aria-hidden="true"
        style={{
          height: '3px',
          background: 'linear-gradient(90deg, #1c2385 0%, #bc2e7d 50%, #f39132 100%)',
        }}
      />

      {/* ─ main footer area ─ */}
      <div
        style={{
          backgroundColor: '#1c2385',
          padding: '3.5rem 2rem 2.5rem',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
          color: '#fff',
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '3rem',
          }}
        >
          {/* ── Coluna 1 · Redes Sociais ── */}
          <div>
            <img
              src="/img/devops-logo.png"
              alt="DevOps Automation"
              style={{
                maxWidth: '140px',
                marginBottom: '1.5rem',
                display: 'block',
              }}
            />
            <p style={sectionHeading}>Siga nas redes</p>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.55rem',
              }}
            >
              <SocialBadge
                href="https://www.youtube.com/channel/UCxRNzCKgqQ0FW0GKuRSjlEQ"
                imgSrc="/img/logos_youtube-icon.avif"
                imgAlt="YouTube"
                label="YouTube"
              />
              <SocialBadge
                href="https://linkedin.com/in/iesodias"
                imgSrc="/img/devicon_linkedin.avif"
                imgAlt="LinkedIn"
                label="LinkedIn"
              />
              <SocialBadge
                href="https://instagram.com/iesofdias"
                imgSrc="/img/skill-icons_instagram.avif"
                imgAlt="Instagram"
                label="Instagram"
              />
            </ul>
          </div>

          {/* ── Coluna 2 · Contato ── */}
          <div>
            <p style={sectionHeading}>Contato</p>
            <p
              style={{
                fontSize: '1.05rem',
                color: 'rgba(255, 255, 255, 0.85)',
                lineHeight: '1.7',
                margin: '0 0 1rem',
              }}
            >
              Dúvidas? Fale comigo
            </p>
            <HoverLink
              href="mailto:iesodias@gmail.com"
              style={{ fontWeight: 600, fontSize: '1rem' }}
            >
              ✉ iesodias@gmail.com
            </HoverLink>
          </div>

          {/* ── Coluna 3 · Links Úteis ── */}
          <div>
            <p style={sectionHeading}>Links Úteis</p>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
              }}
            >
              <li>
                <HoverLink href="https://github.com/iesodias" external>
                  ⌘ Github
                </HoverLink>
              </li>
              <li>
                <HoverLink href="https://youtube.com/@iesodias" external>
                  ▶ Youtube
                </HoverLink>
              </li>
              <li>
                <HoverLink href="/blog">✎ Blog</HoverLink>
              </li>
            </ul>
          </div>

          {/* ── Coluna 4 · Legal ── */}
          <div>
            <p style={sectionHeading}>Legal</p>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
              }}
            >
              <li>
                <HoverLink href="/termos">Termos de Uso</HoverLink>
              </li>
              <li>
                <HoverLink href="/privacidade">Privacidade</HoverLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ─ bottom bar ─ */}
      <div
        style={{
          backgroundColor: '#151b6e',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '1.2rem 2rem',
          textAlign: 'center',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
          fontSize: '0.82rem',
          color: 'rgba(255, 255, 255, 0.45)',
          letterSpacing: '0.02em',
        }}
      >
        © {year} DevOps Automation · Todos os direitos reservados.
      </div>
    </footer>
  );
}
