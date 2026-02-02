import React, { useState } from "react";
import { User, Package, Camera, Loader2 } from "lucide-react"; // Loader2 add kiya
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import userlogo from "../assets/user-icon.webp";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "@/redux/userslice";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const params = useParams();
  const userId = params.userId;
  const dispatch = useDispatch();

  // Loader state
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const getInitialData = () => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const data = user || savedUser;
    return {
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      phoneNo: data?.phoneNo || "",
      address: data?.address || "",
      city: data?.city || "",
      ZipCode: data?.ZipCode || "",
      profilepic: data?.profilepic || "",
      role: data?.role || "",
    };
  };

  const [updateUser, setUpdateUser] = useState(getInitialData());

  const handlechange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
  };

  const handlefilechange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUpdateUser({
        ...updateUser,
        profilepic: URL.createObjectURL(selectedFile),
      });
    }
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const accesstoken = localStorage.getItem("accesstoken");

    try {
      const formData = new FormData();
      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("phoneNo", updateUser.phoneNo);
      formData.append("city", updateUser.city);
      formData.append("ZipCode", updateUser.ZipCode);
      formData.append("address", updateUser.address);

      if (file) {
        formData.append("file", file);
      }

      const res = await axios.put(
        `http://localhost:8000/api/v1/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accesstoken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.data.success) {
        toast.success("Profile updated successfully!");

        dispatch(setUser(res.data.user));
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
    } catch (error) {
      console.log(error);
      toast.error("Update fail ho gaya!");
    } finally {
      setLoading(false);
    }
  };

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
          <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-100 pb-6">
              <CardTitle className="text-2xl font-bold text-[#3E4152]">
                Account Settings
              </CardTitle>
              <CardDescription>
                Update your personal information below.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="flex flex-col md:flex-row gap-10 items-start">
                {/* Profile Picture */}
                <div className="flex flex-col items-center space-y-4 w-full md:w-1/3">
                  <div className="relative">
                    <img
                      src={updateUser.profilepic || userlogo}
                      alt="profile"
                      className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg ring-1 ring-gray-200"
                    />
                    <label className="absolute bottom-2 right-2 p-2 bg-[#FF3F6C] text-white rounded-full cursor-pointer">
                      <Camera size={18} />
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlefilechange}
                      />
                    </label>
                  </div>
                </div>

                {/* Form */}
                <form
                  onSubmit={handlesubmit}
                  className="flex-1 space-y-4 w-full"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input
                        type="text"
                        name="firstName"
                        value={updateUser.firstName}
                        onChange={handlechange}
                        className="focus-visible:ring-[#FF3F6C]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input
                        type="text"
                        name="lastName"
                        value={updateUser.lastName}
                        onChange={handlechange}
                        className="focus-visible:ring-[#FF3F6C]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      value={updateUser.email}
                      disabled
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Phone No</Label>
                    <Input
                      type="text"
                      name="phoneNo"
                      value={updateUser.phoneNo}
                      onChange={handlechange}
                      className="focus-visible:ring-[#FF3F6C]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input
                        type="text"
                        name="city"
                        value={updateUser.city}
                        onChange={handlechange}
                        className="focus-visible:ring-[#FF3F6C]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Zip Code</Label>
                      <Input
                        type="text"
                        name="ZipCode"
                        value={updateUser.ZipCode}
                        onChange={handlechange}
                        className="focus-visible:ring-[#FF3F6C]"
                      />
                    </div>
                  </div>

                  {/* Button with Loader */}
                  <Button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-[#FF3F6C] hover:bg-[#e0355f] text-white font-bold h-11"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Profile"
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
