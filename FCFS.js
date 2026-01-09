class FCFS extends Algorithm {
    constructor(contextSwitchTime = 1.0) {
        super('First-Come, First-Served (FCFS)', contextSwitchTime);
    }

    simulate(processes) {
        const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
        let currentTime = 0;
        const completedProcesses = [];

        for (let i = 0; i < sortedProcesses.length; i++) {
            const process = sortedProcesses[i];
            
            if (currentTime < process.arrivalTime) {
                currentTime = process.arrivalTime;
            }

            if (i > 0) {
                this.addContextSwitch(currentTime);
                currentTime += this.contextSwitchTime;
            }

            const executionTime = process.execute(process.burstTime, currentTime);
            this.addProcessExecution(process, currentTime, executionTime);
            currentTime += executionTime;

            completedProcesses.push(process);
        }

        return completedProcesses;
    }
}