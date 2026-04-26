import { HowItWorksQrCard } from "./HowItWorksQrCard";

const QR_CARDS: Array<{ rotation: number; translateX: number }> = [
  { rotation: -6, translateX: -18 },
  { rotation: 0, translateX: 0 },
  { rotation: 6, translateX: 18 },
];

export const HowItWorksStep1 = () => (
  <div className="relative flex h-40 items-center justify-center">
    <div className="relative flex h-37.5 w-37.5 items-center justify-center">
      {QR_CARDS.map((card) => (
        <HowItWorksQrCard
          key={card.rotation}
          rotation={card.rotation}
          translateX={card.translateX}
        />
      ))}
    </div>
  </div>
);
