export interface ActionCard {
  label: string;
  text: string;
  href: string;
  primary?: boolean;
  monoTag?: string;
}

export interface NamedText {
  title: string;
  text: string;
}

export interface MetricCard {
  label: string;
  value: string;
  text: string;
  large?: boolean;
}

export interface StepItem {
  number: string;
  title: string;
  text: string;
}

export interface FactItem {
  label: string;
  value: string;
}

export interface ComparisonRow {
  category: string;
  us: string;
  left: string;
  right: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  open?: boolean;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface ProfileDataRow {
  label: string;
  value: string;
  verified?: boolean;
}

export interface ResultProfile {
  initials: string;
  brand: string;
  brandSuffix: string;
  status: string;
  name: string;
  role: string;
  meta: string;
  rows: ProfileDataRow[];
  tags: string[];
  footLeft: string;
  footRight: string;
}

export interface BenefitCard {
  num: string;
  title: string;
  highlight?: string;
  text: string;
  span?: 2 | 3;
  feature?: boolean;
  demo?: string;
}

export interface UseCaseCard {
  who: string;
  title: string;
  text: string;
  query: string;
}

export interface UseCaseFrontmatter {
  title: string;
  description: string;
  bodyClass: string;
  themeColor: string;
  ogTitle: string;
  ogDescription: string;
  schema: {
    name: string;
    description: string;
    mainEntityName: string;
    mainEntityDescription: string;
    providerName: string;
  };
  hero: {
    ghostNumber: string;
    eyebrow: string;
    title: {
      lines: string[];
      highlight: string;
    };
    lead: string;
    actions: ActionCard[];
    meta: string[];
    promptLabel: string;
    promptText: string;
    profile: ResultProfile;
    resultLabel: string;
    resultMeta: string;
  };
  trust: {
    items: Array<{
      label: string;
      stat: string;
      statHighlight: string;
      statSuffix?: string;
      desc: string;
    }>;
  };
  pipeline: {
    eyebrow: string;
    title: {
      text: string;
      highlight: string;
    };
    description: string;
    stages: Array<{
      ix: string;
      title: string;
      text: string;
    }>;
    foot: Array<{
      label: string;
      html: string;
    }>;
  };
  benefits: {
    eyebrow: string;
    title: string;
    description: string;
    cards: BenefitCard[];
  };
  useCases: {
    eyebrow: string;
    title: {
      text: string;
      highlight: string;
    };
    description: string;
    items: UseCaseCard[];
  };
  comparison: {
    eyebrow: string;
    title: string;
    description: string;
    columns: {
      us: string;
      a: string;
      b: string;
    };
    rows: ComparisonRow[];
  };
  flow: {
    eyebrow: string;
    title: {
      text: string;
      highlight: string;
    };
    steps: StepItem[];
  };
  facts: {
    eyebrow: string;
    title: string;
    text: string;
    items: FactItem[];
  };
  prompt: {
    eyebrow: string;
    title: string;
    text: string;
    copyTarget: string;
    buttonLabel: string;
    code: string;
  };
  cta: {
    eyebrow: string;
    title: {
      text: string;
      highlight: string;
    };
    text: string;
    actions: ActionCard[];
    badges: string[];
  };
  faq: {
    eyebrow: string;
    title: string;
    description: string;
    items: FaqItem[];
  };
  footer: {
    brand: string;
    suffix: string;
    tag: string;
  };
}
