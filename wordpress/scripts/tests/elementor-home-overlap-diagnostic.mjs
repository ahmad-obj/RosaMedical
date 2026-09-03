import { createRequire } from 'node:module';
import { settlePageMedia } from '../client-preview-capture.mjs';

const require = createRequire(new URL('../../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const baseUrl = process.argv[2] || 'http://localhost:8088/';
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 431, height: 932 } });
  await page.goto(baseUrl, { waitUntil: 'load' });
  await settlePageMedia(page, { scrollDelayMs: 10 });

  const diagnostic = await page.evaluate(async () => {
    const latest = document.querySelector('[data-home-section="latest"]');
    const widget = latest?.closest('.elementor-widget');
    const widgetContainer = latest?.closest('.elementor-widget-container');
    const root = widget?.parentElement;
    if (!latest || !widget || !widgetContainer || !root) {
      return { error: 'Latest section/widget/root could not be resolved.' };
    }

    const pick = (element) => {
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      const vars = [
        '--height',
        '--min-height',
        '--flex-basis',
        '--flex-grow',
        '--flex-shrink',
        '--align-self',
        '--container-widget-height',
        '--container-widget-align-self',
        '--container-widget-width',
        '--container-widget-flex-grow',
        '--flex-wrap',
        '--flex-wrap-mobile',
      ];
      return {
        className: element.className,
        box: {
          top: Math.round(box.top + scrollY),
          bottom: Math.round(box.bottom + scrollY),
          width: Math.round(box.width),
          height: Math.round(box.height),
        },
        computed: {
          display: style.display,
          position: style.position,
          height: style.height,
          minHeight: style.minHeight,
          maxHeight: style.maxHeight,
          flex: style.flex,
          flexBasis: style.flexBasis,
          flexGrow: style.flexGrow,
          flexShrink: style.flexShrink,
          alignSelf: style.alignSelf,
          overflow: style.overflow,
          boxSizing: style.boxSizing,
          contain: style.contain,
          flexDirection: style.flexDirection,
          flexWrap: style.flexWrap,
          alignItems: style.alignItems,
          alignContent: style.alignContent,
          gap: style.gap,
        },
        variables: Object.fromEntries(vars.map((name) => [name, style.getPropertyValue(name).trim()])),
        inlineStyle: element.getAttribute('style') || '',
      };
    };

    const measureOverlap = () => {
      const sectionBox = latest.getBoundingClientRect();
      const widgetBox = widget.getBoundingClientRect();
      const containerBox = widgetContainer.getBoundingClientRect();
      const nextWidget = widget.nextElementSibling;
      const nextBox = nextWidget?.getBoundingClientRect();
      return {
        sectionHeight: Math.round(sectionBox.height),
        widgetHeight: Math.round(widgetBox.height),
        widgetContainerHeight: Math.round(containerBox.height),
        overflowAmount: Math.round(sectionBox.bottom - widgetBox.bottom),
        nextWidgetGap: nextBox ? Math.round(nextBox.top - sectionBox.bottom) : null,
        rootHeight: Math.round(root.getBoundingClientRect().height),
        rootFlexWrap: getComputedStyle(root).flexWrap,
        rootFlexWrapVar: getComputedStyle(root).getPropertyValue('--flex-wrap').trim(),
        rootFlexWrapMobileVar: getComputedStyle(root).getPropertyValue('--flex-wrap-mobile').trim(),
      };
    };

    const relevantText = /height|flex|align|overflow|contain|position/i;
    const matchedRules = [];

    const visitRules = (rules, href, context = []) => {
      for (const rule of rules) {
        if (rule instanceof CSSMediaRule) {
          if (matchMedia(rule.conditionText).matches) {
            visitRules(rule.cssRules, href, [...context, `@media ${rule.conditionText}`]);
          }
          continue;
        }
        if (rule instanceof CSSSupportsRule) {
          let active = true;
          try { active = CSS.supports(rule.conditionText); } catch { active = true; }
          if (active) visitRules(rule.cssRules, href, [...context, `@supports ${rule.conditionText}`]);
          continue;
        }
        if (!(rule instanceof CSSStyleRule) || !relevantText.test(rule.cssText)) continue;

        let widgetMatches = false;
        let containerMatches = false;
        let rootMatches = false;
        try { widgetMatches = widget.matches(rule.selectorText); } catch {}
        try { containerMatches = widgetContainer.matches(rule.selectorText); } catch {}
        try { rootMatches = root.matches(rule.selectorText); } catch {}
        if (!widgetMatches && !containerMatches && !rootMatches) continue;

        matchedRules.push({
          target: [widgetMatches && 'widget', containerMatches && 'widget-container', rootMatches && 'root'].filter(Boolean).join(', '),
          href,
          context,
          selector: rule.selectorText,
          cssText: rule.style.cssText,
        });
      }
    };

    for (const sheet of document.styleSheets) {
      let rules;
      try { rules = sheet.cssRules; } catch { continue; }
      visitRules(rules, sheet.href || '<inline>');
    }

    const baseline = measureOverlap();
    const rootBefore = pick(root);
    const widgetBefore = pick(widget);
    const widgetContainerBefore = pick(widgetContainer);
    const sectionBefore = pick(latest);

    // Hypothesis probe only: Elementor's <=767px default changes this vertical
    // authoring container to flex-wrap:wrap. Rosa's authoring root is a single
    // column stack, so force nowrap in-memory and remeasure without touching CSS.
    root.style.setProperty('--flex-wrap-mobile', 'nowrap');
    root.style.setProperty('--flex-wrap', 'nowrap');
    root.style.flexWrap = 'nowrap';
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    const noWrapProbe = measureOverlap();

    root.style.removeProperty('--flex-wrap-mobile');
    root.style.removeProperty('--flex-wrap');
    root.style.removeProperty('flex-wrap');

    return {
      baseline,
      noWrapProbe,
      root: rootBefore,
      widget: widgetBefore,
      widgetContainer: widgetContainerBefore,
      section: sectionBefore,
      matchedRules,
    };
  });

  console.dir(diagnostic, { depth: null, maxArrayLength: null });
  await page.close();
} finally {
  await browser.close();
}
