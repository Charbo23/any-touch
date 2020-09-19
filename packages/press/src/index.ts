import type { EventTrigger, Computed, RecognizerStatus } from '@any-touch/shared';
import {
    STATUS_POSSIBLE, STATUS_FAILED, STATUS_RECOGNIZED, DIRECTION_UP, INPUT_START, INPUT_CANCEL, INPUT_END
} from '@any-touch/shared';
import { ComputeDistance } from '@any-touch/compute';
import { canResetStatusForPressMoveLike } from '@any-touch/recognizer';
const DEFAULT_OPTIONS = {
    name: 'press',
    pointLength: 1,
    maxDistance: 9,
    minPressTime: 251,
};

/**
 * 按压识别器
 * @param options 选项
 */
export default function Press(options: Partial<typeof DEFAULT_OPTIONS>) {
    const _options = Object.assign(DEFAULT_OPTIONS, options);
    let _status: RecognizerStatus = STATUS_POSSIBLE;
    let _timeoutId: number | undefined;

    function _recognize(computed: Computed, emit: EventTrigger): void {
        const { stage, startInput, pointLength } = computed;
        // 1. start阶段
        // 2. 触点数符合
        // 那么等待minPressTime时间后触发press
        if (INPUT_START === stage && _options.pointLength === pointLength) {
            // 重置状态
            // 重置status
            if (canResetStatusForPressMoveLike(_status)) {
                _status = STATUS_POSSIBLE;
            };
            // 延迟触发
            _cancel();
            _timeoutId = (setTimeout as Window['setTimeout'])(() => {
                _status = STATUS_RECOGNIZED;
                emit(_options.name);
            }, _options.minPressTime);
        }
        // 触发pressup条件:
        // 1. end阶段
        // 2. 已识别
        else if (INPUT_END === stage && STATUS_RECOGNIZED === _status) {
            emit(`${_options.name}${DIRECTION_UP}`);
        }
        else if (STATUS_RECOGNIZED !== _status) {
            const deltaTime = computed.timestamp - startInput.timestamp;
            // 一旦不满足必要条件,
            // 发生了大的位移变化
            if (!_test(computed) ||
                // end 或 cancel触发的时候还不到要求的press触发时间
                (_options.minPressTime > deltaTime && [INPUT_END, INPUT_CANCEL].includes(stage))) {
                _cancel();
                _status = STATUS_FAILED;
            }
        }
    };

    /**
     * 是否满足:
     * 移动距离不大
     */
    function _test(computed: Computed): boolean {
        const { distance } = computed;
        return _options.maxDistance > distance;
    };

    function _cancel(): void {
        clearTimeout(_timeoutId);
    }

    return [_recognize, ()=>_options];
};


Press.C = [ComputeDistance];