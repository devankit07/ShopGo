import React from "react";
import { User, Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileSection from "./account/ProfileSection";
import OrdersSection from "./account/OrdersSection";
import DarkMeshBackdrop from "@/components/ui/DarkMeshBackdrop";

const Profile = () => {
  const params = useParams();
  const userId = params.userId;
  const currentUserRole = useSelector((state) => state.User?.user?.role);
  const isAdmin = currentUserRole === "admin";

  return (
    <div className="dark relative overflow-hidden pt-28 pb-10 min-h-screen bg-[#030508] px-4">
      <DarkMeshBackdrop glow="top" />
      <Tabs defaultValue="profile" className="relative z-10 max-w-4xl mx-auto">
        <TabsList
          className={`grid w-full mb-8 bg-white/10 backdrop-blur border border-white/20 ${
            isAdmin ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-[#fc8019] data-[state=active]:text-white text-gray-200"
          >
            <User className="w-4 h-4 mr-2" /> Profile
          </TabsTrigger>
          {!isAdmin && (
            <TabsTrigger
              value="orders"
              className="data-[state=active]:bg-[#fc8019] data-[state=active]:text-white text-gray-200"
            >
              <Package className="w-4 h-4 mr-2" /> Orders
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile">
          <ProfileSection userId={userId} />
        </TabsContent>

        {!isAdmin && (
          <TabsContent value="orders">
            <OrdersSection userId={userId} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Profile;
