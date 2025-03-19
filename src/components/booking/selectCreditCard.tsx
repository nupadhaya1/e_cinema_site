"use client";

import { Card, CardContent } from "../ui/card";
import CreditCard from "./creditcard";
import { Button } from "../ui/button";
import { use, useState } from "react";
import CreditCardForm from "./EnterCreditCardInfo";
import { CreditCardInterface } from "./creditcard";
import { useEffect } from "react";
import { Trash } from "lucide-react";

const MAXNUMCARDS = 4;

type SelectCreditCardProps = {
  selectedCard: string | null;
  setSelectedCard: (e: string | null) => void;
  disableButtons?: boolean;
  handleConfirmBooking: () => Promise<void>;
};

export default function SelectCreditCard({
  selectedCard,
  setSelectedCard,
  disableButtons = false,
  handleConfirmBooking,
}: SelectCreditCardProps) {
  const [addCard, setAddCard] = useState(false);
  const [cards, setCards] = useState<CreditCardInterface[]>();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchData = async () => {
      const response = await fetch("/api/creditcard");
      const result = await response.json();
      setCards(result);
      setRefresh(false);
      setAddCard(false);
    };

    fetchData();
  }, [refresh]);

  function onAddCard() {
    setAddCard(true);
  }
  function handleCancel() {
    setAddCard(false);
  }

  function onClick(event: React.MouseEvent<HTMLButtonElement>) {
    setSelectedCard(event.currentTarget.id);
    //console.log(event.currentTarget.id);
  }

  async function handleDeleteCard(card: CreditCardInterface) {
    //console.log("click");
    setSelectedCard(null);
    try {
      const response = await fetch("/api/creditcard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...card, delete: true }),
      });
      setRefresh(true);
    } catch (error) {
      console.log("error deleting card: " + error);
    }
  }

  return (
    <main className="w-full space-y-4">
      <Card className="p-4">
        <h1 className="">Payment Methods</h1>
        <CardContent className="">
          {/* Changed flex container to vertical list */}
          <div className="flex flex-col">
            {cards != null &&
              cards.map((card, index) => (
                <div key={"div" + card.id} className="flex flex-row">
                  <button
                    key={card.id}
                    id={"" + card.id}
                    onClick={onClick}
                    className="flex w-full flex-row justify-between p-2"
                    disabled={disableButtons}
                  >
                    <CreditCard
                      index={index}
                      card={card}
                      className={
                        "w-full " +
                        ("" + card.id === selectedCard ? "bg-green-300" : "")
                      }
                    />
                  </button>
                  <button
                    key={"deletebutton_" + card.id}
                    type="button"
                    onClick={() => handleDeleteCard(card)}
                  >
                    <Trash size={30} color="red" />
                  </button>
                </div>
              ))}
          </div>
        </CardContent>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-1">
            <Button
              onClick={onAddCard}
              className=""
              disabled={
                addCard || (cards != null && cards.length >= MAXNUMCARDS)
              }
            >
              Add Card
            </Button>
            {addCard && (
              <Button onClick={handleCancel} className="">
                Cancel
              </Button>
            )}
          </div>
          <Button
            onClick={handleConfirmBooking}
            className=" "
            disabled={selectedCard === null}
          >
            Confirm Booking
          </Button>
        </div>
        {addCard && (
          <CreditCardForm refresh={refresh} setRefresh={setRefresh} />
        )}
      </Card>
    </main>
  );
}
