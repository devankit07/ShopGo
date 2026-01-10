import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const Signup = () => {
  const [showpassword, setshowpassword] = useState(false);
  const [loading, setloading] = useState(false);
  const [formdata, setformdata] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setformdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
 const submithandler = async (e) => {
    e.preventDefault();
    console.log(formdata)
    try {
      setloading(true)
      const res = await axios.post(`http://localhost:8000/api/v1/user/register`, formdata);
      
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/verify');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message );
    } finally{
      setloading(false)
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Create an account
          </CardTitle>
          <CardDescription>
            Enter your details below to create your ShopGo account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  required
                  value={formdata.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  required
                  value={formdata.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email Row */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                value={formdata.email}
                onChange={handleChange}
              />
            </div>

            {/* Password Row */}
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  placeholder="create a password"
                  required
                  type={showpassword ? "text" : "password"}
                  value={formdata.password}
                  onChange={handleChange}
                />
                {showpassword ? (
                  <EyeOff
                    onClick={() => {
                      setshowpassword(false);
                    }}
                    className="w-5 h-5 text-gray-700 absolute right-5 bottom-2"
                  />
                ) : (
                  <Eye
                    onClick={() => {
                      setshowpassword(true);
                    }}
                    className="w-5 h-5 text-gray-700 absolute right-5 bottom-2"
                  />
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button onClick={submithandler} type="submit" className="w-full cursor-pointer bg-pink-500 hover:bg-pink-600">
            {loading?<><Loader2 className="w-4 h-4 animate-spin mr-2"/>please wait</>:'Signup'} 
          </Button>
          <p className="gap-2 flex">
            Already have an account
            <Link
              className="hover:underline cursor-pointer text-pink-800"
              to={"/login"}
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
