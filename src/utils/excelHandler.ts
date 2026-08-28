import * as XLSX from 'xlsx';
import { Employee } from '../types';

export async function parseExcel(file: File): Promise<Partial<Employee>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        
        const employees: Partial<Employee>[] = json.map((row: any) => ({
          employeeId: String(row['employee_id'] || row.employeeId || ''),
          name: row['name'] || row.Name || '',
          department: row['department'] || row.Department || '',
          email: row['email'] || row.Email || '',
          phone: String(row['phone'] || row.Phone || ''),
          dob: formatDate(row['date_of_birth'] || row.dob),
          joinedDate: formatDate(row['joined_date'] || row.joinedDate),
          status: 'active',
        }));
        
        resolve(employees);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function exportToExcel(employees: Employee[]) {
  const data = employees.map(emp => ({
    'employee_id': emp.employeeId,
    'name': emp.name,
    'department': emp.department,
    'email': emp.email,
    'phone': emp.phone,
    'date_of_birth': emp.dob,
    'joined_date': emp.joinedDate
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');
  XLSX.writeFile(workbook, 'employee_export.xlsx');
}

export function downloadTemplate() {
  const template = [{
    'employee_id': 'B150-00014998',
    'name': 'Mr.Paul',
    'department': 'IT',
    'email': 'paul.huang1@pouchen.com',
    'phone': '09-955599968 (2058)',
    'date_of_birth': '1978-08-28',
    'joined_date': '2016-03-14'
  }];

  const worksheet = XLSX.utils.json_to_sheet(template);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
  XLSX.writeFile(workbook, 'employee_template.xlsx');
}

function formatDate(date: any): string {
  if (!date) return '';
  if (date instanceof Date) return date.toISOString().split('T')[0];
  if (typeof date === 'number') {
    // Excel serial date
    const d = XLSX.SSF.parse_date_code(date);
    return `${d.y}-${String(d.m).padStart(2, '0')}-${String(d.d).padStart(2, '0')}`;
  }
  return String(date);
}
