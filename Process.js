class Process {
    constructor(pid, arrivalTime, burstTime) {
        this.pid = pid;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
        this.remainingTime = burstTime;
        this.completionTime = 0;
        this.turnaroundTime = 0;
        this.waitingTime = 0;
        this.responseTime = 0;
        this.startTime = 0;
        this.colorClass = `process-color-${(pid % 15) + 1}`;
    }

    execute(time, currentTime) {
        if (this.startTime === 0 && this.remainingTime === this.burstTime) {
            this.startTime = currentTime;
            this.responseTime = this.startTime - this.arrivalTime;
        }
        
        const executionTime = Math.min(time, this.remainingTime);
        this.remainingTime -= executionTime;
        
        if (this.remainingTime === 0) {
            this.completionTime = currentTime + executionTime;
            this.turnaroundTime = this.completionTime - this.arrivalTime;
            this.waitingTime = this.turnaroundTime - this.burstTime;
        }
        
        return executionTime;
    }

    isCompleted() {
        return this.remainingTime === 0;
    }

    getDisplayData() {
        return {
            pid: this.pid,
            arrivalTime: this.arrivalTime.toFixed(2),
            burstTime: this.burstTime.toFixed(2),
            startTime: this.startTime.toFixed(2),
            completionTime: this.completionTime.toFixed(2),
            turnaroundTime: this.turnaroundTime.toFixed(2),
            waitingTime: this.waitingTime.toFixed(2),
            responseTime: this.responseTime.toFixed(2),
            colorClass: this.colorClass
        };
    }
}