import type { EventTrigger, Computed, RecognizerStatus } from '@any-touch/shared';
import { INPUT_END, STATUS_POSSIBLE } from '@any-touch/shared';
import { ComputeDistance, ComputeVAndDir, ComputeMaxLength } from '@any-touch/compute';
const DEFAULT_OPTIONS = {
    name: 'swipe',
    threshold: 10,
    velocity: 0.3,
    pointLength: 1,
};


export default function Press(options: Partial<typeof DEFAULT_OPTIONS>) {
    const _options = Object.assign(DEFAULT_OPTIONS, options);
    let _status: RecognizerStatus = STATUS_POSSIBLE;

    /**
     * 识别条件
     * @param computed 计算数据
     */
    function _test(computed: Computed): boolean {
        // 非end阶段, 开始校验数据
        if (INPUT_END !== computed.stage) return false;
        const { velocityX, velocityY, maxPointLength, distance } = computed;
        return _options.pointLength === maxPointLength &&
            _options.threshold < distance &&
            _options.velocity < Math.max(velocityX, velocityY);
    };
    /**
     * 开始识别
     * @param {Input} 输入 
     */
    function _recognize(computed: Computed, emit: EventTrigger) {
        if (_test(computed)) {
            emit(_options.name);
            // swipeleft...
            emit(_options.name + computed.direction);
        }

    };

    return [_recognize, ()=>_options];
};

Press.C = [ComputeDistance, ComputeVAndDir, ComputeMaxLength];