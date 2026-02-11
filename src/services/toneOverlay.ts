import { AnswerSections } from '../types';

const openers = [
  'Here, I did the reading so you do not have to.',
  'Good news: this one is actually in the manual.',
  'Try not to improvise this into a disaster.'
];

export const applyToneOverlay = (answer: AnswerSections): string => {
  const opener = openers[Math.floor(Math.random() * openers.length)];
  const lines = [
    opener,
    '',
    'Bottom Line:',
    answer.bottomLine,
    '',
    ...(answer.steps.length
      ? ['Steps:', ...answer.steps.map((step) => step), '']
      : []),
    ...(answer.toolsParts?.length ? ['Tools/Parts:', ...answer.toolsParts, ''] : []),
    ...(answer.specifications?.length ? ['Specifications:', ...answer.specifications, ''] : []),
    'Citations:',
    ...answer.citations.map((c) => `- ${c.document} (Page ${c.pages}): "${c.snippet}"`),
    '',
    'There. Follow it exactly and nobody has to learn new swear words.'
  ];

  return lines.join('\n').trim();
};
