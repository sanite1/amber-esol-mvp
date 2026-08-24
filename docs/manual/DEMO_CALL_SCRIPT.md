# Amber ESOL Demo Call Run Sheet

_Follow this top to bottom on the call. Every step tells you exactly
where to click, what to type, and what to say. Total running time is
about 40 minutes. Steps marked **SAY** are your talking points; steps
marked **DO** are your clicks._

---

## Before the call (15 minutes before, not during)

1. Start the backend: open a terminal in `amber-esol-backend` and run
   `npm run dev`. Wait for "connected" in the log.
2. Start the frontend: open a terminal in `amber-esol-mvp` and run
   `npm start`. Wait for `localhost:3000` to open.
3. Restore the demo state (this re creates Lara's unread teacher
   message and the pending Stage 5 review if a previous demo consumed
   them). In `amber-esol-backend` run:

```bash
npx ts-node --transpile-only src/scripts/prepManualDemoData.ts
```

4. Open **two browser windows** side by side:
   - Window A (normal): your main window for admin, teacher, and org
     admin logins.
   - Window B (incognito/private): reserved for the learner joining
     flow, so two accounts can be signed in at once.
5. Test one login (any account from the table below) and log out again.
6. Check your internet. The AI tutor replies, placement scoring, and
   the cohort summary all use live Gemini calls.
7. Have this script open on a second screen or printed.

### Voice: text to speech and the microphone (optional, do this the day before)

The AI tutor can read its lines aloud (a **Listen** button on every
Amber message) and the learner can speak an answer instead of typing
it (a **Record your answer** microphone next to the input). Both are
built and tested, but they are switched off until two things happen.
Right now they are off, so if you skip this section the session
simply runs text only and nothing looks broken.

1. Enable two Google APIs on the same Google Cloud project that
   already powers Gemini (project `trim-epigram-496314-m4`). Open
   each link, make sure that project is selected at the top, press
   **Enable**:
   - Cloud Text to Speech:
     https://console.developers.google.com/apis/api/texttospeech.googleapis.com/overview?project=trim-epigram-496314-m4
   - Cloud Speech to Text:
     https://console.developers.google.com/apis/api/speech.googleapis.com/overview?project=trim-epigram-496314-m4
     Wait two or three minutes after enabling.
2. In `amber-esol-backend/.env` change the two lines at the bottom
   from `false` to `true`:

```bash
VOICE_TTS_ENABLED=true
VOICE_STT_ENABLED=true
```

3. Restart the backend (`Ctrl+C` in its terminal, then `npm run dev`
   again).
4. Rehearse once: sign in as Lara, start a session, and check that a
   small speaker **Listen** button now shows under Amber's first
   message and a microphone button sits beside the text box. Press
   the microphone once in rehearsal so Chrome asks for microphone
   permission and you can press **Allow** before the call, not
   during it.

The voices are Google's EU hosted voices (London region), matched to
the learner's language. If the buttons do not appear after step 3,
the API enable has not propagated yet; wait a few minutes and restart
the backend again.

**Important warning:** do NOT type anything about being unsafe, hurt,
or frightened into the AI tutor during the demo. The safeguarding
detector is real: it will raise a live alert and email the
safeguarding inbox. You will show safeguarding from the admin side
instead (Act 8), where a real open alert and a resolved one already
exist.

---

## The cast (all passwords are `TestPass1!` unless stated)

| Role                                      | Email                        | Use for        |
| ----------------------------------------- | ---------------------------- | -------------- |
| Amber admin                               | seed-qa-admin@example.com    | Acts 2 and 8   |
| Org admin (Seed QA Organisation)          | seed-qa-orgadmin@example.com | Acts 3 and 7   |
| Teacher (Theo)                            | seed-qa-teacher@example.com  | Act 6          |
| Learner (Lara, E3, two months of history) | seed-qa-learner@example.com  | Act 5          |
| Hillview org admin (Hana)                 | hillview-admin@example.org   | backup org     |
| Hillview teacher (Priya)                  | hillview-teacher@example.org | backup teacher |

The learner you create live in Act 4 needs no email or password at
all, which is itself a selling point.

---

## Act 1: The story in one minute (no screen yet)

**SAY:** "Amber is an AI supported English learning platform for
funded adult ESOL. Learners practise real UK life scenarios with an
AI tutor that supports them in their own language. While they
practise, the platform writes the compliance record automatically:
guided learning hours, RARPA evidence, the ILR return. And every
judgement that matters, a level achieved, a safeguarding concern, is
confirmed by a person, never by the AI alone. I'll show you the whole
journey: we'll create an organisation, invite a learner, watch them
join and get placed, practise with the AI tutor, and then see what
the teacher, the provider, and Amber each see."

---

## Act 2: Amber admin provisions an organisation (4 min)

**DO, in Window A:**

1. Go to `localhost:3000/login`.
2. Email: `seed-qa-admin@example.com` · Password: `TestPass1!` ·
   press **Sign in**.
3. You land on **Overview**. Pause here.

**SAY:** "This is Amber's own view: every client organisation,
learners, hours this month, revenue, and billing state at a glance.
You can see one client with a lapsed contract flagged in red."

4. In the sidebar press **Organisations**, then the orange
   **Provision organisation** button (top right).
5. Fill the form (say the values out loud as you type):
   - Organisation name: `Riverside Community College`
   - Contact name: `Dana Ellis`
   - Contact email: `dana@riverside-demo.org`
   - Phone: `07700900123`
   - Payment model: **Invoiced** · Invoice cycle: monthly
   - Admin first name `Dana`, last name `Ellis`, admin email
     `dana@riverside-demo.org`, admin phone `07700900123`
6. Press the create button and point at the new row in the list.

**SAY:** "One form creates the organisation and its first admin
account together. The admin gets a welcome email and from that moment
Riverside runs itself: Amber does not create learners for them.
That is deliberate: providers own their learners, Amber owns the
platform. For the rest of the demo I'll use Seed QA Organisation,
which has two months of live history in it."

7. Top right, press your avatar, then **Sign out**.

---

## Act 3: Org admin invites a learner (3 min)

**DO, in Window A:**

1. Sign in as `seed-qa-orgadmin@example.com` / `TestPass1!`.
2. You land on the **Cohort dashboard**. Do not explain it yet, that
   is Act 7. Just say: "This is the provider's home; we'll come back
   to it once our learner has some data."
3. Sidebar: press **Invitations**, then **New invitation**.
4. In the modal:
   - Learner email: leave **empty** (say: "with an email the invite
     is sent automatically; I'll use a link so you can watch the
     learner side live").
   - Assigned ESOL level: leave as **Set later** (the placement will
     decide).
   - Expires in: leave the default 30 days.
5. Press create, then press **Copy link** on the new invitation row.

**SAY:** "That link is the entire enrolment infrastructure. No
account creation, no passwords to manage, no IT ticket. The provider
sends this to a learner by text, email, or on paper as a QR code."

---

## Act 4: The learner joins and gets placed at E3 (7 min)

**DO, in Window B (incognito):**

1. Paste the copied invite link and open it.
2. The welcome screen appears, branded for the organisation. Point at
   the **language picker, top right**. Click it and switch to
   **العربية (Arabic)**.

**SAY:** "First decision the learner ever makes: their language. And
watch the whole layout flip right to left for Arabic. Amber never
assumes English."

3. Switch back to **English**. Press **Start**.
4. Walk the wizard steps, filling minimal details:
   - Details: first name `Amal`, last name `Hassan`, and whatever
     else the step requires.
   - Eligibility: answer the declarations honestly ("this is the ESFA
     eligibility evidence being captured at source").
   - ULN: **skip** (say: "the provider can record it later; the
     compliance dashboard flags it as missing until then").
   - Done: press through to the placement assessment.

**SAY:** "No email, no password. The learner is enrolled and goes
straight to placement: twenty questions, adapting to their answers,
scored by AI, and, important, reviewed by a teacher afterwards."

5. **The placement.** Twenty multiple choice questions. To land Amal
   at Entry 3, answer with this cheat sheet: get every E1, E2, and E3
   question RIGHT and every L1 and L2 question WRONG. The level tag
   is not shown on screen, so recognise the question and use this
   table:

   **Answer these correctly:**

   | When you see                                 | Click                                    |
   | -------------------------------------------- | ---------------------------------------- |
   | 'NO ENTRY' sign meaning                      | You cannot go in                         |
   | Shop 'OPEN 9am 5pm Mon to Fri', open Sunday? | No                                       |
   | Correctly written sentence (London)          | I am from London.                        |
   | How old is Sara?                             | 25                                       |
   | Train to Manchester leaves at                | 3:30                                     |
   | How much was the milk?                       | £1.50                                    |
   | 'I will meet you \_\_\_ the bus stop.'       | at                                       |
   | Polite reply to 'How are you?'               | I'm fine, thank you. And you?            |
   | Correct sentence (shops yesterday)           | She went to the shops yesterday.         |
   | What do doctors recommend?                   | Walking for half an hour daily           |
   | Library closes at the weekend at             | 5pm                                      |
   | Politely ask to leave work early             | Could I leave a bit early today, please? |

   **Answer these wrongly (click the option shown):**

   | When you see                             | Deliberately click                                        |
   | ---------------------------------------- | --------------------------------------------------------- |
   | Tenancy agreement, one month's notice    | Tell the landlord by phone on the day of leaving          |
   | Conditional sentence (rain)              | If it will rain, I will stay home.                        |
   | Meeting postponed because                | Someone was late                                          |
   | Disagree with a colleague professionally | That is wrong.                                            |
   | Manager asks why you missed a deadline   | I forgot about it.                                        |
   | Retail footfall article means            | Online prices rose by 18%                                 |
   | Past perfect sentence                    | By the time we arrived, the meeting has already finished. |
   | 'Had we anticipated...' the speaker is   | Making a prediction about the future                      |

   The first five questions are one from each level in rising order
   (E1, E2, E3, L1, L2), so early on expect: sign, train time,
   shops yesterday, tenancy, missed deadline.

6. Submit and wait a few seconds while it scores.

**SAY (while it scores):** "Gemini is scoring the attempt now: level,
confidence score, and skill weaknesses. The result seeds everything
downstream: the learner's scenario difficulty, their goals, and the
funding paperwork."

7. The result lands at **Entry 3**. Show the learner's goals screen
   if offered (objectives written in plain language, agreed by the
   learner). Then leave Window B; Amal's part is done.

**If the placement misbehaves live** (network hiccup): close Window B
and say "rather than fight the wifi, let me show you a learner who
has been using Amber for two months", and go straight to Act 5.

---

## Act 5: Living with Amber as a learner (8 min)

**DO, in Window A** (sign out of the org admin first):

1. Sign in as `seed-qa-learner@example.com` / `TestPass1!`.
2. A full screen note appears: **a message from her teacher**. Read
   it out loud.

**SAY:** "Teacher messages physically cannot be missed. They appear
before anything else, translated into the learner's language when
needed."

3. Press **Got it**. If a welcome panel appears next, close it too.
4. You are on Lara's dashboard. Point at, in order: her level badge
   (E3), the scenario picker, and the stats below.
5. Sidebar: **My Goals**. Show her objectives and the agreement note.

**SAY:** "These are her RARPA Stage 3 objectives, agreed by her, in
her own words and language. Every practice session collects evidence
against them automatically."

6. Sidebar: **Vocabulary**. Show retained versus in progress words.

**SAY:** "Every word she meets is tracked. A word only counts as
retained after she has met it five times and used it correctly
herself. This is the vocabulary evidence for her file."

7. Now the main event. Go back to the dashboard and press
   **Booking a GP appointment** in the scenario picker.
8. The PREPARE screen shows what she will practise and the key
   phrases. Press **Begin roleplay**.
9. Amber opens the conversation. Wait for its first message, then
   type exactly this and press Enter:

   > Hello, I would like to book an appointment with the doctor please.

10. Wait for Amber's reply (a few seconds; the typing indicator shows
    it thinking). Then type:

    > I have pain in my back for three days. It hurts when I sit for a long time.

11. **Voice moment (only if you enabled voice before the call).**
    When Amber's second reply arrives, press the small speaker
    **Listen** button under it and let it play out loud.

    **SAY:** "Every line the tutor says can be heard as well as read,
    in a natural voice matched to the learner's language. For a
    learner with low literacy in English, or in their own script,
    this is the difference between using the platform and not."

    Then, instead of typing the third message, press the microphone
    button (**Record your answer**) next to the text box and say
    clearly:

    > Thursday morning is good for me. What do I need to bring?

    Press the same button again (**Stop and send**). A moment later
    her sentence appears in the conversation as a spoken answer, with
    a small microphone mark and a clarity chip under it (Clear, Nearly
    there, or Let's try that again) plus a one line pronunciation tip.
    Amber's reply will comment on how it sounded before carrying on.

    **SAY:** "This is the part typing can never do. She spoke, the
    platform listened, and the tutor now knows how she pronounced it,
    not just what she meant. The clarity is scored, credited as
    speaking evidence, and flagged for the teacher to confirm. The
    audio itself is assessed in Google's EU region and never stored;
    Amber keeps only the words and the assessment."

    **If you did NOT enable voice**, simply type the third message
    instead:

    > Thursday morning is good for me. What do I need to bring?

12. While replies come in, point at the screen furniture: the mode
    chip (BRIDGE means first language support is available, ANCHOR
    means maximum support, IMMERSION means mostly English), the text
    size button, and the four stage progress dots.

**SAY:** "Notice the tutor never just says 'correct'. It recasts her
mistakes naturally, the way a good teacher does, and every turn is
scored quietly in the background. Nothing she does here is wasted:
it is all becoming evidence."

13. **Ending the session:** after Amber's third reply, press
    **End & review** (top of the chat). A completion panel appears
    with her score, the words she used, and the tutor's note.

**SAY:** "Ten minutes of practice, and the by product is a scored,
transcripted, evidenced learning session. She just presses one button
and she is done. Now let me show you what her teacher sees."

14. Sign out.

---

## Act 6: The teacher's morning (6 min)

**DO, in Window A:**

1. Sign in as `seed-qa-teacher@example.com` / `TestPass1!`.
2. You land on the **Teacher Dashboard**. Give it a second to load,
   then walk the priority queue top to bottom.

**SAY:** "This is the whole product for teachers: who needs me, and
why. P1 at the top: Stephen has an open safeguarding alert, act
today. P2: Collins has gone quiet for a week, send encouragement.
And the learners who are fine are parked in P4, on track, explicitly
labelled no action needed. The teacher never hunts for work. Note the
queue was built by the platform overnight, with the reason attached
to every name."

3. Point at the **auto send toggle** above the queue: "if a learner
   goes quiet for two weeks, the platform checks in on the teacher's
   behalf, at most once a fortnight, and the teacher can turn it off."
4. In the cohort table press **Lara Learner** to open her record.
5. Walk the tabs quickly:
   - **Recent sessions**: open the top card, show the transcript of
     the session you just did in Act 5.
   - **Vocab and objectives**: her ledger and Stage 3 goals with
     progress.
   - **Your reviews**: the review history (append only, cannot be
     edited later).
   - **Activity**: the compliance trail.
6. Press **Log review** (right side). Pick **Async review**, set 15
   minutes, and type notes:

   > Reviewed today's GP booking session. Clear progress on polite requests. Ready for the housing scenario next.

   Tick "acted on the AI recommendation" and press **Save review**.

**SAY:** "That 15 minutes just became part of the organisation's
claimable teaching hours, stamped with my name in the audit trail.
Reviews cannot be edited after saving; the record stands as written."

7. Press **Send message**, type:

   > Great session today, Lara. Next time we will try talking to your landlord about repairs.

   Point at the translation preview if her language is set, then
   **Send**.

8. Sign out.

---

## Act 7: The provider's compliance view (6 min)

**DO, in Window A:**

1. Sign in as `seed-qa-orgadmin@example.com` / `TestPass1!`.
2. The **Cohort dashboard** loads (the table takes a few seconds; it
   is aggregating every session and evidence row live; fill the gap
   by reading the AI cohort summary at the top out loud).

**SAY:** "A plain English summary of the month, written by the
platform from the real data, and under it the cohort: hours, teacher
hours, scenarios passed, last activity, status, and whether we hold a
ULN for each learner. This table IS the funding record."

3. Press **Lara Learner** (or go via **Learners**) to open her
   detail. On the overview point at the four hour cards.

**SAY:** "The most important distinction in the product: Total hours
include AI practice. Claimable hours exclude it, only teacher contact
and imported classroom hours count toward a funding claim. Both are
shown side by side precisely so nobody ever claims the wrong number."

4. Press the **Evidence Chain** tab.

**SAY:** "Every claim traces back to the moment it was captured:
which session, which turn, which ILR fields it feeds, which RARPA
stage it satisfies, and whether a human has confirmed it. The AI's
scores stay marked 'needs sign off' until a person confirms. This is
what an auditor sees."

5. Go back to the Cohort dashboard and press the **Stage 5 Pending**
   tab. Open Lara's pending review.

**SAY:** "Lara completed Entry 3. Here is her own self assessment,
the AI's summary of her evidence, and her teacher's sign off,
already done. The final step is mine: the organisation confirms. Two
different humans, in order, before anything becomes an achievement.
Nothing the AI scores can be exported on its own."

6. **Optional live moment:** type into the required next steps box:

   > Progress to Level 1 pathway with an employability focus. Review at October half term.

   and press **Confirm and lock**. (This consumes the pending review;
   the reset command in the last section restores it for the next
   demo.)

7. Quickly show **Export ILR** on the cohort dashboard: pick the
   organisation and dates, download the CSV, and open it for two
   seconds: "this is the file that goes to the funding body."
8. Sidebar **Invoices**: show the paid invoices. Sign out.

---

## Act 8: Amber oversight: safeguarding, hours, audit (5 min)

**DO, in Window A:**

1. Sign in as `seed-qa-admin@example.com` / `TestPass1!`.
2. Sidebar: **Safeguarding**.

**SAY:** "The most important queue in the platform. During any AI
session, if a learner discloses something worrying, the learner
instantly sees a supportive message with real helplines, written by
humans in advance, and an alert lands here with the safeguarding
lead emailed within seconds. Here is a live one: high level, domestic
abuse trigger, still open, and the SLA clock is running. And below
it, July's alert: reviewed, escalated to the organisation, resolved
the same day, with the notes preserved. The AI never handles the
concern in the lesson. A person always does."

3. Press the open alert to show the review panel and its four
   outcomes. Press **Cancel** (do not resolve it; it is the standing
   demo of the duty).
4. Sidebar: **Response texts**: "the exact crisis messages learners
   see, per language, editable by us, never generated live."
5. Sidebar: **GLH analytics**. Point at Total versus Claimable cards,
   the teacher contact percentage with its ABOVE TARGET badge, and
   the weekly trend.

**SAY:** "Platform wide hours by source. The funding model targets
teacher contact at ten to twenty percent of total hours: enough human
oversight to satisfy the funder, little enough that the AI is doing
the heavy lifting. We track that ratio continuously."

6. Sidebar: **Teacher utilisation**: two teachers, load, capacity,
   reviews and hours this month.
7. Sidebar: **Audit search**. Scroll slowly.

**SAY:** "And finally, the memory. Every compliance event across
every organisation: sessions, placements, goals agreed, reviews,
messages, nudges, level changes, safeguarding. Append only, nothing
can be edited or deleted, by anyone. When an auditor asks what
happened, this is the answer."

---

## Wrap (1 min)

**SAY:** "So that is the full loop: the provider invites, the learner
joins in their own language with no password, the AI tutors and
quietly writes the evidence, the teacher spends their time only where
a human is needed, the provider signs off achievements and exports
the funding file, and Amber holds the safeguarding duty and the audit
trail. Questions?"

---

## If something goes wrong live

| Symptom                                          | What to do and say                                                                                                                      |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Cohort table sits on a spinner                   | It aggregates live evidence; say so and give it ten seconds.                                                                            |
| AI tutor reply is slow                           | "It is generating a level matched reply live." It arrives; do not resend.                                                               |
| Placement scoring fails                          | Close the incognito window; continue with Lara (Act 5). All later acts work without Act 4.                                              |
| Teacher message modal reappears on learner login | That is the unread message from Act 6. Read it out: it proves the loop. Press Got it.                                                   |
| No Listen or microphone buttons in the session   | Voice is off (flags false, or the Google APIs not yet enabled). Skip the voice moment; type the line instead. Nothing else is affected. |
| Listen button shows but nothing plays            | The Google API enable has not propagated, or the tab is muted. Say "voice is optional" and move on; check after the call.               |
| Microphone does nothing                          | Chrome blocked the mic. Click the camera/mic icon in the address bar, Allow, and retry once. Otherwise type the line.                   |
| Wrong dashboard after login                      | You are signed into another role in this window. Sign out via the top right avatar.                                                     |
| A page looks empty                               | Check you are signed in as the role that act names. Seed QA Organisation is where all the history lives.                                |

## Reset between demos

Run in `amber-esol-backend` (restores Lara's unread message, the
pending Stage 5 review, and the open safeguarding alert if any demo
consumed them):

```bash
npx ts-node --transpile-only src/scripts/prepManualDemoData.ts
```

The organisation you provisioned in Act 2 can be deactivated from
Organisations after the call, and each demo run should invent a new
learner name in Act 4 (each invite link is fresh anyway).
