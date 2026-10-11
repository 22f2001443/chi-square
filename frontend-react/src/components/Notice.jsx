import Layout from "./Layout";
import { ButtonLink, Container } from "./ui";

// A centred message page (maintenance, not found).
export default function Notice({ title, message }) {
  return (
    <Layout>
      <section aria-labelledby="page-title" className="bg-paper">
        <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-5 py-16 text-center">
          <span aria-hidden="true" className="font-mono text-[54px] text-accent">
            χ²
          </span>
          <h1 id="page-title" className="max-w-[18em] text-[clamp(25px,3.6vw,36px)] leading-tight font-semibold tracking-[-0.02em]">
            {title}
          </h1>
          {message && <p className="max-w-[34em] text-base leading-relaxed text-muted">{message}</p>}
          <ButtonLink href="/" variant="secondary" className="mt-2">
            Back to home
          </ButtonLink>
        </Container>
      </section>
    </Layout>
  );
}
