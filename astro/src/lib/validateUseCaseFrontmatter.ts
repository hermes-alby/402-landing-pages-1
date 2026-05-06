import type { UseCaseFrontmatter } from "../types";

function fail(path: string, expected: string): never {
  throw new Error(`Invalid use-case frontmatter at ${path}: expected ${expected}`);
}

function objectAt(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail(path, "object");
  }
  return value as Record<string, unknown>;
}

function stringAt(value: unknown, path: string): string {
  if (typeof value !== "string" || value.length === 0) {
    fail(path, "non-empty string");
  }
  return value;
}

function optionalStringAt(value: unknown, path: string): string | undefined {
  if (value === undefined || value === null) return undefined;
  return stringAt(value, path);
}

function booleanAt(value: unknown, path: string): boolean | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "boolean") fail(path, "boolean");
  return value;
}

function numberAt(value: unknown, path: string): number | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "number") fail(path, "number");
  return value;
}

function arrayAt(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) fail(path, "array");
  return value;
}

function stringArrayAt(value: unknown, path: string): string[] {
  return arrayAt(value, path).map((item, index) => stringAt(item, `${path}[${index}]`));
}

export function validateUseCaseFrontmatter(value: unknown, source = "unknown"): UseCaseFrontmatter {
  const root = objectAt(value, source);

  const schema = objectAt(root.schema, `${source}.schema`);
  const hero = objectAt(root.hero, `${source}.hero`);
  const heroTitle = objectAt(hero.title, `${source}.hero.title`);
  const connection = objectAt(hero.connection, `${source}.hero.connection`);
  const connectionAgent = objectAt(connection.agent, `${source}.hero.connection.agent`);
  const connectionService = objectAt(connection.service, `${source}.hero.connection.service`);
  const trust = objectAt(root.trust, `${source}.trust`);
  const pipeline = root.pipeline === undefined ? undefined : objectAt(root.pipeline, `${source}.pipeline`);
  const pipelineTitle = pipeline ? objectAt(pipeline.title, `${source}.pipeline.title`) : undefined;
  const benefits = root.benefits === undefined ? undefined : objectAt(root.benefits, `${source}.benefits`);
  const useCases = objectAt(root.useCases, `${source}.useCases`);
  const useCasesTitle = objectAt(useCases.title, `${source}.useCases.title`);
  const comparison = root.comparison === undefined ? undefined : objectAt(root.comparison, `${source}.comparison`);
  const comparisonColumns = comparison ? objectAt(comparison.columns, `${source}.comparison.columns`) : undefined;
  const flow = root.flow === undefined ? undefined : objectAt(root.flow, `${source}.flow`);
  const flowTitle = flow ? objectAt(flow.title, `${source}.flow.title`) : undefined;
  const facts = root.facts === undefined ? undefined : objectAt(root.facts, `${source}.facts`);
  const prompt = root.prompt === undefined ? undefined : objectAt(root.prompt, `${source}.prompt`);
  const cta = objectAt(root.cta, `${source}.cta`);
  const ctaTitle = objectAt(cta.title, `${source}.cta.title`);
  const faq = objectAt(root.faq, `${source}.faq`);
  const footer = objectAt(root.footer, `${source}.footer`);

  return {
    title: stringAt(root.title, `${source}.title`),
    description: stringAt(root.description, `${source}.description`),
    bodyClass: stringAt(root.bodyClass, `${source}.bodyClass`),
    themeColor: stringAt(root.themeColor, `${source}.themeColor`),
    ogTitle: stringAt(root.ogTitle, `${source}.ogTitle`),
    ogDescription: stringAt(root.ogDescription, `${source}.ogDescription`),
    schema: {
      name: stringAt(schema.name, `${source}.schema.name`),
      description: stringAt(schema.description, `${source}.schema.description`),
      mainEntityName: stringAt(schema.mainEntityName, `${source}.schema.mainEntityName`),
      mainEntityDescription: stringAt(schema.mainEntityDescription, `${source}.schema.mainEntityDescription`),
      providerName: stringAt(schema.providerName, `${source}.schema.providerName`)
    },
    hero: {
      ghostNumber: stringAt(hero.ghostNumber, `${source}.hero.ghostNumber`),
      eyebrow: stringAt(hero.eyebrow, `${source}.hero.eyebrow`),
      title: {
        lines: stringArrayAt(heroTitle.lines, `${source}.hero.title.lines`),
        highlight: stringAt(heroTitle.highlight, `${source}.hero.title.highlight`)
      },
      lead: stringAt(hero.lead, `${source}.hero.lead`),
      meta: stringArrayAt(hero.meta, `${source}.hero.meta`),
      connection: {
        agent: {
          eyebrow: stringAt(connectionAgent.eyebrow, `${source}.hero.connection.agent.eyebrow`),
          logo: stringAt(connectionAgent.logo, `${source}.hero.connection.agent.logo`),
          title: stringAt(connectionAgent.title, `${source}.hero.connection.agent.title`)
        },
        service: {
          eyebrow: stringAt(connectionService.eyebrow, `${source}.hero.connection.service.eyebrow`),
          logo: stringAt(connectionService.logo, `${source}.hero.connection.service.logo`),
          title: stringAt(connectionService.title, `${source}.hero.connection.service.title`)
        }
      }
    },
    trust: {
      items: arrayAt(trust.items, `${source}.trust.items`).map((item, index) => {
        const entry = objectAt(item, `${source}.trust.items[${index}]`);
        const rawStat = entry.stat;
        if (rawStat !== undefined && rawStat !== null && typeof rawStat !== "string") {
          fail(`${source}.trust.items[${index}].stat`, "string");
        }
        return {
          label: stringAt(entry.label, `${source}.trust.items[${index}].label`),
          stat: typeof rawStat === "string" ? rawStat : "",
          statHighlight: stringAt(entry.statHighlight, `${source}.trust.items[${index}].statHighlight`),
          statSuffix: optionalStringAt(entry.statSuffix, `${source}.trust.items[${index}].statSuffix`),
          desc: stringAt(entry.desc, `${source}.trust.items[${index}].desc`)
        };
      })
    },
    pipeline: pipeline && pipelineTitle ? {
      eyebrow: stringAt(pipeline.eyebrow, `${source}.pipeline.eyebrow`),
      title: {
        text: stringAt(pipelineTitle.text, `${source}.pipeline.title.text`),
        highlight: stringAt(pipelineTitle.highlight, `${source}.pipeline.title.highlight`)
      },
      description: stringAt(pipeline.description, `${source}.pipeline.description`),
      stages: arrayAt(pipeline.stages, `${source}.pipeline.stages`).map((item, index) => {
        const entry = objectAt(item, `${source}.pipeline.stages[${index}]`);
        return {
          ix: stringAt(entry.ix, `${source}.pipeline.stages[${index}].ix`),
          title: stringAt(entry.title, `${source}.pipeline.stages[${index}].title`),
          text: stringAt(entry.text, `${source}.pipeline.stages[${index}].text`)
        };
      }),
      foot: arrayAt(pipeline.foot, `${source}.pipeline.foot`).map((item, index) => {
        const entry = objectAt(item, `${source}.pipeline.foot[${index}]`);
        return {
          label: stringAt(entry.label, `${source}.pipeline.foot[${index}].label`),
          html: stringAt(entry.html, `${source}.pipeline.foot[${index}].html`)
        };
      })
    } : undefined,
    benefits: benefits ? {
      eyebrow: stringAt(benefits.eyebrow, `${source}.benefits.eyebrow`),
      title: stringAt(benefits.title, `${source}.benefits.title`),
      description: stringAt(benefits.description, `${source}.benefits.description`),
      cards: arrayAt(benefits.cards, `${source}.benefits.cards`).map((item, index) => {
        const entry = objectAt(item, `${source}.benefits.cards[${index}]`);
        const span = numberAt(entry.span, `${source}.benefits.cards[${index}].span`);
        return {
          num: stringAt(entry.num, `${source}.benefits.cards[${index}].num`),
          title: stringAt(entry.title, `${source}.benefits.cards[${index}].title`),
          highlight: optionalStringAt(entry.highlight, `${source}.benefits.cards[${index}].highlight`),
          text: stringAt(entry.text, `${source}.benefits.cards[${index}].text`),
          span: span === 2 || span === 3 ? span : undefined,
          feature: booleanAt(entry.feature, `${source}.benefits.cards[${index}].feature`),
          demo: optionalStringAt(entry.demo, `${source}.benefits.cards[${index}].demo`)
        };
      })
    } : undefined,
    useCases: {
      eyebrow: stringAt(useCases.eyebrow, `${source}.useCases.eyebrow`),
      title: {
        text: stringAt(useCasesTitle.text, `${source}.useCases.title.text`),
        highlight: stringAt(useCasesTitle.highlight, `${source}.useCases.title.highlight`)
      },
      description: stringAt(useCases.description, `${source}.useCases.description`),
      items: arrayAt(useCases.items, `${source}.useCases.items`).map((item, index) => {
        const entry = objectAt(item, `${source}.useCases.items[${index}]`);
        return {
          who: stringAt(entry.who, `${source}.useCases.items[${index}].who`),
          title: stringAt(entry.title, `${source}.useCases.items[${index}].title`),
          text: stringAt(entry.text, `${source}.useCases.items[${index}].text`),
          query: stringAt(entry.query, `${source}.useCases.items[${index}].query`)
        };
      })
    },
    comparison: comparison && comparisonColumns ? {
      eyebrow: stringAt(comparison.eyebrow, `${source}.comparison.eyebrow`),
      title: stringAt(comparison.title, `${source}.comparison.title`),
      description: stringAt(comparison.description, `${source}.comparison.description`),
      columns: {
        us: stringAt(comparisonColumns.us, `${source}.comparison.columns.us`),
        a: stringAt(comparisonColumns.a, `${source}.comparison.columns.a`),
        b: stringAt(comparisonColumns.b, `${source}.comparison.columns.b`)
      },
      rows: arrayAt(comparison.rows, `${source}.comparison.rows`).map((item, index) => {
        const entry = objectAt(item, `${source}.comparison.rows[${index}]`);
        return {
          category: stringAt(entry.category, `${source}.comparison.rows[${index}].category`),
          us: stringAt(entry.us, `${source}.comparison.rows[${index}].us`),
          left: stringAt(entry.left, `${source}.comparison.rows[${index}].left`),
          right: stringAt(entry.right, `${source}.comparison.rows[${index}].right`)
        };
      })
    } : undefined,
    flow: flow && flowTitle ? {
      eyebrow: stringAt(flow.eyebrow, `${source}.flow.eyebrow`),
      title: {
        text: stringAt(flowTitle.text, `${source}.flow.title.text`),
        highlight: stringAt(flowTitle.highlight, `${source}.flow.title.highlight`)
      },
      steps: arrayAt(flow.steps, `${source}.flow.steps`).map((item, index) => {
        const entry = objectAt(item, `${source}.flow.steps[${index}]`);
        return {
          number: stringAt(entry.number, `${source}.flow.steps[${index}].number`),
          title: stringAt(entry.title, `${source}.flow.steps[${index}].title`),
          text: stringAt(entry.text, `${source}.flow.steps[${index}].text`)
        };
      })
    } : undefined,
    facts: facts ? {
      eyebrow: stringAt(facts.eyebrow, `${source}.facts.eyebrow`),
      title: stringAt(facts.title, `${source}.facts.title`),
      text: stringAt(facts.text, `${source}.facts.text`),
      items: arrayAt(facts.items, `${source}.facts.items`).map((item, index) => {
        const entry = objectAt(item, `${source}.facts.items[${index}]`);
        return {
          label: stringAt(entry.label, `${source}.facts.items[${index}].label`),
          value: stringAt(entry.value, `${source}.facts.items[${index}].value`)
        };
      })
    } : undefined,
    prompt: prompt ? {
      eyebrow: stringAt(prompt.eyebrow, `${source}.prompt.eyebrow`),
      title: stringAt(prompt.title, `${source}.prompt.title`),
      text: stringAt(prompt.text, `${source}.prompt.text`),
      copyTarget: stringAt(prompt.copyTarget, `${source}.prompt.copyTarget`),
      buttonLabel: stringAt(prompt.buttonLabel, `${source}.prompt.buttonLabel`),
      code: stringAt(prompt.code, `${source}.prompt.code`)
    } : undefined,
    cta: {
      eyebrow: stringAt(cta.eyebrow, `${source}.cta.eyebrow`),
      title: {
        text: stringAt(ctaTitle.text, `${source}.cta.title.text`),
        highlight: stringAt(ctaTitle.highlight, `${source}.cta.title.highlight`)
      },
      text: stringAt(cta.text, `${source}.cta.text`),
      actions: arrayAt(cta.actions, `${source}.cta.actions`).map((item, index) => {
        const entry = objectAt(item, `${source}.cta.actions[${index}]`);
        return {
          label: stringAt(entry.label, `${source}.cta.actions[${index}].label`),
          text: stringAt(entry.text, `${source}.cta.actions[${index}].text`),
          href: stringAt(entry.href, `${source}.cta.actions[${index}].href`),
          primary: booleanAt(entry.primary, `${source}.cta.actions[${index}].primary`),
          monoTag: optionalStringAt(entry.monoTag, `${source}.cta.actions[${index}].monoTag`)
        };
      }),
      badges: stringArrayAt(cta.badges, `${source}.cta.badges`)
    },
    faq: {
      eyebrow: stringAt(faq.eyebrow, `${source}.faq.eyebrow`),
      title: stringAt(faq.title, `${source}.faq.title`),
      description: stringAt(faq.description, `${source}.faq.description`),
      items: arrayAt(faq.items, `${source}.faq.items`).map((item, index) => {
        const entry = objectAt(item, `${source}.faq.items[${index}]`);
        return {
          question: stringAt(entry.question, `${source}.faq.items[${index}].question`),
          answer: stringAt(entry.answer, `${source}.faq.items[${index}].answer`),
          open: booleanAt(entry.open, `${source}.faq.items[${index}].open`)
        };
      })
    },
    footer: {
      brand: stringAt(footer.brand, `${source}.footer.brand`),
      suffix: stringAt(footer.suffix, `${source}.footer.suffix`),
      tag: stringAt(footer.tag, `${source}.footer.tag`)
    }
  };
}
