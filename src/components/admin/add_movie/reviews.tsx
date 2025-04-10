"use client";

import { useState } from "react";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { FormLabel } from "~/components/ui/form";

import { Badge } from "~/components/ui/badge";
import { stateTuple } from "~/components/utils";

type AddreviewComponentProps = {
  reviewState: stateTuple<string[]>;
  loading: boolean;
};

export default function AdminAddReviewComponent({
  reviewState,
  loading,
}: AddreviewComponentProps) {
  const [review, setreview] = reviewState;
  const [reviewInput, setreviewInput] = useState("");

  const addreviewMember = () => {
    if (reviewInput.trim() && !review.includes(reviewInput.trim())) {
      setreview([...review, reviewInput.trim()]);
      setreviewInput("");
    }
  };

  const removereviewMember = (index: number) => {
    setreview(review.filter((_, i) => i !== index));
  };

  return (
    <>
      <FormLabel>Reviews</FormLabel>
      <div className="mt-2 flex items-center gap-2">
        <Input
          placeholder="Enter review"
          value={reviewInput}
          onChange={(e) => setreviewInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addreviewMember();
            }
          }}
        />
        <Button
          type="button"
          onClick={addreviewMember}
          size="sm"
          disabled={loading}
        >
          <Plus className="mr-1 h-4 w-4" /> Add
        </Button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {review.map((member, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {member}
            <button
              type="button"
              onClick={() => removereviewMember(index)}
              className="ml-1 text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="h-3 w-3" />
              <span className="sr-only">Remove {member}</span>
            </button>
          </Badge>
        ))}
      </div>
    </>
  );
}
