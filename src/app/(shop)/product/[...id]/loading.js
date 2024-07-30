export default function LoadingProduct() {
  return (
    <div className="animate-pulse container mx-auto">
      <div className="container flex flex-col w-full lg:max-w-[1350px] justify-center mx-auto px-[20px]">
        <div className="mt-[40px] h-6 bg-gray-200 rounded-lg w-full max-w-[400px] dark:bg-gray-700 m-2"></div>

        <div className="mt-[67px] flex flex-col lg:flex-row items-center justify-center lg:items-start">
          <div className="lg:min-w-[500px] w-[676px] min-h-[300px] lg:min-h-[600px] flex flex-col items-start relative">
            <div className="w-[400px] mx-auto min-h-[300px] lg:min-h-[400px] mt-16 bg-gray-200 rounded-sm dark:bg-gray-700"></div>
            <div className="absolute flex top-0 left-5 gap-3">
              <div className="border border-solid border-opacity-20 rounded-full cursor-pointer">
                <div className="w-10 h-10 bg-gray-200 rounded-full dark:bg-gray-700"></div>
              </div>
              <div className="border border-solid border-opacity-20 rounded-full cursor-pointer">
                <div className="w-10 h-10 bg-gray-200 rounded-full dark:bg-gray-700"></div>
              </div>
              <div className="border border-solid border-opacity-20 rounded-full cursor-pointer">
                <div className="w-10 h-10 bg-gray-200 rounded-full dark:bg-gray-700"></div>
              </div>
            </div>
            <div className="border border-solid border-opacity-20 rounded-full absolute flex top-0 right-10">
              <div className="w-10 h-10 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
            <div className="flex lg:max-w-[576px] my-10 lg:gap-5 gap-10 flex-wrap">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="flex flex-col items-center shadow">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
                  <div className="w-16 h-2 mt-2 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="grow max-w-[676px]">
            <div className="bg-[#F7F7F7] pt-10">
              <div className="flex flex-col lg:flex-row items-start gap-8 px-8">
                <div className="grow">
                  <div className="w-full h-20 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
                  <div className="w-full h-4 mt-[14px] bg-gray-200 rounded-lg dark:bg-gray-700"></div>
                  <div className="w-full h-4 mt-[14px] bg-gray-200 rounded-lg dark:bg-gray-700"></div>
                  <div className="w-full h-4 mt-[14px] bg-gray-200 rounded-lg dark:bg-gray-700"></div>
                  <div className="w-full h-4 mt-[14px] bg-gray-200 rounded-lg dark:bg-gray-700"></div>
                  <div className="w-1/2 h-4 mt-[14px] bg-gray-200 rounded-lg dark:bg-gray-700"></div>
                  <div className="w-full h-4 mt-[14px] bg-gray-200 rounded-lg dark:bg-gray-700"></div>
                  <div className="w-full h-4 mt-[14px] bg-gray-200 rounded-lg dark:bg-gray-700"></div>
                  <div className="w-1/2 h-4 mt-[14px] bg-gray-200 rounded-lg dark:bg-gray-700"></div>
                </div>
                <div className="flex flex-col gap-y-2.5">
                  <div className=" w-[190px] h-14 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
                  <div className=" w-[190px] h-14 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
                </div>
              </div>
              <hr className="border-t my-[30px] border-gray-200 h-1 w-full" />
              <form>
                <div className="lg:px-8 lg:pb-10">
                  <div className="h-8 w-1/2 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
                  <div className="flex mt-5 gap-10">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                      <div className="w-[200px] ml-2.5 h-6 bg-gray-200 rounded-sm dark:bg-gray-700"></div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                      <div className="w-[200px] ml-2.5 h-6 bg-gray-200 rounded-sm dark:bg-gray-700"></div>
                    </div>
                  </div>
                  <div className="h-8 w-1/2  mt-[40px] bg-gray-200 rounded-lg dark:bg-gray-700"></div>

                  <div className="my-5 max-w-[600px]">
                    <span className="flex ml-3 text-black text-sm items-center my-3 flex-wrap">
                      <div className="w-[80px] h-4 bg-gray-200 rounded-sm dark:bg-gray-700"></div>
                      <br />
                      <div className="flex gap-2 ml-2.5">
                        <div className="w-8 h-8 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded-full dark:bg-gray-700"></div>{' '}
                        <div className="w-8 h-8 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded-full dark:bg-gray-700"></div>{' '}
                        <div className="w-8 h-8 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                      </div>
                    </span>
                  </div>
                  <div className="h-8 w-2/3  mt-[40px] bg-gray-200 rounded-lg dark:bg-gray-700"></div>
                </div>
                <div className="bg-white p-3 py-6">
                  <div>
                    <div className="mb-3"></div>
                    <div className="flex justify-between">
                      <div>
                        <div className="h-4 w-[120px]  bg-gray-200 rounded-lg dark:bg-gray-700"></div>
                        <div className="h-8 w-[70px] mt-2  bg-gray-200 rounded-lg dark:bg-gray-700"></div>
                      </div>
                      <div>
                        <div className="h-4 w-[120px]  bg-gray-200 rounded-lg dark:bg-gray-700"></div>
                        <div className="h-8 w-[70px] mt-2  bg-gray-200 rounded-lg dark:bg-gray-700"></div>
                      </div>

                      <div className=" w-[190px] h-14 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="gap-3 grid grid-cols-2">
              <div className=" w-full h-24 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
              <div className=" w-full h-24 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
            </div>
            <div className=" w-full h-24 mt-2 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
