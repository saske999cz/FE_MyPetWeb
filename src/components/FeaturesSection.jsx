import React from "react";

function FeaturesSection() {
  return (
    <div className="w-full h-[70vh] flex flex-row items-center justify-center bg-black absolute top-[100vh]">
      <div className="w-full h-full flex flex-col items-center justify-start">
        <div className="w-full h-[20vh] flex flex-row items-center justify-center">
          <h1 className="text-[26px] text-white font-bold">FEATURES</h1>
        </div>
        <div className="w-full h-[40vh] flex flex-row items-center justify-around">
          <div className="w-[20%] h-[300px] bg-black rounded-md flex flex-col items-center justify-start px-12">
            <h1 className="text-[20px] text-white font-semibold mt-4">
              Shopping
            </h1>
            <p className="text-[16px] mt-4 text-white">
              Wide range of pet products: food, treats, toys, grooming supplies.
              Personalized recommendations. Easy navigation. Detailed product
              descriptions and customer reviews. Exclusive discounts. Fast
              delivery.
            </p>
          </div>
          <div className="w-[20%] h-[300px] bg-black rounded-md flex flex-col items-center justify-start px-12">
            <h1 className="text-[20px] text-white font-semibold mt-4">Adopt</h1>
            <p className="text-[16px] mt-4 text-white">
              Wide range of pet products: food, treats, toys, grooming supplies.
              Personalized recommendations. Easy navigation. Detailed product
              descriptions and customer reviews. Exclusive discounts. Fast
              delivery.
            </p>
          </div>
          <div className="w-[20%] h-[300px] bg-black rounded-md flex flex-col items-center justify-start px-12">
            <h1 className="text-[20px] text-white font-semibold mt-4">
              Appointment
            </h1>
            <p className="text-[16px] mt-4 text-white">
              Wide range of pet products: food, treats, toys, grooming supplies.
              Personalized recommendations. Easy navigation. Detailed product
              descriptions and customer reviews. Exclusive discounts. Fast
              delivery.
            </p>
          </div>
          <div className="w-[20%] h-[300px] bg-black rounded-md flex flex-col items-center justify-start px-12">
            <h1 className="text-[20px] text-white font-semibold mt-4">Blog</h1>
            <p className="text-[16px] mt-4 text-white">
              Wide range of pet products: food, treats, toys, grooming supplies.
              Personalized recommendations. Easy navigation. Detailed product
              descriptions and customer reviews. Exclusive discounts. Fast
              delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturesSection;
