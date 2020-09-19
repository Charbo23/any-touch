import type { Computed, EventTrigger, RecognizerStatus,RecognizerOptions ,RecognizerFunction} from '@any-touch/shared';
import { STATUS_POSSIBLE } from '@any-touch/shared';
import { ComputeAngle } from '@any-touch/compute';
import { canResetStatusForPressMoveLike, recognizeForPressMoveLike } from '@any-touch/recognizer';

const DEFAULT_OPTIONS = {
    name: 'rotate',
    // 触发事件所需要的最小角度
    threshold: 0,
    pointLength: 2,
};
export default function Rotate(options?: RecognizerOptions<typeof DEFAULT_OPTIONS>):ReturnType<RecognizerFunction> {
    const _context = Object.assign(
        DEFAULT_OPTIONS,
        options,
        { status: STATUS_POSSIBLE as RecognizerStatus });
    let _isRecognized = false;

    /**
     * 识别条件
     * @param computed 计算数据
     * @return 接收是否识别状态
     */
    function _test(computed: Computed): boolean {
        const { pointLength, angle } = computed;
        return _context.pointLength === pointLength && (_context.threshold < Math.abs(angle) || _isRecognized);
    };

    /**
     * 开始识别
     * @param computed 计算数据
     */
    function _recognize(computed: Computed, emit: EventTrigger) {
        // 重置status
        if (canResetStatusForPressMoveLike(_context.status)) {
            _context.status = STATUS_POSSIBLE;
        };

        recognizeForPressMoveLike(computed, _test, _context.name, _context.status, emit, ([isRecognized, status]: any) => {
            _context.status = status;
            _isRecognized = isRecognized;
        });
    };
    return [_context,_recognize];
};

Rotate.C = [ComputeAngle];