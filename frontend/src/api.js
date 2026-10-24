const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

const samplePlans = [
  { id: 1, name: 'Monthly', durationMonths: 1, price: 999 },
  { id: 2, name: 'Quarterly', durationMonths: 3, price: 2499 },
  { id: 3, name: 'Yearly', durationMonths: 12, price: 8999 },
]

function sampleDate(offsetDays) {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() + offsetDays)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const sampleMembers = [
  ['Aarav Sharma', '9876501201', 'aarav@example.com', '4102', 1, 0],
  ['Diya Patel', '9876501202', 'diya@example.com', '5827', 2, 3],
  ['Kabir Mehta', '9876501203', 'kabir@example.com', '7364', 3, 365],
  ['Mira Iyer', '9876501204', 'mira@example.com', '2941', 1, -2],
  ['Reyansh Rao', '9876501205', 'reyansh@example.com', '8635', 2, -90],
].map(([name, phone, email, memberCode, planId, expiryOffset], index) => {
  const plan = samplePlans.find((item) => item.id === planId)
  return { id: index + 1, name, phone, email, memberCode, planId, planName: plan.name,
    planDurationMonths: plan.durationMonths, planPrice: plan.price,
    joinDate: sampleDate(expiryOffset - plan.durationMonths * 30), expiryDate: sampleDate(expiryOffset) }
})

function sampleRequest(path, options) {
  if ((options.method || 'GET') !== 'GET') throw new Error('This is a read-only UI demo; changes are not saved.')
  if (path === '/plans') return samplePlans
  if (path === '/members') return sampleMembers
  if (path === '/members/expired') return sampleMembers.filter((member) => {
    const daysLeft = Math.ceil((new Date(`${member.expiryDate}T00:00:00`) - new Date(new Date().toDateString())) / 86400000)
    return daysLeft <= 7
  })
  if (path.startsWith('/members/search?name=')) {
    const name = new URLSearchParams(path.split('?')[1]).get('name')?.toLowerCase() || ''
    return sampleMembers.filter((member) => member.name.toLowerCase().includes(name))
  }
  if (path === '/dashboard') {
    const due = sampleMembers.filter((member) => {
      const days = Math.ceil((new Date(`${member.expiryDate}T00:00:00`) - new Date(new Date().toDateString())) / 86400000)
      return days <= 7
    })
    return { totalMembers: sampleMembers.length, activeMembers: sampleMembers.length - due.filter((member) => member.expiryDate < sampleDate(0)).length,
      expiredMembers: due.filter((member) => member.expiryDate < sampleDate(0)).length, expiringSoon: due.filter((member) => member.expiryDate >= sampleDate(0)).length }
  }
  const memberMatch = path.match(/^\/members\/(\d+)$/)
  if (memberMatch) {
    const member = sampleMembers.find((item) => item.id === Number(memberMatch[1]))
    if (member) return member
  }
  const paymentMatch = path.match(/^\/payments\/(\d+)$/)
  if (paymentMatch) {
    const member = sampleMembers.find((item) => item.id === Number(paymentMatch[1]))
    if (member) return [-60, -30].map((offset, index) => ({ id: member.id * 10 + index, memberId: member.id,
      memberName: member.name, planId: member.planId, planName: member.planName,
      planDurationMonths: member.planDurationMonths, amount: member.planPrice, paymentDate: sampleDate(offset) })).reverse()
  }
  const attendanceMatch = path.match(/^\/attendance\/(\d+)$/)
  if (attendanceMatch) {
    const member = sampleMembers.find((item) => item.id === Number(attendanceMatch[1]))
    if (member) return [-2, -5, -8].map((offset, index) => ({ id: member.id * 10 + index,
      memberId: member.id, memberName: member.name, memberCode: member.memberCode, checkInDate: sampleDate(offset) }))
  }
  throw new Error('This demo page does not have sample data.')
}

export async function api(path, options = {}) {
  if (DEMO_MODE) return sampleRequest(path, options)
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })
  if (response.status === 204) return null
  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : await response.text()
  if (!response.ok) throw new Error(data?.message || data || `Request failed (${response.status})`)
  return data
}

export const formatDate = (value) => value
  ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`))
  : '—'

export const formatMoney = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 0,
}).format(Number(value || 0))

export const memberStatus = (expiryDate) => {
  if (!expiryDate) return 'Unknown'
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const expiry = new Date(`${expiryDate}T00:00:00`)
  if (expiry < today) return 'Expired'
  return Math.ceil((expiry - today) / 86400000) <= 7 ? 'Expiring soon' : 'Active'
}
