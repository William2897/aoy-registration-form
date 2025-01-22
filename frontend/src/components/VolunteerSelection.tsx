import React from 'react';
import { Heart, AlertCircle } from 'lucide-react';
import { VolunteerRole, FormData } from '../App';

interface VolunteerSelectionProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  familyMemberIndex?: number;
}

const VOLUNTEER_ROLES: { value: VolunteerRole; label: string; description: string }[] = [
  {
    value: 'food_team',
    label: 'Food Team',
    description: 'Help coordinate and serve meals to conference attendees'
  },
  {
    value: 'registration_team',
    label: 'Registration Team',
    description: 'Assist with check-in and registration process'
  },
  {
    value: 'treasury_team',
    label: 'Treasury Team',
    description: 'Support financial operations during the event'
  },
  {
    value: 'prayer_team',
    label: 'Prayer Team',
    description: 'Lead and participate in prayer sessions'
  },
  {
    value: 'pa_av_team',
    label: 'PA/AV Team',
    description: 'Manage sound, lighting, and multimedia systems'
  },
  {
    value: 'emergency_medical_team',
    label: 'Emergency Medical Team',
    description: 'Provide basic medical support and first aid'
  },
  {
    value: 'children_program',
    label: 'Children\'s Program',
    description: 'Help organize and run activities for children'
  },
  {
    value: 'usher',
    label: 'Usher',
    description: 'Guide and assist attendees during sessions'
  }
];

const VolunteerSelection: React.FC<VolunteerSelectionProps> = ({ formData, setFormData, familyMemberIndex }) => {
  const handleRoleToggle = (role: VolunteerRole) => {
    if (typeof familyMemberIndex === 'number') {
      setFormData(prev => ({
        ...prev,
        familyDetails: prev.familyDetails.map((member, idx) => {
          if (idx !== familyMemberIndex) return member;
          const currentRoles = member.volunteerRoles || [];
          if (currentRoles.includes(role)) {
            return {
              ...member,
              volunteerRoles: currentRoles.filter(r => r !== role)
            };
          }
          if (currentRoles.length >= 5) return member;
          return {
            ...member,
            volunteerRoles: [...currentRoles, role]
          };
        })
      }));
    } else {
      setFormData(prev => {
        const currentRoles = prev.volunteerRoles || [];
        if (currentRoles.includes(role)) {
          return {
            ...prev,
            volunteerRoles: currentRoles.filter(r => r !== role)
          };
        }
        if (currentRoles.length >= 5) {
          return prev;
        }
        return {
          ...prev,
          volunteerRoles: [...currentRoles, role]
        };
      });
    }
  };

  const isVolunteer = typeof familyMemberIndex === 'number' 
    ? formData.familyDetails[familyMemberIndex]?.volunteer 
    : formData.volunteer;

  const volunteerRoles = typeof familyMemberIndex === 'number'
    ? formData.familyDetails[familyMemberIndex]?.volunteerRoles || []
    : formData.volunteerRoles;

  if (!isVolunteer) return null;

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

      {volunteerRoles.length >= 5 && (
        <div className="flex items-center space-x-2 mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/50 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
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
              ${volunteerRoles.includes(role.value)
                ? 'border-orange-500 bg-orange-50 dark:border-orange-400 dark:bg-orange-400/10'
                : 'border-gray-200 hover:border-orange-300 dark:border-gray-600 dark:hover:border-orange-500/50'}
              ${volunteerRoles.length >= 5 && !volunteerRoles.includes(role.value)
                ? 'opacity-50 cursor-not-allowed'
                : ''}
            `}
          >
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                checked={volunteerRoles.includes(role.value)}
                onChange={() => handleRoleToggle(role.value)}
                disabled={volunteerRoles.length >= 5 && !volunteerRoles.includes(role.value)}
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
