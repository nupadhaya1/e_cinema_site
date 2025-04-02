"use client";

import { useState } from "react";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { FormLabel } from "~/components/ui/form";

import { Badge } from "~/components/ui/badge";
import { stateTuple } from "~/components/utils";

type AddCastComponentProps = {
  castState: stateTuple<string[]>;
  loading: boolean;
};

export default function AdminAddCastComponent({
  castState,
  loading,
}: AddCastComponentProps) {
  const [cast, setCast] = castState;
  const [castInput, setCastInput] = useState("");

  const addCastMember = () => {
    if (castInput.trim() && !cast.includes(castInput.trim())) {
      setCast([...cast, castInput.trim()]);
      setCastInput("");
    }
  };

  const removeCastMember = (index: number) => {
    setCast(cast.filter((_, i) => i !== index));
  };

  return (
    <>
      <FormLabel>Cast</FormLabel>
      <div className="mt-2 flex items-center gap-2">
        <Input
          placeholder="Enter cast member name"
          value={castInput}
          onChange={(e) => setCastInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCastMember();
            }
          }}
        />
        <Button
          type="button"
          onClick={addCastMember}
          size="sm"
          disabled={loading}
        >
          <Plus className="mr-1 h-4 w-4" /> Add
        </Button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {cast.map((member, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {member}
            <button
              type="button"
              onClick={() => removeCastMember(index)}
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
