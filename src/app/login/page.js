import React from 'react'
import Link from 'next/link'

const page = () => {
    return (
        < div className='flex flex-col items-center justify-center w-full h-screen' >
            <form>
                <div className="flex flex-col items-center justify-center mx-auto lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <p className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Login


                            </p><div>
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    Your username
                                </label>
                                <input placeholder="JohnDoe" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5" id="username" type="text" />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    Password
                                </label>
                                <input className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5" placeholder="••••••••" id="password" type="password" />
                            </div>
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 bg-gray-700 border-gray-600 focus:ring-primary-600 ring-offset-gray-800" type="checkbox" aria-describedby="terms" id="terms" />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label className="font-light text-gray-500 text-gray-300">
                                        You don&apos;t have an account?
                                        <Link href="/register" className="font-medium text-primary-600 hover:underline text-primary-500">
                                            Register
                                        </Link>
                                    </label>
                                </div>
                            </div>

                            <button className="w-full bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  focus:ring-blue-800 text-white" type="submit">
                                Create an account
                            </button>

                        </div>
                    </div>
                </div></form>

        </div >
    )
}

export default page