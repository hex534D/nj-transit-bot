import { NJTransitAdvisory } from './types';

export function formatAdvisory(advisory: NJTransitAdvisory): string {
  // Strip HTML tags from content
  const content =
    advisory.description || advisory.title?.replace(/<[^>]*>/g, '') || '';

  // Truncate if too long
  const maxLength = 500;
  const truncated =
    content.length > maxLength
      ? content.substring(0, maxLength) + '...'
      : content;

  return `
📢 *${advisory.title}*

${truncated}

🔗 [Read More](${advisory.link})
⏰ ${new Date(advisory.pubDate).toLocaleString()}
  `.trim();
}

export function formatAdvisoriesSummary(
  advisories: NJTransitAdvisory[],
): string {
  if (advisories.length === 0) {
    return '✅ *No Active Advisories*\n\nAll systems operating normally.';
  }

  const summary = advisories
    .map((adv, i) => {
      return `${i + 1}. ${adv.title}`;
    })
    .join('\n');

  return `
⚠️ *${advisories.length} Active Advisory${advisories.length > 1 ? 'ies' : ''}*

${summary}
  `.trim();
}
