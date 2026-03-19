import { MDXRemote } from 'next-mdx-remote/rsc'
import styles from './ArticleProse.module.css'

// ─── Custom components injected into every MDX article ───────────────────────
// These replace raw HTML elements and add the scoped CSS module styles.
// Your MDX just uses plain markdown — no JSX imports needed in the editor.

const components = {
  // Headings
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h1 {...props} />,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h2 {...props} />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 {...props} />,

  // Paragraphs — first one gets the drop cap
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p {...props} />,

  // Blockquote → pull quote styling
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote {...props} />
  ),

  // ── Layout blocks usable as JSX in MDX ───────────────────────────────────

  /** <Kicker>Culture & Heritage · Eastern Region</Kicker> */
  Kicker: ({ children }: { children: React.ReactNode }) => (
    <div className={styles.kicker}>{children}</div>
  ),

  /** <Subtitle>Among the Krobo of Eastern Ghana...</Subtitle> */
  Subtitle: ({ children }: { children: React.ReactNode }) => (
    <p className={styles.subtitle}>{children}</p>
  ),

  /** <Meta>By our Ghana correspondent · 12 min read</Meta> */
  Meta: ({ children }: { children: React.ReactNode }) => (
    <div className={styles.meta}>{children}</div>
  ),

  /** <AccentBand /> — the gradient colour stripe */
  AccentBand: () => <div className={styles.accentBand} />,

  /** <Dropcap>First paragraph text...</Dropcap> */
  Dropcap: ({ children }: { children: React.ReactNode }) => (
    <p className={styles.dropcap}>{children}</p>
  ),

  /** <SectionLabel>The craft</SectionLabel> */
  SectionLabel: ({ children }: { children: React.ReactNode }) => (
    <div className={styles.sectionLabel}>{children}</div>
  ),

  /** <BeadStrip caption="A palette drawn from trade-era pigments..." /> */
  BeadStrip: ({ caption }: { caption?: string }) => (
    <div className={styles.beadStrip}>
      {[
        '#C0501A', '#E8833A', '#F5C04A', '#3B6D11',
        '#1D9E75', '#185FA5', '#D4537E', '#4A1B0C', '#2C2C2A',
      ].map((color) => (
        <div key={color} className={styles.bead} style={{ background: color }} />
      ))}
      <div className={styles.bead} style={{ background: '#F1EFE8', border: '0.5px solid #aaa' }} />
      {caption && <span className={styles.beadCaption}>{caption}</span>}
    </div>
  ),

  /**
   * <InfoGrid>
   *   <InfoCard label="Where to visit" value="Odumase-Krobo & Somanya" />
   *   <InfoCard label="Distance from Accra" value="~95 km · 2 hrs" />
   * </InfoGrid>
   */
  InfoGrid: ({ children }: { children: React.ReactNode }) => (
    <div className={styles.infoGrid}>{children}</div>
  ),
  InfoCard: ({ label, value }: { label: string; value: string }) => (
    <div className={styles.infoCard}>
      <div className={styles.infoCardLabel}>{label}</div>
      <div className={styles.infoCardValue}>{value}</div>
    </div>
  ),

  /** <Divider /> — the centred rule between body and closing */
  Divider: () => <div className={styles.divider} />,

  /** <Closer>The Krobo do not keep their stories...</Closer> */
  Closer: ({ children }: { children: React.ReactNode }) => (
    <p className={styles.closer}>{children}</p>
  ),

  /**
   * <TagRow>
   *   <Tag>Culture</Tag>
   *   <Tag>Eastern Region</Tag>
   * </TagRow>
   */
  TagRow: ({ children }: { children: React.ReactNode }) => (
    <div className={styles.tagRow}>{children}</div>
  ),
  Tag: ({ children }: { children: React.ReactNode }) => (
    <span className={styles.tag}>{children}</span>
  ),
}

// ─── MDXContent ──────────────────────────────────────────────────────────────

interface MDXContentProps {
  source: string
}

export async function MDXContent({ source }: MDXContentProps) {
  return (
    <div className={styles.prose}>
      <MDXRemote source={source} components={components} />
    </div>
  )
}
