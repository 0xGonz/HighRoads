'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { DollarSign, Calendar, TrendingUp, Truck, ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

// Constants
const EQUITY_RATE = 0.85 // 85% of payment goes to equity
const WEEKS_PER_MONTH = 4.33

export function OwnershipCalculator() {
  const [weeklyPayment, setWeeklyPayment] = useState(600)
  const [truckValue, setTruckValue] = useState(100000)

  const calculations = useMemo(() => {
    const monthlyPayment = weeklyPayment * WEEKS_PER_MONTH
    const monthlyEquity = monthlyPayment * EQUITY_RATE
    const monthsToOwnership = Math.ceil(truckValue / monthlyEquity)
    const yearsToOwnership = monthsToOwnership / 12
    const totalPaid = monthlyPayment * monthsToOwnership
    const maintenanceReserve = totalPaid * (1 - EQUITY_RATE)

    // Calculate ownership date
    const ownershipDate = new Date()
    ownershipDate.setMonth(ownershipDate.getMonth() + monthsToOwnership)

    // Calculate milestones
    const milestones = [
      { percent: 25, months: Math.ceil(monthsToOwnership * 0.25) },
      { percent: 50, months: Math.ceil(monthsToOwnership * 0.5) },
      { percent: 75, months: Math.ceil(monthsToOwnership * 0.75) },
      { percent: 100, months: monthsToOwnership },
    ]

    return {
      monthlyPayment,
      monthlyEquity,
      monthsToOwnership,
      yearsToOwnership,
      totalPaid,
      maintenanceReserve,
      ownershipDate,
      milestones,
    }
  }, [weeklyPayment, truckValue])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  return (
    <div className="space-y-8">
      {/* Input Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Customize Your Plan</h2>

        {/* Weekly Payment Slider */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">Weekly Payment</label>
            <span className="text-2xl font-bold text-accent">{formatCurrency(weeklyPayment)}</span>
          </div>
          <input
            type="range"
            min="400"
            max="900"
            step="25"
            value={weeklyPayment}
            onChange={(e) => setWeeklyPayment(Number(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>$400/week</span>
            <span>$900/week</span>
          </div>
        </div>

        {/* Truck Value Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">Truck Value</label>
            <span className="text-2xl font-bold text-primary-700">{formatCurrency(truckValue)}</span>
          </div>
          <input
            type="range"
            min="60000"
            max="180000"
            step="5000"
            value={truckValue}
            onChange={(e) => setTruckValue(Number(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>$60,000</span>
            <span>$180,000</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Calendar className="h-6 w-6 text-accent" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Time to Ownership</p>
          <p className="text-3xl font-bold text-gray-900">
            {calculations.yearsToOwnership.toFixed(1)} <span className="text-lg font-normal">years</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            ({calculations.monthsToOwnership} months)
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Truck className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Ownership Date</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatDate(calculations.ownershipDate)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Your truck, free and clear
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="h-6 w-6 text-primary-600" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Monthly Equity</p>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(calculations.monthlyEquity)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Building ownership every month
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <DollarSign className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Investment</p>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(calculations.totalPaid)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Includes {formatCurrency(calculations.maintenanceReserve)} reserve
          </p>
        </div>
      </div>

      {/* Equity Timeline */}
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Your Equity Timeline</h2>

        <div className="relative">
          {/* Progress bar background */}
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-green-500 rounded-full transition-all duration-500"
              style={{ width: '100%' }}
            />
          </div>

          {/* Milestones */}
          <div className="flex justify-between mt-4">
            {calculations.milestones.map((milestone) => (
              <div key={milestone.percent} className="text-center">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="h-4 w-4 text-primary-600" />
                </div>
                <p className="text-sm font-bold text-gray-900">{milestone.percent}%</p>
                <p className="text-xs text-gray-500">
                  {milestone.months} mo
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Lease-to-Own Wins</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <p className="font-medium text-green-800 mb-2">High Road Lease-to-Own</p>
              <ul className="text-sm text-green-700 space-y-1">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  100% equity after {calculations.monthsToOwnership} months
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Own the truck outright
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Build wealth over time
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-700 mb-2">Traditional Leasing</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center">
                  <span className="w-4 h-4 mr-2 text-red-500">✗</span>
                  0% equity after payments
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 mr-2 text-red-500">✗</span>
                  Return truck at lease end
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 mr-2 text-red-500">✗</span>
                  Endless payment cycle
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary-700 rounded-xl shadow-lg p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">Ready to Start Building Equity?</h2>
        <p className="text-primary-100 mb-6 max-w-lg mx-auto">
          Your path to ownership starts with a simple 5-minute application. No credit check required.
        </p>
        <Link href="/apply">
          <Button size="lg" className="text-lg px-8">
            Apply Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
