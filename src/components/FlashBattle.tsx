// Flash battle component from the UI kit (simplified)
"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function FlashBattle({
  battleId,
  onAction,
}: {
  battleId: string;
  onAction: (action: "buy" | "sell") => void;
}) {
  return (
    <Card className="bg-card text-foreground">
      <CardHeader>
        <CardTitle>Flash Battle #{battleId}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">Realtime battle actions will appear here.</p>
        <div className="flex gap-2 justify-center">
          <Button onClick={() => onAction("buy")} variant="outline">Buy</Button>
          <Button onClick={() => onAction("sell")} variant="outline">Sell</Button>
        </div>
      </CardContent>
    </Card>
  );
}
