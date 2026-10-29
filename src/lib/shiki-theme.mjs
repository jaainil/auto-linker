const theme = {
  name: 'juhenza-blueprint',
  type: 'light',
  colors: {
    'editor.background': '#f7f7f7',
    'editor.foreground': '#000000',
  },
  tokenColors: [
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: '#555555', fontStyle: 'italic' },
    },
    {
      scope: ['keyword', 'storage.type', 'storage.modifier', 'keyword.operator.new'],
      settings: { foreground: '#1d4ed8' },
    },
    {
      scope: ['string', 'string.quoted', 'string.template', 'punctuation.definition.string'],
      settings: { foreground: '#222222' },
    },
    {
      scope: ['constant.numeric', 'constant.language'],
      settings: { foreground: '#1d4ed8' },
    },
    {
      scope: ['entity.name.function', 'support.function'],
      settings: { foreground: '#1d4ed8' },
    },
    {
      scope: ['entity.name.type', 'support.type', 'support.class', 'entity.name.tag'],
      settings: { foreground: '#2563eb' },
    },
    {
      scope: ['entity.other.attribute-name', 'variable.other.property', 'meta.object-literal.key'],
      settings: { foreground: '#3f3f3f' },
    },
    {
      scope: ['variable', 'variable.other', 'variable.parameter'],
      settings: { foreground: '#000000' },
    },
    {
      scope: ['punctuation', 'meta.brace', 'keyword.operator'],
      settings: { foreground: '#3f3f3f' },
    },
  ],
};

export default theme;
