export interface VoicePunctuationCommand {
  id: string;
  label: string;
  spokenExamples: string[];
  symbolLabel: string;
  insertText: string;
}

export const VOICE_PUNCTUATION_COMMANDS: VoicePunctuationCommand[] = [
  {
    id: 'period',
    label: 'Period',
    spokenExamples: ['period', 'full stop'],
    symbolLabel: '.',
    insertText: '.',
  },
  {
    id: 'comma',
    label: 'Comma',
    spokenExamples: ['comma'],
    symbolLabel: ',',
    insertText: ',',
  },
  {
    id: 'question-mark',
    label: 'Question Mark',
    spokenExamples: ['question mark'],
    symbolLabel: '?',
    insertText: '?',
  },
  {
    id: 'exclamation-mark',
    label: 'Exclamation Mark',
    spokenExamples: ['exclamation mark', 'exclamation point'],
    symbolLabel: '!',
    insertText: '!',
  },
  {
    id: 'colon',
    label: 'Colon',
    spokenExamples: ['colon'],
    symbolLabel: ':',
    insertText: ':',
  },
  {
    id: 'semicolon',
    label: 'Semicolon',
    spokenExamples: ['semicolon'],
    symbolLabel: ';',
    insertText: ';',
  },
  {
    id: 'dash',
    label: 'Em Dash',
    spokenExamples: ['dash', 'em dash'],
    symbolLabel: '—',
    insertText: ' — ',
  },
  {
    id: 'hyphen',
    label: 'Hyphen',
    spokenExamples: ['hyphen'],
    symbolLabel: '-',
    insertText: '-',
  },
  {
    id: 'ellipsis',
    label: 'Ellipsis',
    spokenExamples: ['ellipsis', 'dot dot dot'],
    symbolLabel: '...',
    insertText: '...',
  },
  {
    id: 'open-quote',
    label: 'Open Quote',
    spokenExamples: ['open quote', 'open quotes'],
    symbolLabel: '"...',
    insertText: '"',
  },
  {
    id: 'close-quote',
    label: 'Close Quote',
    spokenExamples: ['close quote', 'end quote'],
    symbolLabel: '..."',
    insertText: '"',
  },
  {
    id: 'open-paren',
    label: 'Open Parenthesis',
    spokenExamples: ['open parenthesis', 'open bracket'],
    symbolLabel: '(',
    insertText: '(',
  },
  {
    id: 'close-paren',
    label: 'Close Parenthesis',
    spokenExamples: ['close parenthesis', 'close bracket'],
    symbolLabel: ')',
    insertText: ')',
  },
  {
    id: 'new-line',
    label: 'New Line',
    spokenExamples: ['new line', 'next line'],
    symbolLabel: '↵',
    insertText: '\n',
  },
  {
    id: 'new-paragraph',
    label: 'New Paragraph',
    spokenExamples: ['new paragraph', 'next paragraph'],
    symbolLabel: '¶',
    insertText: '\n\n',
  },
];

interface ReplacementRule {
  pattern: RegExp;
  token: string;
}

// Ordered longest-phrase first to prevent partial matches
const SPOKEN_RULES: ReplacementRule[] = [
  { pattern: /\b(?:new|next)\s+paragraph\b/gi, token: '[[P_PARA]]' },
  { pattern: /\b(?:new|next)\s+line\b/gi, token: '[[P_LINE]]' },
  { pattern: /\bexclamation\s+(?:mark|point)\b/gi, token: '[[P_EMARK]]' },
  { pattern: /\bquestion\s+mark\b/gi, token: '[[P_QMARK]]' },
  { pattern: /\bfull\s+stop\b/gi, token: '[[P_PERIOD]]' },
  { pattern: /\bdot\s+dot\s+dot\b/gi, token: '[[P_ELLIPSIS]]' },
  { pattern: /\bsemi\s+colon\b/gi, token: '[[P_SEMI]]' },
  { pattern: /\bem\s+dash\b/gi, token: '[[P_DASH]]' },
  {
    pattern: /\b(?:open|left)\s+(?:parenthesis|parentheses|bracket)\b/gi,
    token: '[[P_OPEN_PAREN]]',
  },
  {
    pattern: /\b(?:close|right|end)\s+(?:parenthesis|parentheses|bracket)\b/gi,
    token: '[[P_CLOSE_PAREN]]',
  },
  {
    pattern: /\b(?:open|start)\s+(?:quotation\s+mark|quotation|quotes|quote)\b/gi,
    token: '[[P_OPEN_QUOTE]]',
  },
  {
    pattern: /\b(?:close|end)\s+(?:quotation\s+mark|quotation|quotes|quote)\b/gi,
    token: '[[P_CLOSE_QUOTE]]',
  },
  { pattern: /\bsemicolon\b/gi, token: '[[P_SEMI]]' },
  { pattern: /\bellipsis\b/gi, token: '[[P_ELLIPSIS]]' },
  { pattern: /\bperiod\b/gi, token: '[[P_PERIOD]]' },
  { pattern: /\bcomma\b/gi, token: '[[P_COMMA]]' },
  { pattern: /\bcolon\b/gi, token: '[[P_COLON]]' },
  { pattern: /\bhyphen\b/gi, token: '[[P_HYPHEN]]' },
  { pattern: /\bdash\b/gi, token: '[[P_DASH]]' },
];

const TOKEN_OUTPUT: Record<string, string> = {
  '[[P_PARA]]': '\n\n',
  '[[P_LINE]]': '\n',
  '[[P_PERIOD]]': '.',
  '[[P_COMMA]]': ',',
  '[[P_QMARK]]': '?',
  '[[P_EMARK]]': '!',
  '[[P_COLON]]': ':',
  '[[P_SEMI]]': ';',
  '[[P_ELLIPSIS]]': '...',
  '[[P_DASH]]': '—',
  '[[P_HYPHEN]]': '-',
  '[[P_OPEN_QUOTE]]': '"',
  '[[P_CLOSE_QUOTE]]': '"',
  '[[P_OPEN_PAREN]]': '(',
  '[[P_CLOSE_PAREN]]': ')',
};

const LEFT_ATTACH_TOKENS =
  '\\[\\[P_(?:PERIOD|COMMA|QMARK|EMARK|COLON|SEMI|ELLIPSIS|CLOSE_QUOTE|CLOSE_PAREN)\\]\\]';
const RIGHT_ATTACH_TOKENS = '\\[\\[P_(?:OPEN_QUOTE|OPEN_PAREN)\\]\\]';
const BREAK_TOKENS = '\\[\\[P_(?:PARA|LINE)\\]\\]';

function shouldCapitalizeAfter(existingText: string): boolean {
  if (!existingText || existingText.trim().length === 0) return true;
  if (/\n[ \t]*$/.test(existingText)) return true;
  if (/[.!?]["')\]]*[ \t]*$/.test(existingText)) return true;
  return false;
}

function applyCapitalization(
  text: string,
  capitalizeStart: boolean,
  language: string
): string {
  let result = text;

  if (capitalizeStart) {
    result = result.replace(
      /^([ \t\n"'(]*)([a-z])/,
      (_, prefix: string, letter: string) => `${prefix}${letter.toUpperCase()}`
    );
  }

  // Capitalize first letter after sentence-ending punctuation or newline
  result = result.replace(
    /([.!?]["')\]]*[ \t]+|\n[ \t]*)([("']*)([a-z])/g,
    (_, boundary: string, opener: string, letter: string) =>
      `${boundary}${opener}${letter.toUpperCase()}`
  );

  // Capitalize standalone English pronoun "I" and common contractions
  if (language.toLowerCase().startsWith('en')) {
    result = result.replace(/\bi(?='(?:m|ve|ll|d)\b|\b)/g, 'I');
  }

  return result;
}

export function formatSpokenPunctuation(
  rawText: string,
  options?: {
    enabled?: boolean;
    existingText?: string;
    language?: string;
  }
): string {
  const enabled = options?.enabled ?? true;
  const existingText = options?.existingText ?? '';
  const language = options?.language ?? 'en-US';

  const trimmed = rawText.trim();
  if (!trimmed) return '';
  if (!enabled) return trimmed;

  let text = trimmed;

  for (const rule of SPOKEN_RULES) {
    text = text.replace(rule.pattern, rule.token);
  }

  // Clean horizontal spaces around break tokens
  text = text.replace(new RegExp(`[ \\t]*(${BREAK_TOKENS})[ \\t]*`, 'g'), '$1');

  // Remove spaces before left-attaching punctuation tokens
  text = text.replace(new RegExp(`[ \\t]+(${LEFT_ATTACH_TOKENS})`, 'g'), '$1');

  // Ensure a single space after left-attaching punctuation when followed by word or opener
  text = text.replace(
    new RegExp(
      `(${LEFT_ATTACH_TOKENS})(?![ \\t\\n]|${LEFT_ATTACH_TOKENS}|${BREAK_TOKENS}|\\[\\[P_HYPHEN\\]\\])`,
      'g'
    ),
    '$1 '
  );

  // Remove spaces right after opening quotes / parentheses
  text = text.replace(new RegExp(`(${RIGHT_ATTACH_TOKENS})[ \\t]+`, 'g'), '$1');

  // Tightly attach hyphens on both sides
  text = text.replace(/[ \t]*\[\[P_HYPHEN\]\][ \t]*/g, '[[P_HYPHEN]]');

  // Space em-dashes cleanly on both sides
  text = text.replace(/[ \t]*\[\[P_DASH\]\][ \t]*/g, ' [[P_DASH]] ');

  // Replace sentinel tokens with actual symbols
  text = text.replace(
    /\[\[P_[A-Z_]+\]\]/g,
    (match) => TOKEN_OUTPUT[match] ?? match
  );

  // Collapse repeated horizontal spaces without disturbing newlines
  text = text.replace(/[ \t]{2,}/g, ' ');
  text = text.replace(/[ \t]+\n/g, '\n');
  text = text.replace(/\n[ \t]+/g, '\n');

  // Collapse accidental double period (not ellipsis)
  text = text.replace(/(?<!\.)\.{2}(?!\.)/g, '.');

  return applyCapitalization(
    text,
    shouldCapitalizeAfter(existingText),
    language
  );
}

export function appendDictationChunk(
  existingText: string,
  chunk: string
): string {
  if (!chunk) return existingText;

  if (!existingText) {
    return chunk.replace(/^[ \t]+/, '');
  }

  // Starts with newline break: strip trailing horizontal whitespace before appending
  if (chunk.startsWith('\n')) {
    return `${existingText.replace(/[ \t]+$/, '')}${chunk}`;
  }

  // Starts with closing/attaching punctuation (period, comma, ?, !, :, ;, ), -)
  if (/^[.,?!:;)\-]/.test(chunk)) {
    const cleanExisting = existingText.replace(/[ \t]+$/, '');
    // Avoid doubling a single period when browser already punctuated
    if (
      cleanExisting.endsWith('.') &&
      !cleanExisting.endsWith('...') &&
      chunk.startsWith('.') &&
      !chunk.startsWith('...')
    ) {
      return `${cleanExisting}${chunk.slice(1)}`;
    }
    return `${cleanExisting}${chunk}`;
  }

  // If existing text already ends with whitespace, newline, opening paren/quote, or hyphen
  if (/[\s\n(\-]$/.test(existingText)) {
    return `${existingText}${chunk.replace(/^[ \t]+/, '')}`;
  }

  // If chunk already starts with leading space (e.g. em dash " — ")
  if (/^[ \t]/.test(chunk)) {
    return `${existingText.replace(/[ \t]+$/, '')}${chunk}`;
  }

  return `${existingText} ${chunk}`;
}

export function insertManualPunctuation(
  existingText: string,
  insertText: string
): string {
  if (!existingText) {
    return insertText.startsWith('\n') ? '' : insertText.trimStart();
  }

  if (insertText === '"') {
    const quoteCount = (existingText.match(/"/g) || []).length;
    const isClosing = quoteCount % 2 === 1;
    if (isClosing) {
      return `${existingText.replace(/[ \t]+$/, '')}"`;
    }
    return /[\s\n(\-]$/.test(existingText)
      ? `${existingText}"`
      : `${existingText} "`;
  }

  return appendDictationChunk(existingText, insertText);
}
