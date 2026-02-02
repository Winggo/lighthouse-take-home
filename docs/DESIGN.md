# Lighthouse Take-Home Assignment - My Thought Process and Implementation

This README outlines my thought process from ideation to implementation.


## 1. Gather Requirements
Goal
Build working prototype that
- Collects immigration case information
    - Use DB to store case data
- Educates users their visa and what “good” evidence looks like
    - Provide feedback on submitted evidence
- Supports live Q&A
    - Add LLM chat assistant on sidebar
- Bonus:
    - Demonstrates system adapts to different user profiles
        - Implement dynamic workflow page order, determined by initial user profile
    - Handles “pushback” for case managers
        - Add review page for case managers

Evaluated on
- Solution intuitive and helpful to confused user
- Problem decomposition
    - How to clarify ambiguity?
    - What assumptions were made?
    - How were assumptions validated?
- Clear communication in walkthrough



## 2. Perform Research
For case strategy, use format “[Criteria] - [Description]"

O-1: Individuals with an extraordinary ability in the sciences, education, business, or athletics
Meet 3 of 8 USCIS extraordinary ability criteria
- Awards
    - Documentation of the beneficiary’s receipt of nationally or internationally recognized prizes or awards for excellence in the field of endeavor
- Membership in distinguished organizations
    - Documentation of the beneficiary’s membership in associations in the field for which classification is sought, which require outstanding achievements of their members, as judged by recognized national or international experts in their disciplines or fields.
- Published press
    - Published material in professional or major trade publications or major media about the beneficiary, relating to the beneficiary's work in the field for which classification is sought. This evidence must include the title, date, and author of such published material and any necessary translation.
- Judging the work of others
    * Evidence of the beneficiary's participation on a panel, or individually, as a judge of the work of others in the same or in an allied field of specialization for which classification is sought.
- Original contributions of major significance
    - Evidence of the beneficiary's original scientific, scholarly, or business-related contributions of major significance in the field
- Scholarly authorship
    - Evidence of the beneficiary's authorship of scholarly articles in the field, in professional journals, or other major media.
- Critical or essential employment
    - Evidence that the beneficiary has been employed in a critical or essential capacity for organizations and establishments that have a distinguished reputation.
- High remuneration
    - Evidence that the beneficiary has either commanded a high salary or will command a high salary or other remuneration for services as evidenced by contracts or other reliable evidence.


Links
- O-1 Visa Overview
    - https://www.uscis.gov/working-in-the-united-states/temporary-workers/o-1-visa-individuals-with-extraordinary-ability-or-achievement
- O-1 Visa Criteria
    - https://www.uscis.gov/policy-manual/volume-2-part-m-chapter-4



## 3. Implement Solution
Assumptions and observations
- Users are bad at reading and understanding what data to provide
- User is stressed
- User is uninformed
- User is disorganized, and does not have all information all-hand

How to address observed problem?
- Users are bad at reading and understanding what data to provide
    - Simplify language. Provide live feedback as user inputs data.
- User is stressed
    - Split workflow into one component at a time, to avoid overwhelming user.
- User is uninformed
    - Add live Q&A. List required evidence instead of having user needing to guess what to provide.
- User is disorganized, and does not have all information all-hand
    - Support saving progress and resuming after.

Solution
1. Start with a step by step Typeform style flow with a progress bar. Each page asks the user 1 question to incrementally build their profile.
    - This 1 question-at-a-time approach encourages the user to feel that they are making progess right from the beginning.
    - User does need to read big chunks of text, reducing cognitive processing load.
    - Progress is saved after answering each question. User can resume at any point.
2. Based on the profile data, predict the most applicable criteria for the candidate using LLMs, with a score applied to each criteria. The score represents the strength of the user's profile for that particular criteria.
    - This eliminates decision fatique from user having to decide which criteria to apply. Our system handles that for them.
3. Next, display the 3 most applicable criteria on a dashboard.
    - This birds-eye view paints a clear action plan for the user to follow and make progress.
    - Progress can be saved at any point. User can resume at any time via a link.
    - This structure allows the user to explore and submit evidence for any criteria in any order. This solves the problem of the user feeling overwhelmed from needing to gather all documents up front. If they suddenly find relevant evidence mid-day, just go to the dashboard, upload it, and forget about it.
4. After all evidence is collected for all 3 criteria, user can submit the case for the case manager to review.

Additional features supported
    - The app supports live Q&A throughout the entire process. Just click on the chat widget on the bottom-right corner to open a chatbox.

Tech Stack
Quick setup for prototyping
- Next.js
- Vercel Functions
- Firebase Firestore
- OpenAI API



## 4. Deliverables
- Deployed link
- Github repo
- Video walkthrough with approach + assumptions + what to do differently

Assumptions
- user is stressed (split workflow into one component at a time, to avoid overwhelming user)
- user is uninformed (support q&a, evaluate input using LLM)
- user is disorganized, does not have all information all-hand (support saving progress and resuming after)


What to do differently with more time?
- Add authentication so only case owner can access case
- More extensive testing
- Check files for malicious content before allowing upload
- Add rejection flow for case managers
- Add email notifications to applicant and case manager
