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

export function EditMemberModal({
  open,
  member,
  onClose,
}: {
  open: boolean
  member: Member
  onClose: () => void
}) {
  const updateMember = useMembersStore(
    (state) => state.updateMember,
  )

  const [name, setName] = useState(member.name)
  const [phone, setPhone] = useState(member.phone)
  const [email, setEmail] = useState(member.email)
  const [branch, setBranch] = useState(member.branch)
  const [occupation, setOccupation] = useState(member.occupation)
  const [address, setAddress] = useState(member.address)
  const [role, setRole] = useState<Role>(member.role)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = () => {
    if (
      !name.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !occupation.trim() ||
      !address.trim()
    ) {
      toast(
        'Please complete all required member details.',
        'error',
      )
      return
    }

    setIsSubmitting(true)

    updateMember(member.id, {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      branch,
      occupation: occupation.trim(),
      address: address.trim(),
      role,
    })

    setTimeout(() => {
      setIsSubmitting(false)
      onClose()

      toast(
        `${name.trim()}'s profile was updated successfully.`,
      )
    }, 400)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit member"
      description="Update the member's personal and cooperative information."
      size="lg"
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            onClick={submit}
            isLoading={isSubmitting}
          >
            Save Changes
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
            htmlFor="edit-member-role"
            className="text-text text-sm font-medium"
          >
            Role
          </label>

          <Select
            id="edit-member-role"
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
            htmlFor="edit-member-branch"
            className="text-text text-sm font-medium"
          >
            Branch
          </label>

          <Select
            id="edit-member-branch"
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