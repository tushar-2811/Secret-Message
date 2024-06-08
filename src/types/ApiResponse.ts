import { Message } from "@/model/types/model.types";

export interface ApiResponse {
    success : boolean;
    message : string;
    isAcceptingMessages ?: boolean;
    messages ?: Array<Message>
}