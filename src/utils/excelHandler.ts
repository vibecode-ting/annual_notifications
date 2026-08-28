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
          firstName: row['First Name'] || row.firstName,
          lastName: row['Last Name'] || row.lastName,
          email: row['Email'] || row.email,
          department: row['Department'] || row.department,
          jobTitle: row['Job Title'] || row.jobTitle,
          dob: formatDate(row['Date of Birth'] || row.dob),
          joinedDate: formatDate(row['Joined Date'] || row.joinedDate),
          status: (row['Status'] || row.status || 'active').toLowerCase() as 'active' | 'inactive',
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
    'First Name': emp.firstName,
    'Last Name': emp.lastName,
    'Email': emp.email,
    'Department': emp.department,
    'Job Title': emp.jobTitle,
    'Date of Birth': emp.dob,
    'Joined Date': emp.joinedDate,
    'Status': emp.status
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');
  XLSX.writeFile(workbook, 'employee_export.xlsx');
}

export function downloadTemplate() {
  const template = [{
    'First Name': 'John',
    'Last Name': 'Doe',
    'Email': 'john.doe@example.com',
    'Department': 'Engineering',
    'Job Title': 'Senior Developer',
    'Date of Birth': '1990-01-01',
    'Joined Date': '2020-05-15',
    'Status': 'active'
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
