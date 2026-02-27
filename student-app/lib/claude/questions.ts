import Groq from 'groq-sdk'
import { Question, PracticeMode, ExamPaper } from '@/types'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

interface GenerateOptions {
  classNum: number
  subject: string
  chapter: string
  topics: string[]
  count: number
  mode: PracticeMode
}

function buildPrompt(opts: GenerateOptions): string {
  const { classNum, subject, chapter, topics, count, mode } = opts

  const questionTypeInstructions: Record<PracticeMode, string> = {
    quick: `Generate ${count} MCQ questions (1 mark each). Mix of factual, conceptual and application-based.`,
    chapter_test: `Generate ${count} questions: ${Math.ceil(count * 0.5)} MCQs (1 mark each), ${Math.ceil(count * 0.3)} short answer questions (3 marks each), ${Math.floor(count * 0.2)} long answer questions (5 marks each).`,
    pyq: `Generate ${count} questions in the style of CBSE Previous Year Questions. Mix of MCQs, short answer, and long answer as per CBSE pattern. Questions should closely resemble actual board exam questions from 2018–2024.`,
    sample_paper: `Generate a complete CBSE sample paper with ${count} questions: Section A — 15 MCQs (1 mark each), Section B — 5 very short answer questions (2 marks each), Section C — 3 short answer questions (3 marks each), Section D — 2 long answer questions (5 marks each).`,
  }

  return `You are an expert CBSE question paper setter with 20+ years of experience creating papers for Classes 9-12.

Generate practice questions for:
- Class: ${classNum} (CBSE Board)
- Subject: ${subject}
- Chapter: ${chapter}
- Key Topics: ${topics.join(', ')}

${questionTypeInstructions[mode]}

Requirements:
1. Questions must be strictly based on CBSE NCERT curriculum for Class ${classNum}
2. Follow CBSE marking scheme accurately
3. For MCQs: all 4 options must be plausible, only one clearly correct
4. Explanations must reference NCERT concepts and be educational
5. Vary difficulty: approximately 30% easy, 50% medium, 20% hard
6. Include application-based and HOTS (Higher Order Thinking Skills) questions

Return ONLY valid JSON in this exact format, no other text:
{
  "questions": [
    {
      "id": "q1",
      "type": "mcq",
      "question": "The full question text here",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correct_answer": "A",
      "explanation": "Detailed explanation referencing NCERT",
      "marks": 1,
      "difficulty": "medium"
    },
    {
      "id": "q2",
      "type": "short_answer",
      "question": "The full question text here",
      "correct_answer": "Model answer with key points:\n1. First point\n2. Second point\n3. Third point",
      "explanation": "Key concepts to understand",
      "marks": 3,
      "difficulty": "medium"
    }
  ]
}`
}

export async function generateQuestions(opts: GenerateOptions): Promise<Question[]> {
  const prompt = buildPrompt(opts)

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are an expert CBSE question paper setter. Always respond with valid JSON only, no markdown, no extra text.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 4096,
    response_format: { type: 'json_object' },
  })

  const text = completion.choices[0]?.message?.content ?? ''

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('Could not extract JSON from AI response')
  }

  const parsed = JSON.parse(jsonMatch[0])
  return parsed.questions as Question[]
}

// ── Full-syllabus PYQ paper generation ────────────────────────────────────────

interface FullPaperOptions {
  classNum: number
  subject: string
  subjectName: string
  chapters: { name: string; topics: string[] }[]
}

function buildFullPaperPrompt(opts: FullPaperOptions): string {
  const { classNum, subjectName, chapters } = opts

  const chapterList = chapters
    .map((ch, i) => `${i + 1}. ${ch.name} (Topics: ${ch.topics.slice(0, 3).join(', ')})`)
    .join('\n')

  return `You are an expert CBSE question paper setter creating a comprehensive practice board exam paper.

Create a full-syllabus practice paper for:
- Class: ${classNum} (CBSE Board)
- Subject: ${subjectName}

Full Syllabus Chapters Available:
${chapterList}

Generate a structured 100-mark paper with EXACTLY these 5 sections:
- Section A: 20 MCQ questions, 1 mark each (total 20 marks)
- Section B: 10 Very Short Answer questions, 2 marks each (total 20 marks)
- Section C: 8 Short Answer questions, 3 marks each (total 24 marks)
- Section D: 4 Long Answer questions, 4 marks each (total 16 marks)
- Section E: 4 Long Answer questions, 5 marks each (total 20 marks)
Grand Total: 100 marks, 46 questions

Rules:
1. Spread questions ACROSS different chapters — cover as many chapters as possible
2. Questions must resemble CBSE board exam style — clear, curriculum-accurate
3. MCQ: all 4 options must be plausible, exactly one correct
4. Short/long answers: provide complete model answer with numbered key points
5. Include chapter_reference for each question (e.g. "Chapter 3: Metals and Non-metals")
6. Section D and E must include HOTS (Higher Order Thinking Skills) questions
7. Vary difficulty: Section A mostly easy/medium, Section B–C medium, Section D–E medium/hard

Return ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "sections": [
    {
      "name": "Section A",
      "description": "Multiple Choice Questions — 1 mark each",
      "questions": [
        {
          "id": "a1",
          "type": "mcq",
          "question": "Full question text",
          "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
          "correct_answer": "A",
          "explanation": "Why A is correct with NCERT reference",
          "marks": 1,
          "chapter_reference": "Chapter N: Chapter Name"
        }
      ]
    },
    {
      "name": "Section B",
      "description": "Very Short Answer Questions — 2 marks each",
      "questions": [
        {
          "id": "b1",
          "type": "short_answer",
          "question": "Full question text",
          "correct_answer": "Key points:\n1. First point\n2. Second point",
          "explanation": "Core concept being tested",
          "marks": 2,
          "chapter_reference": "Chapter N: Chapter Name"
        }
      ]
    },
    {
      "name": "Section C",
      "description": "Short Answer Questions — 3 marks each",
      "questions": [...]
    },
    {
      "name": "Section D",
      "description": "Long Answer Questions — 4 marks each",
      "questions": [
        {
          "id": "d1",
          "type": "long_answer",
          "question": "Full question text",
          "correct_answer": "Detailed model answer:\n1. Point one\n2. Point two\n3. Point three\n4. Point four",
          "explanation": "Core concept and NCERT reference",
          "marks": 4,
          "chapter_reference": "Chapter N: Chapter Name"
        }
      ]
    },
    {
      "name": "Section E",
      "description": "Long Answer Questions — 5 marks each",
      "questions": [
        {
          "id": "e1",
          "type": "long_answer",
          "question": "Full question text (HOTS/application-based)",
          "correct_answer": "Comprehensive model answer:\n1. Point one\n2. Point two\n3. Point three\n4. Point four\n5. Point five",
          "explanation": "Core concept and NCERT reference",
          "marks": 5,
          "chapter_reference": "Chapter N: Chapter Name"
        }
      ]
    }
  ]
}`
}

export async function generateFullSyllabusPaper(opts: FullPaperOptions): Promise<ExamPaper> {
  const prompt = buildFullPaperPrompt(opts)

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are an expert CBSE question paper setter. Always respond with valid JSON only, no markdown, no extra text.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 16384,
    response_format: { type: 'json_object' },
  })

  const text = completion.choices[0]?.message?.content ?? ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Could not extract JSON from AI response')

  const parsed = JSON.parse(jsonMatch[0])

  return {
    classNum: opts.classNum,
    subjectName: opts.subjectName,
    totalMarks: 100,
    duration: '3 Hours',
    sections: parsed.sections,
  }
}
