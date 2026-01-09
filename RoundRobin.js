class RoundRobin extends Algorithm {
    constructor(contextSwitchTime = 1.0, timeQuantum = 4.0) {
        super('Round Robin (RR)', contextSwitchTime);
        this.timeQuantum = timeQuantum;
    }

    simulate(processes) {
        const sortedByArrival = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
        const remainingTime = new Map();
        const readyQueue = [];
        let currentTime = 0;
        let completed = 0;
        const n = sortedByArrival.length;
        const completedProcesses = [];
        let index = 0;

        sortedByArrival.forEach(p => {
            remainingTime.set(p.pid, p.burstTime);
            p.remainingTime = p.burstTime;
        });

        while (completed < n) {
            while (index < n && sortedByArrival[index].arrivalTime <= currentTime) {
                readyQueue.push(sortedByArrival[index]);
                index++;
            }

            if (readyQueue.length === 0) {
                if (index < n) {
                    currentTime = sortedByArrival[index].arrivalTime;
                    continue;
                } else {
                    break;
                }
            }

            const process = readyQueue.shift();
            const execTime = Math.min(this.timeQuantum, remainingTime.get(process.pid));

            if (this.ganttChart.length > 0 && 
                this.ganttChart[this.ganttChart.length - 1].type === 'process') {
                this.addContextSwitch(currentTime);
                currentTime += this.contextSwitchTime;
            }

            process.execute(execTime, currentTime);
            this.addProcessExecution(process, currentTime, execTime);
            
            remainingTime.set(process.pid, remainingTime.get(process.pid) - execTime);
            currentTime += execTime;

            while (index < n && sortedByArrival[index].arrivalTime <= currentTime) {
                readyQueue.push(sortedByArrival[index]);
                index++;
            }

            if (remainingTime.get(process.pid) > 0) {
                readyQueue.push(process);
            } else {
                completedProcesses.push(process);
                completed++;
            }
        }

        return completedProcesses;
    }
}