import type { EventTrigger, Computed, RecognizerStatus } from '@any-touch/shared';
import {
    STATUS_POSSIBLE,
} from '@any-touch/shared';
import { ComputeDistance, ComputeDeltaXY, ComputeVAndDir } from '@any-touch/compute';
import { recognizeForPressMoveLike, canResetStatusForPressMoveLike } from '@any-touch/recognizer';
const DEFAULT_OPTIONS = {
    name: 'pan',
    threshold: 10,
    pointLength: 1
};

/**
 * 拖拽识别器
 * @param options 选项 
 */
function Pan(options: Partial<typeof DEFAULT_OPTIONS>) {
    const _context = Object.assign(DEFAULT_OPTIONS, options, { status: STATUS_POSSIBLE as RecognizerStatus });

    let _isRecognized = false;
    /**
     * 必要条件
     * @param computed 计算数据
     * @return 是否是当前手势
     */
    function _test(computed: Computed): boolean {
        const { pointLength, distance } = computed;
        return (
            (_isRecognized || _context.threshold <= distance) &&
            _context.pointLength === pointLength
        );
    }

    /**
     * 开始识别
     * @param input 输入
     * @param emit 触发事件函数
     */
    function _recognize(computed: Computed, emit: EventTrigger): void {
        // 重置status
        if (canResetStatusForPressMoveLike(_context.status)) {
            _context.status = STATUS_POSSIBLE;
        };

        // 需要有方向
        const isRecognizedNow = void 0 !== computed.direction &&
            recognizeForPressMoveLike(computed,
                _test,
                _context.name,
                _context.status,
                emit, ([isRecognized, status]) => {
                    _context.status = status;
                    _isRecognized = isRecognized;
                });
        // panleft/panup/panright/pandown
        if (isRecognizedNow) {
            emit(_context.name + computed.direction);
        }
    }

    return [_context,_recognize, ];
}
Pan.C = [ComputeVAndDir, ComputeDistance, ComputeDeltaXY];
export default Pan;