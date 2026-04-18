import React from 'react';

export default function About() {
  return (
    <div className='py-20 px-6 max-w-6xl mx-auto flex flex-col gap-12'>
      <div className='text-center flex flex-col gap-4'>
        <h1 className='text-5xl md:text-6xl font-black tracking-tighter text-slate-800'>
          About <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600'>Real Estate</span>
        </h1>
        <p className='text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed'>
          Redefining the property experience with transparency, style, and unmatched expertise.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        <div className='bg-white p-8 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-50 flex flex-col gap-3 group hover:scale-[1.02] transition-all cursor-default'>
          <div className='w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500'>?</div>
          <h2 className='text-2xl font-bold text-slate-800'>Who We Are</h2>
          <p className='text-slate-600 leading-relaxed font-medium'>
            Welcome to Real Estate, where your property journey begins with trust and ends with success. 
            We are a modern agency dedicated to helping you find a place you can truly call home.
          </p>
        </div>

        <div className='bg-white p-8 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-50 flex flex-col gap-3 group hover:scale-[1.02] transition-all cursor-default'>
          <div className='w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-black text-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-500'>!</div>
          <h2 className='text-2xl font-bold text-slate-800'>Our Mission</h2>
          <p className='text-slate-600 leading-relaxed font-medium'>
            Our mission is to make real estate simple, transparent, and rewarding. We provide 
            expert guidance and support to help you achieve your property goals with total confidence.
          </p>
        </div>

        <div className='bg-white p-8 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-50 flex flex-col gap-3 group hover:scale-[1.02] transition-all cursor-default'>
          <div className='w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 font-black text-xl group-hover:bg-amber-600 group-hover:text-white transition-colors duration-500'>⭐</div>
          <h2 className='text-2xl font-bold text-slate-800'>What We Do</h2>
          <p className='text-slate-600 leading-relaxed font-medium'>
            We offer a full range of services including buying, selling, and renting. 
            Whether it's your dream home or a smart investment, we assist you at every single step.
          </p>
        </div>

        <div className='bg-white p-8 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-50 flex flex-col gap-3 group hover:scale-[1.02] transition-all cursor-default'>
          <div className='w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 font-black text-xl group-hover:bg-rose-600 group-hover:text-white transition-colors duration-500'>🤝</div>
          <h2 className='text-2xl font-bold text-slate-800'>Why Choose Us</h2>
          <p className='text-slate-600 leading-relaxed font-medium'>
            We focus on a stress-free experience. With deep market knowledge and a customer-first approach, 
            we ensure every transaction is handled with integrity.
          </p>
        </div>

        <div className='bg-white p-8 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-50 flex flex-col gap-3 group hover:scale-[1.02] transition-all cursor-default'>
          <div className='w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500'>👥</div>
          <h2 className='text-2xl font-bold text-slate-800'>Our Team</h2>
          <p className='text-slate-600 leading-relaxed font-medium'>
            Our team consists of skilled professionals who are passionate about real estate. 
            We work together to provide the highest level of service you deserve.
          </p>
        </div>

        <div className='bg-white p-8 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-50 flex flex-col gap-3 group hover:scale-[1.02] transition-all cursor-default'>
          <div className='w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 font-black text-xl group-hover:bg-purple-600 group-hover:text-white transition-colors duration-500'>⚡</div>
          <h2 className='text-2xl font-bold text-slate-800'>Our Vision</h2>
          <p className='text-slate-600 leading-relaxed font-medium'>
            Our vision is to be the most trusted name in real estate by consistently delivering 
            excellent service and building long-term relationships.
          </p>
        </div>
      </div>

      <div className='bg-gradient-to-r from-blue-600 to-indigo-700 p-12 rounded-[40px] shadow-2xl shadow-blue-200 text-center flex flex-col gap-4 text-white hover:scale-[1.01] transition-transform'>
        <h2 className='text-3xl font-black'>Our Promise</h2>
        <p className='text-blue-50 text-lg max-w-3xl mx-auto leading-relaxed'>
          We believe that buying or selling a property should be an exciting and rewarding experience. 
          That’s why we are committed to guiding you through every step, making the process easy, smooth, 
          and successful.
        </p>
      </div>
    </div>
  );
}