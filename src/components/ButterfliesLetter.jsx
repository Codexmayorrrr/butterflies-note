import React from 'react';

const letterParagraphs = [
  "To the butterflies we feel in our bellies",
  "They say butterflies are pretty, but the butterflies don’t know this because they can’t see their wings. I know I say you are pretty all the time and you probably don’t believe me, and I get why you don’t sometimes, because when you are the one wearing the wings you don’t really get the view from out here.",
  "Still, hear me when I say that you are one of the prettiest things my eyes have seen. You are so pretty that I find myself up some nights, wondering what games my ancestors are playing in the great hallowed halls. From the look of things, I’d say they are doing a really spectacular job.",
  "I don’t think you realize how uncommon it is to meet someone who feels like a story people only tell by firelight, the kind where everyone leans in a little closer because nobody is completely sure if the person was real or just a rumor the village made up to feel luckier. If they ever write one about you, I hope they get the small details right. The way you make it so easy to forget whatever else was supposed to be on my mind.",
  "Omosimisola, the name that holds quite a bit of volume. Orekelewa, the pretty one, the one of fables and myths, the one my ancestors clearly spent extra time plotting over before they let our paths cross.",
  "So the next time I tell you that you are pretty and you feel like brushing it off, maybe don’t. Take my word for it, since you don’t have my eyes to see what I see. Let it sit for a second. You don’t have to argue with a fact.",
  "If those butterflies never quite figure out how to settle down, I honestly don’t think I will be complaining."
];

export default function ButterfliesLetter() {
  return (
    <article
      data-testid="figma-frame-1-2"
      className="relative w-[390px] h-[651px] bg-parchment pt-[50px] pb-[50px] px-[30px] box-border overflow-hidden select-text flex flex-col justify-start"
      aria-label="To the butterflies we feel in our bellies"
    >
      <div
        data-testid="figma-content-1-3"
        className="w-[330px] min-w-0 font-corsiva text-[12px] leading-[19px] text-charcoal-muted text-justify"
      >
        {letterParagraphs.map((paragraph, index) => (
          <p
            key={index}
            className={`m-0 p-0 ${index < letterParagraphs.length - 1 ? 'mb-[19px]' : ''}`}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
