"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type CreditCardProps = {
  card: CreditCardInterface;
  className?: string;
};

export interface CreditCardInterface {
  id: number;
  cardNumber: bigint;
  cardName: string;
  cardType: string;
  exp: string;
}

export default function CreditCard({ card, className }: CreditCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Card {card.id}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        <div>
          {card.cardNumber + " "}
          {card.exp}
        </div>

        <div>
          {card.cardName} {card.cardType}
        </div>
      </CardContent>
    </Card>
  );
}
