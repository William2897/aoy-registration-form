import React from 'react';
import { Heart } from 'lucide-react';
import { FormData } from '../App';

interface VolunteerSelectionProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  familyMemberIndex?: number;
}

type VolunteerFields = {
  isFoodTeam: boolean;
  isRegistrationTeam: boolean;
  isTreasuryTeam: boolean;
  isPrayerTeam: boolean;
  isPaAvTeam: boolean;
  isEmergencyMedicalTeam: boolean;
  isChildrenProgram: boolean;
  isUsher: boolean;
};

const VOLUNTEER_ROLES = [
  {
    value: 'isFoodTeam' as const,
    label: 'Food Team',
    description: 'Help coordinate and serve meals to conference attendees'
  },
  {
    value: 'isRegistrationTeam' as const,
    label: 'Registration Team',
    description: 'Assist with check-in and registration process'
  },
  {
    value: 'isTreasuryTeam' as const,
    label: 'Treasury Team',
    description: 'Support financial operations during the event'
  },
  {
    value: 'isPrayerTeam' as const,
    label: 'Prayer Team',
    description: 'Lead and participate in prayer sessions'
  },
  {
    value: 'isPaAvTeam' as const,
    label: 'PA/AV Team',
    description: 'Manage sound, lighting, and multimedia systems'
  },
  {
    value: 'isEmergencyMedicalTeam' as const,
    label: 'Emergency Medical Team',
    description: 'Provide basic medical support and first aid'
  },
  {
    value: 'isChildrenProgram' as const,
    label: 'Children\'s Program',
    description: 'Help organize and run activities for children'
  },
  {
    value: 'isUsher' as const,
    label: 'Usher',
    description: 'Guide and assist attendees during sessions'
  }
] as const;

const VolunteerSelection: React.FC<VolunteerSelectionProps> = ({
  formData,
  setFormData,
  familyMemberIndex
}) => {
  const countSelectedRoles = (member: Partial<VolunteerFields>): number => {
    return VOLUNTEER_ROLES.reduce((count, role) => 
      member[role.value as keyof VolunteerFields] ? count + 1 : count, 0
    );
  };

  const getVolunteerFields = (data: FormData | typeof formData.familyDetails[number]): Partial<VolunteerFields> => {
    const fields: Partial<VolunteerFields> = {};
    VOLUNTEER_ROLES.forEach(role => {
      fields[role.value as keyof VolunteerFields] = data[role.value as keyof typeof data] as boolean;
    });
    return fields;
  };

  const toggleRole = (roleField: typeof VOLUNTEER_ROLES[number]['value']) => {
    if (typeof familyMemberIndex === 'number') {
      setFormData(prev => ({
        ...prev,
        familyDetails: prev.familyDetails.map((member, idx) => {
          if (idx !== familyMemberIndex) return member;
          const selectedCount = countSelectedRoles(getVolunteerFields(member));
          // Don't allow more than 5 roles unless deselecting
          if (selectedCount >= 5 && !member[roleField]) return member;
          return { ...member, [roleField]: !member[roleField] };
        })
      }));
    } else {
      setFormData(prev => {
        const selectedCount = countSelectedRoles(getVolunteerFields(prev));
        // Don't allow more than 5 roles unless deselecting
        if (selectedCount >= 5 && !prev[roleField]) return prev;
        return { ...prev, [roleField]: !prev[roleField] };
      });
    }
  };

  const isVolunteer = typeof familyMemberIndex === 'number'
    ? formData.familyDetails[familyMemberIndex]?.volunteer
    : formData.volunteer;

  if (!isVolunteer) return null;

  const currentMember = typeof familyMemberIndex === 'number'
    ? formData.familyDetails[familyMemberIndex]
    : formData;

  const selectedCount = countSelectedRoles(getVolunteerFields(currentMember));

  return (
    <div className="animate-fade-in mt-6 bg-orange-50 dark:bg-gray-700/50 rounded-lg p-6">
      <div className="flex items-start space-x-3 mb-4">
        <Heart className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-1" />
        <div>
          <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400">
            Make a Difference - Volunteer!
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
            Join our volunteer team and be part of making AOY 2025 an incredible experience for everyone. Participants that have indicated their interest will be personally contacted by the respective team leaders.
          </p>
        </div>
      </div>

      {selectedCount >= 5 && (
        <div className="flex items-center space-x-2 mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/50 rounded-lg text-sm">
          <p className="text-yellow-600 dark:text-yellow-400">
            Maximum of 5 roles selected
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {VOLUNTEER_ROLES.map(role => (
          <label
            key={role.value}
            className={`
              relative flex items-start p-4 rounded-lg border-2 cursor-pointer
              ${currentMember[role.value]
                ? 'border-orange-500 bg-orange-50 dark:border-orange-400 dark:bg-orange-400/10'
                : 'border-gray-200 hover:border-orange-300 dark:border-gray-600 dark:hover:border-orange-500/50'}
              ${selectedCount >= 5 && !currentMember[role.value]
                ? 'opacity-50 cursor-not-allowed'
                : ''}
            `}
          >
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                checked={currentMember[role.value]}
                onChange={() => toggleRole(role.value)}
                disabled={selectedCount >= 5 && !currentMember[role.value]}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {role.label}
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {role.description}
              </p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default VolunteerSelection;
