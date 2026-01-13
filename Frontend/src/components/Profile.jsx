import React from "react"
import { User, Package, Camera } from "lucide-react" 
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const Profile = () => {
  return (
    <div className='pt-28 pb-10 min-h-screen bg-[#dbdfe4] px-4'>
      <Tabs defaultValue="profile" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/50 border border-gray-300">
          <TabsTrigger value="profile" className="data-[state=active]:bg-[#FF3F6C] data-[state=active]:text-white">
            <User className="w-4 h-4 mr-2" /> Profile
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-[#FF3F6C] data-[state=active]:text-white">
            <Package className="w-4 h-4 mr-2" /> Orders
          </TabsTrigger>
        </TabsList>

        {/* --- PROFILE TAB UI IMPROVED --- */}
        <TabsContent value="profile">
          <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-100 pb-6">
              <CardTitle className="text-2xl font-bold text-[#3E4152]">Account Settings</CardTitle>
              <CardDescription>Update your personal information below.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="flex flex-col md:flex-row gap-10 items-start">
                
                {/* Profile Picture UI */}
                <div className="flex flex-col items-center space-y-4 w-full md:w-1/3">
                  <div className="relative">
                    <img 
                      src="/a.jpg" 
                      alt="profile" 
                      className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg ring-1 ring-gray-200" 
                    />
                    <label className="absolute bottom-2 right-2 p-2 bg-[#FF3F6C] text-white rounded-full cursor-pointer hover:scale-110 transition-transform">
                       <Camera size={18} />
                       <Input type="file" accept="image/*" className="hidden"/>
                    </label>
                  </div>
                </div>

                {/* Form UI - No Extra Logic */}
                <form className="flex-1 space-y-4 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">First Name</Label>
                      <Input type="text" placeholder="First Name" className="focus-visible:ring-[#FF3F6C] border-gray-200" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">Last Name</Label>
                      <Input type="text" placeholder="Last Name" className="focus-visible:ring-[#FF3F6C] border-gray-200" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-600">Email Address</Label>
                    <Input type="email" disabled className="bg-gray-100 text-gray-500 cursor-not-allowed" placeholder="Email" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-600">Phone No</Label>
                    <Input type="text" placeholder="Phone Number" className="focus-visible:ring-[#FF3F6C]" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">City</Label>
                      <Input type="text" placeholder="City" className="focus-visible:ring-[#FF3F6C]" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">Zip Code</Label>
                      <Input type="text" placeholder="Zip Code" className="focus-visible:ring-[#FF3F6C]" />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-[#FF3F6C] hover:bg-[#e0355f] text-white font-bold h-11 shadow-md">
                    Update Profile
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- ORDERS TAB (NOT TOUCHED) --- */}
        <TabsContent value="orders">
          {/* Aapka puraana order section yahan rahega */}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Profile