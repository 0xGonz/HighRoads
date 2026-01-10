'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, X } from 'lucide-react'
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
    <div className="space-y-6">
      {/* Input Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-primary-800 mb-6">Customize Your Plan</h2>

        {/* Weekly Payment Slider */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-gray-700">Weekly Payment</label>
            <span className="text-xl font-bold text-primary-800 tabular-nums">{formatCurrency(weeklyPayment)}</span>
          </div>
          <input
            type="range"
            min="400"
            max="900"
            step="25"
            value={weeklyPayment}
            onChange={(e) => setWeeklyPayment(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>$400/week</span>
            <span>$900/week</span>
          </div>
        </div>

        {/* Truck Value Slider */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-gray-700">Truck Value</label>
            <span className="text-xl font-bold text-primary-800 tabular-nums">{formatCurrency(truckValue)}</span>
          </div>
          <input
            type="range"
            min="60000"
            max="180000"
            step="5000"
            value={truckValue}
            onChange={(e) => setTruckValue(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>$60,000</span>
            <span>$180,000</span>
          </div>
        </div>
      </div>

      {/* Results Data Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-primary-800 text-white px-6 py-4">
          <h3 className="font-semibold">Your Ownership Projection</h3>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="flex justify-between items-center px-6 py-4">
            <span className="text-gray-600">Time to Ownership</span>
            <span className="font-bold text-primary-800 tabular-nums">
              {calculations.yearsToOwnership.toFixed(1)} years ({calculations.monthsToOwnership} months)
            </span>
          </div>
          <div className="flex justify-between items-center px-6 py-4">
            <span className="text-gray-600">Ownership Date</span>
            <span className="font-bold text-primary-800">{formatDate(calculations.ownershipDate)}</span>
          </div>
          <div className="flex justify-between items-center px-6 py-4">
            <span className="text-gray-600">Monthly Equity</span>
            <span className="font-bold text-primary-800 tabular-nums">{formatCurrency(calculations.monthlyEquity)}</span>
          </div>
          <div className="flex justify-between items-center px-6 py-4">
            <span className="text-gray-600">Total Investment</span>
            <span className="font-bold text-primary-800 tabular-nums">{formatCurrency(calculations.totalPaid)}</span>
          </div>
          <div className="flex justify-between items-center px-6 py-4 bg-gray-50">
            <span className="text-gray-500 text-sm">Includes maintenance reserve</span>
            <span className="text-gray-600 tabular-nums">{formatCurrency(calculations.maintenanceReserve)}</span>
          </div>
        </div>
      </div>

      {/* Equity Timeline */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-bold text-primary-800 mb-4">Equity Timeline</h3>

        {/* Progress bar */}
        <div className="h-2 bg-gray-200 rounded mb-6">
          <div className="h-full bg-primary-700 rounded" style={{ width: '100%' }} />
        </div>

        {/* Milestone markers */}
        <div className="flex justify-between text-sm">
          {calculations.milestones.map((milestone) => (
            <div key={milestone.percent} className="text-center">
              <div className="font-semibold text-primary-800">{milestone.percent}%</div>
              <div className="text-gray-500 text-xs">{milestone.months} mo</div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-bold text-primary-800 mb-4">Why Lease-to-Own Wins</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="font-semibold text-primary-800 mb-3">High Road Lease-to-Own</p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                <span>100% equity after {calculations.monthsToOwnership} months</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                <span>Own the truck outright</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                <span>Build wealth over time</span>
              </li>
            </ul>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="font-semibold text-gray-700 mb-3">Traditional Leasing</p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center">
                <X className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                <span>0% equity after payments</span>
              </li>
              <li className="flex items-center">
                <X className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                <span>Return truck at lease end</span>
              </li>
              <li className="flex items-center">
                <X className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                <span>Endless payment cycle</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary-800 rounded-lg p-8 text-center text-white">
        <h2 className="text-xl font-bold mb-2">Ready to Start Building Equity?</h2>
        <p className="text-gray-300 mb-6 max-w-md mx-auto text-sm">
          Your path to ownership starts with a simple 5-minute application. No credit check required.
        </p>
        <Link href="/apply">
          <Button variant="secondary" size="lg">
            Apply Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
