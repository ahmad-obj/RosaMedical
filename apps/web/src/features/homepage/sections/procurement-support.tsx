import type { ReactElement } from "react";
import { Container, Section } from "@/components/layout";
import { Reveal, Stagger, StaggerItem } from "@/features/motion";
import { SectionHeading } from "@/features/public-catalogue";
import type { HomeProcurementModel } from "../homepage.data";

export function ProcurementSupport({
  model
}: {
  model: HomeProcurementModel;
}): ReactElement {
  return (
    <Section
      className="home-procurement-refined"
      tone="paper"
      data-section="procurement-support"
      aria-labelledby="procurement-support-title"
    >
      <Container size="wide">
        <div className="home-procurement-refined__grid">
          <Reveal direction="right" className="home-procurement-refined__intro">
            <SectionHeading
              id="procurement-support-title"
              level={2}
              eyebrow={model.eyebrow}
              title={model.title}
              copy={model.copy}
            />
          </Reveal>

          <Reveal direction="left" className="home-procurement-refined__details" delay={0.08}>
            <h3 className="home-procurement-refined__title">{model.detailTitle}</h3>
            <p className="home-procurement-refined__body">{model.detailCopy}</p>
            <Stagger as="ol" className="home-procurement-refined__steps" interval={0.085}>
              {model.steps.map((step, index) => (
                <StaggerItem as="li" key={step}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{step}</strong>
                </StaggerItem>
              ))}
            </Stagger>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
