"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { PaymentIcon, PaymentType } from 'react-svg-credit-card-payment-icons';

type CreditCardProps = {
  card: CreditCardInterface;
  className?: string;
  index: number;
};

export interface CreditCardInterface {
  id: number;
  cardNumber: bigint;
  cardName: string;
  cardType: PaymentType;
  exp: string;
}

export default function CreditCard({
  card,
  index,
  className,
}: CreditCardProps) {



  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Card {index + 1}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
          <div>
            {card.cardNumber + "  " + card.exp}
            {}
          </div>
          <div className="">
            {card.cardName} 
            {<PaymentIcon type={card.cardType} format="flatRounded" width={50} />}
          </div>
      </CardContent>
    </Card>
  );
}
