import { Employee, MilestoneType } from '../types';

export interface MilestoneResult {
  employee: Employee;
  type: MilestoneType;
  years?: number;
  isToday: boolean;
  daysUntil: number;
}

export function calculateMilestones(employees: Employee[], daysThreshold: number = 7): MilestoneResult[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const results: MilestoneResult[] = [];

  employees.forEach(employee => {
    // Birthday check
    const birthdayMilestone = checkMilestone(employee, 'dob', today, daysThreshold);
    if (birthdayMilestone) {
      results.push({
        employee,
        type: 'BIRTHDAY',
        ...birthdayMilestone
      });
    }

    // Anniversary check
    const anniversaryMilestone = checkMilestone(employee, 'joinedDate', today, daysThreshold);
    if (anniversaryMilestone) {
      const joinedDate = new Date(employee.joinedDate);
      const years = today.getFullYear() - joinedDate.getFullYear();
      
      results.push({
        employee,
        type: 'ANNIVERSARY',
        years,
        ...anniversaryMilestone
      });
    }
  });

  return results.sort((a, b) => a.daysUntil - b.daysUntil);
}

function checkMilestone(employee: Employee, dateField: 'dob' | 'joinedDate', today: Date, threshold: number) {
  const dateStr = employee[dateField];
  if (!dateStr) return null;

  const originalDate = new Date(dateStr);
  const currentYearDate = new Date(today.getFullYear(), originalDate.getMonth(), originalDate.getDate());

  // If the date has already passed this year, check next year
  if (currentYearDate < today) {
    currentYearDate.setFullYear(today.getFullYear() + 1);
  }

  const diffTime = currentYearDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= threshold) {
    return {
      isToday: diffDays === 0 || (currentYearDate.getMonth() === today.getMonth() && currentYearDate.getDate() === today.getDate()),
      daysUntil: diffDays
    };
  }

  return null;
}
