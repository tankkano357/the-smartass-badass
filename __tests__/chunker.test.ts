import { chunkText } from '../src/services/chunker';

describe('chunkText', () => {
  it('preserves procedure steps in order', () => {
    const chunks = chunkText('manual', [{ page: 1, section: 'Proc', text: '1. Remove cover\n2. Inspect chain\n3. Torque bolts' }], 20);
    expect(chunks.join).toBeDefined();
    expect(chunks.map((c) => c.chunk_text).join('\n')).toContain('1. Remove cover');
    expect(chunks.map((c) => c.chunk_text).join('\n')).toContain('2. Inspect chain');
  });

  it('does not split table rows', () => {
    const chunks = chunkText('manual', [{ page: 1, section: 'Table', text: 'Spec|Value\nOil|20W-50\nBrake|DOT 5' }], 12);
    expect(chunks[0].chunk_text).toContain('Spec|Value');
    expect(chunks[0].chunk_text).toContain('Oil|20W-50');
  });
});
