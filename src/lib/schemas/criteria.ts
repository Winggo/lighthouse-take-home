export type FieldType = "text" | "textarea" | "date" | "url" | "urls" | "files";

export interface FieldConfig {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  hint?: string;
}

export interface CriteriaConfig {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  helpText: string;
  fields: FieldConfig[];
}

export const O1_CRITERIA: CriteriaConfig[] = [
  {
    id: "awards",
    name: "Awards",
    shortDescription: "Nationally/internationally recognized prizes",
    fullDescription:
      "Documentation of receipt of nationally or internationally recognized prizes or awards for excellence in your field.",
    helpText:
      "Think about industry awards, academic honors, competitive grants, or recognition from professional bodies. Examples: Best Paper Award, Innovation Prize, Fellowship grants.",
    fields: [
      {
        id: "award_name",
        label: "Award Name",
        type: "text",
        required: true,
        placeholder: "e.g., ACM Best Paper Award 2023",
      },
      {
        id: "awarding_organization",
        label: "Awarding Organization",
        type: "text",
        required: true,
        placeholder: "e.g., Association for Computing Machinery",
      },
      {
        id: "date_received",
        label: "Date Received",
        type: "date",
        required: true,
      },
      {
        id: "description",
        label: "Describe the award and its significance",
        type: "textarea",
        required: true,
        hint: "Explain what the award recognizes and why it's prestigious in your field.",
      },
      {
        id: "evidence_urls",
        label: "Evidence URLs",
        type: "urls",
        required: false,
        hint: "Links to press releases, announcements, or online articles about the award",
      },
      {
        id: "evidence_files",
        label: "Evidence Files",
        type: "files",
        required: false,
        hint: "Upload award certificates, letters, or other documentary evidence",
      },
    ],
  },
  {
    id: "membership",
    name: "Membership",
    shortDescription: "Membership in distinguished organizations",
    fullDescription:
      "Documentation of membership in associations that require outstanding achievements of their members, as judged by recognized experts.",
    helpText:
      "This includes selective professional associations, honor societies, or organizations with competitive admission. Examples: National Academy of Engineering, IEEE Senior Member, YCombinator.",
    fields: [
      {
        id: "organization_name",
        label: "Organization Name",
        type: "text",
        required: true,
        placeholder: "e.g., Y Combinator",
      },
      {
        id: "date_selected",
        label: "Date Selected/Admitted",
        type: "date",
        required: true,
      },
      {
        id: "selection_criteria",
        label: "Selection Criteria",
        type: "textarea",
        required: true,
        hint: "Describe what makes membership in this organization selective and prestigious.",
      },
      {
        id: "evidence_files",
        label: "Proof of Membership",
        type: "files",
        required: false,
        hint: "Upload membership certificates, acceptance letters, or organization profile pages",
      },
    ],
  },
  {
    id: "press",
    name: "Published Press",
    shortDescription: "Media coverage about your work",
    fullDescription:
      "Published material in professional or major trade publications or media about you, relating to your work in the field.",
    helpText:
      "This includes news articles, blog posts on major platforms, podcast features, or profiles in trade publications that discuss your work. The coverage should be about you, not just mentioning your company.",
    fields: [
      {
        id: "publication_name",
        label: "Publication/Media Outlet",
        type: "text",
        required: true,
        placeholder: "e.g., TechCrunch, Forbes, IEEE Spectrum",
      },
      {
        id: "article_title",
        label: "Article Title",
        type: "text",
        required: true,
      },
      {
        id: "publication_date",
        label: "Publication Date",
        type: "date",
        required: true,
      },
      {
        id: "summary",
        label: "Brief Summary",
        type: "textarea",
        required: true,
        hint: "Summarize what the article says about you and your work.",
      },
      {
        id: "article_urls",
        label: "Article URLs",
        type: "urls",
        required: true,
        hint: "Links to the published articles online",
      },
      {
        id: "article_files",
        label: "Article Files (optional)",
        type: "files",
        required: false,
        hint: "Upload PDF copies or screenshots if articles are behind paywalls or may become unavailable",
      },
    ],
  },
  {
    id: "judging",
    name: "Judging",
    shortDescription: "Judge of others' work in your field",
    fullDescription:
      "Evidence of participation on a panel, or individually, as a judge of the work of others in the same or an allied field.",
    helpText:
      "This includes peer review for journals, judging competitions, reviewing grant applications, or serving on thesis committees. Document your role as an evaluator of others' work.",
    fields: [
      {
        id: "role_description",
        label: "Judging Role",
        type: "text",
        required: true,
        placeholder: "e.g., Peer Reviewer, Competition Judge, Grant Reviewer",
      },
      {
        id: "organization",
        label: "Organization/Event",
        type: "text",
        required: true,
        placeholder: "e.g., Nature Communications, TechCrunch Disrupt",
      },
      {
        id: "dates",
        label: "Dates of Service",
        type: "text",
        required: true,
        placeholder: "e.g., 2022-Present",
      },
      {
        id: "description",
        label: "Describe Your Judging Activities",
        type: "textarea",
        required: true,
        hint: "Explain what you evaluated and the scope of your judging responsibilities.",
      },
      {
        id: "evidence_urls",
        label: "Evidence URLs",
        type: "files",
        required: false,
        hint: "Links to invitation letters, reviewer acknowledgments, certificates, or screenshots",
      },
      {
        id: "evidence_files",
        label: "Evidence Files",
        type: "files",
        required: false,
        hint: "Upload invitation letters, reviewer acknowledgments, certificates, or screenshots",
      },
    ],
  },
  {
    id: "original_contributions",
    name: "Original Contributions",
    shortDescription: "Contributions of major significance",
    fullDescription:
      "Evidence of original scientific, scholarly, or business-related contributions of major significance in the field.",
    helpText:
      "This could include patents, open-source projects with significant adoption, research with high citation counts, or innovative business solutions. Focus on impact and uniqueness.",
    fields: [
      {
        id: "contribution_title",
        label: "Contribution Title",
        type: "text",
        required: true,
        placeholder: "e.g., Distributed Consensus Algorithm for Real-Time Systems",
      },
      {
        id: "work_description",
        label: "Describe Your Work and Unique Contributions",
        type: "textarea",
        required: true,
        hint: "Explain what you created or discovered and what makes it original.",
      },
      {
        id: "impact_description",
        label: "Describe the Impact",
        type: "textarea",
        required: true,
        hint: "Explain how this contribution has affected your field or the world. Include metrics if available.",
      },
      {
        id: "evidence_urls",
        label: "Supporting Evidence URLs",
        type: "urls",
        required: false,
        hint: "Links to GitHub repos, publications, usage metrics, or testimonials",
      },
      {
        id: "evidence_files",
        label: "Supporting Evidence Files",
        type: "files",
        required: false,
        hint: "Upload patents, technical documents, impact reports, or testimonial letters",
      },
    ],
  },
  {
    id: "scholarly_authorship",
    name: "Scholarly Authorship",
    shortDescription: "Authorship of scholarly articles",
    fullDescription:
      "Evidence of authorship of scholarly articles in the field, in professional journals, or other major media.",
    helpText:
      "This includes peer-reviewed papers, technical reports, white papers, or substantial technical blog posts. Focus on publications where you are a primary author.",
    fields: [
      {
        id: "publication_title",
        label: "Publication Title",
        type: "text",
        required: true,
        placeholder: "e.g., Scaling Machine Learning Systems: A Practical Guide",
      },
      {
        id: "journal_conference",
        label: "Journal/Conference/Publication",
        type: "text",
        required: true,
        placeholder: "e.g., ICML 2023, Journal of Machine Learning Research",
      },
      {
        id: "publication_date",
        label: "Publication Date",
        type: "date",
        required: true,
      },
      {
        id: "your_role",
        label: "Your Role",
        type: "text",
        required: true,
        placeholder: "e.g., First Author, Co-Author",
      },
      {
        id: "summary",
        label: "Brief Summary",
        type: "textarea",
        required: true,
        hint: "Summarize the publication and its significance.",
      },
      {
        id: "publication_urls",
        label: "Publication URLs",
        type: "urls",
        required: true,
        hint: "Links to the publication (arXiv, journal website, Google Scholar)",
      },
      {
        id: "publication_files",
        label: "Publication Files (optional)",
        type: "files",
        required: false,
        hint: "Upload PDF copies if publications are behind paywalls or for offline access",
      },
    ],
  },
  {
    id: "critical_employment",
    name: "Critical Employment",
    shortDescription: "Essential role at distinguished organizations",
    fullDescription:
      "Evidence that you have been employed in a critical or essential capacity for organizations and establishments that have a distinguished reputation.",
    helpText:
      "Focus on demonstrating both that the organization is distinguished AND that your role was critical to its success. Include evidence of your specific impact.",
    fields: [
      {
        id: "organization_name",
        label: "Organization Name",
        type: "text",
        required: true,
        placeholder: "e.g., Stripe, OpenAI, Stanford University",
      },
      {
        id: "role_title",
        label: "Your Role/Title",
        type: "text",
        required: true,
        placeholder: "e.g., Founding Engineer, Principal Researcher",
      },
      {
        id: "start_date",
        label: "Start Date",
        type: "date",
        required: true,
      },
      {
        id: "end_date",
        label: "End Date (leave blank if current)",
        type: "date",
        required: false,
      },
      {
        id: "key_responsibilities",
        label: "Key Responsibilities",
        type: "textarea",
        required: true,
        hint: "Describe your core responsibilities and why your role was critical.",
      },
      {
        id: "evidence_urls",
        label: "Supporting Evidence URLs",
        type: "urls",
        required: false,
        hint: "Links to blog posts, press articles, or online documentation about your work",
      },
      {
        id: "evidence_files",
        label: "Supporting Evidence Files",
        type: "files",
        required: true,
        hint: "Upload org charts, product roadmaps, technical diagrams, or reference letters",
      },
    ],
  },
  {
    id: "high_remuneration",
    name: "High Remuneration",
    shortDescription: "High salary relative to peers",
    fullDescription:
      "Evidence that you have commanded a high salary or will command a high salary or other remuneration for services, as evidenced by contracts or other reliable evidence.",
    helpText:
      "Include base salary, bonuses, and equity compensation. You'll need to show this is significantly above average for your role and location.",
    fields: [
      {
        id: "work_location",
        label: "Work Location",
        type: "text",
        required: true,
        placeholder: "e.g., San Francisco, CA",
      },
      {
        id: "salary",
        label: "Annual Salary",
        type: "text",
        required: true,
        placeholder: "e.g., $250,000 USD",
        hint: "Include currency",
      },
      {
        id: "total_compensation",
        label: "Total Compensation (including equity)",
        type: "text",
        required: true,
        placeholder: "e.g., $500,000 USD",
        hint: "Include base + bonus + equity value",
      },
      {
        id: "paystub_files",
        label: "Paystub Files",
        type: "files",
        required: true,
        hint: "Upload your last 4 paystubs (PDF or image format)",
      },
      {
        id: "equity_files",
        label: "Equity Documentation Files",
        type: "files",
        required: false,
        hint: "Upload Carta screenshots, offer letter showing equity grant, or equity statements",
      },
    ],
  },
];

export function getCriteriaById(id: string): CriteriaConfig | undefined {
  return O1_CRITERIA.find((c) => c.id === id);
}
