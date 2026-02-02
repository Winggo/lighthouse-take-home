import { NextRequest, NextResponse } from "next/server";
import { getCase, updateCase } from "@/lib/firebase/firestore";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const { caseId } = await params;
    const caseData = await getCase(caseId);

    if (!caseData) {
      return NextResponse.json(
        { error: "Case not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(caseData);
  } catch (error) {
    console.error("Failed to get case:", error);
    return NextResponse.json(
      { error: "Failed to get case" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const { caseId } = await params;
    const updates = await request.json();

    // Verify case exists
    const existingCase = await getCase(caseId);
    if (!existingCase) {
      return NextResponse.json(
        { error: "Case not found" },
        { status: 404 }
      );
    }

    // Prevent updating evidence data if case is already submitted
    if (existingCase.status === "submitted") {
      if (updates.evidenceData !== undefined || updates.completedCriteria !== undefined) {
        return NextResponse.json(
          { error: "Cannot update evidence for a submitted case" },
          { status: 403 }
        );
      }
    }

    await updateCase(caseId, updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update case:", error);
    return NextResponse.json(
      { error: "Failed to update case" },
      { status: 500 }
    );
  }
}
