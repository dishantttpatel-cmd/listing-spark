import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminUsers } from "./AdminUsers";
import { AdminListings } from "./AdminListings";
import { AdminTransactions } from "./AdminTransactions";
import { AdminPacks } from "./AdminPacks";

export default function AdminPanel() {
  const [tab, setTab] = useState("users");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="packs">Packs</TabsTrigger>
        </TabsList>
        <TabsContent value="users"><AdminUsers /></TabsContent>
        <TabsContent value="listings"><AdminListings /></TabsContent>
        <TabsContent value="transactions"><AdminTransactions /></TabsContent>
        <TabsContent value="packs"><AdminPacks /></TabsContent>
      </Tabs>
    </div>
  );
}
