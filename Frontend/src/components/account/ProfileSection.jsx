import React, { useState, useEffect } from "react";
import { Camera, Loader2 } from "lucide-react";
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
import { useDispatch, useSelector } from "react-redux";
import userlogo from "../../assets/user-icon.webp";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "@/redux/userslice";

const API_BASE = "http://localhost:8000/api/v1";

export default function ProfileSection({ userId }) {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [file, setFile] = useState(null);

  const [updateUser, setUpdateUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    ZipCode: "",
    profilePic: "",
  });

  // Fetch profile from backend on load so data persists after reload
  useEffect(() => {
    if (!userId) {
      setFetching(false);
      const saved = JSON.parse(localStorage.getItem("user") || "{}");
      if (saved?._id) {
        setUpdateUser({
          firstName: saved.firstName ?? "",
          lastName: saved.lastName ?? "",
          email: saved.email ?? "",
          phoneNo: saved.phoneNo ?? "",
          address: saved.address ?? "",
          city: saved.city ?? "",
          ZipCode: saved.ZipCode ?? "",
          profilePic: saved.profilePic ?? saved.profilepic ?? "",
        });
      }
      return;
    }
    const token = localStorage.getItem("accesstoken");
    if (!token) {
      setFetching(false);
      const saved = JSON.parse(localStorage.getItem("user") || "{}");
      if (saved?._id) {
        setUpdateUser({
          firstName: saved.firstName ?? "",
          lastName: saved.lastName ?? "",
          email: saved.email ?? "",
          phoneNo: saved.phoneNo ?? "",
          address: saved.address ?? "",
          city: saved.city ?? "",
          ZipCode: saved.ZipCode ?? "",
          profilePic: saved.profilePic ?? saved.profilepic ?? "",
        });
      }
      return;
    }
    axios
      .get(`${API_BASE}/user/get-user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success && res.data.user) {
          const u = res.data.user;
          setUpdateUser({
            firstName: u.firstName ?? "",
            lastName: u.lastName ?? "",
            email: u.email ?? "",
            phoneNo: u.phoneNo ?? "",
            address: u.address ?? "",
            city: u.city ?? "",
            ZipCode: u.ZipCode ?? "",
            profilePic: u.profilePic ?? "",
          });
          dispatch(setUser(res.data.user));
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      })
      .catch(() => {
        const saved = JSON.parse(localStorage.getItem("user") || "{}");
        if (saved?._id) {
          setUpdateUser({
            firstName: saved.firstName ?? "",
            lastName: saved.lastName ?? "",
            email: saved.email ?? "",
            phoneNo: saved.phoneNo ?? "",
            address: saved.address ?? "",
            city: saved.city ?? "",
            ZipCode: saved.ZipCode ?? "",
            profilePic: saved.profilePic ?? saved.profilepic ?? "",
          });
        }
      })
      .finally(() => setFetching(false));
  }, [userId, dispatch]);

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUpdateUser({
        ...updateUser,
        profilePic: URL.createObjectURL(selectedFile),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("accesstoken");
    try {
      const formData = new FormData();
      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("phoneNo", updateUser.phoneNo ?? "");
      formData.append("city", updateUser.city ?? "");
      formData.append("ZipCode", updateUser.ZipCode ?? "");
      formData.append("address", updateUser.address ?? "");
      if (file) formData.append("file", file);

      const res = await axios.put(
        `${API_BASE}/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success && res.data.user) {
        toast.success("Profile updated successfully!");
        const u = res.data.user;
        setUpdateUser((prev) => ({
          ...prev,
          firstName: u.firstName ?? prev.firstName,
          lastName: u.lastName ?? prev.lastName,
          email: u.email ?? prev.email,
          phoneNo: u.phoneNo ?? prev.phoneNo,
          address: u.address ?? prev.address,
          city: u.city ?? prev.city,
          ZipCode: u.ZipCode ?? prev.ZipCode,
          profilePic: u.profilePic ?? prev.profilePic,
        }));
        dispatch(setUser(res.data.user));
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setFile(null);
      }
    } catch (err) {
      toast.error("Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const displayPic = updateUser.profilePic || user?.profilePic || userlogo;

  if (fetching) {
    return (
      <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
        <CardContent className="pt-8 flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF3F6C]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-100 pb-6">
        <CardTitle className="text-2xl font-bold text-[#3E4152]">
          Account Settings
        </CardTitle>
        <CardDescription className="text-gray-600">
          Update your personal information below.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-8">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="flex flex-col items-center space-y-4 w-full md:w-1/3">
            <div className="relative">
              <img
                src={displayPic}
                alt="profile"
                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg ring-1 ring-gray-200"
              />
              <label className="absolute bottom-2 right-2 p-2 bg-[#FF3F6C] text-white rounded-full cursor-pointer">
                <Camera size={18} />
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex-1 space-y-4 w-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700">First Name</Label>
                <Input
                  type="text"
                  name="firstName"
                  value={updateUser.firstName}
                  onChange={handleChange}
                  className="focus-visible:ring-[#FF3F6C] text-gray-900 placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700">Last Name</Label>
                <Input
                  type="text"
                  name="lastName"
                  value={updateUser.lastName}
                  onChange={handleChange}
                  className="focus-visible:ring-[#FF3F6C] text-gray-900 placeholder:text-gray-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Email Address</Label>
              <Input
                type="email"
                value={updateUser.email}
                disabled
                className="bg-gray-100 cursor-not-allowed text-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Phone No</Label>
              <Input
                type="text"
                name="phoneNo"
                value={updateUser.phoneNo}
                onChange={handleChange}
                className="focus-visible:ring-[#FF3F6C] text-gray-900 placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Address</Label>
              <Input
                type="text"
                name="address"
                value={updateUser.address}
                onChange={handleChange}
                className="focus-visible:ring-[#FF3F6C] text-gray-900 placeholder:text-gray-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700">City</Label>
                <Input
                  type="text"
                  name="city"
                  value={updateUser.city}
                  onChange={handleChange}
                  className="focus-visible:ring-[#FF3F6C] text-gray-900 placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700">Zip Code</Label>
                <Input
                  type="text"
                  name="ZipCode"
                  value={updateUser.ZipCode}
                  onChange={handleChange}
                  className="focus-visible:ring-[#FF3F6C] text-gray-900 placeholder:text-gray-500"
                />
              </div>
            </div>
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
  );
}
