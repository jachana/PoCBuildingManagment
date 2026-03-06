export type ReportReason = 'INAPPROPRIATE' | 'SPAM' | 'WRONG_CATEGORY' | 'SCAM' | 'OTHER';
export type ContentType = 'POST' | 'RECOMMENDATION' | 'ENTREPRENEUR';

export interface CreateReportData {
  contentType: ContentType;
  contentId: string;
  reason: ReportReason;
  description?: string;
}
