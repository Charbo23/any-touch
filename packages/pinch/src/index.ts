import type { Computed, EventTrigger,RecognizerStatus } from '@any-touch/shared';
import  { STATUS_POSSIBLE } from '@any-touch/shared';
import { ComputeScale } from '@any-touch/compute';
import { canResetStatusForPressMoveLike,recognizeForPressMoveLike } from '@any-touch/recognizer';
const DEFAULT_OPTIONS = {
    name: 'pinch',
    // 触发事件所需要的最小缩放比例
    threshold: 0,
    pointLength: 2,
};
export default function Pinch(options: Partial<typeof DEFAULT_OPTIONS>) {
    const _options = Object.assign(DEFAULT_OPTIONS, options);
    let _status: RecognizerStatus = STATUS_POSSIBLE;
    let _isRecognized = false;

    /**
     * 识别条件
     * @param computed 计算数据
     * @return 接收是否识别状态
     */
    function _test(computed: Computed): boolean {
        const { pointLength, scale } = computed;
        return _options.pointLength === pointLength
            && void 0 !== scale
            && (_options.threshold < Math.abs(scale - 1) || _isRecognized);
    };

    /**
     * 开始识别
     * @param computed 计算数据
     */
    function _recognize(computed: Computed, emit: EventTrigger) {
        // 重置status
        if (canResetStatusForPressMoveLike(_status)) {
            _status = STATUS_POSSIBLE;
        };

        recognizeForPressMoveLike(computed, _test, _options.name, _status, emit, ([isRecognized, status]: any) => {
            _status = status;
            _isRecognized = isRecognized;
        });
    };
    return [_recognize, ()=>_options];
};

Pinch.C = [ComputeScale];