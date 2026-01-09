class Algorithm {
    constructor(name, contextSwitchTime = 1.0) {
        this.name = name;
        this.contextSwitchTime = contextSwitchTime;
        this.ganttChart = [];
        this.totalContextSwitches = 0;
        this.totalTime = 0;
        this.completedProcesses = [];
    }

    simulate(processes) {
        throw new Error('simulate() must be implemented by subclass');
    }

    addContextSwitch(startTime) {
        this.ganttChart.push({
            type: 'switch',
            start: startTime,
            duration: this.contextSwitchTime
        });
        this.totalContextSwitches++;
        this.totalTime += this.contextSwitchTime;
    }

    addProcessExecution(process, startTime, duration) {
        this.ganttChart.push({
            type: 'process',
            pid: process.pid,
            start: startTime,
            duration: duration,
            colorClass: process.colorClass
        });
        this.totalTime += duration;
    }

    getGanttChart() {
        return this.ganttChart;
    }

    // Helper method to verify process completion
    verifyProcessCompletion(processes) {
        console.log('Verifying process completion...');
        processes.forEach((process, index) => {
            console.log(`Process ${index + 1}:`, {
                pid: process.pid,
                arrivalTime: process.arrivalTime,
                burstTime: process.burstTime,
                completionTime: process.completionTime,
                turnaroundTime: process.turnaroundTime,
                waitingTime: process.waitingTime,
                responseTime: process.responseTime,
                remainingTime: process.remainingTime
            });
        });
        
        return processes;
    }
}