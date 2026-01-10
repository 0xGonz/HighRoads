import { redirect } from 'next/navigation'

export default function CalculatorPage() {
  redirect('/resources?tab=calculator')
}
