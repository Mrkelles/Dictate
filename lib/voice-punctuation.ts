import { getLanguageOption } from '@/lib/languages';

export type PunctuationCommandId =
  | 'period'
  | 'comma'
  | 'question-mark'
  | 'exclamation-mark'
  | 'colon'
  | 'semicolon'
  | 'dash'
  | 'hyphen'
  | 'ellipsis'
  | 'open-quote'
  | 'close-quote'
  | 'open-paren'
  | 'close-paren'
  | 'new-line'
  | 'new-paragraph';

export interface LocalizedPunctuationCommand {
  id: PunctuationCommandId;
  englishLabel: string;
  nativePhrase: string;
  spokenExamples: string[];
  symbolLabel: string;
  insertText: string;
  isFallbackEnglish: boolean;
}

interface CommandMeta {
  id: PunctuationCommandId;
  englishLabel: string;
  token: string;
  defaultSymbol: string;
  defaultSymbolLabel: string;
  defaultInsertText: string;
}

const COMMAND_ORDER: CommandMeta[] = [
  { id: 'period', englishLabel: 'Period', token: '[[P_PERIOD]]', defaultSymbol: '.', defaultSymbolLabel: '.', defaultInsertText: '.' },
  { id: 'comma', englishLabel: 'Comma', token: '[[P_COMMA]]', defaultSymbol: ',', defaultSymbolLabel: ',', defaultInsertText: ',' },
  { id: 'question-mark', englishLabel: 'Question Mark', token: '[[P_QMARK]]', defaultSymbol: '?', defaultSymbolLabel: '?', defaultInsertText: '?' },
  { id: 'exclamation-mark', englishLabel: 'Exclamation Mark', token: '[[P_EMARK]]', defaultSymbol: '!', defaultSymbolLabel: '!', defaultInsertText: '!' },
  { id: 'colon', englishLabel: 'Colon', token: '[[P_COLON]]', defaultSymbol: ':', defaultSymbolLabel: ':', defaultInsertText: ':' },
  { id: 'semicolon', englishLabel: 'Semicolon', token: '[[P_SEMI]]', defaultSymbol: ';', defaultSymbolLabel: ';', defaultInsertText: ';' },
  { id: 'dash', englishLabel: 'Em Dash', token: '[[P_DASH]]', defaultSymbol: '—', defaultSymbolLabel: '—', defaultInsertText: ' — ' },
  { id: 'hyphen', englishLabel: 'Hyphen', token: '[[P_HYPHEN]]', defaultSymbol: '-', defaultSymbolLabel: '-', defaultInsertText: '-' },
  { id: 'ellipsis', englishLabel: 'Ellipsis', token: '[[P_ELLIPSIS]]', defaultSymbol: '...', defaultSymbolLabel: '...', defaultInsertText: '...' },
  { id: 'open-quote', englishLabel: 'Open Quote', token: '[[P_OPEN_QUOTE]]', defaultSymbol: '"', defaultSymbolLabel: '"...', defaultInsertText: '"' },
  { id: 'close-quote', englishLabel: 'Close Quote', token: '[[P_CLOSE_QUOTE]]', defaultSymbol: '"', defaultSymbolLabel: '..."', defaultInsertText: '"' },
  { id: 'open-paren', englishLabel: 'Open Parenthesis', token: '[[P_OPEN_PAREN]]', defaultSymbol: '(', defaultSymbolLabel: '(', defaultInsertText: '(' },
  { id: 'close-paren', englishLabel: 'Close Parenthesis', token: '[[P_CLOSE_PAREN]]', defaultSymbol: ')', defaultSymbolLabel: ')', defaultInsertText: ')' },
  { id: 'new-line', englishLabel: 'New Line', token: '[[P_LINE]]', defaultSymbol: '\n', defaultSymbolLabel: '↵', defaultInsertText: '\n' },
  { id: 'new-paragraph', englishLabel: 'New Paragraph', token: '[[P_PARA]]', defaultSymbol: '\n\n', defaultSymbolLabel: '¶', defaultInsertText: '\n\n' },
];

type PhraseDictionary = Partial<Record<PunctuationCommandId, string[]>>;

interface LanguagePunctuationPack {
  phrases: PhraseDictionary;
  symbols?: Partial<Record<PunctuationCommandId, string>>;
  spacelessScript?: boolean;
}

const ENGLISH_PHRASES: Record<PunctuationCommandId, string[]> = {
  period: ['period', 'full stop'],
  comma: ['comma'],
  'question-mark': ['question mark'],
  'exclamation-mark': ['exclamation mark', 'exclamation point'],
  colon: ['colon'],
  semicolon: ['semicolon', 'semi colon'],
  dash: ['em dash', 'dash'],
  hyphen: ['hyphen'],
  ellipsis: ['ellipsis', 'dot dot dot'],
  'open-quote': ['open quote', 'open quotes', 'open quotation', 'start quote'],
  'close-quote': ['close quote', 'close quotes', 'end quote', 'close quotation'],
  'open-paren': ['open parenthesis', 'left parenthesis', 'open bracket'],
  'close-paren': ['close parenthesis', 'right parenthesis', 'close bracket'],
  'new-line': ['new line', 'next line'],
  'new-paragraph': ['new paragraph', 'next paragraph'],
};

const NATIVE_PACKS: Record<string, LanguagePunctuationPack> = {
  en: {
    phrases: ENGLISH_PHRASES,
  },
  es: {
    phrases: {
      period: ['punto', 'punto y seguido', 'punto final'],
      comma: ['coma'],
      'question-mark': ['signo de interrogación', 'cerrar interrogación', 'interrogación'],
      'exclamation-mark': ['signo de exclamación', 'signo de admiración', 'exclamación'],
      colon: ['dos puntos', '2 puntos'],
      semicolon: ['punto y coma'],
      dash: ['raya', 'guion largo', 'guión largo'],
      hyphen: ['guion', 'guión'],
      ellipsis: ['puntos suspensivos', 'tres puntos', '3 puntos'],
      'open-quote': ['abrir comillas', 'abre comillas', 'abrir las comillas', 'abre las comillas'],
      'close-quote': ['cerrar comillas', 'cierra comillas', 'cerrar las comillas', 'cierra las comillas'],
      'open-paren': ['abrir paréntesis', 'abre paréntesis'],
      'close-paren': ['cerrar paréntesis', 'cierra paréntesis'],
      'new-line': ['nueva línea', 'salto de línea', 'siguiente línea'],
      'new-paragraph': ['nuevo párrafo', 'punto y aparte', 'punto aparte', 'siguiente párrafo'],
    },
  },
  fr: {
    phrases: {
      period: ['point', 'point final'],
      comma: ['virgule'],
      'question-mark': ["point d'interrogation", "points d'interrogation", 'point d interrogation'],
      'exclamation-mark': ["point d'exclamation", "points d'exclamation", 'point d exclamation'],
      colon: ['deux points', 'deux-points', '2 points', '2-points'],
      semicolon: ['point-virgule', 'point virgule'],
      dash: ['tiret long', 'tiret cadratin', 'tiret'],
      hyphen: ["trait d'union", 'trait d union'],
      ellipsis: ['points de suspension', 'trois points', '3 points'],
      'open-quote': ['ouvrir les guillemets', 'ouvrez les guillemets', 'ouvre les guillemets', 'ouvrir guillemets', 'guillemet ouvrant'],
      'close-quote': ['fermer les guillemets', 'fermez les guillemets', 'ferme les guillemets', 'fermer guillemets', 'guillemet fermant'],
      'open-paren': ['ouvrir la parenthèse', 'ouvrez la parenthèse', 'ouvre la parenthèse', 'ouvrir parenthèse', 'parenthèse ouvrante', 'parenthèse ouverte'],
      'close-paren': ['fermer la parenthèse', 'fermez la parenthèse', 'ferme la parenthèse', 'fermer parenthèse', 'parenthèse fermante', 'parenthèse fermée'],
      'new-line': ['à la ligne', 'a la ligne', 'aller à la ligne', 'passer à la ligne', 'nouvelle ligne', 'retour à la ligne'],
      'new-paragraph': ['nouveau paragraphe', 'paragraphe suivant'],
    },
  },
  de: {
    phrases: {
      period: ['punkt'],
      comma: ['komma'],
      'question-mark': ['fragezeichen'],
      'exclamation-mark': ['ausrufezeichen'],
      colon: ['doppelpunkt'],
      semicolon: ['semikolon', 'strichpunkt'],
      dash: ['gedankenstrich'],
      hyphen: ['bindestrich'],
      ellipsis: ['auslassungspunkte', 'drei punkte', '3 punkte'],
      'open-quote': ['anführungszeichen auf', 'anführungszeichen oben'],
      'close-quote': ['anführungszeichen zu', 'anführungszeichen unten'],
      'open-paren': ['klammer auf', 'klammer öffnen'],
      'close-paren': ['klammer zu', 'klammer schließen'],
      'new-line': ['neue zeile', 'zeilenumbruch'],
      'new-paragraph': ['neuer absatz', 'nächster absatz'],
    },
  },
  it: {
    phrases: {
      period: ['punto', 'punto fermo'],
      comma: ['virgola'],
      'question-mark': ['punto interrogativo', 'punto di domanda'],
      'exclamation-mark': ['punto esclamativo'],
      colon: ['due punti', '2 punti'],
      semicolon: ['punto e virgola'],
      dash: ['trattino lungo', 'lineetta'],
      hyphen: ['trattino'],
      ellipsis: ['puntini di sospensione', 'tre puntini', '3 puntini', 'tre punti', '3 punti'],
      'open-quote': ['apri le virgolette', 'apri virgolette', 'virgolette aperte', 'aprire le virgolette'],
      'close-quote': ['chiudi le virgolette', 'chiudi virgolette', 'virgolette chiuse', 'chiudere le virgolette'],
      'open-paren': ['apri la parentesi', 'apri parentesi', 'parentesi aperta', 'aprire la parentesi'],
      'close-paren': ['chiudi la parentesi', 'chiudi parentesi', 'parentesi chiusa', 'chiudere la parentesi'],
      'new-line': ['vai a capo', 'a capo', 'nuova riga', 'nuova linea'],
      'new-paragraph': ['nuovo paragrafo', 'nuovo capoverso'],
    },
  },
  pt: {
    phrases: {
      period: ['ponto final', 'ponto'],
      comma: ['vírgula'],
      'question-mark': ['ponto de interrogação', 'interrogação'],
      'exclamation-mark': ['ponto de exclamação', 'exclamação'],
      colon: ['dois pontos', 'dois-pontos', '2 pontos'],
      semicolon: ['ponto e vírgula'],
      dash: ['travessão'],
      hyphen: ['hífen'],
      ellipsis: ['reticências', 'três pontos', '3 pontos'],
      'open-quote': ['abrir aspas', 'abre aspas', 'abrir as aspas'],
      'close-quote': ['fechar aspas', 'fecha aspas', 'fechar as aspas'],
      'open-paren': ['abrir parênteses', 'abre parêntese', 'abrir parêntese'],
      'close-paren': ['fechar parênteses', 'fecha parêntese', 'fechar parêntese'],
      'new-line': ['nova linha', 'quebra de linha'],
      'new-paragraph': ['novo parágrafo', 'próximo parágrafo'],
    },
  },
  nl: {
    phrases: {
      period: ['punt'],
      comma: ['komma'],
      'question-mark': ['vraagteken'],
      'exclamation-mark': ['uitroepteken'],
      colon: ['dubbele punt'],
      semicolon: ['puntkomma'],
      dash: ['gedachtestreepje', 'streepje'],
      hyphen: ['koppelteken'],
      ellipsis: ['beletselteken', 'punt punt punt'],
      'open-quote': ['aanhalingsteken openen'],
      'close-quote': ['aanhalingsteken sluiten'],
      'open-paren': ['haakje openen'],
      'close-paren': ['haakje sluiten'],
      'new-line': ['nieuwe regel'],
      'new-paragraph': ['nieuwe alinea'],
    },
  },
  pl: {
    phrases: {
      period: ['kropka'],
      comma: ['przecinek'],
      'question-mark': ['znak zapytania', 'pytajnik'],
      'exclamation-mark': ['wykrzyknik'],
      colon: ['dwukropek'],
      semicolon: ['średnik'],
      dash: ['myślnik', 'pauza'],
      hyphen: ['łącznik', 'dywiz'],
      ellipsis: ['wielokropek'],
      'open-quote': ['otwórz cudzysłów'],
      'close-quote': ['zamknij cudzysłów'],
      'open-paren': ['otwórz nawias'],
      'close-paren': ['zamknij nawias'],
      'new-line': ['nowa linia', 'nowy wiersz'],
      'new-paragraph': ['nowy akapit'],
    },
  },
  ru: {
    phrases: {
      period: ['точка'],
      comma: ['запятая'],
      'question-mark': ['вопросительный знак', 'знак вопроса'],
      'exclamation-mark': ['восклицательный знак'],
      colon: ['двоеточие'],
      semicolon: ['точка с запятой'],
      dash: ['тире'],
      hyphen: ['дефис'],
      ellipsis: ['многоточие'],
      'open-quote': ['открыть кавычки', 'кавычки открыть'],
      'close-quote': ['закрыть кавычки', 'кавычки закрыть'],
      'open-paren': ['открыть скобку', 'скобка открыть'],
      'close-paren': ['закрыть скобку', 'скобка закрыть'],
      'new-line': ['новая строка'],
      'new-paragraph': ['новый абзац', 'красная строка'],
    },
  },
  uk: {
    phrases: {
      period: ['крапка'],
      comma: ['кома'],
      'question-mark': ['знак питання'],
      'exclamation-mark': ['знак оклику'],
      colon: ['двокрапка'],
      semicolon: ['крапка з комою'],
      dash: ['тире'],
      hyphen: ['дефіс'],
      ellipsis: ['трикрапка'],
      'open-quote': ['відкрити лапки'],
      'close-quote': ['закрити лапки'],
      'open-paren': ['відкрити дужку'],
      'close-paren': ['закрити дужку'],
      'new-line': ['новий рядок'],
      'new-paragraph': ['новий абзац'],
    },
  },
  tr: {
    phrases: {
      period: ['nokta'],
      comma: ['virgül'],
      'question-mark': ['soru işareti'],
      'exclamation-mark': ['ünlem işareti', 'ünlem'],
      colon: ['iki nokta'],
      semicolon: ['noktalı virgül'],
      dash: ['uzun tire', 'tire'],
      hyphen: ['kısa çizgi'],
      ellipsis: ['üç nokta'],
      'open-quote': ['tırnak aç'],
      'close-quote': ['tırnak kapat'],
      'open-paren': ['parantez aç'],
      'close-paren': ['parantez kapat'],
      'new-line': ['yeni satır'],
      'new-paragraph': ['yeni paragraf'],
    },
  },
  ar: {
    phrases: {
      period: ['نقطة', 'نقطه'],
      comma: ['فاصلة', 'فاصله'],
      'question-mark': ['علامة استفهام', 'علامه استفهام'],
      'exclamation-mark': ['علامة تعجب', 'علامه تعجب'],
      colon: ['نقطتان', 'نقطتين'],
      semicolon: ['فاصلة منقوطة', 'فاصله منقوطه'],
      dash: ['شرطة طويلة', 'شرطة'],
      hyphen: ['واصلة'],
      ellipsis: ['ثلاث نقاط'],
      'open-quote': ['افتح اقتباس', 'بداية اقتباس'],
      'close-quote': ['أغلق اقتباس', 'نهاية اقتباس'],
      'open-paren': ['افتح قوس'],
      'close-paren': ['أغلق قوس'],
      'new-line': ['سطر جديد'],
      'new-paragraph': ['فقرة جديدة', 'فقره جديده'],
    },
    symbols: {
      comma: '،',
      'question-mark': '؟',
      semicolon: '؛',
    },
  },
  he: {
    phrases: {
      period: ['נקודה'],
      comma: ['פסיק'],
      'question-mark': ['סימן שאלה'],
      'exclamation-mark': ['סימן קריאה'],
      colon: ['נקודתיים'],
      semicolon: ['נקודה פסיק'],
      dash: ['מקף ארוך', 'קו מפריד'],
      hyphen: ['מקף'],
      ellipsis: ['שלוש נקודות'],
      'open-quote': ['פתח מרכאות'],
      'close-quote': ['סגור מרכאות'],
      'open-paren': ['פתח סוגריים'],
      'close-paren': ['סגור סוגריים'],
      'new-line': ['שורה חדשה'],
      'new-paragraph': ['פסקה חדשה'],
    },
  },
  fa: {
    phrases: {
      period: ['نقطه'],
      comma: ['ویرگول', 'کاما'],
      'question-mark': ['علامت سوال', 'علامت سؤال'],
      'exclamation-mark': ['علامت تعجب'],
      colon: ['دو نقطه'],
      semicolon: ['نقطه ویرگول'],
      dash: ['خط تیره'],
      hyphen: ['خط فاصله'],
      ellipsis: ['سه نقطه'],
      'open-quote': ['گیومه باز'],
      'close-quote': ['گیومه بسته'],
      'open-paren': ['پرانتز باز'],
      'close-paren': ['پرانتز بسته'],
      'new-line': ['خط جدید', 'سطر جدید'],
      'new-paragraph': ['پاراگراف جدید'],
    },
    symbols: {
      comma: '،',
      'question-mark': '؟',
      semicolon: '؛',
    },
  },
  ur: {
    phrases: {
      period: ['ختمہ', 'فل اسٹاپ'],
      comma: ['سکتہ', 'کوما'],
      'question-mark': ['سوالیہ نشان'],
      'exclamation-mark': ['فجائیہ نشان'],
      colon: ['رابطہ'],
      semicolon: ['وقفہ'],
      dash: ['ڈیش'],
      hyphen: ['ہائفن'],
      ellipsis: ['تین نقطے'],
      'open-quote': ['واوین شروع'],
      'close-quote': ['واوین ختم'],
      'open-paren': ['قوسین شروع'],
      'close-paren': ['قوسین ختم'],
      'new-line': ['نئی سطر'],
      'new-paragraph': ['نیا پیراگراف'],
    },
    symbols: {
      period: '۔',
      comma: '،',
      'question-mark': '؟',
      semicolon: '؛',
    },
  },
  hi: {
    phrases: {
      period: ['पूर्ण विराम', 'फुल स्टॉप'],
      comma: ['अल्पविराम', 'कॉमा'],
      'question-mark': ['प्रश्नवाचक चिह्न', 'प्रश्न चिह्न'],
      'exclamation-mark': ['विस्मयादिबोधक चिह्न'],
      colon: ['अपूर्ण विराम'],
      semicolon: ['अर्धविराम'],
      dash: ['निर्देशक चिह्न', 'डैश'],
      hyphen: ['योजक चिह्न'],
      ellipsis: ['तीन बिंदु'],
      'open-quote': ['उद्धरण शुरू'],
      'close-quote': ['उद्धरण बंद'],
      'open-paren': ['कोष्ठक शुरू'],
      'close-paren': ['कोष्ठक बंद'],
      'new-line': ['नई पंक्ति', 'नई लाइन'],
      'new-paragraph': ['नया पैराग्राफ', 'नया अनुच्छेद'],
    },
    symbols: {
      period: '।',
    },
  },
  bn: {
    phrases: {
      period: ['দাঁড়ি', 'ফুল স্টপ'],
      comma: ['কমা'],
      'question-mark': ['প্রশ্নবোধক চিহ্ন'],
      'exclamation-mark': ['বিস্ময়সূচক চিহ্ন'],
      colon: ['কোলন'],
      semicolon: ['সেমিকোলন'],
      dash: ['ড্যাশ'],
      hyphen: ['হাইফেন'],
      ellipsis: ['তিন বিন্দু'],
      'open-quote': ['উদ্ধৃতি শুরু'],
      'close-quote': ['উদ্ধৃতি শেষ'],
      'open-paren': ['বন্ধনী শুরু'],
      'close-paren': ['বন্ধনী শেষ'],
      'new-line': ['নতুন লাইন'],
      'new-paragraph': ['নতুন অনুচ্ছেদ'],
    },
    symbols: {
      period: '।',
    },
  },
  ta: {
    phrases: {
      period: ['முற்றுப்புள்ளி'],
      comma: ['காற்புள்ளி'],
      'question-mark': ['கேள்விக்குறி'],
      'exclamation-mark': ['ஆச்சரியக்குறி'],
      colon: ['முக்காற்புள்ளி'],
      semicolon: ['அரைப்புள்ளி'],
      dash: ['நீள்க்கோடு'],
      hyphen: ['இணைப்புக்கோடு'],
      'new-line': ['புதிய வரி'],
      'new-paragraph': ['புதிய பத்தி'],
    },
  },
  zh: {
    spacelessScript: true,
    phrases: {
      period: ['句号', '句號'],
      comma: ['逗号', '逗號'],
      'question-mark': ['问号', '問號'],
      'exclamation-mark': ['感叹号', '感嘆號', '叹号'],
      colon: ['冒号', '冒號'],
      semicolon: ['分号', '分號'],
      dash: ['破折号', '破折號'],
      hyphen: ['连字符', '連字號'],
      ellipsis: ['省略号', '省略號'],
      'open-quote': ['左引号', '前引号', '開引號', '左引號'],
      'close-quote': ['右引号', '后引号', '關引號', '右引號'],
      'open-paren': ['左括号', '前括号', '左括號'],
      'close-paren': ['右括号', '后括号', '右括號'],
      'new-line': ['换行', '換行', '下一行'],
      'new-paragraph': ['新段落', '换段', '換段', '下一段'],
    },
    symbols: {
      period: '。',
      comma: '，',
      'question-mark': '？',
      'exclamation-mark': '！',
      colon: '：',
      semicolon: '；',
      dash: '——',
      ellipsis: '……',
      'open-quote': '“',
      'close-quote': '”',
      'open-paren': '（',
      'close-paren': '）',
    },
  },
  ja: {
    spacelessScript: true,
    phrases: {
      period: ['句点', 'まる'],
      comma: ['読点', 'てん'],
      'question-mark': ['はてな', 'クエスチョンマーク', '疑問符'],
      'exclamation-mark': ['びっくりマーク', 'エクスクラメーションマーク', '感嘆符'],
      colon: ['コロン'],
      semicolon: ['セミコロン'],
      dash: ['ダッシュ'],
      hyphen: ['ハイフン'],
      ellipsis: ['三点リーダー'],
      'open-quote': ['かぎかっこ開く', 'かぎかっこ'],
      'close-quote': ['かぎかっこ閉じる', 'かっこ閉じる'],
      'open-paren': ['かっこ開く', '丸かっこ開く'],
      'close-paren': ['丸かっこ閉じる', 'かっこ閉じ'],
      'new-line': ['改行', '次の行'],
      'new-paragraph': ['新しい段落', '段落変え'],
    },
    symbols: {
      period: '。',
      comma: '、',
      'question-mark': '？',
      'exclamation-mark': '！',
      colon: '：',
      semicolon: '；',
      ellipsis: '…',
      'open-quote': '「',
      'close-quote': '」',
      'open-paren': '（',
      'close-paren': '）',
    },
  },
  ko: {
    phrases: {
      period: ['마침표'],
      comma: ['쉼표'],
      'question-mark': ['물음표'],
      'exclamation-mark': ['느낌표'],
      colon: ['콜론', '쌍점'],
      semicolon: ['세미콜론'],
      dash: ['줄표', '대시'],
      hyphen: ['하이픈', '붙임표'],
      ellipsis: ['말줄임표'],
      'open-quote': ['따옴표 열기', '큰따옴표 열기'],
      'close-quote': ['따옴표 닫기', '큰따옴표 닫기'],
      'open-paren': ['괄호 열기'],
      'close-paren': ['괄호 닫기'],
      'new-line': ['줄바꿈', '다음 줄', '새 줄'],
      'new-paragraph': ['새 문단', '다음 문단', '문단 바꾸기'],
    },
  },
  sv: {
    phrases: {
      period: ['punkt'],
      comma: ['komma', 'kommatecken'],
      'question-mark': ['frågetecken'],
      'exclamation-mark': ['utropstecken'],
      colon: ['kolon'],
      semicolon: ['semikolon'],
      dash: ['tankstreck'],
      hyphen: ['bindestreck'],
      ellipsis: ['tre punkter'],
      'open-quote': ['öppna citattecken'],
      'close-quote': ['stäng citattecken'],
      'open-paren': ['öppna parentes'],
      'close-paren': ['stäng parentes'],
      'new-line': ['ny rad'],
      'new-paragraph': ['nytt stycke'],
    },
  },
  nb: {
    phrases: {
      period: ['punktum'],
      comma: ['komma'],
      'question-mark': ['spørsmålstegn'],
      'exclamation-mark': ['utropstegn'],
      colon: ['kolon'],
      semicolon: ['semikolon'],
      dash: ['tankestrek'],
      hyphen: ['bindestrek'],
      ellipsis: ['tre punktum'],
      'open-quote': ['åpne anførselstegn'],
      'close-quote': ['lukk anførselstegn'],
      'open-paren': ['åpne parentes'],
      'close-paren': ['lukk parentes'],
      'new-line': ['ny linje'],
      'new-paragraph': ['nytt avsnitt'],
    },
  },
  da: {
    phrases: {
      period: ['punktum'],
      comma: ['komma'],
      'question-mark': ['spørgsmålstegn'],
      'exclamation-mark': ['udråbstegn'],
      colon: ['kolon'],
      semicolon: ['semikolon'],
      dash: ['tankestreg'],
      hyphen: ['bindestreg'],
      ellipsis: ['tre punktummer'],
      'open-quote': ['åbn anførselstegn'],
      'close-quote': ['luk anførselstegn'],
      'open-paren': ['åbn parentes'],
      'close-paren': ['luk parentes'],
      'new-line': ['ny linje'],
      'new-paragraph': ['nyt afsnit'],
    },
  },
  fi: {
    phrases: {
      period: ['piste'],
      comma: ['pilkku'],
      'question-mark': ['kysymysmerkki'],
      'exclamation-mark': ['huutomerkki'],
      colon: ['kaksoispiste'],
      semicolon: ['puolipiste'],
      dash: ['ajatusviiva'],
      hyphen: ['yhdysviiva'],
      ellipsis: ['kolme pistettä'],
      'open-quote': ['lainausmerkki alku'],
      'close-quote': ['lainausmerkki loppu'],
      'open-paren': ['sulku auki'],
      'close-paren': ['sulku kiinni'],
      'new-line': ['uusi rivi'],
      'new-paragraph': ['uusi kappale'],
    },
  },
  cs: {
    phrases: {
      period: ['tečka'],
      comma: ['čárka'],
      'question-mark': ['otazník'],
      'exclamation-mark': ['vykřičník'],
      colon: ['dvojtečka'],
      semicolon: ['středník'],
      dash: ['pomlčka'],
      hyphen: ['spojovník'],
      ellipsis: ['tři tečky'],
      'open-quote': ['otevřít uvozovky'],
      'close-quote': ['zavřít uvozovky'],
      'open-paren': ['otevřít závorku'],
      'close-paren': ['zavřít závorku'],
      'new-line': ['nový řádek'],
      'new-paragraph': ['nový odstavec'],
    },
  },
  sk: {
    phrases: {
      period: ['bodka'],
      comma: ['čiarka'],
      'question-mark': ['otáznik'],
      'exclamation-mark': ['výkričník'],
      colon: ['dvojbodka'],
      semicolon: ['bodkočiarka'],
      dash: ['pomlčka'],
      hyphen: ['spojovník'],
      ellipsis: ['tri bodky'],
      'open-quote': ['otvoriť úvodzovky'],
      'close-quote': ['zavrieť úvodzovky'],
      'open-paren': ['otvoriť zátvorku'],
      'close-paren': ['zavrieť zátvorku'],
      'new-line': ['nový riadok'],
      'new-paragraph': ['nový odsek'],
    },
  },
  el: {
    phrases: {
      period: ['τελεία'],
      comma: ['κόμμα'],
      'question-mark': ['ερωτηματικό'],
      'exclamation-mark': ['θαυμαστικό'],
      colon: ['άνω κάτω τελεία'],
      semicolon: ['άνω τελεία'],
      dash: ['παύλα'],
      hyphen: ['ενωτικό'],
      ellipsis: ['αποσιωπητικά'],
      'open-quote': ['άνοιγμα εισαγωγικών'],
      'close-quote': ['κλείσιμο εισαγωγικών'],
      'open-paren': ['άνοιγμα παρένθεσης'],
      'close-paren': ['κλείσιμο παρένθεσης'],
      'new-line': ['νέα γραμμή'],
      'new-paragraph': ['νέα παράγραφος'],
    },
  },
  hu: {
    phrases: {
      period: ['pont'],
      comma: ['vessző'],
      'question-mark': ['kérdőjel'],
      'exclamation-mark': ['felkiáltójel'],
      colon: ['kettőspont'],
      semicolon: ['pontosvessző'],
      dash: ['gondolatjel'],
      hyphen: ['kötőjel'],
      ellipsis: ['három pont'],
      'open-quote': ['idézőjel nyit'],
      'close-quote': ['idézőjel zár'],
      'open-paren': ['zárójel nyit'],
      'close-paren': ['zárójel zár'],
      'new-line': ['új sor'],
      'new-paragraph': ['új bekezdés'],
    },
  },
  ro: {
    phrases: {
      period: ['punct'],
      comma: ['virgulă'],
      'question-mark': ['semnul întrebării'],
      'exclamation-mark': ['semnul exclamării'],
      colon: ['două puncte'],
      semicolon: ['punct și virgulă'],
      dash: ['linie de dialog', 'linie'],
      hyphen: ['cratimă'],
      ellipsis: ['puncte de suspensie'],
      'open-quote': ['deschide ghilimele'],
      'close-quote': ['închide ghilimele'],
      'open-paren': ['deschide paranteza'],
      'close-paren': ['închide paranteza'],
      'new-line': ['linie nouă'],
      'new-paragraph': ['paragraf nou'],
    },
  },
  bg: {
    phrases: {
      period: ['точка'],
      comma: ['запетая'],
      'question-mark': ['въпросителен знак'],
      'exclamation-mark': ['удивителен знак'],
      colon: ['двоеточие'],
      semicolon: ['точка и запетая'],
      dash: ['тире'],
      hyphen: ['дефис'],
      ellipsis: ['многоточие'],
      'open-quote': ['отвори кавички'],
      'close-quote': ['затвори кавички'],
      'open-paren': ['отвори скоба'],
      'close-paren': ['затвори скоба'],
      'new-line': ['нов ред'],
      'new-paragraph': ['нов абзац'],
    },
  },
  hr: {
    phrases: {
      period: ['točka'],
      comma: ['zarez'],
      'question-mark': ['upitnik'],
      'exclamation-mark': ['uskličnik'],
      colon: ['dvotočka'],
      semicolon: ['točka zarez'],
      dash: ['crtica'],
      hyphen: ['spojnica'],
      ellipsis: ['trotočje'],
      'open-quote': ['otvori navodnike'],
      'close-quote': ['zatvori navodnike'],
      'open-paren': ['otvori zagradu'],
      'close-paren': ['zatvori zagradu'],
      'new-line': ['novi red'],
      'new-paragraph': ['novi odlomak'],
    },
  },
  sr: {
    phrases: {
      period: ['тачка'],
      comma: ['зарез'],
      'question-mark': ['упитник'],
      'exclamation-mark': ['узвичник'],
      colon: ['двотачка'],
      semicolon: ['тачка зарез'],
      dash: ['црта'],
      hyphen: ['цртица'],
      ellipsis: ['три тачке'],
      'new-line': ['нови ред'],
      'new-paragraph': ['нови пасус'],
    },
  },
  ca: {
    phrases: {
      period: ['punt'],
      comma: ['coma'],
      'question-mark': ["signe d'interrogació"],
      'exclamation-mark': ["signe d'exclamació"],
      colon: ['dos punts'],
      semicolon: ['punt i coma'],
      dash: ['guió llarg'],
      hyphen: ['guionet'],
      ellipsis: ['punts suspensius'],
      'open-quote': ['obrir cometes'],
      'close-quote': ['tancar cometes'],
      'open-paren': ['obrir parèntesi'],
      'close-paren': ['tancar parèntesi'],
      'new-line': ['nova línia'],
      'new-paragraph': ['nou paràgraf'],
    },
  },
  vi: {
    phrases: {
      period: ['chấm'],
      comma: ['phẩy'],
      'question-mark': ['chấm hỏi', 'dấu hỏi'],
      'exclamation-mark': ['chấm than', 'dấu chấm than'],
      colon: ['hai chấm'],
      semicolon: ['chấm phẩy'],
      dash: ['gạch ngang'],
      hyphen: ['gạch nối'],
      ellipsis: ['ba chấm'],
      'open-quote': ['mở ngoặc kép'],
      'close-quote': ['đóng ngoặc kép'],
      'open-paren': ['mở ngoặc đơn', 'mở ngoặc'],
      'close-paren': ['đóng ngoặc đơn', 'đóng ngoặc'],
      'new-line': ['xuống dòng'],
      'new-paragraph': ['đoạn mới', 'xuống đoạn'],
    },
  },
  th: {
    spacelessScript: true,
    phrases: {
      period: ['จุด'],
      comma: ['จุลภาค', 'คอมม่า'],
      'question-mark': ['เครื่องหมายคำถาม'],
      'exclamation-mark': ['เครื่องหมายตกใจ', 'อัศเจรีย์'],
      colon: ['ทวิภาค', 'โคลอน'],
      semicolon: ['อัฒภาค'],
      dash: ['ขีดยาว'],
      hyphen: ['ยัติภังค์'],
      'open-quote': ['เปิดอัญประกาศ'],
      'close-quote': ['ปิดอัญประกาศ'],
      'open-paren': ['เปิดวงเล็บ'],
      'close-paren': ['ปิดวงเล็บ'],
      'new-line': ['ขึ้นบรรทัดใหม่'],
      'new-paragraph': ['ขึ้นย่อหน้าใหม่'],
    },
  },
  id: {
    phrases: {
      period: ['titik'],
      comma: ['koma'],
      'question-mark': ['tanda tanya'],
      'exclamation-mark': ['tanda seru'],
      colon: ['titik dua'],
      semicolon: ['titik koma'],
      dash: ['tanda pisah'],
      hyphen: ['tanda hubung'],
      ellipsis: ['titik tiga'],
      'open-quote': ['buka kutip', 'tanda kutip buka'],
      'close-quote': ['tutup kutip', 'tanda kutip tutup'],
      'open-paren': ['buka kurung'],
      'close-paren': ['tutup kurung'],
      'new-line': ['baris baru'],
      'new-paragraph': ['paragraf baru'],
    },
  },
  ms: {
    phrases: {
      period: ['noktah', 'titik'],
      comma: ['koma'],
      'question-mark': ['tanda soal'],
      'exclamation-mark': ['tanda seru'],
      colon: ['titik bertindih'],
      semicolon: ['koma bernoktah'],
      dash: ['tanda pisah'],
      hyphen: ['tanda sempang'],
      'open-quote': ['buka petikan'],
      'close-quote': ['tutup petikan'],
      'open-paren': ['buka kurungan'],
      'close-paren': ['tutup kurungan'],
      'new-line': ['baris baharu', 'baris baru'],
      'new-paragraph': ['perenggan baharu', 'perenggan baru'],
    },
  },
  fil: {
    phrases: {
      period: ['tuldok'],
      comma: ['kuwit'],
      'question-mark': ['tandang pananong'],
      'exclamation-mark': ['tandang padamdam'],
      colon: ['tutuldok'],
      semicolon: ['tuldok-kuwit'],
      dash: ['gatlang'],
      hyphen: ['gitling'],
      'new-line': ['bagong linya'],
      'new-paragraph': ['bagong talata'],
    },
  },
  sw: {
    phrases: {
      period: ['nukta', 'kituo'],
      comma: ['mkato'],
      'question-mark': ['alama ya swali'],
      'exclamation-mark': ['alama ya mshangao'],
      colon: ['nukta pacha'],
      semicolon: ['nukta mkato'],
      dash: ['kistari kirefu'],
      hyphen: ['kistari'],
      'new-line': ['mstari mpya'],
      'new-paragraph': ['aya mpya'],
    },
  },
  af: {
    phrases: {
      period: ['punt'],
      comma: ['komma'],
      'question-mark': ['vraagteken'],
      'exclamation-mark': ['uitroepteken'],
      colon: ['dubbelpunt'],
      semicolon: ['kommapunt'],
      dash: ['aandagstreep'],
      hyphen: ['koppelteken'],
      'open-paren': ['hakie oop'],
      'close-paren': ['hakie toe'],
      'new-line': ['nuwe reël'],
      'new-paragraph': ['nuwe paragraaf'],
    },
  },
};

function escapeRegExp(literal: string): string {
  return literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildPhraseRegex(phrase: string, spaceless: boolean): RegExp {
  const escaped = escapeRegExp(phrase).replace(/\s+/g, '\\s+');
  if (spaceless) {
    return new RegExp(escaped, 'giu');
  }
  return new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, 'giu');
}

interface CompiledLanguageRules {
  rules: Array<{ pattern: RegExp; token: string }>;
  tokenOutput: Record<string, string>;
  spacelessScript: boolean;
  hasNativePack: boolean;
}

const COMPILED_CACHE = new Map<string, CompiledLanguageRules>();

function getCompiledRules(baseLang: string): CompiledLanguageRules {
  const cached = COMPILED_CACHE.get(baseLang);
  if (cached) return cached;

  const nativePack = NATIVE_PACKS[baseLang];
  const hasNativePack = Boolean(nativePack);
  const spacelessScript = Boolean(nativePack?.spacelessScript);

  const tokenOutput: Record<string, string> = {};
  for (const meta of COMMAND_ORDER) {
    tokenOutput[meta.token] = nativePack?.symbols?.[meta.id] ?? meta.defaultSymbol;
  }

  // Collect all candidate rules: native phrases + English fallback phrases
  const rawEntries: Array<{
    phrase: string;
    token: string;
    spaceless: boolean;
    priority: number;
  }> = [];

  for (const meta of COMMAND_ORDER) {
    const nativeList = nativePack?.phrases[meta.id] ?? [];
    for (const phrase of nativeList) {
      rawEntries.push({
        phrase,
        token: meta.token,
        spaceless: spacelessScript,
        priority: 2,
      });
    }

    if (baseLang !== 'en') {
      for (const fallbackPhrase of ENGLISH_PHRASES[meta.id]) {
        rawEntries.push({
          phrase: fallbackPhrase,
          token: meta.token,
          spaceless: false,
          priority: 1,
        });
      }
    }
  }

  // Sort longest phrase first (then native over English fallback)
  rawEntries.sort((a, b) => {
    if (b.phrase.length !== a.phrase.length) {
      return b.phrase.length - a.phrase.length;
    }
    return b.priority - a.priority;
  });

  const seen = new Set<string>();
  const rules: Array<{ pattern: RegExp; token: string }> = [];
  for (const entry of rawEntries) {
    const key = `${entry.phrase.toLowerCase()}::${entry.spaceless ? '1' : '0'}`;
    if (seen.has(key)) continue;
    seen.add(key);
    rules.push({
      pattern: buildPhraseRegex(entry.phrase, entry.spaceless),
      token: entry.token,
    });
  }

  const compiled: CompiledLanguageRules = {
    rules,
    tokenOutput,
    spacelessScript,
    hasNativePack,
  };
  COMPILED_CACHE.set(baseLang, compiled);
  return compiled;
}

export function hasNativePunctuationPack(languageCode: string): boolean {
  const { baseLang } = getLanguageOption(languageCode);
  return Boolean(NATIVE_PACKS[baseLang]);
}

export function getPunctuationCommandsForLanguage(languageCode: string): {
  hasNativePack: boolean;
  languageLabel: string;
  commands: LocalizedPunctuationCommand[];
} {
  const option = getLanguageOption(languageCode);
  const nativePack = NATIVE_PACKS[option.baseLang];
  const hasNativePack = Boolean(nativePack);

  const commands: LocalizedPunctuationCommand[] = COMMAND_ORDER.map((meta) => {
    const nativeList = nativePack?.phrases[meta.id];
    const isFallbackEnglish = !nativeList || nativeList.length === 0;
    const spokenExamples = isFallbackEnglish
      ? ENGLISH_PHRASES[meta.id]
      : nativeList;

    const localizedSymbol =
      nativePack?.symbols?.[meta.id] ?? meta.defaultSymbol;

    let symbolLabel = meta.defaultSymbolLabel;
    if (nativePack?.symbols?.[meta.id]) {
      if (meta.id === 'open-quote') {
        symbolLabel = `${localizedSymbol}...`;
      } else if (meta.id === 'close-quote') {
        symbolLabel = `...${localizedSymbol}`;
      } else {
        symbolLabel = localizedSymbol;
      }
    }

    let insertText = meta.defaultInsertText;
    if (nativePack?.symbols?.[meta.id]) {
      if (meta.id === 'dash') {
        insertText = nativePack.spacelessScript
          ? localizedSymbol
          : ` ${localizedSymbol} `;
      } else {
        insertText = localizedSymbol;
      }
    }

    return {
      id: meta.id,
      englishLabel: meta.englishLabel,
      nativePhrase: spokenExamples[0],
      spokenExamples,
      symbolLabel,
      insertText,
      isFallbackEnglish,
    };
  });

  return {
    hasNativePack,
    languageLabel: option.label,
    commands,
  };
}

export function getHintExamplesForLanguage(languageCode: string): string[] {
  const { commands } = getPunctuationCommandsForLanguage(languageCode);
  const targetIds: PunctuationCommandId[] = [
    'period',
    'comma',
    'question-mark',
    'new-paragraph',
  ];
  return targetIds
    .map((id) => commands.find((c) => c.id === id)?.nativePhrase)
    .filter((phrase): phrase is string => Boolean(phrase));
}

const LEFT_ATTACH_TOKENS =
  '\\[\\[P_(?:PERIOD|COMMA|QMARK|EMARK|COLON|SEMI|ELLIPSIS|CLOSE_QUOTE|CLOSE_PAREN)\\]\\]';
const RIGHT_ATTACH_TOKENS = '\\[\\[P_(?:OPEN_QUOTE|OPEN_PAREN)\\]\\]';
const BREAK_TOKENS = '\\[\\[P_(?:PARA|LINE)\\]\\]';

function shouldCapitalizeAfter(existingText: string): boolean {
  if (!existingText || existingText.trim().length === 0) return true;
  if (/\n[ \t]*$/.test(existingText)) return true;
  if (/[.!?。！？।۔]["'”」)\]]*[ \t]*$/.test(existingText)) return true;
  return false;
}

function applyCapitalization(
  text: string,
  capitalizeStart: boolean,
  baseLang: string
): string {
  let result = text;

  if (capitalizeStart) {
    result = result.replace(
      /^([ \t\n"'“「(\[]*)(\p{Ll})/u,
      (_, prefix: string, letter: string) => `${prefix}${letter.toUpperCase()}`
    );
  }

  result = result.replace(
    /([.!?]["')\]]*[ \t]+|\n[ \t]*)([("'“]*)(\p{Ll})/gu,
    (_, boundary: string, opener: string, letter: string) =>
      `${boundary}${opener}${letter.toUpperCase()}`
  );

  if (baseLang === 'en') {
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
  const languageCode = options?.language ?? 'en-US';

  const trimmed = rawText.trim();
  if (!trimmed) return '';
  if (!enabled) return trimmed;

  const langOption = getLanguageOption(languageCode);
  const compiled = getCompiledRules(langOption.baseLang);

  // Normalize typographic curly apostrophes emitted by Chrome/Safari (e.g. "point d’interrogation")
  let text = trimmed.replace(/[\u2018\u2019\u02BC`]/g, "'");

  // Italian compound phrase: "punto e a capo" -> period + newline
  if (langOption.baseLang === 'it') {
    text = text.replace(
      /(?<![\p{L}\p{N}])punto\s+(?:e\s+)?a\s+capo(?![\p{L}\p{N}])/giu,
      '[[P_PERIOD]][[P_LINE]]'
    );
  }

  for (const rule of compiled.rules) {
    text = text.replace(rule.pattern, rule.token);
  }

  // Clean horizontal spaces around break tokens
  text = text.replace(new RegExp(`[ \\t]*(${BREAK_TOKENS})[ \\t]*`, 'g'), '$1');

  // Remove spaces before left-attaching punctuation tokens
  text = text.replace(new RegExp(`[ \\t]+(${LEFT_ATTACH_TOKENS})`, 'g'), '$1');

  if (compiled.spacelessScript) {
    // Full-width / CJK scripts do not insert ASCII spaces after punctuation
    text = text.replace(
      new RegExp(`(${LEFT_ATTACH_TOKENS})[ \\t]+`, 'g'),
      '$1'
    );
    text = text.replace(
      new RegExp(`[ \\t]+(${RIGHT_ATTACH_TOKENS})`, 'g'),
      '$1'
    );
    text = text.replace(
      new RegExp(`(${RIGHT_ATTACH_TOKENS})[ \\t]+`, 'g'),
      '$1'
    );
    text = text.replace(/[ \t]*\[\[P_DASH\]\][ \t]*/g, '[[P_DASH]]');
  } else {
    // Ensure single space after left-attaching punctuation when followed by word or opener
    text = text.replace(
      new RegExp(
        `(${LEFT_ATTACH_TOKENS})(?![ \\t\\n]|${LEFT_ATTACH_TOKENS}|${BREAK_TOKENS}|\\[\\[P_HYPHEN\\]\\])`,
        'g'
      ),
      '$1 '
    );
    // Remove spaces right after opening quotes / parentheses
    text = text.replace(
      new RegExp(`(${RIGHT_ATTACH_TOKENS})[ \\t]+`, 'g'),
      '$1'
    );
    // Space em-dashes cleanly on both sides
    text = text.replace(/[ \t]*\[\[P_DASH\]\][ \t]*/g, ' [[P_DASH]] ');
  }

  // Tightly attach hyphens on both sides
  text = text.replace(/[ \t]*\[\[P_HYPHEN\]\][ \t]*/g, '[[P_HYPHEN]]');

  // Replace sentinel tokens with localized symbols
  text = text.replace(
    /\[\[P_[A-Z_]+\]\]/g,
    (match) => compiled.tokenOutput[match] ?? match
  );

  // Collapse repeated horizontal spaces without disturbing newlines
  text = text.replace(/[ \t]{2,}/g, ' ');
  text = text.replace(/[ \t]+\n/g, '\n');
  text = text.replace(/\n[ \t]+/g, '\n');

  // Collapse accidental double period (not ellipsis)
  text = text.replace(/(?<!\.)\.{2}(?!\.)/g, '.');
  text = text.replace(/。。+/g, '。');

  return applyCapitalization(
    text,
    shouldCapitalizeAfter(existingText),
    langOption.baseLang
  );
}

const ATTACHING_START_PATTERN = /^[.,?!:;)\-。、，？！：；）」）،؟؛।۔]/;
const NO_SPACE_AFTER_END_PATTERN = /[\s\n(\-「（“。、，？！：；]$/;

export function appendDictationChunk(
  existingText: string,
  chunk: string
): string {
  if (!chunk) return existingText;

  if (!existingText) {
    return chunk.replace(/^[ \t]+/, '');
  }

  if (chunk.startsWith('\n')) {
    return `${existingText.replace(/[ \t]+$/, '')}${chunk}`;
  }

  if (ATTACHING_START_PATTERN.test(chunk)) {
    const cleanExisting = existingText.replace(/[ \t]+$/, '');
    if (
      cleanExisting.endsWith('.') &&
      !cleanExisting.endsWith('...') &&
      chunk.startsWith('.') &&
      !chunk.startsWith('...')
    ) {
      return `${cleanExisting}${chunk.slice(1)}`;
    }
    if (cleanExisting.endsWith('。') && chunk.startsWith('。')) {
      return `${cleanExisting}${chunk.slice(1)}`;
    }
    return `${cleanExisting}${chunk}`;
  }

  if (NO_SPACE_AFTER_END_PATTERN.test(existingText)) {
    return `${existingText}${chunk.replace(/^[ \t]+/, '')}`;
  }

  if (/^[ \t]/.test(chunk)) {
    return `${existingText.replace(/[ \t]+$/, '')}${chunk}`;
  }

  // Avoid inserting ASCII spaces between contiguous CJK characters
  const lastChar = existingText.slice(-1);
  const firstChar = chunk.slice(0, 1);
  if (/[\u3040-\u30ff\u3400-\u9fff]/.test(lastChar) && /[\u3040-\u30ff\u3400-\u9fff]/.test(firstChar)) {
    return `${existingText}${chunk}`;
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
