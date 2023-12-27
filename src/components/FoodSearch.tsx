import React, { useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/lib/supabase";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function FoodSearch({ setFieldValue }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [foodList, setFoodList] = React.useState([]);

  useEffect(() => {
    supabase
      .from("food_db")
      .select()
      .then(({ data }) => {
        if (data) {
          setFoodList(data as any);
        }
      });
  }, []);

  const selectedFood = foodList?.find(
    (framework: any) => framework.name?.toLowerCase() === value
  ) as any;

  useEffect(() => {
    setFieldValue({
      calories: selectedFood?.calories,
      protein: selectedFood?.protein,
      fat: selectedFood?.fat,
      carb: selectedFood?.carb,
    });
  }, [selectedFood?.calories]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? (
                foodList.find(
                  (framework: any) => framework.name?.toLowerCase() === value
                ) as any
              )?.name
            : "Select from Food DB..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search food DB..." />
          <CommandEmpty>No Food found.</CommandEmpty>
          <CommandGroup>
            {foodList?.map((framework: any) => (
              <CommandItem
                key={framework.name}
                value={framework.name?.toLowerCase()}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === framework.name ? "opacity-100" : "opacity-0"
                  )}
                />
                {framework.name?.length > 20
                  ? framework.name?.slice(0, 19) + `...`
                  : framework?.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
