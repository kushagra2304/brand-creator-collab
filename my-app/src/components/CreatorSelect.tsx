import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Creator } from "../types";

interface Props {
  creators: Creator[];
  onSelect: (creator: Creator) => void;
}

export default function CreatorSelect({ creators, onSelect }: Props) {
  return (
    <Card className="shadow-md">
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-2">Choose a Creator</h2>
        <Select
          onValueChange={(id) =>
            onSelect(creators.find((c) => c.id === Number(id))!)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a Creator" />
          </SelectTrigger>
          <SelectContent>
            {creators.map((c) => (
              <SelectItem key={c.id} value={c.id.toString()}>
                {c.name} ({c.platform})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
