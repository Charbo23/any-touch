import {
    STATUS_END,
    STATUS_CANCELLED,
    STATUS_FAILED, STATUS_RECOGNIZED, RecognizerStatus
} from '@any-touch/shared'
export default function (status: RecognizerStatus) {
    // 重置status
    return -1 !== [STATUS_END, STATUS_CANCELLED, STATUS_RECOGNIZED, STATUS_FAILED].indexOf(status);
}