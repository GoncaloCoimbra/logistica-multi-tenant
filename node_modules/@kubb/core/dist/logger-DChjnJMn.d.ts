import { ConsolaInstance } from 'consola';
import { Ora } from 'ora';

declare class EventEmitter<TEvents extends Record<string, any>> {
    #private;
    constructor();
    emit<TEventName extends keyof TEvents & string>(eventName: TEventName, ...eventArg: TEvents[TEventName]): void;
    on<TEventName extends keyof TEvents & string>(eventName: TEventName, handler: (...eventArg: TEvents[TEventName]) => void): void;
    off<TEventName extends keyof TEvents & string>(eventName: TEventName, handler: (...eventArg: TEvents[TEventName]) => void): void;
    removeAll(): void;
}

declare const LogMapper: {
    readonly silent: number;
    readonly info: 3;
    readonly debug: 4;
};
declare const LogLevel: {
    readonly silent: "silent";
    readonly info: "info";
    readonly debug: "debug";
};
type LogLevel = keyof typeof LogLevel;
type Events = {
    start: [message: string];
    end: [message: string];
    error: [message: string, cause: Error];
    warning: [message: string];
    debug: [logs: string[]];
};
type Logger = {
    /**
     * Optional config name to show in CLI output
     */
    name?: string;
    logLevel: LogLevel;
    spinner?: Ora;
    consola?: ConsolaInstance;
    on: EventEmitter<Events>['on'];
    emit: EventEmitter<Events>['emit'];
};
type Props = {
    name?: string;
    logLevel: LogLevel;
    spinner?: Ora;
    consola?: ConsolaInstance;
};
declare function createLogger({ logLevel, name, spinner, consola }: Props): Logger;
declare function randomColour(text?: string, colours?: readonly ["black", "blue", "darkBlue", "cyan", "gray", "green", "darkGreen", "magenta", "red", "darkRed", "yellow", "darkYellow"]): string;
declare function randomCliColour(text?: string, colors?: readonly ["black", "blue", "darkBlue", "cyan", "gray", "green", "darkGreen", "magenta", "red", "darkRed", "yellow", "darkYellow"]): string;

export { EventEmitter as E, type Logger as L, LogLevel as a, LogMapper as b, createLogger as c, randomCliColour as d, randomColour as r };
