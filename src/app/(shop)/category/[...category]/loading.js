import CardSkeleton from '@/app/components/common/itemCardSkeleton';

export default function Loading() {
  return (
    <>

{/* if you wanna add the banner for the collection section just add "lg:flex flex-col lg:flex-row" after "hidden" to display the collection banner  */}

      <div className="hidden h-[400px] bg-gray-200 items-center justify-center  text-white">
        <div className="lg:w-1/2 ">
          <div className=" w-4/5 h-12 bg-gray-400 rounded-lg dark:bg-gray-700"></div>
          <div className=" w-2/3 h-4 mt-5 bg-gray-400 rounded-lg dark:bg-gray-700"></div>
          <div className=" w-2/3 h-4 mt-3 bg-gray-400 rounded-lg dark:bg-gray-700"></div>
          <div className=" w-2/3 h-4 mt-3 bg-gray-400 rounded-lg dark:bg-gray-700"></div>
          <div className=" w-1/2 h-4 mt-3 bg-gray-400 rounded-lg dark:bg-gray-700"></div>
          <div className=" w-2/3 h-4 mt-3 bg-gray-400 rounded-lg dark:bg-gray-700"></div>
        </div>
        <div className=" w-1/3 h-4/5 bg-gray-400 rounded-lg dark:bg-gray-700"></div>
      </div>
      <div className="container animate-pulse mx-auto mt-[190px]">
        <div className="mt-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 gap-y-10">
            {[...Array(24)].map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
