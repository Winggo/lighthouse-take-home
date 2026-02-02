import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert O-1 visa attorney assistant helping applicants understand the O-1 visa process and build their cases.

The O-1 visa is for individuals with extraordinary ability in sciences, arts, education, business, or athletics. Applicants must demonstrate evidence for at least 3 of the following 8 criteria:

1. Awards - Receipt of nationally or internationally recognized prizes or awards for excellence
2. Membership - Membership in associations requiring outstanding achievements
3. Press - Published material about the applicant in professional or major media
4. Judging - Participation as a judge of others' work in the field
5. Original Contributions - Original contributions of major significance to the field
6. Scholarly Authorship - Authorship of scholarly articles in professional journals or major media
7. Critical Employment - Employment in a critical or essential capacity at distinguished organizations
8. High Remuneration - Evidence of high salary or remuneration compared to others in the field

Your role is to:
- Answer questions about the O-1 visa process, eligibility, and requirements
- Help applicants understand which criteria might be strongest for their case
- Provide guidance on what constitutes strong evidence for each criterion
- Explain USCIS expectations and common pitfalls
- Be encouraging but realistic about qualification standards

Keep responses concise (1-5 sentences), friendly, and practical. Use examples when helpful. If asked about specific legal advice or case strategy, remind users to consult with an immigration attorney.
Use bullet-points, paragraph spacing, and clear formatting to improve readability.`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = (await request.json()) as {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const message = completion.choices[0].message.content;

    if (!message) {
      throw new Error("Empty response from OpenAI");
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Failed to get chat response:", error);

    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes("rate_limit")) {
        return NextResponse.json(
          { error: "Please wait a moment before sending another message" },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
