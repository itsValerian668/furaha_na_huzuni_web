import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { useMembersStore } from '@/stores/members.store'
import { toast } from '@/stores/toast.store'
import type { Member, Role } from '@/types/coop'

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: 'MEMBER', label: 'Member' },
  { value: 'FINANCE_OFFICER', label: 'Finance Officer' },
  { value: 'COOPERATIVE_LEADER', label: 'Cooperative Leader' },
  { value: 'ADMIN', label: 'Admin' },
]

const BRANCH_OPTIONS = [
  {
    value: 'Dar es Salaam — Kinondoni',
    label: 'Dar es Salaam — Kinondoni',
  },
  {
    value: 'Dar es Salaam — Ilala',
    label: 'Dar es Salaam — Ilala',
  },
  {
    value: 'Arusha',
    label: 'Arusha',
  },
  {
    value: 'Mwanza',
    label: 'Mwanza',
  },
  {
    value: 'Dodoma',
    label: 'Dodoma',
  },
]

const DEFAULT_BRANCH = 'Dar es Salaam — Kinondoni'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function AddMemberModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const addMember = useMembersStore((state) => state.addMember)
  const members = useMembersStore((state) => state.members)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [branch, setBranch] = useState(DEFAULT_BRANCH)
  const [occupation, setOccupation] = useState('')
  const [address, setAddress] = useState('')
  const [role, setRole] = useState<Role>('MEMBER')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => {
    setName('')
    setPhone('')
    setEmail('')
    setBranch(DEFAULT_BRANCH)
    setOccupation('')
    setAddress('')
    setRole('MEMBER')
  }

  const handleClose = () => {
    if (isSubmitting) return

    resetForm()
    onClose()
  }

  const submit = () => {
    const trimmedName = name.trim()
    const trimmedPhone = phone.trim()
    const trimmedEmail = email.trim().toLowerCase()
    const trimmedOccupation = occupation.trim()
    const trimmedAddress = address.trim()

    if (
      !trimmedName ||
      !trimmedPhone ||
      !trimmedEmail ||
      !trimmedOccupation ||
      !trimmedAddress
    ) {
      toast('Please complete all required member details.', 'error')
      return
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      toast('Please enter a valid email address.', 'error')
      return
    }

    const normalizedPhone = trimmedPhone.replace(/\s+/g, '')

    const emailExists = members.some(
      (member) =>
        member.email.trim().toLowerCase() === trimmedEmail,
    )

    if (emailExists) {
      toast(
        'A member with this email address already exists.',
        'error',
      )
      return
    }

    const phoneExists = members.some(
      (member) =>
        member.phone.replace(/\s+/g, '') === normalizedPhone,
    )

    if (phoneExists) {
      toast(
        'A member with this phone number already exists.',
        'error',
      )
      return
    }

    setIsSubmitting(true)

    const now = Date.now()

    const memberId = `MB-${String(now).slice(-6)}`

    const existingNumbers = new Set(
  members.map((member) => member.memberNumber),
)

let sequence = members.length + 1
let memberNumber = `FH-2026-${String(sequence).padStart(4, '0')}`

while (existingNumbers.has(memberNumber)) {
  sequence += 1
  memberNumber = `FH-2026-${String(sequence).padStart(4, '0')}`
}

    const newMember: Member = {
      id: memberId,
      memberNumber,
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      avatarColor: '#0B6655',
      status: 'ACTIVE',
      role,
      joinedOn: new Date().toISOString().slice(0, 10),
      branch,
      occupation: trimmedOccupation,
      totalSavings: 0,
      welfareStatus: 'IN_GOOD_STANDING',
      address: trimmedAddress,
    }

    addMember(newMember)

    setTimeout(() => {
      setIsSubmitting(false)
      resetForm()
      onClose()

      toast(
        `${newMember.name} was registered successfully.`,
      )
    }, 400)
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Register new member"
      description="Add a new member to the cooperative. Financial products and initial savings are not included during registration."
      footer={
        <>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            onClick={submit}
            isLoading={isSubmitting}
          >
            Register Member
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Full name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter full name"
          required
        />

        <Input
          label="Phone number"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+255 7XX XXX XXX"
          required
        />

        <Input
          label="Email address"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="member@example.com"
          required
        />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="member-role"
            className="text-text text-sm font-medium"
          >
            Role
          </label>

          <Select
            id="member-role"
            value={role}
            onChange={(event) =>
              setRole(event.target.value as Role)
            }
            options={ROLE_OPTIONS}
            className="w-full"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="member-branch"
            className="text-text text-sm font-medium"
          >
            Branch
          </label>

          <Select
            id="member-branch"
            value={branch}
            onChange={(event) => setBranch(event.target.value)}
            options={BRANCH_OPTIONS}
            className="w-full"
          />
        </div>

        <Input
          label="Occupation"
          value={occupation}
          onChange={(event) =>
            setOccupation(event.target.value)
          }
          placeholder="e.g. Teacher"
          required
        />

        <div className="sm:col-span-2">
          <Input
            label="Address"
            value={address}
            onChange={(event) =>
              setAddress(event.target.value)
            }
            placeholder="Enter residential address"
            required
          />
        </div>
      </div>
    </Modal>
  )
}