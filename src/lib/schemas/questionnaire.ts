import { QuestionnaireResponses } from "./case";

export type QuestionType =
  | "text"
  | "textarea"
  | "currency"
  | "number"
  | "yes_no"
  | "multi_select"
  | "single_select";

export interface QuestionOption {
  id: string;
  label: string;
}

export interface QuestionConfig {
  id: keyof QuestionnaireResponses | string;
  index: number;
  type: QuestionType;
  question: string;
  subtext?: string;
  placeholder?: string;
  options?: QuestionOption[];
  // For yes_no questions, which field stores the follow-up text
  followUpField?: keyof QuestionnaireResponses;
  followUpPlaceholder?: string;
}

export const QUESTIONS: QuestionConfig[] = [
  {
    id: "name",
    index: 0,
    type: "text",
    question: "What is your name?",
    subtext: "First, middle, and last name",
    placeholder: "Miles Morales",
  },
  {
    id: "email",
    index: 1,
    type: "text",
    question: "What is your email?",
    subtext: "All information will be sent to this email",
    placeholder: "hello@yourname.com",
  },
  {
    id: "birthday",
    index: 2,
    type: "text",
    question: "What is your date of birth?",
    subtext: "Format in MM/DD/YYYY",
    placeholder: "04/15/1990",
  },
  {
    id: "address",
    index: 3,
    type: "text",
    question: "Where do you currently reside?",
    subtext: "Name of country",
    placeholder: "United States",
  },
  {
    id: "jobTitle",
    index: 4,
    type: "text",
    question: "What is your current job title and primary field?",
    subtext: "For example: Senior Software Engineer, Machine Learning",
    placeholder: "Job title, field of expertise",
  },
  {
    id: "compensation",
    index: 5,
    type: "currency",
    question: "What is your current total compensation (salary + equity + bonuses)?",
    subtext: "Annual amount in USD. This helps determine high remuneration eligibility.",
    placeholder: "150,000",
  },
  {
    id: "roleDescription",
    index: 6,
    type: "textarea",
    question: "Describe your role and impact at your current company in 2-3 sentences.",
    subtext: "Focus on what makes your contribution unique or significant.",
    placeholder: "I lead a team of engineers building...",
  },
  {
    id: "hasAwards",
    index: 7,
    type: "yes_no",
    question: "Have you received any awards, grants, or recognitions in your field?",
    subtext: "Include industry awards, academic honors, competitive grants, or recognition from professional bodies.",
    followUpField: "awardsDescription",
    followUpPlaceholder: "Describe your awards and recognitions...",
  },
  {
    id: "professionalActivities",
    index: 8,
    type: "multi_select",
    question: "Which of the following have you done professionally?",
    subtext: "Select all that apply",
    options: [
      { id: "published_papers", label: "Published research papers or scholarly articles" },
      { id: "patents", label: "Filed or received patents" },
      { id: "peer_review", label: "Peer reviewed work for journals or conferences" },
      { id: "judged_competitions", label: "Judged competitions or evaluated grants" },
      { id: "speaking", label: "Given talks at major conferences" },
      { id: "open_source", label: "Created widely-used open source projects" },
      { id: "founding_role", label: "Had a founding or executive role at a company" },
      { id: "none", label: "None of the above" },
    ],
  },
  {
    id: "hasMemberships",
    index: 9,
    type: "yes_no",
    question: "Are you a member of any professional organizations or associations?",
    subtext: "Include selective organizations that require demonstrated achievement for membership.",
    followUpField: "membershipsDescription",
    followUpPlaceholder: "List the organizations and your membership details...",
  },
  {
    id: "yearsExperience",
    index: 10,
    type: "number",
    question: "How many years of experience do you have in your field?",
    subtext: "Include all relevant professional experience",
    placeholder: "5",
  },
  {
    id: "hasMediaCoverage",
    index: 11,
    type: "yes_no",
    question: "Has your work been covered by media, press, or industry publications?",
    subtext: "This includes news articles, podcasts, or profiles in trade publications about you or your work.",
    followUpField: "mediaCoverageDescription",
    followUpPlaceholder: "Describe the media coverage...",
  },
  {
    id: "employerType",
    index: 12,
    type: "single_select",
    question: "Select the statement that best describes your current employer or most recent organization",
    options: [
      { id: "faang_tier", label: "FAANG-tier company (Google, Meta, Apple, Amazon, Netflix, Microsoft)" },
      { id: "well_funded_startup", label: "Well-funded startup (Series B+, YC-backed, or notable investors)" },
      { id: "major_corp", label: "Fortune 500 or major multinational company" },
      { id: "research_institution", label: "Top research institution or university" },
      { id: "own_company", label: "My own company (founder/co-founder)" },
      { id: "other", label: "Other" },
    ],
  },
  {
    id: "measurableImpact",
    index: 13,
    type: "textarea",
    question: "What measurable impact has your work had?",
    subtext: "Include metrics like revenue generated, users served, efficiency improvements, citations, etc.",
    placeholder: "Our system processes 10M requests daily, reducing costs by $2M annually...",
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;

export function getQuestionByIndex(index: number): QuestionConfig | undefined {
  return QUESTIONS.find((q) => q.index === index);
}

export function isQuestionAnswered(
  question: QuestionConfig,
  responses: QuestionnaireResponses
): boolean {
  const value = responses[question.id as keyof QuestionnaireResponses];

  switch (question.type) {
    case "text":
    case "textarea":
    case "currency":
      return typeof value === "string" && value.trim().length > 0;
    case "number":
      return typeof value === "number" && !isNaN(value);
    case "yes_no":
      return typeof value === "boolean";
    case "multi_select":
      return Array.isArray(value) && value.length > 0;
    case "single_select":
      return typeof value === "string" && value.length > 0;
    default:
      return false;
  }
}
