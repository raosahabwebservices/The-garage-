export type PaymentStatus = 'Paid' | 'Partial' | 'Unpaid' | 'Overdue';
export type AttendanceStatus = 'Present' | 'Absent';
export type MembershipStatus = 'Active' | 'Expired' | 'Pending';

export interface PaymentTransaction {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  date: string; // ISO string or YYYY-MM-DD
  method: 'Cash' | 'UPI' | 'Card' | 'Bank Transfer';
  receiptNo: string;
  note?: string;
}

export interface Member {
  id: string; // e.g. TFG-1001
  name: string;
  phone: string;
  email?: string;
  joiningDate: string; // YYYY-MM-DD
  membershipStartDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  planDurationMonths: number; // e.g. 1, 3, 6, 12
  planFee: number; // e.g. 600
  paidAmount: number;
  pendingAmount: number;
  paymentStatus: PaymentStatus;
  attendanceStatus: AttendanceStatus;
  membershipStatus: MembershipStatus;
  avatar?: string;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  date: string; // YYYY-MM-DD
  checkInTime: string; // HH:MM AM/PM
  checkOutTime?: string; // HH:MM AM/PM
}

export interface AutomationLog {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'payment_reminder' | 'expiry_alert' | 'expired_detection' | 'daily_summary';
  status: 'Success' | 'Warning' | 'Info';
  details: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'payment' | 'expiry' | 'registration' | 'attendance' | 'system';
  read: boolean;
  memberId?: string;
}

export interface GymSettings {
  gymName: string;
  tagline: string;
  location: string;
  phone: string;
  currency: string;
  defaultMonthlyFee: number;
  ownerName: string;
  whatsappEnabled: boolean;
  autoReminders: boolean;
}
