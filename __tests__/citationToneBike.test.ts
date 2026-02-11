import { composeAnswer } from '../src/services/answerComposer';
import { applyToneOverlay } from '../src/services/toneOverlay';
import { BIKE_PROFILE } from '../src/constants/bikeProfile';

describe('citation formatting', () => {
  it('includes document and page citation', () => {
    const answer = composeAnswer([
      {
        chunk: {
          doc_name: 'Manual.pdf',
          page_start: 4,
          page_end: 4,
          section_title: 'Specs',
          chunk_text: 'Torque 35 ft-lb. Use calibrated wrench.',
          embedding_vector: []
        },
        vectorScore: 0.9,
        keywordScore: 0.8,
        intentScore: 1,
        confidence: 0.9
      }
    ]);
    expect(answer).not.toBe('Not in the provided manuals.');
    if (typeof answer === 'string') return;
    expect(answer.citations[0].document).toBe('Manual.pdf');
    expect(answer.citations[0].pages).toBe('4');
    expect(answer.bottomLine).toContain('Torque 35 ft-lb.');
  });

  it('tone overlay does not mutate numeric specs', () => {
    const input = {
      bottomLine: 'Torque 35 ft-lb.',
      steps: ['1. Tighten to 35 ft-lb'],
      specifications: ['35 ft-lb'],
      citations: [{ document: 'M', pages: '1', snippet: '35 ft-lb' }]
    };
    const out = applyToneOverlay(input as any);
    expect(out).toContain('35 ft-lb');
  });

  it('bike profile is prepopulated correctly', () => {
    expect(BIKE_PROFILE.nickname).toBe('Virginia');
    expect(BIKE_PROFILE.vin).toBe('1HD1FHW184Y702588');
    expect(BIKE_PROFILE.milestone).toBe('Major cam chest / engine work completed at 22,900 miles.');
  });
});
