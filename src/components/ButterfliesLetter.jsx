import React, { useMemo } from 'react';

const letterParagraphs = [
  "To the butterflies we feel in our bellies",
  "They say butterflies are pretty, but the butterflies don’t know this because they can’t see their wings. I know I say you are pretty all the time and you probably don’t believe me, and I get why you don’t sometimes, because when you are the one wearing the wings you don’t really get the view from out here.",
  "Still, hear me when I say that you are one of the prettiest things my eyes have seen. You are so pretty that I find myself up some nights, wondering what games my ancestors are playing in the great hallowed halls. From the look of things, I’d say they are doing a really spectacular job.",
  "I don’t think you realize how uncommon it is to meet someone who feels like a story people only tell by firelight, the kind where everyone leans in a little closer because nobody is completely sure if the person was real or just a rumor the village made up to feel luckier. If they ever write one about you, I hope they get the small details right. The way you make it so easy to forget whatever else was supposed to be on my mind.",
  "Omosimisola, the name that holds quite a bit of volume. Orekelewa, the pretty one, the one of fables and myths, the one my ancestors clearly spent extra time plotting over before they let our paths cross.",
  "So the next time I tell you that you are pretty and you feel like brushing it off, maybe don’t. Take my word for it, since you don’t have my eyes to see what I see. Let it sit for a second. You don’t have to argue with a fact.",
  "If those butterflies never quite figure out how to settle down, I honestly don’t think I will be complaining."
];

export default function ButterfliesLetter({ instant = false }) {
  // Precompute deliberate, mechanical-poetic cadence
  const structuredParagraphs = useMemo(() => {
    let currentDelay = 400; // Poetic opening pause

    return letterParagraphs.map((paragraph, pIndex) => {
      const words = paragraph.split(' ').filter(Boolean);
      const isHeader = pIndex === 0;

      const timedWords = words.map((word) => {
        const delay = currentDelay;

        // Punctuation and cadence detection
        const hasFullStop = /[.?!]$/.test(word);
        const hasComma = /[,;:]$/.test(word);
        const hasDash = /[-—]$/.test(word);

        if (hasFullStop) {
          currentDelay += 480; // Full contemplative breath after sentence
        } else if (hasComma || hasDash) {
          currentDelay += 260; // Natural phrase pause
        } else {
          currentDelay += isHeader ? 150 : 120; // Deliberate mechanical cadence
        }

        return { word, delay };
      });

      // Paragraph transition interval
      currentDelay += isHeader ? 700 : 550;

      return {
        id: pIndex,
        isHeader,
        words: timedWords
      };
    });
  }, []);

  return (
    <article
      className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl font-corsiva text-charcoal-muted text-[14px] sm:text-[16px] md:text-[18px] leading-[23px] sm:leading-[27px] md:leading-[31px] text-justify select-text tracking-normal"
      aria-label={letterParagraphs.join('\n\n')}
    >
      {structuredParagraphs.map((paragraph) => (
        <p
          key={paragraph.id}
          className={`m-0 p-0 ${
            paragraph.isHeader
              ? 'mb-5 sm:mb-6 md:mb-7 font-normal'
              : 'mb-4 sm:mb-5 md:mb-6'
          } last:mb-0`}
        >
          {paragraph.words.map(({ word, delay }, wIndex) => (
            <React.Fragment key={wIndex}>
              <span
                className={instant ? 'word-revealed-instant' : 'word-reveal'}
                style={instant ? undefined : { animationDelay: `${delay}ms` }}
              >
                {word}
              </span>
              {wIndex < paragraph.words.length - 1 && ' '}
            </React.Fragment>
          ))}
        </p>
      ))}
    </article>
  );
}
