export class Timer {
    private throttleTimer;

    timeout(delay) {
        return new Promise((res) => {
            setTimeout(res, delay || 0);
        });
    }

    reset() {
        this.throttleTimer = null;
    }

    throttle(fn, delay = 0) {
        if (this.throttleTimer) return;
        this.throttleTimer = setTimeout(() => {
            fn();
            this.reset();
        }, delay);
    }

    debounce(fn, delay = 0) {
        clearTimeout(this.throttleTimer);
        this.throttleTimer = setTimeout(() => {
            fn();
            this.reset();
        }, delay);
    }
}

