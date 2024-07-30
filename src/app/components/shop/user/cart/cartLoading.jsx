export default function CartLoading() {
  return (
    <div className="animate-pulse container mx-auto min-h-screen flex flex-col lg:flex-row items-start justify-center mt-10">
      <div className="container mx-auto flex flex-col lg:max-w-[500px] xl:max-w-[700px] 2xl:max-w-[1000px] justify-between">
        <div className="mt-[40px] h-6 bg-gray-200 rounded-lg w-full max-w-[400px] dark:bg-gray-400 m-2"></div>
        {[...Array(4)].map((_, index) => (
          <div key={index}>
            <div className="max-w-[868px] p-6 min-h-[400px] flex flex-wrap bg-gray-200 rounded-lg w-full dark:bg-gray-400 m-2 mb-10">
              <div className="h-[128px] w-[128px] bg-gray-400 rounded-lg max-w-[400px] dark:bg-gray-200 m-2"></div>
              <div className="ml-4 flex flex-col justify-between w-[80%]">
                <div>
                  <div className="h-6 w-[300px] bg-gray-400 rounded-lg max-w-[400px] dark:bg-gray-200"></div>
                  <div className="h-6 w-[100px] my-3 bg-gray-400 rounded-lg max-w-[400px] dark:bg-gray-200"></div>
                  <div className="h-6 w-[200px] my-3 bg-gray-400 rounded-lg max-w-[400px] dark:bg-gray-200"></div>
                  <div className="h-6 w-[250px] my-3 bg-gray-400 rounded-lg max-w-[400px] dark:bg-gray-200"></div>
                  <div className="h-6 w-[50px] my-3 bg-gray-400 rounded-lg max-w-[400px] dark:bg-gray-200"></div>
                  <div className="h-6 w-[100px] mx-2 bg-transparent rounded-lg max-w-[400px] dark:bg-gray-200"></div>
                </div>
                <div className="flex justify-end flex-wrap gap-y-2">
                  <div className="h-6 w-[100px] mx-2 bg-gray-400 rounded-lg max-w-[400px] dark:bg-gray-200"></div>
                  <div className="h-6 w-[100px] mx-2 bg-gray-400 rounded-lg max-w-[400px] dark:bg-gray-200"></div>
                  <div className="h-6 w-[100px] mx-2 bg-gray-400 rounded-lg max-w-[400px] dark:bg-gray-200"></div>
                  <div className="h-6 w-[100px] mx-2 bg-gray-400 rounded-lg max-w-[400px] dark:bg-gray-200"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 pt-16 mt-[80px] h-[30vh] grow max-w-[200px] lg:max-w-[350px] xl:max-w-[400px] 2xl:max-w-[500px]  bg-gray-200 rounded-lg  dark:bg-gray-200">
        <div className="h-6 w-[300px] bg-gray-400 rounded-lg max-w-[400px] dark:bg-gray-200"></div>
        <div className="h-6 w-[100px] my-3 bg-gray-400 rounded-lg max-w-[400px] dark:bg-gray-200"></div>
        <div className="mt-10 h-6 w-[200px] my-3 bg-gray-400 rounded-lg max-w-[400px] dark:bg-gray-200"></div>
      </div>
    </div>
  );
}
