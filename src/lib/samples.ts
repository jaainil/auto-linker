import type { LinkablePage } from './linker';

export interface Scenario {
  id: string;
  label: string;
  title: string;
  article: string;
  pages: LinkablePage[];
}

export const scenarios: Scenario[] = [
  {
    id: 'automation',
    label: 'AI automation',
    title: 'How AI automation reduces business costs',
    article: `<p>Businesses can reduce repetitive tasks using AI automation. Teams that map a process before automating it usually find that half the work disappears entirely.</p>
<p>Custom software is often the better answer when an off-the-shelf tool forces your team into someone else's workflow. A workflow automation layer can connect the systems you already pay for without replacing them.</p>
<p>Start with the process, not the tool. The cheapest automation is the one you never needed to build.</p>`,
    pages: [
      {
        url: 'https://juhenza.com/services/ai-automation',
        title: 'AI Automation Services',
        content:
          'We design and deploy AI automation for operations teams, from document intake to decision support. Every deployment starts with a measured baseline.',
        headings: ['AI automation for operations teams'],
        keywords: ['AI automation', 'document automation'],
        anchors: ['AI automation'],
      },
      {
        url: 'https://juhenza.com/services/custom-software',
        title: 'Custom Software Development',
        content:
          'Bespoke software built around the way your team actually works, not the other way around. Scoped in weeks, owned by you.',
        headings: ['Custom software, built around your process'],
        keywords: ['custom software', 'bespoke software'],
        anchors: ['custom software'],
      },
      {
        url: 'https://juhenza.com/guides/workflow-automation',
        title: 'Workflow Automation Guide',
        content:
          'A practical guide to mapping, testing, and shipping workflow automation without breaking the systems your team already depends on.',
        headings: ['A practical guide to workflow automation'],
        keywords: ['workflow automation', 'process automation'],
        anchors: ['workflow automation'],
      },
      {
        url: 'https://juhenza.com/services/process-audit',
        title: 'Business Process Audit',
        content:
          'Two days on site to map the process, find the waste, and decide what should be automated and what should simply stop.',
        headings: ['Business process audit'],
        keywords: ['process mapping', 'business process audit'],
        anchors: ['process mapping'],
      },
    ],
  },
  {
    id: 'logistics',
    label: 'Logistics systems',
    title: 'Auditing the workflow before writing the integration',
    article: `<p>Most warehouse teams do not need a new platform. They need an integration layer that makes the existing inventory software and transport management system agree on what happened.</p>
<p>We begin with a logistics process audit: two days on site, every handoff documented, every spreadsheet accounted for. ERP integration projects fail when the data model is decided before the work is understood.</p>
<p>Once the process is clear, warehouse automation is a small, testable set of changes rather than a five-year programme.</p>`,
    pages: [
      {
        url: 'https://juhenza.com/services/erp-integration',
        title: 'ERP Integration',
        content:
          'Connect finance, inventory, and fulfilment without a replatform. We work with the ERP you have and the systems your operators actually use.',
        headings: ['ERP integration without the replatform'],
        keywords: ['ERP integration', 'systems integration'],
        anchors: ['ERP integration'],
      },
      {
        url: 'https://juhenza.com/services/warehouse-automation',
        title: 'Warehouse Automation',
        content:
          'Pick, pack, and replenishment automation designed around the physical floor, not a vendor slide deck.',
        headings: ['Warehouse automation that fits the floor'],
        keywords: ['warehouse automation', 'pick and pack'],
        anchors: ['warehouse automation'],
      },
      {
        url: 'https://juhenza.com/software/inventory',
        title: 'Inventory Software',
        content:
          'Inventory software for multi-site teams: one stock truth across warehouses, channels, and returns.',
        headings: ['Inventory software for multi-site teams'],
        keywords: ['inventory software', 'stock control'],
        anchors: ['inventory software'],
      },
      {
        url: 'https://juhenza.com/services/logistics-audit',
        title: 'Logistics Process Audit',
        content:
          'A fixed-scope audit of the physical and digital workflow, delivered as a decision document rather than a report.',
        headings: ['Logistics process audit'],
        keywords: ['logistics process audit', 'process mapping'],
        anchors: ['logistics process audit'],
      },
    ],
  },
  {
    id: 'internal-tools',
    label: 'Internal tools',
    title: 'Replacing the spreadsheet that runs operations',
    article: `<p>Every operations team has one spreadsheet that quietly runs the business. It started as a stopgap, then grew tabs, owners, and a colour code nobody can explain.</p>
<p>Replacing it is not a database migration. It is a design problem: which decisions does the tool support, who makes them, and what happens when two people edit the same row?</p>
<p>We build internal tools that keep the familiar workflow and remove the fragile parts. Database design comes after the workflow, not before it.</p>`,
    pages: [
      {
        url: 'https://juhenza.com/services/internal-tools',
        title: 'Internal Tools Development',
        content:
          'Operations software shaped around the decisions your team makes every day. Built to be maintained in-house.',
        headings: ['Internal tools your team will actually use'],
        keywords: ['internal tools', 'operations software'],
        anchors: ['internal tools'],
      },
      {
        url: 'https://juhenza.com/services/database-design',
        title: 'Database Design',
        content:
          'Data modelling for operational systems: constraints, audit trails, and a schema that survives the second year.',
        headings: ['Database design for operational systems'],
        keywords: ['database design', 'data modelling'],
        anchors: ['database design'],
      },
      {
        url: 'https://juhenza.com/guides/spreadsheet-migration',
        title: 'Spreadsheet Migration',
        content:
          'A guide to moving a critical spreadsheet into a tool without losing the workflow that made it useful.',
        headings: ['From spreadsheet to internal tool'],
        keywords: ['spreadsheet migration', 'spreadsheet to app'],
        anchors: ['spreadsheet migration'],
      },
      {
        url: 'https://juhenza.com/services/process-automation',
        title: 'Process Automation',
        content:
          'Automate the handoffs, not the judgement. We map the workflow first and remove the parts that only exist because of the old tool.',
        headings: ['Process automation'],
        keywords: ['process automation', 'workflow automation'],
        anchors: ['process automation'],
      },
    ],
  },
];
