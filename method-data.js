// ============================================================
// Flowence Grid Method™ — method-data.js
// Fonte única de verdade: filosofia, níveis CEFR, temas, gramática,
// estrutura de aula, missões. Tudo lido pelas páginas metodo.html
// e nivel.html.
// ============================================================

window.METHOD_DATA = {

  // ---------- VISÃO GERAL ----------
  overview: {
    title: 'Flowence Grid Method™',
    subtitle: 'Sistema de Progressão CEFR para Fluência Real',
    philosophy: 'O aluno aprende MAIS quando fala muito, escuta inglês real, repete naturalmente, erra sem medo, usa contexto emocional e trabalha situações reais.',
    formula: 'Exposição + Repetição + Uso Real = Fluência',
    pillars: [
      'Fluência prática',
      'Comunicação real',
      'Confiança',
      'Naturalidade',
      'Retenção de longo prazo'
    ],
    tools: [
      'Repetição inteligente',
      'Speaking constante',
      'Listening contextual',
      'Micro fluência',
      'Missões semanais',
      'Progressão CEFR'
    ],
    idealStructure: [
      { label: 'Comunicação', value: 40, color: 'purple' },
      { label: 'Listening',    value: 30, color: 'teal'   },
      { label: 'Reading',      value: 20, color: 'blue'   },
      { label: 'Gramática',    value: 10, color: 'orange' }
    ],
    goldenRule: {
      student: 70,
      teacher: 30,
      label: 'Aluno falando / Professor guiando'
    },
    results: [
      'Repetição', 'Speaking', 'Listening',
      'Correção leve', 'Contexto', 'Emoção', 'Produção final'
    ]
  },

  // ---------- ESTRUTURA DE AULA ----------
  lessonStructure: {
    duration: '1 hora',
    stages: [
      { icon: '🔥', name: 'Warm-up',           time: '5 min',  goal: '3–5 perguntas rápidas, 1 mini conversa, 2 follow-ups' },
      { icon: '📘', name: 'Review',            time: '10 min', goal: '5 palavras antigas, 2 expressões, 5 perguntas, mini speaking' },
      { icon: '📝', name: 'New Vocabulary',    time: '10 min', goal: '5–15 palavras/expressões por nível' },
      { icon: '🎧', name: 'Listening',         time: '15 min', goal: 'Áudio contextual + 3x (geral, detalhes, shadowing)' },
      { icon: '💬', name: 'Speaking Activity', time: '20 min', goal: 'Diálogos, roleplay, debate, storytelling' },
      { icon: '🧩', name: 'Grammar Focus',     time: '10 min', goal: '1 estrutura contextual com prática' },
      { icon: '🎯', name: 'Final Production',  time: '5 min',  goal: 'Resumo oral, mini missão, produção espontânea' }
    ],
    quantitiesByLevel: {
      A1: { vocab: '5 palavras, 2 frases',            audio: '30s–1min', listeningQs: 3, speaking: '5 perguntas + 1 mini diálogo' },
      A2: { vocab: '6–8 palavras, 3 expressões',      audio: '1–2 min',  listeningQs: 4, speaking: '5–7 perguntas + 1 roleplay' },
      B1: { vocab: '8–10 palavras, 4 chunks',         audio: '2–4 min',  listeningQs: 5, speaking: '1 storytelling, 1 debate leve, 7–10 perguntas' },
      B2: { vocab: '10–15 expressões',                audio: '4–6 min',  listeningQs: 6, speaking: '1 discussão complexa, 1 argumentação' },
      C1: { vocab: '15+ expressões idiomáticas',      audio: '6+ min',   listeningQs: 8, speaking: 'Apresentações, debate profundo' }
    }
  },

  // ---------- NÍVEIS CEFR ----------
  levels: {
    A1: {
      code: 'A1',
      name: 'Beginner',
      label: 'Sobrevivência',
      color: 'green',
      badgeClass: 'a1',
      objective: 'O aluno inicia contato com o idioma e aprende sobrevivência básica em inglês.',
      learnsTo: [
        'Se apresentar',
        'Responder perguntas simples',
        'Falar informações pessoais',
        'Formar frases curtas',
        'Ganhar confiança'
      ],
      structure: [
        { label: 'Comunicação', value: 40 },
        { label: 'Listening',   value: 30 },
        { label: 'Reading',     value: 20 },
        { label: 'Gramática',   value: 10 }
      ],
      themes: [
        { month:  1, name: 'Greetings and Introductions' },
        { month:  2, name: 'Numbers and Personal Information' },
        { month:  3, name: 'Family' },
        { month:  4, name: 'Daily Routine' },
        { month:  5, name: 'Food and Drinks' },
        { month:  6, name: 'House and Furniture' },
        { month:  7, name: 'Jobs' },
        { month:  8, name: 'Free Time' },
        { month:  9, name: 'Transportation' },
        { month: 10, name: 'Clothes' },
        { month: 11, name: 'Weather' },
        { month: 12, name: 'Shopping' }
      ],
      grammar: [
        'Verb to be', 'Subject pronouns', 'Possessive adjectives',
        'Simple Present', 'There is / There are', 'Can / Can\'t',
        'Prepositions', 'Articles', 'Plural nouns', 'Basic questions'
      ],
      whatWorks: [
        'Flashcards', 'Repetição', 'Diálogos curtos',
        'Listening lento e claro (30s a 1min)',
        'Perguntas simples', 'Jogos', 'Roleplay', 'Imagens', 'Frases prontas'
      ],
      audioDuration: '30 segundos a 1 minuto',
      averageTime: '4 a 8 meses (1 aula/semana)',
      missions: ['Introduce yourself', 'Order food', 'Describe your family'],
      coreExpressions: ['How are you?', 'Nice to meet you.', "I'm from Brazil."]
    },

    A2: {
      code: 'A2',
      name: 'Elementary',
      label: 'Autonomia básica',
      color: 'blue',
      badgeClass: 'a2',
      objective: 'O aluno começa a sobreviver sozinho em inglês e desenvolver autonomia.',
      learnsTo: [
        'Conversar sobre rotina',
        'Fazer perguntas',
        'Contar experiências',
        'Falar sobre passado',
        'Compreender situações simples'
      ],
      structure: [
        { label: 'Comunicação', value: 40 },
        { label: 'Listening',   value: 30 },
        { label: 'Reading',     value: 20 },
        { label: 'Gramática',   value: 10 }
      ],
      themes: [
        { month:  1, name: 'Daily Life' },
        { month:  2, name: 'Past Experiences' },
        { month:  3, name: 'Travel' },
        { month:  4, name: 'Health' },
        { month:  5, name: 'Restaurants' },
        { month:  6, name: 'Technology' },
        { month:  7, name: 'School and Work' },
        { month:  8, name: 'Entertainment' },
        { month:  9, name: 'Directions and Places' },
        { month: 10, name: 'Shopping Problems' },
        { month: 11, name: 'Future Plans' },
        { month: 12, name: 'Culture' }
      ],
      grammar: [
        'Simple Past', 'Future with going to', 'Comparatives', 'Superlatives',
        'Adverbs of frequency', 'Countable and uncountable nouns',
        'Some / Any', 'Present Continuous', 'Basic modal verbs', 'Question forms'
      ],
      whatWorks: [
        'Storytelling simples', 'Conversas guiadas', 'Mini debates',
        'Vídeos curtos (1–2 min)', 'Listening contextual',
        'Situações reais', 'Perguntas abertas'
      ],
      audioDuration: '1 a 2 minutos',
      averageTime: '6 a 10 meses (1 aula/semana)',
      missions: ['Tell a past story', 'Solve a hotel problem', 'Describe experiences'],
      coreExpressions: ['I used to…', "I'm planning to…", 'What do you think about…?']
    },

    B1: {
      code: 'B1',
      name: 'Intermediate',
      label: 'Comunicação real',
      color: 'purple',
      badgeClass: 'b1',
      objective: 'O aluno começa a realmente pensar em inglês e sustentar comunicação real.',
      learnsTo: [
        'Defender opiniões',
        'Conversar naturalmente',
        'Explicar ideias',
        'Contar histórias',
        'Resolver problemas em inglês'
      ],
      structure: [
        { label: 'Comunicação', value: 40 },
        { label: 'Listening',   value: 30 },
        { label: 'Reading',     value: 20 },
        { label: 'Gramática',   value: 10 }
      ],
      themes: [
        { month:  1, name: 'Travel' },
        { month:  2, name: 'Technology' },
        { month:  3, name: 'Health' },
        { month:  4, name: 'Movies' },
        { month:  5, name: 'Work and Career' },
        { month:  6, name: 'Relationships' },
        { month:  7, name: 'Environment' },
        { month:  8, name: 'Social Media' },
        { month:  9, name: 'Education' },
        { month: 10, name: 'Crime and Safety' },
        { month: 11, name: 'Culture' },
        { month: 12, name: 'Future Plans' }
      ],
      grammar: [
        'Present Perfect', 'Present Perfect vs Past Simple', 'Past Continuous',
        'Future forms', 'First Conditional', 'Second Conditional (intro)',
        'Passive Voice (básico)', 'Relative Clauses',
        'Reported Speech (intro)', 'Modal verbs', 'Gerunds and infinitives'
      ],
      whatWorks: [
        'Repetição constante', 'Speaking acima de gramática',
        'Listening real (2–4 min)', 'Chunks naturais', 'Storytelling',
        'Conversação guiada', 'Debates leves', 'Situações reais'
      ],
      audioDuration: '2 a 4 minutos',
      averageTime: '8 a 12 meses (1 aula/semana)',
      missions: ['Debate opinions', 'Give advice', 'Explain problems'],
      coreExpressions: ['In my opinion…', 'One of the biggest problems is…', 'I totally agree with…'],
      monthlyLessons: [
        {
          title: 'Aula 1 — Introdução + Comunicação',
          communication: ['Talking about past trips', 'Asking travel questions', 'Describing experiences', 'Pair conversation'],
          listening: ['Vídeo curto sobre viagens', 'Podcast simples (1-2 min)', 'Perguntas de compreensão'],
          reading: '"Top 5 places to visit in Brazil"',
          grammar: 'Past Simple vs Present Perfect'
        },
        {
          title: 'Aula 2 — Problemas e Situações Reais',
          communication: ['Lost luggage', 'Airport problems', 'Hotel situations', 'Roleplay'],
          listening: ['Conversa em aeroporto (1-2 min)', 'Expressões comuns'],
          reading: 'Hotel review, Flight information',
          grammar: 'should / could / must'
        },
        {
          title: 'Aula 3 — Opiniões e Debate',
          communication: ['Is traveling expensive?', 'Best country to visit?', 'Agreeing and disagreeing'],
          listening: ['Entrevista simples (2-3 min)', 'Opiniões sobre viagens'],
          reading: '"Why people should travel more"',
          grammar: 'Comparatives and superlatives'
        },
        {
          title: 'Aula 4 — Produção e Fluência',
          communication: ['Presentation', 'Storytelling'],
          listening: ['Natural conversation (3-4 min)', 'Comprehension challenge'],
          reading: 'Social media travel posts',
          grammar: 'Correção de erros frequentes'
        }
      ]
    },

    B2: {
      code: 'B2',
      name: 'Upper Intermediate',
      label: 'Espontaneidade',
      color: 'orange',
      badgeClass: 'b2',
      objective: 'O aluno passa a usar inglês com espontaneidade e independência real.',
      learnsTo: [
        'Argumentar',
        'Debater',
        'Consumir inglês autêntico',
        'Produzir textos estruturados',
        'Melhorar naturalidade'
      ],
      structure: [
        { label: 'Comunicação', value: 40 },
        { label: 'Listening',   value: 30 },
        { label: 'Reading',     value: 20 },
        { label: 'Gramática refinada', value: 10 }
      ],
      themes: [
        { month:  1, name: 'Artificial Intelligence' },
        { month:  2, name: 'Social Media' },
        { month:  3, name: 'Business' },
        { month:  4, name: 'Psychology' },
        { month:  5, name: 'Environment' },
        { month:  6, name: 'Global Issues' },
        { month:  7, name: 'Technology and Ethics' },
        { month:  8, name: 'Movies and Culture' },
        { month:  9, name: 'Career Development' },
        { month: 10, name: 'Education' },
        { month: 11, name: 'Science' },
        { month: 12, name: 'Future Society' }
      ],
      grammar: [
        'Conditionals', 'Passive Voice', 'Reported Speech', 'Relative Clauses',
        'Advanced modal verbs', 'Present Perfect Continuous', 'Narrative tenses',
        'Linking words', 'Complex sentence structure', 'Discourse markers'
      ],
      whatWorks: [
        'Debates', 'TED Talks (4–6 min ou +)', 'Podcasts reais',
        'Notícias', 'Opiniões complexas', 'Discussões profundas',
        'Apresentações', 'Essays', 'Simulações profissionais'
      ],
      audioDuration: '4 a 6 minutos ou mais',
      averageTime: '10 meses a 2 anos (1 aula/semana)',
      missions: ['Present arguments', 'Discuss social topics', 'Simulate interviews'],
      coreExpressions: ['From my perspective…', "There's evidence that…", 'On the other hand…']
    },

    C1: {
      code: 'C1',
      name: 'Advanced',
      label: 'Naturalidade profissional',
      color: 'red',
      badgeClass: 'c1',
      objective: 'O aluno alcança naturalidade profissional, expressa nuances e domina inglês em contextos complexos.',
      learnsTo: [
        'Expressar nuances de significado',
        'Usar inglês em contextos profissionais',
        'Argumentar com sofisticação',
        'Compreender materiais nativos sem esforço',
        'Produzir textos complexos e estruturados'
      ],
      structure: [
        { label: 'Comunicação', value: 40 },
        { label: 'Listening',   value: 30 },
        { label: 'Reading',     value: 20 },
        { label: 'Gramática refinada', value: 10 }
      ],
      themes: [
        { month:  1, name: 'Leadership and Influence' },
        { month:  2, name: 'Critical Thinking' },
        { month:  3, name: 'Negotiation' },
        { month:  4, name: 'Innovation' },
        { month:  5, name: 'Philosophy and Ethics' },
        { month:  6, name: 'Geopolitics' },
        { month:  7, name: 'Economics' },
        { month:  8, name: 'Literature and Arts' },
        { month:  9, name: 'Public Speaking' },
        { month: 10, name: 'Cultural Nuances' },
        { month: 11, name: 'Academic Writing' },
        { month: 12, name: 'Future of Work' }
      ],
      grammar: [
        'Advanced conditionals', 'Inversion', 'Cleft sentences',
        'Subjunctive mood', 'Advanced passive forms', 'Nominalization',
        'Hedging language', 'Discourse markers avançados',
        'Idiomatic expressions', 'Register shifts'
      ],
      whatWorks: [
        'TED Talks completas', 'Podcasts nativos sem adaptação',
        'Debates estruturados', 'Análise de discurso',
        'Escrita acadêmica', 'Apresentações executivas',
        'Negociação simulada', 'Crítica literária'
      ],
      audioDuration: '6 minutos ou mais (nativo)',
      averageTime: '1 a 3 anos (1 aula/semana)',
      missions: ['Lead a meeting', 'Write a formal proposal', 'Debate complex topics'],
      coreExpressions: ['Be that as it may…', 'It stands to reason that…', 'I beg to differ on…']
    }
  },

  // ---------- ENGLISH ROUTINE (semana) ----------
  englishRoutine: {
    description: 'Rotina semanal do aluno fora da aula',
    items: [
      { icon: '📹', name: '1 vídeo curto',    detail: 'Com áudio, duração varia por nível' },
      { icon: '🎧', name: '1 listening',      detail: 'Com áudio adequado ao nível' },
      { icon: '✍️', name: '5 frases',         detail: 'Para repetição ativa' },
      { icon: '🔁', name: '1 shadowing',      detail: 'Com áudio modelo' },
      { icon: '📖', name: '1 mini reading',   detail: 'Texto adaptado ao nível' }
    ],
    shadowing: {
      steps: ['Escutar (áudio)', 'Repetir', 'Copiar ritmo', 'Copiar pronúncia'],
      benefits: ['Fluência', 'Listening', 'Pronúncia', 'Confiança']
    }
  },

  // ---------- SISTEMA DE REVISÃO ----------
  reviewSystem: {
    structure: [
      { when: 'Início da aula', what: 'Revisão rápida' },
      { when: 'Fim da aula',    what: 'Produção oral' },
      { when: 'Próxima aula',   what: 'Reciclagem' }
    ],
    formula: [
      '5 min revisão',
      '5 min perguntas',
      '5 min speaking livre'
    ]
  },

  // ---------- MICRO FLUÊNCIA ----------
  microFluency: {
    description: 'O aluno domina pequenas situações reais',
    situations: [
      'Pedir comida', 'Marcar horário', 'Reclamar',
      'Pedir ajuda', 'Resolver problemas'
    ]
  }
};
