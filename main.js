class ContextSwitchingSimulator {
    constructor() {
        this.processGenerator = new ProcessGenerator();
        this.ganttChart = new GanttChart('ganttChart', 'ganttTimeline');
        this.resultsDisplay = new ResultsDisplay();
        
        this.currentAlgorithm = 'FCFS';
        this.processes = [];
        this.algorithm = null;
        this.isRunning = false;
        
        this.config = {
            numProcesses: 6,
            timeQuantum: 4.0,
            contextSwitchTime: 1.0
        };
        
        this.init();
    }

    init() {
        console.log('Initializing simulator...');
        console.log('Gantt chart element:', document.getElementById('ganttChart'));
        console.log('Metrics grid element:', document.getElementById('metricsGrid'));
        
        this.bindEvents();
        this.updateConfigDisplays();
        this.generateProcesses();
        this.setActiveAlgorithm('FCFS');
    }

    bindEvents() {
        // Configuration sliders
        const numProcessesInput = document.getElementById('numProcesses');
        const timeQuantumInput = document.getElementById('timeQuantum');
        const contextSwitchTimeInput = document.getElementById('contextSwitchTime');
        
        if (numProcessesInput) {
            numProcessesInput.addEventListener('input', (e) => {
                this.config.numProcesses = parseInt(e.target.value);
                document.getElementById('processCount').textContent = this.config.numProcesses;
            });
        }
        
        if (timeQuantumInput) {
            timeQuantumInput.addEventListener('input', (e) => {
                this.config.timeQuantum = parseFloat(e.target.value);
                document.getElementById('quantumValue').textContent = this.config.timeQuantum.toFixed(1);
            });
        }
        
        if (contextSwitchTimeInput) {
            contextSwitchTimeInput.addEventListener('input', (e) => {
                this.config.contextSwitchTime = parseFloat(e.target.value);
                document.getElementById('switchValue').textContent = this.config.contextSwitchTime.toFixed(1);
            });
        }

        // Algorithm buttons
        document.querySelectorAll('.algo-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const algo = e.currentTarget.dataset.algo;
                this.setActiveAlgorithm(algo);
            });
        });

        // Action buttons
        const generateBtn = document.getElementById('generateBtn');
        const runBtn = document.getElementById('runSimulation');
        
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                this.generateProcesses();
            });
        }
        
        if (runBtn) {
            runBtn.addEventListener('click', () => {
                this.runSimulation();
            });
        }
        
        console.log('Event listeners bound successfully');
    }

    updateConfigDisplays() {
        const processCount = document.getElementById('processCount');
        const quantumValue = document.getElementById('quantumValue');
        const switchValue = document.getElementById('switchValue');
        
        if (processCount) processCount.textContent = this.config.numProcesses;
        if (quantumValue) quantumValue.textContent = this.config.timeQuantum.toFixed(1);
        if (switchValue) switchValue.textContent = this.config.contextSwitchTime.toFixed(1);
    }

    setActiveAlgorithm(algorithm) {
        this.currentAlgorithm = algorithm;
        
        document.querySelectorAll('.algo-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.algo === algorithm) {
                btn.classList.add('active');
            }
        });
        
        console.log(`Algorithm set to: ${algorithm}`);
    }

    generateProcesses() {
        console.log('Generating processes...');
        
        // Show loading state
        const generateBtn = document.getElementById('generateBtn');
        const originalText = generateBtn.innerHTML;
        generateBtn.innerHTML = 'Generating...';
        generateBtn.disabled = true;
        
        setTimeout(() => {
            this.processes = this.processGenerator.generate(this.config.numProcesses);
            
            const processListElement = document.getElementById('processList');
            if (processListElement) {
                this.processGenerator.updateDisplay(processListElement);
            }
            
            // Clear previous results
            this.ganttChart.clear();
            this.resultsDisplay.clear();
            
            console.log(`Generated ${this.processes.length} processes:`, this.processes);
            
            // Restore button
            generateBtn.innerHTML = originalText;
            generateBtn.disabled = false;
            
            // Show success message
            this.showNotification(`Generated ${this.processes.length} processes!`, 'success');
        }, 500);
    }

    async runSimulation() {
        if (this.isRunning) {
            this.showNotification('Simulation is already running!', 'warning');
            return;
        }
        
        console.log('Running simulation...');
        
        if (this.processes.length === 0) {
            this.showNotification('Please generate processes first!', 'error');
            return;
        }

        this.isRunning = true;
        
        // Show loading state
        const runBtn = document.getElementById('runSimulation');
        const originalText = runBtn.innerHTML;
        runBtn.innerHTML = 'Running...';
        runBtn.disabled = true;
        
        try {
            // Create algorithm instance
            switch (this.currentAlgorithm) {
                case 'FCFS':
                    this.algorithm = new FCFS(this.config.contextSwitchTime);
                    break;
                case 'SJF':
                    this.algorithm = new SJF(this.config.contextSwitchTime);
                    break;
                case 'RR':
                    this.algorithm = new RoundRobin(this.config.contextSwitchTime, this.config.timeQuantum);
                    break;
                default:
                    this.algorithm = new FCFS(this.config.contextSwitchTime);
            }

            console.log(`Running ${this.currentAlgorithm} algorithm...`);
            
            // Run simulation
            const startTime = performance.now();
            const completedProcesses = this.algorithm.simulate([...this.processes]);
            const endTime = performance.now();
            
            console.log(`Simulation completed in ${(endTime - startTime).toFixed(2)}ms`);
            console.log(`Processed ${completedProcesses.length} processes:`, completedProcesses);
            
            // Verify process completion
            this.algorithm.verifyProcessCompletion(completedProcesses);
            
            // Update displays
            await this.ganttChart.render(this.algorithm.getGanttChart(), this.algorithm.totalTime);
            await this.resultsDisplay.update(this.algorithm, completedProcesses);
            
            // Show success notification
            this.showNotification(
                `${this.algorithm.name} completed! Processed ${completedProcesses.length} processes in ${this.algorithm.totalTime.toFixed(1)} units.`,
                'success'
            );
            
        } catch (error) {
            console.error('Simulation error:', error);
            this.showNotification('Simulation error: ' + error.message, 'error');
        } finally {
            // Restore button
            runBtn.innerHTML = originalText;
            runBtn.disabled = false;
            this.isRunning = false;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 10px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            transform: translateX(150%);
            transition: transform 0.5s ease;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        `;
        
        // Set colors based on type
        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        } else if (type === 'warning') {
            notification.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(150%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing simulator...');
    
    // Check if all required elements exist
    const requiredElements = [
        'ganttChart',
        'metricsGrid',
        'resultsBody',
        'currentAlgorithm',
        'totalTime'
    ];
    
    requiredElements.forEach(id => {
        const element = document.getElementById(id);
        console.log(`${id}:`, element ? 'Found' : 'NOT FOUND');
    });
    
    window.simulator = new ContextSwitchingSimulator();
});