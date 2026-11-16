"use client";

import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { ChipButton } from "@/components/ui/pill";
import { TokenIcon } from "@/components/ui/token-icon";
import { useToast } from "@/hooks/use-toast";
import { BASE_URL } from "../utils/httpClient";

const QUICK_AMOUNTS = ["1000", "5000", "25000", "100000"];

export default function DepositModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/order/onramp`, {
        amount,
        userId: "1",
      });
      console.log("response: ", response.data.message);
      toast({
        variant: "success",
        title: "Success!",
        description: "Money has been deposited successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Failed to Deposit Money",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogPopup className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Deposit funds</DialogTitle>
          <DialogDescription>
            Credited to your trading balance right away.
          </DialogDescription>
        </DialogHeader>
        <DialogPanel className="flex flex-col gap-5" scrollFade={false}>
          <div className="border-apple flex items-center justify-between rounded-xl bg-surface px-4 py-3">
            <span className="flex items-center gap-3">
              <TokenIcon src="/usdc copy.webp" symbol="INR" />
              <span className="flex flex-col gap-1">
                <span className="font-medium text-heading text-sm leading-none">
                  INR
                </span>
                <span className="text-foreground/40 text-xs leading-none">
                  Indian Rupee
                </span>
              </span>
            </span>
            <span className="label-caps">Asset</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="label-caps" htmlFor="amount">
              Amount
            </label>
            <InputGroup>
              <InputGroupInput
                autoComplete="off"
                className="h-12 text-right text-base"
                id="amount"
                inputMode="decimal"
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                type="number"
                value={amount}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>INR</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <div className="grid grid-cols-4 gap-2">
              {QUICK_AMOUNTS.map((quick) => (
                <ChipButton
                  active={amount === quick}
                  className="num"
                  key={quick}
                  onClick={() => setAmount(quick)}
                >
                  {Number(quick).toLocaleString("en-US")}
                </ChipButton>
              ))}
            </div>
          </div>
        </DialogPanel>
        <DialogFooter variant="bare">
          <Button
            className="w-full"
            loading={isLoading}
            onClick={handleClick}
            size="lg"
          >
            Deposit
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
