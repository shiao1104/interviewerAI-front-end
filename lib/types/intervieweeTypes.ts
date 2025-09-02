export type IntervieweeTypes = {
    opening: string;
    remark: string;
    interview_id: string;
    candidate_detail?: {
        username: string;
        email: string;
        phone_number: string;
    };
    opening_detail?: {
        opening_name: string;
        company_name: string;
    };
    interview_status?: string;
    interview_datetime: string | number | Date;
    interview_result: string;
    total_score: number;
    interviewState?: boolean;
    interview_date?: string;
    interview_time?: string;
    score_expression?: number;
    score_attitude?: number;
    score_technical?: number;
    score_collaboration?: number;
    result_abstract?: string;
}