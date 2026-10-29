import { autoLink, suggestLinks, removeInsertedLinks } from '@juhenza/auto-linker';

const options = {
  content: '<p>AI automation helps companies. Custom software improves efficiency.</p>',
  currentUrl: 'https://example.com/blog/business-costs',
  pages: [
    { url: 'https://example.com/ai-automation', title: 'AI Automation Services', keywords: ['AI automation'], anchors: ['AI automation'] },
    { url: 'https://example.com/custom-software', title: 'Custom Software Development', keywords: ['custom software'], anchors: ['custom software'] },
  ],
};
const suggestions = suggestLinks(options);
const result = autoLink(options);
if (suggestions.content !== options.content || result.links.length !== 2 || removeInsertedLinks(result) !== options.content) throw new Error('Quickstart failed');
console.log(result.content);
console.log(JSON.stringify(result.links, null, 2));
