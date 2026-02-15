import React, { useEffect, useState } from "react";
import axios from "axios";
import { Sidebar } from "lucide-react";
import SidebarNav from "../Components/SidebarNav";

const IndustryInsight = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/industry/tech")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(salary);
  };

  const formatPercentage = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value / 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="text-gray-500 text-sm mt-4">Loading market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white mt-20">
        <SidebarNav/>
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-light text-gray-900">Industry Insights</h1>
              <p className="text-sm text-gray-500">Technology Sector • Q1 2024</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-sm text-gray-500 mb-1">Market Growth</p>
            <p className="text-3xl font-light text-gray-900">{data.marketGrowth}%</p>
            <p className="text-xs text-gray-400 mt-2">Year over Year</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-sm text-gray-500 mb-1">Active Roles</p>
            <p className="text-3xl font-light text-gray-900">1,284</p>
            <p className="text-xs text-gray-400 mt-2">+12% from last month</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-sm text-gray-500 mb-1">Avg. Salary</p>
            <p className="text-3xl font-light text-gray-900">₹18.5L</p>
            <p className="text-xs text-gray-400 mt-2">Across all roles</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-sm text-gray-500 mb-1">Top Location</p>
            <p className="text-3xl font-light text-gray-900">Bangalore</p>
            <p className="text-xs text-gray-400 mt-2">34% of openings</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trending Roles */}
          <section className="col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">Trending Roles</h2>
              <span className="text-xs text-gray-400">Growth rate</span>
            </div>
            <div className="space-y-4">
              {data.trending.map((item, index) => (
                <div key={index} className="bg-white border border-gray-100 rounded-lg p-5 hover:border-gray-200 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{item.role}</h3>
                    <span className="text-sm text-emerald-600">+{item.growthPercentage}%</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Average package</span>
                    <span className="text-sm font-medium text-gray-900">{formatSalary(item.avgSalary)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* High Paying Roles */}
          <section className="col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">High Paying</h2>
              <span className="text-xs text-gray-400">Annual CTC</span>
            </div>
            <div className="space-y-4">
              {data.highPaying.map((item, index) => (
                <div key={index} className="bg-white border border-gray-100 rounded-lg p-5 hover:border-gray-200 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{item.role}</h3>
                    <span className="text-sm font-medium text-gray-900">{formatSalary(item.avgSalary)}</span>
                  </div>
                  <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-900 rounded-full" 
                      style={{ width: `${(item.avgSalary / 5000000) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">vs. industry average</p>
                </div>
              ))}
            </div>
          </section>

          {/* Market Analysis */}
          <section className="col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">Market Analysis</h2>
              <span className="text-xs text-gray-400">Trending</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <p className="text-sm text-gray-500 mb-2">Demand Score</p>
              <div className="flex items-end space-x-2 mb-4">
                <span className="text-4xl font-light text-gray-900">86</span>
                <span className="text-sm text-gray-400 mb-1">/100</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full w-[86%] bg-gray-900 rounded-full"></div>
              </div>
            </div>

            {/* Declining Roles as compact list */}
            <div className="bg-white border border-gray-100 rounded-lg p-5">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Declining Roles</h3>
              <div className="space-y-3">
                {data.declining.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.role}</span>
                    <span className="text-sm text-red-500">{item.growthPercentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Section - Industry Trends */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Industry Trends</h2>
              <p className="text-sm text-gray-500">Key insights and projections</p>
            </div>
            <button className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              View full report →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Fastest Growing</p>
                <p className="text-sm text-gray-500 mt-1">{data.trending[0]?.role} • {data.trending[0]?.growthPercentage}%</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Highest Package</p>
                <p className="text-sm text-gray-500 mt-1">{formatSalary(data.highPaying[0]?.avgSalary)}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Market Health</p>
                <p className="text-sm text-gray-500 mt-1">Stable • Positive outlook</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Data aggregated from industry reports • Last updated {new Date().toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </p>
        </footer>
      </main>
    </div>
  );
};

export default IndustryInsight;