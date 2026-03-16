const LORE = {
  intro: {
    opening: [
      "Quando o mundo se afasta da luz,",
      "Deus levanta alguém",
      "para lembrar quem somos."
    ],
    voice: [
      "Elias…",
      "Eu o chamei.",
      "Não para destruir pessoas,",
      "mas para libertá-las."
    ]
  },
  areas: [
    { id: "village",   name: "Aldeia das Ruas Vazias",      color: 0x8B9E7A },
    { id: "desert",    name: "Deserto da Voz Quebrada",     color: 0xC4A46B },
    { id: "market",    name: "Mercado Silencioso",          color: 0x7A6B5A },
    { id: "city",      name: "Cidade das Portas Trancadas", color: 0x5A6B7A },
    { id: "sanctuary", name: "Santuário Abandonado",        color: 0x6B5A7A }
  ],
  bosses: [
    { id: "velar",      name: "Velar",      sin: "Medo",    area: "desert"    },
    { id: "remora",     name: "Remora",     sin: "Culpa",   area: "desert"    },
    { id: "abrasus",    name: "Abrasus",    sin: "Ira",     area: "market"    },
    { id: "vellum",     name: "Vellum",     sin: "Inveja",  area: "market"    },
    { id: "hollowhand", name: "Hollowhand", sin: "Avareza", area: "city"      },
    { id: "sussurro",   name: "Sussurro",   sin: "Luxúria", area: "city"      },
    { id: "altus",      name: "Altus",      sin: "Orgulho", area: "sanctuary" },
    { id: "the_first",  name: "O Primeiro", sin: "Pecado Original", area: "sanctuary" }
  ],
  loreHints: [
    "Ele observa.",
    "Alguém além do mundo cuida de Elias.",
    "Luz além da luz.",
    "O Criador sabe."
  ]
};
