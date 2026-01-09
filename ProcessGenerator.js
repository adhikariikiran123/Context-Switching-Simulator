class ProcessGenerator {
    constructor() {
        this.processes = [];
        this.nextPid = 1;
    }

    generate(count) {
        this.processes = [];
        this.nextPid = 1;
        
        for (let i = 0; i < count; i++) {
            const arrivalTime = Math.random() * 10;
            const burstTime = 1 + Math.random() * 9;
            const process = new Process(this.nextPid++, arrivalTime, burstTime);
            this.processes.push(process);
        }
        
        return this.processes;
    }

    updateDisplay(container) {
        if (!container) {
            console.error('Process list container not found!');
            return;
        }
        
        container.innerHTML = '';
        
        this.processes.forEach(process => {
            const div = document.createElement('div');
            div.className = 'process-item';
            div.innerHTML = `
                <div>P${process.pid}</div>
                <div>Arrival: ${process.arrivalTime.toFixed(1)}</div>
                <div>Burst: ${process.burstTime.toFixed(1)}</div>
            `;
            container.appendChild(div);
        });
    }

    getProcesses() {
        return this.processes;
    }
}