import { NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { auth } from '../../../lib/auth.js';
import dbModule from '../../../lib/db/index.js';
import { personalityAnswersSchema } from '../../../lib/validate.js';

const { db, schema } = dbModule;

const dimensionKeys = [
  'realist',
  'conventional',
  'social',
  'investigativ',
  'intreprinzator',
  'artistic',
];

function errorResponse(message, status) {
  return NextResponse.json({ error: message }, { status });
}

function scoreAnswers(answers) {
  const scores = {
    realist: 0,
    conventional: 0,
    social: 0,
    investigativ: 0,
    intreprinzator: 0,
    artistic: 0,
  };

  answers.forEach((answer, index) => {
    const key = dimensionKeys[index % dimensionKeys.length];
    scores[key] += answer;
  });

  let personality = 0;
  let maxScore = 0;

  dimensionKeys.forEach((key, index) => {
    if (scores[key] > maxScore) {
      maxScore = scores[key];
      personality = index + 1;
    }
  });

  return {
    ...scores,
    personality,
  };
}

export async function GET() {
  if (!db) {
    return errorResponse('Database unavailable', 503);
  }

  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse('Unauthorized', 401);
  }

  const [result] = await db
    .select({
      id: schema.personalityResults.id,
      answers: schema.personalityResults.answers,
      scores: schema.personalityResults.scores,
      createdAt: schema.personalityResults.createdAt,
    })
    .from(schema.personalityResults)
    .where(eq(schema.personalityResults.userId, session.user.id))
    .orderBy(desc(schema.personalityResults.createdAt))
    .limit(1);

  if (!result) {
    return errorResponse('Result not found', 404);
  }

  return NextResponse.json(
    {
      result,
    },
    { status: 200 },
  );
}

export async function POST(request) {
  if (!db) {
    return errorResponse('Database unavailable', 503);
  }

  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse('Unauthorized', 401);
  }
  if (session.user.banned) {
    return errorResponse('Banned users cannot modify content', 403);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body', 400);
  }

  const parsed = personalityAnswersSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse('Validation error', 400);
  }

  const scores = scoreAnswers(parsed.data.answers);

  await db.insert(schema.personalityResults).values({
    userId: session.user.id,
    answers: parsed.data.answers,
    scores,
  });

  return NextResponse.json({ scores }, { status: 201 });
}
