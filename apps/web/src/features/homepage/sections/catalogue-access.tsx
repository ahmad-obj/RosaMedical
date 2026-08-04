import Link from "next/link";
import type { ReactElement } from "react";
import { Container, Section } from "@/components/layout";
import {
  getCinematicMedia,
  type CinematicMediaAsset
} from "@/features/cinematic-media";
import {
  MediaFrame,
  ProgressiveBlur,
  Stagger,
  StaggerItem
} from "@/features/motion";
import { SectionHeading } from "@/features/public-catalogue";
import type { HomeCatalogueModel } from "../homepage.data";

function getCatalogueMedia(name: string): CinematicMediaAsset {
  switch (name) {
    case "Knives":
      return getCinematicMedia("homepage-catalogue-knives");
    case "Scissors":
      return getCinematicMedia("homepage-catalogue-scissors");
    case "Punches":
      return getCinematicMedia("homepage-catalogue-punches");
    case "Chisels":
      return getCinematicMedia("homepage-catalogue-chisels");
    case "Cutters":
      return getCinematicMedia("homepage-catalogue-cutters");
    default:
      throw new Error(`Unsupported homepage catalogue family: ${name}`);
  }
}

export function CatalogueAccess({ model }: { model: HomeCatalogueModel }): ReactElement {
  return (
    <Section
      className="home-catalogues"
      tone="paper"
      data-section="catalogue-access"
      aria-labelledby="catalogue-access-title"
      style={{ display: "block" }}
    >
      <Container size="wide">
        <SectionHeading
          id="catalogue-access-title"
          level={2}
          eyebrow={model.eyebrow}
          title={model.title}
          copy={model.copy}
        />
        <div className="catalogue-grid-shell">
          <Stagger
            as="ul"
            className="catalogue-grid"
            aria-label="Technical catalogues"
            interval={0.055}
          >
            {model.items.map((item) => {
              const media = getCatalogueMedia(item.name);

              return (
                <StaggerItem as="li" key={item.name}>
                  <Link
                    className="catalogue-card premium-surface"
                    href={item.href}
                    aria-label={`View ${item.name} catalogue`}
                  >
                    <MediaFrame
                      src={media.src}
                      alt={media.alt}
                      focalPoint={media.focalPoint}
                      sizes={media.sizes}
                      aspect="portrait"
                      tone="mist"
                      overlay="soft"
                      mediaSlot={media.slot}
                      className="catalogue-card__media"
                    />
                    <span className="catalogue-card__number">{item.number}</span>
                    <span className="catalogue-card__title">{item.name}</span>
                    <span className="catalogue-card__action">
                      View catalogue <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
          <ProgressiveBlur edge="right" className="catalogue-grid__blur" />
        </div>
      </Container>
    </Section>
  );
}
