"use client";

import { Card, CardContent } from "../ui/card";
import CreditCard from "./creditcard";
import { Button } from "../ui/button";
import { useState } from "react";
import CreditCardForm from "./EnterCreditCardInfo";
import { CreditCardInterface } from "./creditcard";
import { useEffect } from "react";

type SelectCreditCardProps = {
  selectedCard: string | null;
  setSelectedCard: (e: string) => void;
  disableButtons?: boolean;
};

// export function getCreditCards() {
//   return [
//     {
//       id: 1,
//       cardNumber: 1111111111111111,
//       cardName: "bob",
//       cardType: "visa",
//       exp: "01/28",
//     },
//     {
//       id: 2,
//       cardNumber: 111111111111111,
//       cardName: "bob",
//       cardType: "visa",
//       exp: "01/28",
//     },
//   ];
// }

export default function SelectCreditCard({
  selectedCard,
  setSelectedCard,
  disableButtons = false,
}: SelectCreditCardProps) {
  const [addCard, setAddCard] = useState(false);
  const [cards, setCards] = useState<CreditCardInterface[]>();
  const [numCards, setNumCards] = useState<number | null>();

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchData = async () => {
      const response = await fetch("/api/creditcard");
      const result = await response.json();
      setCards(result);
    };

    fetchData();
    setNumCards(cards?.length)
  }, [numCards]);  // Empty dependency array, runs only once on mount

  function onAddCard() {
    setAddCard(true);
  }
  function handleCancel() {
    setAddCard(false);
  }

  function onClick(event: React.MouseEvent<HTMLButtonElement>) {
    setSelectedCard(event.currentTarget.id);
    console.log(event.currentTarget.id);
  }

  return (
    <main className="w-full space-y-4">
      <Card className="p-4">
        <h1 className="">Payment Methods</h1>
        <CardContent className="">
          {/* Changed flex container to vertical list */}
          <div className="flex flex-col">
           
            {cards != null && cards.map((card) => (
              <button
                key={card.id}
                id={"" + card.id}
                onClick={onClick}
                className="flex w-full flex-row justify-between p-2"
                disabled={disableButtons}
              >
                <CreditCard
                  card={card}
                  className={
                    "w-full " +
                    ("" + card.id === selectedCard ? "bg-green-300" : "")
                  }
                />
              </button>
            ))}
          </div>
        </CardContent>
        <div className="flex flex-row gap-1">
          <Button
            onClick={onAddCard}
            className=""
            disabled={addCard || (numCards != null && numCards >= 3)}
          >
            Add Card
          </Button>
          {addCard && (
            <Button onClick={handleCancel} className="">
              Cancel
            </Button>
          )}
        </div>

        {addCard && <CreditCardForm />}
      </Card>
    </main>
  );
}
