import type { ReactElement } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/layout";
import { getCinematicMedia } from "@/features/cinematic-media";
import {
  Magnetic,
  MediaFrame,
  ProgressiveBlur,
  Reveal,
  SpotlightSurface,
  TextReveal,
  TiltSurface
} from "@/features/motion";
import type { HomeHeroModel } from "../homepage.data";

export function HomeHero({ model }: { model: HomeHeroModel }): ReactElement {
  const media = getCinematicMedia("homepage-hero");

  return (
    <Section
      className="home-hero public-hero"
      tone="dark"
      spacing="compact"
      data-section="home-hero"
      data-home-choreography="hero"
      aria-labelledby="home-title"
    >
      <Container className="home-hero__grid" size="wide">
        <div className="home-hero__copy">
          <Reveal direction="up" delay={0.04}>
            <p className="public-eyebrow">{model.eyebrow}</p>
          </Reveal>
          <TextReveal
            as="h1"
            className="home-hero__title"
            id="home-title"
            text={model.title}
            delay={0.12}
          />
          <Reveal direction="up" delay={0.24}>
            <p className="home-hero__copy-text">{model.copy}</p>
          </Reveal>
          <Reveal direction="up" delay={0.32}>
            <div className="home-hero__actions">
              <Magnetic>
                <ButtonLink href={model.primary.href}>{model.primary.label}</ButtonLink>
              </Magnetic>
              <Magnetic strength={0.12}>
                <ButtonLink href={model.secondary.href} variant="secondary">
                  {model.secondary.label}
                </ButtonLink>
              </Magnetic>
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.42}>
            <span className="home-hero__scroll">Scroll to explore</span>
          </Reveal>
        </div>
        <Reveal className="home-hero__visual" direction="left" delay={0.18}>
          <SpotlightSurface className="home-hero__visual-surface">
            <TiltSurface className="home-hero__visual-tilt" maxDegrees={1.6}>
              <MediaFrame
                src={media.src}
                alt={media.alt}
                focalPoint={media.focalPoint}
                sizes={media.sizes}
                loading="eager"
                aspect="cinematic"
                tone="dark"
                overlay="soft"
                mediaSlot={media.slot}
                className="home-hero__media"
              />
            </TiltSurface>
            <ProgressiveBlur edge="bottom" className="home-hero__blur" />
          </SpotlightSurface>
        </Reveal>
      </Container>
    </Section>
  );
}
