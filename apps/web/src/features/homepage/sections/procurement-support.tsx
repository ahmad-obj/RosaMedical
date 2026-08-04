import type { ReactElement } from "react";
import { Container, Section } from "@/components/layout";
import { getCinematicMedia } from "@/features/cinematic-media";
import {
  MediaFrame,
  Reveal,
  Stagger,
  StaggerItem,
  TextReveal
} from "@/features/motion";
import { SectionHeading } from "@/features/public-catalogue";
import type { HomeProcurementModel } from "../homepage.data";

export function ProcurementSupport({ model }: { model: HomeProcurementModel }): ReactElement {
  const media = getCinematicMedia("homepage-procurement");

  return (
    <Section tone="paper" data-section="procurement-support" aria-labelledby="procurement-support-title">
      <Container size="wide">
        <SectionHeading
          id="procurement-support-title"
          level={2}
          eyebrow={model.eyebrow}
          title={model.title}
          copy={model.copy}
        />
        <div className="procurement-editorial">
          <Reveal direction="right" className="procurement-editorial__media-reveal">
            <MediaFrame
              src={media.src}
              alt={media.alt}
              focalPoint={media.focalPoint}
              sizes={media.sizes}
              aspect="portrait"
              tone="mist"
              overlay="soft"
              mediaSlot={media.slot}
              className="procurement-editorial__visual"
            />
          </Reveal>
          <Reveal direction="left" className="procurement-editorial__copy" delay={0.08}>
            <p className="public-eyebrow">{model.detailEyebrow}</p>
            <TextReveal
              as="h3"
              className="procurement-editorial__title"
              text={model.detailTitle}
            />
            <p className="procurement-editorial__body">{model.detailCopy}</p>
            <Stagger as="ol" className="procurement-steps" interval={0.085}>
              {model.steps.map((step, index) => (
                <StaggerItem as="li" key={step}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {step}
                </StaggerItem>
              ))}
            </Stagger>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
