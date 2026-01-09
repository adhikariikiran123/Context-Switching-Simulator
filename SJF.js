class SJF extends Algorithm {
    constructor(contextSwitchTime = 1.0) {
        super('Shortest Job First (SJF)', contextSwitchTime);
    }

    simulate(processes) {
        const sortedByArrival = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
        let currentTime = 0;
        let completed = 0;
        const n = sortedByArrival.length;
        const completedProcesses = [];
        const readyQueue = [];
        let index = 0;

        while (completed < n) {
            while (index < n && sortedByArrival[index].arrivalTime <= currentTime) {
                readyQueue.push(sortedByArrival[index]);
                index++;
            }

            if (readyQueue.length > 0) {
                readyQueue.sort((a, b) => a.burstTime - b.burstTime);
                const process = readyQueue.shift();

                if (completed > 0) {
                    this.addContextSwitch(currentTime);
                    currentTime += this.contextSwitchTime;
                }

                const executionTime = process.execute(process.burstTime, currentTime);
                this.addProcessExecution(process, currentTime, executionTime);
                currentTime += executionTime;

                completedProcesses.push(process);
                completed++;
            } else {
                if (index < n) {
                    currentTime = sortedByArrival[index].arrivalTime;
                } else {
                    break;
                }
            }
        }

        return completedProcesses;
    }
}