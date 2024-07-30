import { cookies } from "next/headers";
import Link from "next/link";
function SubcriptionBanner() {
    const cookieStore = cookies()
    const isLoggedIn = Boolean(cookieStore.get("token"))
    return !isLoggedIn && <section className="hidden sm:block container my-12 mx-auto bg-gray-50">
        <div className="flex h-[486px] bg-cover bg-no-repeat" style={{ backgroundImage: `url('/images/subscription.jpg')` }}>
            <div className="bg-black w-1/2 flex-col flex justify-center items-center text-white">
                <span className="text-white text-lg font-semibold leading-5">for sign up & e-newsletter</span>
                <span className="mt-8 text-center  font-semibold text-4xl leading-10">GET <span className="text-[#8A1E41]">$50</span> VOUCHER <br />FOR YOUR <br />NEXT PURCHASE</span>
                <p className="mt-4 text-sm font-medium">*T&C Applies</p>
                <Link href="/user/login" className="bg-[#8A1E41] mt-12 rounded-sm text-white px-6 py-2 m-2">
                    <span className="text-base font-medium leading-5">Sign up now</span>
                </Link>
            </div>
        </div>
    </section>
}
export default SubcriptionBanner;