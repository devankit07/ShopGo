import { Headphones, Shield, Truck } from 'lucide-react'
import React from 'react'

const Features = () => {
  return (
    // bg-[#dbdfe4] ke saath match karne ke liye humne ise pure white/translucent rakha hai
    <section className='py-16 bg-white/50 border-y border-gray-200'>
        <div className='max-w-7xl mx-auto px-6'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
               
               {/* Feature 1 */}
               <div className='flex items-center space-x-5 group'>
                 <div className='h-14 w-14 bg-pink-50 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300'>
                    <Truck className='h-7 w-7 text-[#FF3F6C]'/>
                </div>
                <div>
                    <h3 className='font-bold text-[#3E4152] text-lg'>Free Shipping</h3>
                    <p className='text-gray-500 text-sm'>On all orders above $40</p>
                </div>
               </div>

               {/* Feature 2 */}
               <div className='flex items-center space-x-5 group'>
                 <div className='h-14 w-14 bg-pink-50 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300'>
                    <Shield className='h-7 w-7 text-[#FF3F6C]'/>
                </div>
                <div>
                    <h3 className='font-bold text-[#3E4152] text-lg'>Secure Payment</h3>
                    <p className='text-gray-500 text-sm'>100% Secure Transactions</p>
                </div>
               </div>

               {/* Feature 3 */}
               <div className='flex items-center space-x-5 group'>
                 <div className='h-14 w-14 bg-pink-50 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300'>
                    <Headphones className='h-7 w-7 text-[#FF3F6C]'/>
                </div>
                <div>
                    <h3 className='font-bold text-[#3E4152] text-lg'>24/7 Support</h3>
                    <p className='text-gray-500 text-sm'>Dedicated customer help</p>
                </div>
               </div>

            </div>
        </div>
    </section>
  )
}

export default Features