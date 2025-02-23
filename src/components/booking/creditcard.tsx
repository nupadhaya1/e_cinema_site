import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type CreditCardProps = {
    card: CreditCard
    className?: string
};

export interface CreditCard  {
    id: number;
    cardNumber: number;
    cardName: string;
    cardType: string;
    exp: string;
}

export default function CreditCardComponent({card, className}: CreditCardProps) {
  return (
    <Card  className={className}>
      <CardHeader>
        <CardTitle>Card {card.id}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col ">
        <div>{card.cardNumber + " "}{card.exp}</div>
        
        <div>{card.cardName} {card.cardType}</div> 

      </CardContent>
    </Card>
  );
}
