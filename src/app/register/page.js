'use client'
import React, { useState } from 'react'
import axios from 'axios'

const page = () => {
    const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
  
    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };
  
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (form.password !== form.confirmPassword) {
          setError('Las contraseñas no coinciden');
          return;
        }
        try {
          const res = await axios.post('/api/auth/register', {
            email: form.email,
            password: form.password
          });
          setSuccess(res.data.message);
        } catch (err) {
          setError(err.response?.data?.message || 'Error al registrar');
        }
      }
    
    return (
        <div className='flex flex-col items-center justify-center w-full h-screen'>
            <form onSubmit={handleRegister}>
                <div className="flex flex-col items-center justify-center mx-auto lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <p className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Create an account


                            </p><div>
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    Your username
                                </label>
                                <input name='email' value={form.email} onChange={handleChange} placeholder="Email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5" id="username" type="text" />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    Password
                                </label>
                                <input name='password' value={form.password} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5" placeholder="••••••••" id="password" type="password" />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    Confirm password
                                </label>
                                <input name='confirmPassword' value={form.confirmPassword} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5" placeholder="••••••••" id="confirmPassword" type="password" />
                            </div>
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 bg-gray-700 border-gray-600 focus:ring-primary-600 ring-offset-gray-800" type="checkbox" aria-describedby="terms" id="terms" />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label className="font-light text-gray-500 text-gray-300">
                                        I accept the
                                        <a href="#" className="font-medium text-primary-600 hover:underline text-primary-500">
                                            Terms and Conditions
                                        </a>
                                    </label>
                                </div>
                            </div>
                            {error && <div className="text-red-500">{error}</div>}
                            {success && <div className="text-green-600">{success}</div>}
                            <button className="w-full bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  focus:ring-blue-800 text-white" type="submit">
                                Create an account
                            </button>

                        </div>
                    </div>
                </div></form>

        </div>
    )
}

export default page