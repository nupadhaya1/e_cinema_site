"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import CreditCard from "./CreditCard";
import { Button } from "../ui/button";
import { useState } from "react";
import CreditCardForm from "./EnterCreditCardInfo";

type SelectCreditCardProps = {
  selectedCard: string | null;
  setSelectedCard: (e:string) => void;
  disableButtons?: boolean;
};



export function getCreditCards() {
  return [
    {
      id: 1,
      cardNumber: 1111111111111111,
      cardName: "bob",
      cardType: "visa",
      exp: "01/28",
    },
    {
      id: 2,
      cardNumber: 111111111111111,
      cardName: "bob",
      cardType: "visa",
      exp: "01/28",
    },
    // {
    //   id: 3,
    //   cardNumber: 12222222222222,
    //   cardName: "bob",
    //   cardType: "visa",
    //   exp: "01/28",
    // },
  ];
}

export default function SelectCreditCard({
  //cards,
  selectedCard,
  setSelectedCard, 
  disableButtons=false
}: SelectCreditCardProps) {
  const [addCard, setAddCard] = useState(false);

  let cards = getCreditCards();

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
    <>
      <Card>
        <CardHeader>
          <CardTitle>Cards</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col lg:flex-row">
            {cards.map((card) => (
              <button
                key={card.id}
                id={"" + card.id}
                onClick={onClick}
                className={"flex w-96 flex-row justify-between p-1"}
                disabled={disableButtons}
              >
                <CreditCard
                  card={card}
                  className={
                    "w-80 " +
                    ("" + card.id === selectedCard ? "bg-green-300" : "")
                  }
                ></CreditCard>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-row gap-1">
        <Button
          onClick={onAddCard}
          className="mt-4"
          disabled={addCard || cards.length >= 3}
        >
          Add Card
        </Button>
        {addCard && (
          <Button onClick={handleCancel} className="mt-4">
            Cancel
          </Button>
        )}
      </div>

      {addCard && <CreditCardForm></CreditCardForm>}
    </>
  );
}
