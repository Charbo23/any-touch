import { Computed, directionString } from '../interface';
import Recognizer from './Base';
interface Options {
    name?: string;
    threshold?: number;
    pointerLength?: number;
    directions?: directionString[];
};

export default class PanRecognizer extends Recognizer {
    public name: string;
    public options: Options;
    constructor({
        name = 'pan',
        threshold = 10,
        pointerLength = 1,
        directions = ['up', 'right', 'down', 'left'] }: Options = {}) {
        super({ name, threshold, pointerLength, directions });
    };

    /**
     * @param {Computed} 计算数据
     * @return {Boolean}} .是否是当前手势 
     */
    test({ pointerLength, distance, direction, inputStatus }: Computed): boolean {
        const isValidDirection = -1 !== this.options.directions.indexOf(direction);
        const isValidThreshold = this.options.threshold < distance;
        return isValidDirection &&
            (this.isRecognized || isValidThreshold) && 'move' === inputStatus;
    };
};