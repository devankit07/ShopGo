import React from "react";
import { User, Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";
import ProfileSection from "./account/ProfileSection";
import OrdersSection from "./account/OrdersSection";

const Profile = () => {
  const params = useParams();
  const userId = params.userId;

  return (
    <div className="pt-28 pb-10 min-h-screen bg-[#dbdfe4] px-4">
      <Tabs defaultValue="profile" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/50 border border-gray-300">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-[#FF3F6C] data-[state=active]:text-white"
          >
            <User className="w-4 h-4 mr-2" /> Profile
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="data-[state=active]:bg-[#FF3F6C] data-[state=active]:text-white"
          >
            <Package className="w-4 h-4 mr-2" /> Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSection userId={userId} />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersSection userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
