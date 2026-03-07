import React from "react";
import { User, Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileSection from "./account/ProfileSection";
import OrdersSection from "./account/OrdersSection";

const Profile = () => {
  const params = useParams();
  const userId = params.userId;
  const currentUserRole = useSelector((state) => state.User?.user?.role);
  const isAdmin = currentUserRole === "admin";

  return (
    <div className="dark pt-28 pb-10 min-h-screen bg-[#262a30] px-4">
      <Tabs defaultValue="profile" className="max-w-4xl mx-auto">
        <TabsList
          className={`grid w-full mb-8 bg-[#2d3136] border border-white/10 ${
            isAdmin ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-teal-500 data-[state=active]:text-white text-gray-300"
          >
            <User className="w-4 h-4 mr-2" /> Profile
          </TabsTrigger>
          {!isAdmin && (
            <TabsTrigger
              value="orders"
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-white text-gray-300"
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
