import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Brand } from "../types";

interface Props {
  brands: Brand[];
  onSelect: (brand: Brand) => void;
}

export default function BrandSelect({ brands, onSelect }: Props) {
  return (
    <Card className="shadow-md">
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-2">Choose a Brand</h2>
        <Select
          onValueChange={(id) =>
            onSelect(brands.find((b) => b.id === Number(id))!)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a Brand" />
          </SelectTrigger>
          <SelectContent>
            {brands.map((b) => (
              <SelectItem key={b.id} value={b.id.toString()}>
                {b.brandName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
