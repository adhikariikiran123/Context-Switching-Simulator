class ResultsDisplay {
    constructor() {
        this.metricsGrid = document.getElementById('metricsGrid');
        this.resultsBody = document.getElementById('resultsBody');
        this.colorLegend = document.getElementById('colorLegend');
        this.totalTimeElement = document.getElementById('totalTime');
        this.currentAlgorithmElement = document.getElementById('currentAlgorithm');
    }

    async update(algorithm, processes) {
        console.log('Updating results display...');
        console.log('Algorithm:', algorithm);
        console.log('Processes:', processes);
        
        if (!this.currentAlgorithmElement) {
            console.error('Required elements not found!');
            console.log('currentAlgorithmElement:', this.currentAlgorithmElement);
            return;
        }
        
        // Animate algorithm name change
        this.animateAlgorithmChange(algorithm);
        
        // Update metrics with animation
        await this.updateMetricsWithAnimation(algorithm, processes);
        
        // Update table with animation
        this.updateResultsTable(processes);
        
        // Update color legend with animation
        this.updateColorLegend(processes);
        
        // Animate total time counter
        this.animateTotalTime(algorithm);
    }

    animateAlgorithmChange(algorithm) {
        if (this.currentAlgorithmElement) {
            this.currentAlgorithmElement.textContent = algorithm.name;
            this.currentAlgorithmElement.style.animation = 'pulse 1s';
            setTimeout(() => {
                this.currentAlgorithmElement.style.animation = '';
            }, 1000);
        }
    }

    async updateMetricsWithAnimation(algorithm, processes) {
        console.log('Updating metrics...');
        console.log('Metrics grid element:', this.metricsGrid);
        
        if (!this.metricsGrid) {
            console.error('Metrics grid not found!');
            return;
        }
        
        // Calculate metrics
        const metrics = this.calculateMetrics(algorithm, processes);
        console.log('Calculated metrics:', metrics);
        
        // Clear existing content
        this.metricsGrid.innerHTML = '';
        
        // Create metric cards
        const metricData = [
            { 
                label: 'Avg Turnaround Time', 
                value: metrics.avgTurnaround, 
                unit: 'units',
                color: '#4ade80'
            },
            { 
                label: 'Avg Waiting Time', 
                value: metrics.avgWaiting, 
                unit: 'units',
                color: '#fbbf24'
            },
            { 
                label: 'Avg Response Time', 
                value: metrics.avgResponse, 
                unit: 'units',
                color: '#f87171'
            },
            { 
                label: 'Context Switches', 
                value: metrics.totalContextSwitches, 
                unit: 'times',
                color: '#64dfdf'
            },
            { 
                label: 'CPU Utilization', 
                value: metrics.cpuUtilization, 
                unit: '%',
                color: '#a78bfa'
            },
            { 
                label: 'Throughput', 
                value: metrics.throughput, 
                unit: 'proc/unit',
                color: '#f472b6'
            }
        ];
        
        // Add metric cards with animation
        for (let i = 0; i < metricData.length; i++) {
            await this.createMetricCard(metricData[i], i);
        }
    }

    calculateMetrics(algorithm, processes) {
        console.log('Calculating metrics for', processes.length, 'processes');
        
        if (processes.length === 0) {
            return {
                avgTurnaround: 0,
                avgWaiting: 0,
                avgResponse: 0,
                totalContextSwitches: 0,
                cpuUtilization: 0,
                throughput: 0
            };
        }

        // Calculate basic metrics
        const totalTurnaround = processes.reduce((sum, p) => sum + p.turnaroundTime, 0);
        const totalWaiting = processes.reduce((sum, p) => sum + p.waitingTime, 0);
        const totalResponse = processes.reduce((sum, p) => sum + p.responseTime, 0);
        const count = processes.length;

        // Calculate throughput
        const totalTime = algorithm.totalTime || 1; // Avoid division by zero
        const throughput = count / totalTime;

        // Calculate CPU utilization
        const totalProcessTime = processes.reduce((sum, p) => sum + p.burstTime, 0);
        const cpuUtilization = (totalProcessTime / totalTime) * 100;

        console.log('Total turnaround:', totalTurnaround);
        console.log('Total waiting:', totalWaiting);
        console.log('Total response:', totalResponse);
        console.log('Total time:', totalTime);
        console.log('Throughput:', throughput);
        console.log('CPU Utilization:', cpuUtilization);

        return {
            avgTurnaround: totalTurnaround / count,
            avgWaiting: totalWaiting / count,
            avgResponse: totalResponse / count,
            totalContextSwitches: algorithm.totalContextSwitches || 0,
            cpuUtilization: cpuUtilization,
            throughput: throughput
        };
    }

    createMetricCard(metric, index) {
        return new Promise(resolve => {
            setTimeout(() => {
                const metricCard = document.createElement('div');
                metricCard.className = 'metric-card';
                metricCard.style.opacity = '0';
                metricCard.style.transform = 'translateY(20px)';
                
                const valueContainer = document.createElement('div');
                valueContainer.className = 'metric-value-container';
                valueContainer.style.display = 'flex';
                valueContainer.style.alignItems = 'baseline';
                valueContainer.style.gap = '5px';
                
                const valueSpan = document.createElement('span');
                valueSpan.className = 'metric-value';
                valueSpan.style.color = metric.color;
                valueSpan.style.fontSize = '1.8rem';
                valueSpan.style.fontWeight = 'bold';
                valueSpan.textContent = '0.00';
                
                const unitSpan = document.createElement('span');
                unitSpan.className = 'metric-unit';
                unitSpan.style.color = '#94a3b8';
                unitSpan.style.fontSize = '0.9rem';
                unitSpan.textContent = metric.unit;
                
                valueContainer.appendChild(valueSpan);
                valueContainer.appendChild(unitSpan);
                
                metricCard.innerHTML = `
                    <div class="metric-label" style="font-size: 0.9rem; color: #a9b7c6; margin-bottom: 8px;">
                        ${metric.label}
                    </div>
                `;
                metricCard.appendChild(valueContainer);
                
                this.metricsGrid.appendChild(metricCard);
                
                // Animate appearance
                setTimeout(() => {
                    metricCard.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                    metricCard.style.opacity = '1';
                    metricCard.style.transform = 'translateY(0)';
                    
                    // Animate value counting
                    this.animateValueCounter(valueSpan, 0, metric.value, 1000);
                }, 50);
                
                resolve();
            }, index * 100);
        });
    }

    animateValueCounter(element, start, end, duration) {
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use easing function for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = start + (end - start) * easeOut;
            
            // Format the value appropriately
            let displayValue;
            if (element.parentElement?.nextElementSibling?.textContent === '%') {
                displayValue = currentValue.toFixed(1);
            } else if (element.parentElement?.nextElementSibling?.textContent === 'proc/unit') {
                displayValue = currentValue.toFixed(3);
            } else if (element.parentElement?.nextElementSibling?.textContent === 'times') {
                displayValue = Math.round(currentValue);
            } else {
                displayValue = currentValue.toFixed(2);
            }
            
            element.textContent = displayValue;
            
            // Add bounce effect
            const scale = 1 + 0.2 * Math.sin(progress * Math.PI);
            element.style.transform = `scale(${scale})`;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.style.transform = 'scale(1)';
                // Add final pulse effect
                element.style.animation = 'pulse 0.5s';
                setTimeout(() => {
                    element.style.animation = '';
                }, 500);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    updateResultsTable(processes) {
        console.log('Updating results table...');
        
        if (!this.resultsBody) {
            console.error('Results body not found!');
            return;
        }
        
        // Clear table
        this.resultsBody.innerHTML = '';
        
        // Add rows for each process
        processes.forEach((process, index) => {
            const data = process.getDisplayData();
            const row = document.createElement('tr');
            
            // Style row based on process completion
            row.style.animationDelay = `${index * 0.05}s`;
            row.style.opacity = '0';
            row.style.transform = 'translateX(-20px)';
            
            row.innerHTML = `
                <td style="font-weight: bold; color: ${this.getProcessColor(process.pid)};">
                    P${data.pid}
                </td>
                <td>${data.arrivalTime}</td>
                <td>${data.burstTime}</td>
                <td>${data.startTime}</td>
                <td>${data.completionTime}</td>
                <td class="turnaround-cell">${data.turnaroundTime}</td>
                <td class="waiting-cell">${data.waitingTime}</td>
                <td class="response-cell">${data.responseTime}</td>
            `;
            
            this.resultsBody.appendChild(row);
            
            // Animate row appearance
            setTimeout(() => {
                row.style.transition = 'all 0.5s ease';
                row.style.opacity = '1';
                row.style.transform = 'translateX(0)';
                
                // Animate numeric cells
                this.animateTableCell(row.querySelector('.turnaround-cell'), parseFloat(data.turnaroundTime));
                this.animateTableCell(row.querySelector('.waiting-cell'), parseFloat(data.waitingTime));
                this.animateTableCell(row.querySelector('.response-cell'), parseFloat(data.responseTime));
            }, index * 100);
        });
    }

    animateTableCell(cell, value) {
        if (!cell) return;
        
        const originalValue = cell.textContent;
        cell.textContent = '0.00';
        
        setTimeout(() => {
            const startTime = performance.now();
            const duration = 500;
            
            const updateCell = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const currentValue = value * progress;
                
                cell.textContent = currentValue.toFixed(2);
                
                // Color coding based on value
                if (currentValue < 10) {
                    cell.style.color = '#4ade80';
                } else if (currentValue < 20) {
                    cell.style.color = '#fbbf24';
                } else {
                    cell.style.color = '#f87171';
                }
                
                if (progress < 1) {
                    requestAnimationFrame(updateCell);
                } else {
                    cell.textContent = originalValue;
                }
            };
            
            requestAnimationFrame(updateCell);
        }, 300);
    }

    updateColorLegend(processes) {
        if (!this.colorLegend) return;
        
        this.colorLegend.innerHTML = '';
        
        // Limit to first 5 processes for legend
        const legendProcesses = processes.slice(0, 5);
        
        legendProcesses.forEach((process, index) => {
            setTimeout(() => {
                const legendItem = document.createElement('div');
                legendItem.className = 'legend-item';
                legendItem.style.opacity = '0';
                legendItem.style.transform = 'scale(0.5)';
                
                const colorBox = document.createElement('div');
                colorBox.className = 'legend-color';
                colorBox.style.background = this.getProcessColor(process.pid);
                colorBox.style.width = '20px';
                colorBox.style.height = '20px';
                colorBox.style.borderRadius = '4px';
                
                const text = document.createElement('span');
                text.className = 'legend-text';
                text.textContent = `P${process.pid}`;
                text.style.color = '#e6e6e6';
                text.style.fontSize = '0.9rem';
                
                legendItem.appendChild(colorBox);
                legendItem.appendChild(text);
                this.colorLegend.appendChild(legendItem);
                
                // Animate appearance
                setTimeout(() => {
                    legendItem.style.transition = 'all 0.3s ease';
                    legendItem.style.opacity = '1';
                    legendItem.style.transform = 'scale(1)';
                }, 10);
            }, index * 100);
        });
    }

    animateTotalTime(algorithm) {
        if (!this.totalTimeElement) return;
        
        const currentValue = parseFloat(this.totalTimeElement.textContent) || 0;
        const targetValue = algorithm.totalTime || 0;
        
        const startTime = performance.now();
        const duration = 1000;
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const value = currentValue + (targetValue - currentValue) * easeOut;
            
            this.totalTimeElement.textContent = value.toFixed(1);
            
            // Color based on total time
            if (value < 30) {
                this.totalTimeElement.style.color = '#4ade80';
            } else if (value < 60) {
                this.totalTimeElement.style.color = '#fbbf24';
            } else {
                this.totalTimeElement.style.color = '#f87171';
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                // Final flash effect
                this.totalTimeElement.style.animation = 'pulse 1s';
                setTimeout(() => {
                    this.totalTimeElement.style.animation = '';
                }, 1000);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    getProcessColor(pid) {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2',
            '#EF476F', '#7209B7', '#F3722C', '#43AA8B', '#577590',
            '#F94144', '#F8961E', '#90BE6D', '#277DA1', '#9B5DE5'
        ];
        return colors[(pid - 1) % colors.length];
    }

    clear() {
        if (this.metricsGrid) {
            this.metricsGrid.innerHTML = '<div class="metric-card"><div>Waiting for simulation...</div></div>';
        }
        if (this.resultsBody) {
            this.resultsBody.innerHTML = '';
        }
        if (this.colorLegend) {
            this.colorLegend.innerHTML = '';
        }
        if (this.totalTimeElement) {
            this.totalTimeElement.textContent = '0';
        }
    }
}