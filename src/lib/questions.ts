import { QuestionDef } from "@/types";

export const questions: QuestionDef[] = [
  {
    id: "q1",
    dbColumn: "q1_ip",
    title: "Intellectual Property Strategy",
    subtitle: "How should CAiSEY protect its core technology?",
    options: [
      { key: "patent", label: "Patent key innovations" },
      { key: "trade_secret", label: "Maintain as trade secrets" },
      { key: "open_source", label: "Open-source the platform" },
    ],
  },
  {
    id: "q2",
    dbColumn: "q2_funding",
    title: "Funding Strategy",
    subtitle:
      "CAiSEY has seed funding from Columbia and plenty of runway. When it\u2019s time to raise its next round, how should it fund growth?",
    options: [
      { key: "vc", label: "Raise venture capital" },
      {
        key: "non_vc",
        label:
          "Seek non-VC funding (grants, university backing, strategic investors)",
      },
      { key: "bootstrap", label: "Bootstrap (self-fund from revenue)" },
    ],
  },
  {
    id: "q3",
    dbColumn: "q3_partnership",
    title: "Partnership Strategy",
    subtitle:
      "If CAiSEY had to choose one primary strategic partner, who should it be?",
    options: [
      {
        key: "publisher",
        label: "A textbook/case publisher (e.g., HBP, Pearson)",
      },
      { key: "ai_lab", label: "An AI lab (e.g., OpenAI, Anthropic, Google)" },
      {
        key: "edtech",
        label: "A larger ed-tech platform (e.g., Coursera, Canvas)",
      },
      { key: "columbia", label: "Columbia University" },
    ],
  },
  {
    id: "q4",
    dbColumn: "q4_market",
    title: "Market Strategy",
    subtitle: "Which market should CAiSEY prioritize for expansion?",
    options: [
      { key: "bschools", label: "Business schools" },
      { key: "universities", label: "Universities broadly" },
      { key: "k12", label: "K-12 education" },
      { key: "corporate", label: "Corporate learning & development" },
    ],
  },
  {
    id: "q5",
    dbColumn: "q5_product",
    title: "Product Innovation Strategy",
    subtitle:
      "How should CAiSEY evolve its product within education?",
    options: [
      {
        key: "broad",
        label:
          "Go broad: expand beyond classroom pedagogy into new educational use cases (e.g., admissions prep, career coaching, academic advising)",
      },
      {
        key: "deep",
        label:
          "Go deep: add richer interaction modes to strengthen its current pedagogical use case (e.g., video avatars, interactive artifacts, visual simulations)",
      },
    ],
  },
];
