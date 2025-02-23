import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import CreditCardComponent from "./creditcard";
import { CreditCard } from "./creditcard";
import { Button } from "../ui/button";
import { useState } from "react";
import CreditCardForm from "./cardForm";

type SelectCreditCardProps = {
  cards: CreditCard[];
  selectedCard: string | null;
  setSelectedCard: (e:string) => void;
};

export default function SelectCreditCard({
  cards,
  selectedCard,
  setSelectedCard
}: SelectCreditCardProps) {
  const [addCard, setAddCard] = useState(false);

  function onAddCard() {
    setAddCard(true);
  }
  function handleCancel() {
    setAddCard(false);
  }

  function onClick(event: React.MouseEvent<HTMLButtonElement>) {
    //onSelectCard(event.currentTarget.id);
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
              >
                <CreditCardComponent
                  card={card}
                  className={
                    "w-80 " +
                    ("" + card.id === selectedCard ? "bg-green-300" : "")
                  }
                ></CreditCardComponent>
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
