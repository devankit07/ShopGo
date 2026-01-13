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
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userslice";

const Login = () => {
  const [showpassword, setshowpassword] = useState(false);
  const [loading, setloading] = useState(false);
  const [formdata, setformdata] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setformdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const submithandler = async (e) => {
    e.preventDefault();
    console.log(formdata);
    try {
      setloading(true);
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/login`,
        formdata
      );

      if (res.data.success) {
        navigate("/");
        dispatch(setUser(res.data.user))
        localStorage.setItem('accesstoken',res.data.accesstoken)
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    } finally {
      setloading(false);
    }
  };
  return (
   <div className="flex justify-center items-center min-h-screen bg-[#dbdfe4] p-4">
  <Card className="w-full max-w-md shadow-2xl border-none ring-1 ring-gray-300/50">
    <CardHeader className="text-center space-y-1">
      <CardTitle className="text-2xl font-extrabold text-[#3E4152]">
        Login to your account
      </CardTitle>
      <CardDescription className="text-[#7E818C]">
        Enter your email below to login to your account
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form onSubmit={submithandler} className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-sm font-semibold text-[#3E4152]">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            value={formdata.email}
            onChange={handleChange}
            className="border-gray-300 focus-visible:ring-[#FF3F6C] h-11 bg-white"
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" name="password" className="text-sm font-semibold text-[#3E4152]">Password</Label>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              placeholder="Enter Your password"
              required
              type={showpassword ? "text" : "password"}
              value={formdata.password}
              onChange={handleChange}
              className="border-gray-300 focus-visible:ring-[#FF3F6C] h-11 bg-white"
            />
            <div 
              className="absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-[#FF3F6C]"
              onClick={() => setshowpassword(!showpassword)}
            >
              {showpassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>
        </div>

        <Button
          disabled={loading}
          type="submit"
          className="w-full h-11 mt-2 bg-[#FF3F6C] hover:bg-[#e0355f] text-white font-bold rounded-md transition-all active:scale-[0.98] shadow-md shadow-pink-200"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Please wait
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </CardContent>
    <CardFooter className="flex flex-col gap-4 border-t border-gray-100 pt-6">
      <p className="text-sm text-[#7E818C] text-center">
        Don't have an account?{" "}
        <Link
          className="font-bold text-[#FF3F6C] hover:underline"
          to={"/signup"}
        >
          Signup
        </Link>
      </p>
    </CardFooter>
  </Card>
</div>
  );
};

export default Login;
