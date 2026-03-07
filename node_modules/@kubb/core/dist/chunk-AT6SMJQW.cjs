"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }



var _chunkXTU72BHDcjs = require('./chunk-XTU72BHD.cjs');


var _chunk2IH3FIGIcjs = require('./chunk-2IH3FIGI.cjs');


var _chunkKTZ6EAKPcjs = require('./chunk-KTZ6EAKP.cjs');










var _chunkNFUUQKWPcjs = require('./chunk-NFUUQKWP.cjs');

// ../../node_modules/.pnpm/eventemitter3@5.0.1/node_modules/eventemitter3/index.js
var require_eventemitter3 = _chunkNFUUQKWPcjs.__commonJS.call(void 0, {
  "../../node_modules/.pnpm/eventemitter3@5.0.1/node_modules/eventemitter3/index.js"(exports, module) {
    "use strict";
    _chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
    var has = Object.prototype.hasOwnProperty;
    var prefix = "~";
    function Events() {
    }
    if (Object.create) {
      Events.prototype = /* @__PURE__ */ Object.create(null);
      if (!new Events().__proto__) prefix = false;
    }
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }
    function addListener(emitter, event, fn, context, once) {
      if (typeof fn !== "function") {
        throw new TypeError("The listener must be a function");
      }
      var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
      if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
      else emitter._events[evt] = [emitter._events[evt], listener];
      return emitter;
    }
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0) emitter._events = new Events();
      else delete emitter._events[evt];
    }
    function EventEmitter2() {
      this._events = new Events();
      this._eventsCount = 0;
    }
    EventEmitter2.prototype.eventNames = function eventNames() {
      var names = [], events, name;
      if (this._eventsCount === 0) return names;
      for (name in events = this._events) {
        if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
      }
      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }
      return names;
    };
    EventEmitter2.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event, handlers = this._events[evt];
      if (!handlers) return [];
      if (handlers.fn) return [handlers.fn];
      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }
      return ee;
    };
    EventEmitter2.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event, listeners = this._events[evt];
      if (!listeners) return 0;
      if (listeners.fn) return 1;
      return listeners.length;
    };
    EventEmitter2.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt]) return false;
      var listeners = this._events[evt], len = arguments.length, args, i;
      if (listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
        switch (len) {
          case 1:
            return listeners.fn.call(listeners.context), true;
          case 2:
            return listeners.fn.call(listeners.context, a1), true;
          case 3:
            return listeners.fn.call(listeners.context, a1, a2), true;
          case 4:
            return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for (i = 1, args = new Array(len - 1); i < len; i++) {
          args[i - 1] = arguments[i];
        }
        listeners.fn.apply(listeners.context, args);
      } else {
        var length = listeners.length, j;
        for (i = 0; i < length; i++) {
          if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
          switch (len) {
            case 1:
              listeners[i].fn.call(listeners[i].context);
              break;
            case 2:
              listeners[i].fn.call(listeners[i].context, a1);
              break;
            case 3:
              listeners[i].fn.call(listeners[i].context, a1, a2);
              break;
            case 4:
              listeners[i].fn.call(listeners[i].context, a1, a2, a3);
              break;
            default:
              if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
                args[j - 1] = arguments[j];
              }
              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }
      return true;
    };
    EventEmitter2.prototype.on = function on(event, fn, context) {
      return addListener(this, event, fn, context, false);
    };
    EventEmitter2.prototype.once = function once(event, fn, context) {
      return addListener(this, event, fn, context, true);
    };
    EventEmitter2.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt]) return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }
      var listeners = this._events[evt];
      if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
          clearEvent(this, evt);
        }
      } else {
        for (var i = 0, events = [], length = listeners.length; i < length; i++) {
          if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
            events.push(listeners[i]);
          }
        }
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
        else clearEvent(this, evt);
      }
      return this;
    };
    EventEmitter2.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;
      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt]) clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }
      return this;
    };
    EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
    EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;
    EventEmitter2.prefixed = prefix;
    EventEmitter2.EventEmitter = EventEmitter2;
    if ("undefined" !== typeof module) {
      module.exports = EventEmitter2;
    }
  }
});

// src/FileManager.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
var _crypto = require('crypto'); var _crypto2 = _interopRequireDefault(_crypto);
var _path = require('path'); var _path2 = _interopRequireDefault(_path);

// ../../node_modules/.pnpm/p-queue@8.0.1/node_modules/p-queue/dist/index.js
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );

// ../../node_modules/.pnpm/eventemitter3@5.0.1/node_modules/eventemitter3/index.mjs
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
var import_index = _chunkNFUUQKWPcjs.__toESM.call(void 0, require_eventemitter3(), 1);

// ../../node_modules/.pnpm/p-timeout@6.1.2/node_modules/p-timeout/index.js
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
var TimeoutError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "TimeoutError";
  }
};
var AbortError = class extends Error {
  constructor(message) {
    super();
    this.name = "AbortError";
    this.message = message;
  }
};
var getDOMException = (errorMessage) => globalThis.DOMException === void 0 ? new AbortError(errorMessage) : new DOMException(errorMessage);
var getAbortedReason = (signal) => {
  const reason = signal.reason === void 0 ? getDOMException("This operation was aborted.") : signal.reason;
  return reason instanceof Error ? reason : getDOMException(reason);
};
function pTimeout(promise, options) {
  const {
    milliseconds,
    fallback,
    message,
    customTimers = { setTimeout, clearTimeout }
  } = options;
  let timer;
  const wrappedPromise = new Promise((resolve2, reject) => {
    if (typeof milliseconds !== "number" || Math.sign(milliseconds) !== 1) {
      throw new TypeError(`Expected \`milliseconds\` to be a positive number, got \`${milliseconds}\``);
    }
    if (options.signal) {
      const { signal } = options;
      if (signal.aborted) {
        reject(getAbortedReason(signal));
      }
      signal.addEventListener("abort", () => {
        reject(getAbortedReason(signal));
      });
    }
    if (milliseconds === Number.POSITIVE_INFINITY) {
      promise.then(resolve2, reject);
      return;
    }
    const timeoutError = new TimeoutError();
    timer = customTimers.setTimeout.call(void 0, () => {
      if (fallback) {
        try {
          resolve2(fallback());
        } catch (error) {
          reject(error);
        }
        return;
      }
      if (typeof promise.cancel === "function") {
        promise.cancel();
      }
      if (message === false) {
        resolve2();
      } else if (message instanceof Error) {
        reject(message);
      } else {
        timeoutError.message = _nullishCoalesce(message, () => ( `Promise timed out after ${milliseconds} milliseconds`));
        reject(timeoutError);
      }
    }, milliseconds);
    (async () => {
      try {
        resolve2(await promise);
      } catch (error) {
        reject(error);
      }
    })();
  });
  const cancelablePromise = wrappedPromise.finally(() => {
    cancelablePromise.clear();
  });
  cancelablePromise.clear = () => {
    customTimers.clearTimeout.call(void 0, timer);
    timer = void 0;
  };
  return cancelablePromise;
}

// ../../node_modules/.pnpm/p-queue@8.0.1/node_modules/p-queue/dist/priority-queue.js
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );

// ../../node_modules/.pnpm/p-queue@8.0.1/node_modules/p-queue/dist/lower-bound.js
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
function lowerBound(array, value, comparator) {
  let first = 0;
  let count = array.length;
  while (count > 0) {
    const step = Math.trunc(count / 2);
    let it = first + step;
    if (comparator(array[it], value) <= 0) {
      first = ++it;
      count -= step + 1;
    } else {
      count = step;
    }
  }
  return first;
}

// ../../node_modules/.pnpm/p-queue@8.0.1/node_modules/p-queue/dist/priority-queue.js
var _queue;
var PriorityQueue = class {
  constructor() {
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _queue, []);
  }
  enqueue(run, options) {
    options = {
      priority: 0,
      ...options
    };
    const element = {
      priority: options.priority,
      run
    };
    if (this.size && _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _queue)[this.size - 1].priority >= options.priority) {
      _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _queue).push(element);
      return;
    }
    const index = lowerBound(_chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _queue), element, (a, b) => b.priority - a.priority);
    _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _queue).splice(index, 0, element);
  }
  dequeue() {
    const item = _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _queue).shift();
    return _optionalChain([item, 'optionalAccess', _2 => _2.run]);
  }
  filter(options) {
    return _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _queue).filter((element) => element.priority === options.priority).map((element) => element.run);
  }
  get size() {
    return _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _queue).length;
  }
};
_queue = new WeakMap();

// ../../node_modules/.pnpm/p-queue@8.0.1/node_modules/p-queue/dist/index.js
var _carryoverConcurrencyCount, _isIntervalIgnored, _intervalCount, _intervalCap, _interval, _intervalEnd, _intervalId, _timeoutId, _queue2, _queueClass, _pending, _concurrency, _isPaused, _throwOnTimeout, _PQueue_instances, doesIntervalAllowAnother_get, doesConcurrentAllowAnother_get, next_fn, onResumeInterval_fn, isIntervalPaused_get, tryToStartAnother_fn, initializeIntervalIfNeeded_fn, onInterval_fn, processQueue_fn, throwOnAbort_fn, onEvent_fn;
var PQueue = class extends import_index.default {
  // TODO: The `throwOnTimeout` option should affect the return types of `add()` and `addAll()`
  constructor(options) {
    super();
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _PQueue_instances);
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _carryoverConcurrencyCount);
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _isIntervalIgnored);
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _intervalCount, 0);
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _intervalCap);
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _interval);
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _intervalEnd, 0);
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _intervalId);
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _timeoutId);
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _queue2);
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _queueClass);
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _pending, 0);
    // The `!` is needed because of https://github.com/microsoft/TypeScript/issues/32194
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _concurrency);
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _isPaused);
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _throwOnTimeout);
    /**
        Per-operation timeout in milliseconds. Operations fulfill once `timeout` elapses if they haven't already.
    
        Applies to each future operation.
        */
    _chunkNFUUQKWPcjs.__publicField.call(void 0, this, "timeout");
    options = {
      carryoverConcurrencyCount: false,
      intervalCap: Number.POSITIVE_INFINITY,
      interval: 0,
      concurrency: Number.POSITIVE_INFINITY,
      autoStart: true,
      queueClass: PriorityQueue,
      ...options
    };
    if (!(typeof options.intervalCap === "number" && options.intervalCap >= 1)) {
      throw new TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${_nullishCoalesce(_optionalChain([options, 'access', _3 => _3.intervalCap, 'optionalAccess', _4 => _4.toString, 'call', _5 => _5()]), () => ( ""))}\` (${typeof options.intervalCap})`);
    }
    if (options.interval === void 0 || !(Number.isFinite(options.interval) && options.interval >= 0)) {
      throw new TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${_nullishCoalesce(_optionalChain([options, 'access', _6 => _6.interval, 'optionalAccess', _7 => _7.toString, 'call', _8 => _8()]), () => ( ""))}\` (${typeof options.interval})`);
    }
    _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _carryoverConcurrencyCount, options.carryoverConcurrencyCount);
    _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _isIntervalIgnored, options.intervalCap === Number.POSITIVE_INFINITY || options.interval === 0);
    _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _intervalCap, options.intervalCap);
    _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _interval, options.interval);
    _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _queue2, new options.queueClass());
    _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _queueClass, options.queueClass);
    this.concurrency = options.concurrency;
    this.timeout = options.timeout;
    _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _throwOnTimeout, options.throwOnTimeout === true);
    _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _isPaused, options.autoStart === false);
  }
  get concurrency() {
    return _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _concurrency);
  }
  set concurrency(newConcurrency) {
    if (!(typeof newConcurrency === "number" && newConcurrency >= 1)) {
      throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${newConcurrency}\` (${typeof newConcurrency})`);
    }
    _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _concurrency, newConcurrency);
    _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PQueue_instances, processQueue_fn).call(this);
  }
  async add(function_, options = {}) {
    options = {
      timeout: this.timeout,
      throwOnTimeout: _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _throwOnTimeout),
      ...options
    };
    return new Promise((resolve2, reject) => {
      _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _queue2).enqueue(async () => {
        _chunkNFUUQKWPcjs.__privateWrapper.call(void 0, this, _pending)._++;
        _chunkNFUUQKWPcjs.__privateWrapper.call(void 0, this, _intervalCount)._++;
        try {
          _optionalChain([options, 'access', _9 => _9.signal, 'optionalAccess', _10 => _10.throwIfAborted, 'call', _11 => _11()]);
          let operation = function_({ signal: options.signal });
          if (options.timeout) {
            operation = pTimeout(Promise.resolve(operation), { milliseconds: options.timeout });
          }
          if (options.signal) {
            operation = Promise.race([operation, _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PQueue_instances, throwOnAbort_fn).call(this, options.signal)]);
          }
          const result = await operation;
          resolve2(result);
          this.emit("completed", result);
        } catch (error) {
          if (error instanceof TimeoutError && !options.throwOnTimeout) {
            resolve2();
            return;
          }
          reject(error);
          this.emit("error", error);
        } finally {
          _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PQueue_instances, next_fn).call(this);
        }
      }, options);
      this.emit("add");
      _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PQueue_instances, tryToStartAnother_fn).call(this);
    });
  }
  async addAll(functions, options) {
    return Promise.all(functions.map(async (function_) => this.add(function_, options)));
  }
  /**
  Start (or resume) executing enqueued tasks within concurrency limit. No need to call this if queue is not paused (via `options.autoStart = false` or by `.pause()` method.)
  */
  start() {
    if (!_chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _isPaused)) {
      return this;
    }
    _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _isPaused, false);
    _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PQueue_instances, processQueue_fn).call(this);
    return this;
  }
  /**
  Put queue execution on hold.
  */
  pause() {
    _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _isPaused, true);
  }
  /**
  Clear the queue.
  */
  clear() {
    _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _queue2, new (_chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _queueClass))());
  }
  /**
      Can be called multiple times. Useful if you for example add additional items at a later time.
  
      @returns A promise that settles when the queue becomes empty.
      */
  async onEmpty() {
    if (_chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _queue2).size === 0) {
      return;
    }
    await _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PQueue_instances, onEvent_fn).call(this, "empty");
  }
  /**
      @returns A promise that settles when the queue size is less than the given limit: `queue.size < limit`.
  
      If you want to avoid having the queue grow beyond a certain size you can `await queue.onSizeLessThan()` before adding a new item.
  
      Note that this only limits the number of items waiting to start. There could still be up to `concurrency` jobs already running that this call does not include in its calculation.
      */
  async onSizeLessThan(limit) {
    if (_chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _queue2).size < limit) {
      return;
    }
    await _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PQueue_instances, onEvent_fn).call(this, "next", () => _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _queue2).size < limit);
  }
  /**
      The difference with `.onEmpty` is that `.onIdle` guarantees that all work from the queue has finished. `.onEmpty` merely signals that the queue is empty, but it could mean that some promises haven't completed yet.
  
      @returns A promise that settles when the queue becomes empty, and all promises have completed; `queue.size === 0 && queue.pending === 0`.
      */
  async onIdle() {
    if (_chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _pending) === 0 && _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _queue2).size === 0) {
      return;
    }
    await _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PQueue_instances, onEvent_fn).call(this, "idle");
  }
  /**
  Size of the queue, the number of queued items waiting to run.
  */
  get size() {
    return _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _queue2).size;
  }
  /**
      Size of the queue, filtered by the given options.
  
      For example, this can be used to find the number of items remaining in the queue with a specific priority level.
      */
  sizeBy(options) {
    return _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _queue2).filter(options).length;
  }
  /**
  Number of running items (no longer in the queue).
  */
  get pending() {
    return _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _pending);
  }
  /**
  Whether the queue is currently paused.
  */
  get isPaused() {
    return _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _isPaused);
  }
};
_carryoverConcurrencyCount = new WeakMap();
_isIntervalIgnored = new WeakMap();
_intervalCount = new WeakMap();
_intervalCap = new WeakMap();
_interval = new WeakMap();
_intervalEnd = new WeakMap();
_intervalId = new WeakMap();
_timeoutId = new WeakMap();
_queue2 = new WeakMap();
_queueClass = new WeakMap();
_pending = new WeakMap();
_concurrency = new WeakMap();
_isPaused = new WeakMap();
_throwOnTimeout = new WeakMap();
_PQueue_instances = new WeakSet();
doesIntervalAllowAnother_get = function() {
  return _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _isIntervalIgnored) || _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _intervalCount) < _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _intervalCap);
};
doesConcurrentAllowAnother_get = function() {
  return _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _pending) < _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _concurrency);
};
next_fn = function() {
  _chunkNFUUQKWPcjs.__privateWrapper.call(void 0, this, _pending)._--;
  _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PQueue_instances, tryToStartAnother_fn).call(this);
  this.emit("next");
};
onResumeInterval_fn = function() {
  _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PQueue_instances, onInterval_fn).call(this);
  _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PQueue_instances, initializeIntervalIfNeeded_fn).call(this);
  _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _timeoutId, void 0);
};
isIntervalPaused_get = function() {
  const now = Date.now();
  if (_chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _intervalId) === void 0) {
    const delay = _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _intervalEnd) - now;
    if (delay < 0) {
      _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _intervalCount, _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _carryoverConcurrencyCount) ? _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _pending) : 0);
    } else {
      if (_chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _timeoutId) === void 0) {
        _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _timeoutId, setTimeout(() => {
          _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PQueue_instances, onResumeInterval_fn).call(this);
        }, delay));
      }
      return true;
    }
  }
  return false;
};
tryToStartAnother_fn = function() {
  if (_chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _queue2).size === 0) {
    if (_chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _intervalId)) {
      clearInterval(_chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _intervalId));
    }
    _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _intervalId, void 0);
    this.emit("empty");
    if (_chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _pending) === 0) {
      this.emit("idle");
    }
    return false;
  }
  if (!_chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _isPaused)) {
    const canInitializeInterval = !_chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _PQueue_instances, isIntervalPaused_get);
    if (_chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _PQueue_instances, doesIntervalAllowAnother_get) && _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _PQueue_instances, doesConcurrentAllowAnother_get)) {
      const job = _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _queue2).dequeue();
      if (!job) {
        return false;
      }
      this.emit("active");
      job();
      if (canInitializeInterval) {
        _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PQueue_instances, initializeIntervalIfNeeded_fn).call(this);
      }
      return true;
    }
  }
  return false;
};
initializeIntervalIfNeeded_fn = function() {
  if (_chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _isIntervalIgnored) || _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _intervalId) !== void 0) {
    return;
  }
  _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _intervalId, setInterval(() => {
    _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PQueue_instances, onInterval_fn).call(this);
  }, _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _interval)));
  _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _intervalEnd, Date.now() + _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _interval));
};
onInterval_fn = function() {
  if (_chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _intervalCount) === 0 && _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _pending) === 0 && _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _intervalId)) {
    clearInterval(_chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _intervalId));
    _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _intervalId, void 0);
  }
  _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _intervalCount, _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _carryoverConcurrencyCount) ? _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _pending) : 0);
  _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PQueue_instances, processQueue_fn).call(this);
};
/**
Executes all queued functions until it reaches the limit.
*/
processQueue_fn = function() {
  while (_chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PQueue_instances, tryToStartAnother_fn).call(this)) {
  }
};
throwOnAbort_fn = async function(signal) {
  return new Promise((_resolve, reject) => {
    signal.addEventListener("abort", () => {
      reject(signal.reason);
    }, { once: true });
  });
};
onEvent_fn = async function(event, filter) {
  return new Promise((resolve2) => {
    const listener = () => {
      if (filter && !filter()) {
        return;
      }
      this.off(event, listener);
      resolve2();
    };
    this.on(event, listener);
  });
};

// src/FileManager.ts
var _remeda = require('remeda');
var _fs = require('@kubb/fs');

// src/BarrelManager.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
var _parserts = require('@kubb/parser-ts');


// src/utils/TreeNode.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
var _directorytree = require('directory-tree'); var _directorytree2 = _interopRequireDefault(_directorytree);
var TreeNode = class _TreeNode {
  constructor(data, parent) {
    this.children = [];
    this.data = data;
    this.parent = parent;
    return this;
  }
  addChild(data) {
    const child = new _TreeNode(data, this);
    if (!this.children) {
      this.children = [];
    }
    this.children.push(child);
    return child;
  }
  find(data) {
    if (!data) {
      return null;
    }
    if (data === this.data) {
      return this;
    }
    if (_optionalChain([this, 'access', _12 => _12.children, 'optionalAccess', _13 => _13.length])) {
      for (let i = 0, { length } = this.children, target = null; i < length; i++) {
        target = this.children[i].find(data);
        if (target) {
          return target;
        }
      }
    }
    return null;
  }
  get leaves() {
    if (!this.children || this.children.length === 0) {
      return [this];
    }
    const leaves = [];
    if (this.children) {
      for (let i = 0, { length } = this.children; i < length; i++) {
        leaves.push.apply(leaves, this.children[i].leaves);
      }
    }
    return leaves;
  }
  get root() {
    if (!this.parent) {
      return this;
    }
    return this.parent.root;
  }
  forEach(callback) {
    if (typeof callback !== "function") {
      throw new TypeError("forEach() callback must be a function");
    }
    callback(this);
    if (this.children) {
      for (let i = 0, { length } = this.children; i < length; i++) {
        _optionalChain([this, 'access', _14 => _14.children, 'access', _15 => _15[i], 'optionalAccess', _16 => _16.forEach, 'call', _17 => _17(callback)]);
      }
    }
    return this;
  }
  static build(path2, options = {}) {
    try {
      const exclude = Array.isArray(options.exclude) ? options.exclude : [options.exclude].filter(Boolean);
      const filteredTree = _directorytree2.default.call(void 0, path2, {
        extensions: options.extensions,
        exclude: [/node_modules/, ...exclude]
      });
      if (!filteredTree) {
        return null;
      }
      const treeNode = new _TreeNode({
        name: filteredTree.name,
        path: filteredTree.path,
        type: FileManager.getMode(filteredTree.path)
      });
      const recurse = (node, item) => {
        const subNode = node.addChild({
          name: item.name,
          path: item.path,
          type: FileManager.getMode(item.path)
        });
        if (_optionalChain([item, 'access', _18 => _18.children, 'optionalAccess', _19 => _19.length])) {
          _optionalChain([item, 'access', _20 => _20.children, 'optionalAccess', _21 => _21.forEach, 'call', _22 => _22((child) => {
            recurse(subNode, child);
          })]);
        }
      };
      _optionalChain([filteredTree, 'access', _23 => _23.children, 'optionalAccess', _24 => _24.forEach, 'call', _25 => _25((child) => recurse(treeNode, child))]);
      return treeNode;
    } catch (e) {
      throw new Error("Something went wrong with creating index files with the TreehNode class", { cause: e });
    }
  }
};

// src/BarrelManager.ts
var _options;
var BarrelManager = class {
  constructor(options = {}) {
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _options);
    _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _options, options);
    return this;
  }
  getNamedExport(root, item) {
    const exportedNames = _parserts.getExports.call(void 0, _path2.default.resolve(root, item.path));
    if (!exportedNames) {
      return [item];
    }
    return exportedNames.reduce(
      (prev, curr) => {
        if (!_optionalChain([prev, 'access', _26 => _26[0], 'optionalAccess', _27 => _27.name]) || !_optionalChain([prev, 'access', _28 => _28[1], 'optionalAccess', _29 => _29.name])) {
          return prev;
        }
        if (curr.isTypeOnly) {
          prev[1] = { ...prev[1], name: [...prev[1].name, curr.name] };
        } else {
          prev[0] = { ...prev[0], name: [...prev[0].name, curr.name] };
        }
        return prev;
      },
      [
        {
          ...item,
          name: [],
          isTypeOnly: false
        },
        {
          ...item,
          name: [],
          isTypeOnly: true
        }
      ]
    );
  }
  getNamedExports(root, exports) {
    return _optionalChain([exports, 'optionalAccess', _30 => _30.flatMap, 'call', _31 => _31((item) => {
      return this.getNamedExport(root, item);
    })]);
  }
  getIndexes(root) {
    const { treeNode = {}, isTypeOnly, extName } = _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _options);
    const tree = TreeNode.build(root, treeNode);
    if (!tree) {
      return null;
    }
    const fileReducer = (files, treeNode2) => {
      if (!treeNode2.children) {
        return [];
      }
      if (treeNode2.children.length > 1) {
        const indexPath = _path2.default.resolve(treeNode2.data.path, "index.ts");
        const exports = treeNode2.children.filter(Boolean).map((file) => {
          const importPath = file.data.type === "split" ? `./${file.data.name}/index` : `./${_chunkXTU72BHDcjs.trimExtName.call(void 0, file.data.name)}`;
          if (importPath.endsWith("index") && file.data.type === "single") {
            return void 0;
          }
          return {
            path: extName ? `${importPath}${extName}` : importPath,
            isTypeOnly
          };
        }).filter(Boolean);
        files.push({
          path: indexPath,
          baseName: "index.ts",
          source: "",
          exports,
          exportable: true
        });
      } else if (treeNode2.children.length === 1) {
        const [treeNodeChild] = treeNode2.children;
        const indexPath = _path2.default.resolve(treeNode2.data.path, "index.ts");
        const importPath = treeNodeChild.data.type === "split" ? `./${treeNodeChild.data.name}/index` : `./${_chunkXTU72BHDcjs.trimExtName.call(void 0, treeNodeChild.data.name)}`;
        const exports = [
          {
            path: extName ? `${importPath}${extName}` : importPath,
            isTypeOnly
          }
        ];
        files.push({
          path: indexPath,
          baseName: "index.ts",
          source: "",
          exports,
          exportable: true
        });
      }
      treeNode2.children.forEach((childItem) => {
        fileReducer(files, childItem);
      });
      return files;
    };
    return fileReducer([], tree).reverse();
  }
};
_options = new WeakMap();

// src/FileManager.ts
var _cache, _task, _queue3, _FileManager_instances, add_fn, addOrAppend_fn;
var _FileManager = class _FileManager {
  constructor({ task = async (file) => file, queue = new PQueue() } = {}) {
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _FileManager_instances);
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _cache, /* @__PURE__ */ new Map());
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _task);
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _queue3);
    _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _task, task);
    _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _queue3, queue);
    return this;
  }
  get files() {
    const files = [];
    _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _cache).forEach((item) => {
      files.push(...item.flat(1));
    });
    return files;
  }
  get isExecuting() {
    return _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _queue3).size !== 0 && _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _queue3).pending !== 0;
  }
  async add(...files) {
    const promises = combineFiles(files).map((file) => {
      if (file.override) {
        return _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _FileManager_instances, add_fn).call(this, file);
      }
      return _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _FileManager_instances, addOrAppend_fn).call(this, file);
    });
    const resolvedFiles = await Promise.all(promises);
    if (files.length > 1) {
      return resolvedFiles;
    }
    return resolvedFiles[0];
  }
  async addIndexes({ root, output, meta, logger, options = {} }) {
    const { exportType = "barrel" } = output;
    if (exportType === false) {
      return void 0;
    }
    const pathToBuildFrom = _path.resolve.call(void 0, root, output.path);
    if (_chunkXTU72BHDcjs.transformers_default.trimExtName(pathToBuildFrom).endsWith("index")) {
      logger.emit("warning", "Output has the same fileName as the barrelFiles, please disable barrel generation");
      return;
    }
    const exportPath = output.path.startsWith("./") ? _chunkXTU72BHDcjs.trimExtName.call(void 0, output.path) : `./${_chunkXTU72BHDcjs.trimExtName.call(void 0, output.path)}`;
    const mode = _FileManager.getMode(output.path);
    const barrelManager = new BarrelManager({
      extName: output.extName,
      ...options
    });
    let files = barrelManager.getIndexes(pathToBuildFrom);
    if (!files) {
      return void 0;
    }
    if (exportType === "barrelNamed") {
      files = files.map((file) => {
        if (file.exports) {
          return {
            ...file,
            exports: barrelManager.getNamedExports(pathToBuildFrom, file.exports)
          };
        }
        return file;
      });
    }
    await Promise.all(
      files.map((file) => {
        return _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _FileManager_instances, addOrAppend_fn).call(this, {
          ...file,
          meta: meta ? meta : file.meta
        });
      })
    );
    const rootPath = mode === "split" ? `${exportPath}/index${output.extName || ""}` : `${exportPath}${output.extName || ""}`;
    const rootFile = {
      path: _path.resolve.call(void 0, root, "index.ts"),
      baseName: "index.ts",
      source: "",
      exports: [
        output.exportAs ? {
          name: output.exportAs,
          asAlias: true,
          path: rootPath,
          isTypeOnly: options.isTypeOnly
        } : {
          path: rootPath,
          isTypeOnly: options.isTypeOnly
        }
      ],
      exportable: true
    };
    if (exportType === "barrelNamed" && !output.exportAs && _optionalChain([rootFile, 'access', _32 => _32.exports, 'optionalAccess', _33 => _33[0]])) {
      rootFile.exports = barrelManager.getNamedExport(root, rootFile.exports[0]);
    }
    await _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _FileManager_instances, addOrAppend_fn).call(this, {
      ...rootFile,
      meta: meta ? meta : rootFile.meta
    });
  }
  getCacheByUUID(UUID) {
    let cache;
    _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _cache).forEach((files) => {
      cache = files.find((item) => item.id === UUID);
    });
    return cache;
  }
  get(path2) {
    return _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _cache).get(path2);
  }
  remove(path2) {
    const cacheItem = this.get(path2);
    if (!cacheItem) {
      return;
    }
    _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _cache).delete(path2);
  }
  async write(...params) {
    return _fs.write.call(void 0, ...params);
  }
  async read(...params) {
    return _fs.read.call(void 0, ...params);
  }
  // statics
  static async getSource(file) {
    return getSource(file);
  }
  static combineFiles(files) {
    return combineFiles(files);
  }
  static getMode(path2) {
    if (!path2) {
      return "split";
    }
    return _path.extname.call(void 0, path2) ? "single" : "split";
  }
  static get extensions() {
    return [".js", ".ts", ".tsx"];
  }
  static isJavascript(baseName) {
    return _FileManager.extensions.some((extension) => baseName.endsWith(extension));
  }
};
_cache = new WeakMap();
_task = new WeakMap();
_queue3 = new WeakMap();
_FileManager_instances = new WeakSet();
add_fn = async function(file) {
  const controller = new AbortController();
  const resolvedFile = {
    id: _crypto2.default.randomUUID(),
    name: _chunkXTU72BHDcjs.trimExtName.call(void 0, file.baseName),
    ...file
  };
  if (_optionalChain([resolvedFile, 'access', _34 => _34.exports, 'optionalAccess', _35 => _35.length])) {
    const folder = resolvedFile.path.replace(resolvedFile.baseName, "");
    resolvedFile.exports = resolvedFile.exports.filter((exportItem) => {
      const exportedFile = this.files.find((file2) => file2.path.includes(_path.resolve.call(void 0, folder, exportItem.path)));
      if (exportedFile) {
        return exportedFile.exportable;
      }
      return true;
    });
  }
  _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _cache).set(resolvedFile.path, [{ cancel: () => controller.abort(), ...resolvedFile }]);
  return _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _queue3).add(
    async () => {
      var _a;
      return (_a = _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _task)) == null ? void 0 : _a.call(this, resolvedFile);
    },
    { signal: controller.signal }
  );
};
addOrAppend_fn = async function(file) {
  const previousCaches = _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _cache).get(file.path);
  const previousCache = previousCaches ? previousCaches.at(previousCaches.length - 1) : void 0;
  if (previousCache) {
    _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _cache).delete(previousCache.path);
    return _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _FileManager_instances, add_fn).call(this, {
      ...file,
      source: previousCache.source && file.source ? `${previousCache.source}
${file.source}` : "",
      imports: [...previousCache.imports || [], ...file.imports || []],
      exports: [...previousCache.exports || [], ...file.exports || []],
      env: { ...previousCache.env || {}, ...file.env || {} }
    });
  }
  return _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _FileManager_instances, add_fn).call(this, file);
};
var FileManager = _FileManager;
function combineFiles(files) {
  return files.filter(Boolean).reduce(
    (acc, file) => {
      const prevIndex = acc.findIndex((item) => item.path === file.path);
      if (prevIndex === -1) {
        return [...acc, file];
      }
      const prev = acc[prevIndex];
      if (prev && file.override) {
        acc[prevIndex] = {
          imports: [],
          exports: [],
          ...file
        };
        return acc;
      }
      if (prev) {
        acc[prevIndex] = {
          ...file,
          source: prev.source && file.source ? `${prev.source}
${file.source}` : "",
          imports: [...prev.imports || [], ...file.imports || []],
          exports: [...prev.exports || [], ...file.exports || []],
          env: { ...prev.env || {}, ...file.env || {} }
        };
      }
      return acc;
    },
    []
  );
}
async function getSource(file) {
  if (file.language ? !["typescript", "javascript"].includes(file.language) : !FileManager.isJavascript(file.baseName)) {
    return file.source;
  }
  const parser = await _chunk2IH3FIGIcjs.getParser.call(void 0, file.language);
  const exports = file.exports ? combineExports(file.exports) : [];
  const imports = file.imports && file.source ? combineImports(file.imports, exports, file.source) : [];
  const importNodes = imports.filter((item) => {
    const path2 = item.root ? _fs.getRelativePath.call(void 0, item.root, item.path) : item.path;
    return path2 !== _chunkXTU72BHDcjs.trimExtName.call(void 0, file.path);
  }).map((item) => {
    const path2 = item.root ? _fs.getRelativePath.call(void 0, item.root, item.path) : item.path;
    return parser.factory.createImportDeclaration({
      name: item.name,
      path: item.extName ? `${path2}${item.extName}` : path2,
      isTypeOnly: item.isTypeOnly
    });
  });
  const exportNodes = exports.map(
    (item) => parser.factory.createExportDeclaration({
      name: item.name,
      path: item.extName ? `${item.path}${item.extName}` : item.path,
      isTypeOnly: item.isTypeOnly,
      asAlias: item.asAlias
    })
  );
  const source = [parser.print([...importNodes, ...exportNodes]), getEnvSource(file.source, file.env)].join("\n");
  return parser.print([], { source, noEmitHelpers: false });
}
function combineExports(exports) {
  const combinedExports = _chunkKTZ6EAKPcjs.orderBy.call(void 0, exports, [(v) => !v.isTypeOnly], ["asc"]).reduce(
    (prev, curr) => {
      const name = curr.name;
      const prevByPath = prev.findLast((imp) => imp.path === curr.path);
      const prevByPathAndIsTypeOnly = prev.findLast((imp) => imp.path === curr.path && _remeda.isDeepEqual.call(void 0, imp.name, name) && imp.isTypeOnly);
      if (prevByPathAndIsTypeOnly) {
        return prev;
      }
      const uniquePrev = prev.findLast(
        (imp) => imp.path === curr.path && _remeda.isDeepEqual.call(void 0, imp.name, name) && imp.isTypeOnly === curr.isTypeOnly && imp.asAlias === curr.asAlias
      );
      if (uniquePrev || Array.isArray(name) && !name.length || _optionalChain([prevByPath, 'optionalAccess', _36 => _36.asAlias]) && !curr.asAlias) {
        return prev;
      }
      if (!prevByPath) {
        return [
          ...prev,
          {
            ...curr,
            name: Array.isArray(name) ? [...new Set(name)] : name
          }
        ];
      }
      if (prevByPath && Array.isArray(prevByPath.name) && Array.isArray(curr.name) && prevByPath.isTypeOnly === curr.isTypeOnly) {
        prevByPath.name = [.../* @__PURE__ */ new Set([...prevByPath.name, ...curr.name])];
        return prev;
      }
      return [...prev, curr];
    },
    []
  );
  return _chunkKTZ6EAKPcjs.orderBy.call(void 0, combinedExports, [(v) => !v.isTypeOnly, (v) => v.asAlias], ["desc", "desc"]);
}
function combineImports(imports, exports, source) {
  const combinedImports = _chunkKTZ6EAKPcjs.orderBy.call(void 0, imports, [(v) => !v.isTypeOnly], ["asc"]).reduce(
    (prev, curr) => {
      let name = Array.isArray(curr.name) ? [...new Set(curr.name)] : curr.name;
      const hasImportInSource = (importName) => {
        if (!source) {
          return true;
        }
        const checker = (name2) => name2 && !!source.includes(name2);
        return checker(importName) || exports.some(({ name: name2 }) => Array.isArray(name2) ? name2.some(checker) : checker(name2));
      };
      if (curr.path === curr.root) {
        return prev;
      }
      if (Array.isArray(name)) {
        name = name.filter((item) => typeof item === "string" ? hasImportInSource(item) : hasImportInSource(item.propertyName));
      }
      const prevByPath = prev.findLast((imp) => imp.path === curr.path && imp.isTypeOnly === curr.isTypeOnly);
      const uniquePrev = prev.findLast((imp) => imp.path === curr.path && _remeda.isDeepEqual.call(void 0, imp.name, name) && imp.isTypeOnly === curr.isTypeOnly);
      const prevByPathNameAndIsTypeOnly = prev.findLast((imp) => imp.path === curr.path && _remeda.isDeepEqual.call(void 0, imp.name, name) && imp.isTypeOnly);
      if (prevByPathNameAndIsTypeOnly) {
        return prev;
      }
      if (uniquePrev || Array.isArray(name) && !name.length) {
        return prev;
      }
      if (!prevByPath) {
        return [
          ...prev,
          {
            ...curr,
            name
          }
        ];
      }
      if (prevByPath && Array.isArray(prevByPath.name) && Array.isArray(name) && prevByPath.isTypeOnly === curr.isTypeOnly) {
        prevByPath.name = [.../* @__PURE__ */ new Set([...prevByPath.name, ...name])];
        return prev;
      }
      if (!Array.isArray(name) && name && !hasImportInSource(name)) {
        return prev;
      }
      return [...prev, curr];
    },
    []
  );
  return _chunkKTZ6EAKPcjs.orderBy.call(void 0, combinedImports, [(v) => !v.isTypeOnly], ["desc"]);
}
function getEnvSource(source, env) {
  if (!env) {
    return source;
  }
  const keys = Object.keys(env);
  if (!keys.length) {
    return source;
  }
  return keys.reduce((prev, key) => {
    const environmentValue = env[key];
    const replaceBy = environmentValue ? `'${_optionalChain([environmentValue, 'access', _37 => _37.replaceAll, 'call', _38 => _38('"', ""), 'optionalAccess', _39 => _39.replaceAll, 'call', _40 => _40("'", "")])}'` : "undefined";
    if (key.toUpperCase() !== key) {
      throw new TypeError(`Environment should be in upperCase for ${key}`);
    }
    if (typeof replaceBy === "string") {
      prev = _chunkXTU72BHDcjs.searchAndReplace.call(void 0, {
        text: prev.replaceAll(`process.env.${key}`, replaceBy),
        replaceBy,
        prefix: "process.env",
        key
      });
      prev = _chunkXTU72BHDcjs.searchAndReplace.call(void 0, {
        text: prev.replaceAll(/(declare const).*\n/gi, ""),
        replaceBy,
        key
      });
    }
    return prev;
  }, source);
}




exports.PQueue = PQueue; exports.FileManager = FileManager;
//# sourceMappingURL=chunk-AT6SMJQW.cjs.map