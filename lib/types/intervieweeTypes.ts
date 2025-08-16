export type IntervieweeTypes = {
    interview_id: string;
    candidate_detail?: {
        username: string;
    };
    opening_detail?: {
        opening_name: string;
        company_name: string;
    };
    interview_status: string;
    interview_datetime: string | number | Date;
    interview_result: string;
    total_score: number;
    interviewState?: boolean;
    interview_date?: string;
    interview_time?: string;
    
}