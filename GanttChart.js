class GanttChart {
    constructor(containerId, timelineId) {
        this.container = document.getElementById(containerId);
        this.timeline = document.getElementById(timelineId);
        this.animationDelay = 200; // ms between each block
    }

    async render(ganttData, totalTime) {
        if (!this.container) {
            console.error('Gantt chart container not found!');
            return;
        }
        
        this.container.innerHTML = '';
        
        if (!ganttData || ganttData.length === 0) {
            this.container.innerHTML = '<div>No execution data available</div>';
            return;
        }

        // Create progress bar for animation
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressContainer.appendChild(progressBar);
        this.container.appendChild(progressContainer);

        let currentTime = 0;
        
        // Animate each block sequentially
        for (let i = 0; i < ganttData.length; i++) {
            await this.animateBlock(ganttData[i], currentTime, i);
            currentTime += ganttData[i].duration;
            
            // Update progress bar
            const progress = ((i + 1) / ganttData.length) * 100;
            progressBar.style.width = `${progress}%`;
        }

        // Remove progress bar after animation
        setTimeout(() => {
            progressContainer.style.opacity = '0';
            setTimeout(() => progressContainer.remove(), 300);
        }, 500);

        if (this.timeline) {
            this.animateCounter(this.timeline, 0, totalTime, 1500);
        }
    }

    animateBlock(entry, startTime, index) {
        return new Promise(resolve => {
            setTimeout(() => {
                const element = document.createElement('div');
                element.className = `gantt-item ${entry.colorClass || ''}`;
                element.style.background = entry.type === 'switch' ? '#666' : '';
                
                // Initial state for animation
                element.style.opacity = '0';
                element.style.transform = 'scale(0.5)';
                
                if (entry.type === 'process') {
                    element.textContent = `P${entry.pid}`;
                    element.title = `Process P${entry.pid}: ${entry.duration.toFixed(1)} units\nStart: ${startTime.toFixed(1)}`;
                } else {
                    element.textContent = 'CS';
                    element.title = `Context Switch: ${entry.duration.toFixed(1)} units\nStart: ${startTime.toFixed(1)}`;
                }
                
                // Add hover effect
                element.addEventListener('mouseenter', () => {
                    element.style.transform = 'scale(1.1) translateY(-5px)';
                    element.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.3)';
                    element.style.zIndex = '100';
                });
                
                element.addEventListener('mouseleave', () => {
                    element.style.transform = 'scale(1)';
                    element.style.boxShadow = 'none';
                    element.style.zIndex = '1';
                });
                
                this.container.appendChild(element);
                
                // Animate appearance
                requestAnimationFrame(() => {
                    element.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                    element.style.opacity = '1';
                    element.style.transform = 'scale(1)';
                    
                    // Add a little bounce
                    setTimeout(() => {
                        element.style.transform = 'scale(1.05)';
                        setTimeout(() => {
                            element.style.transform = 'scale(1)';
                        }, 100);
                    }, 500);
                });
                
                resolve();
            }, index * this.animationDelay);
        });
    }

    animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const value = start + (end - start) * progress;
            
            element.textContent = `Timeline: 0 - ${value.toFixed(1)} units`;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                // Add pulse effect when complete
                element.classList.add('pulse');
                setTimeout(() => element.classList.remove('pulse'), 2000);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    clear() {
        if (this.container) {
            // Animate removal
            const items = this.container.children;
            Array.from(items).forEach((item, index) => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '0';
                item.style.transform = 'scale(0.5) translateY(20px)';
                setTimeout(() => {
                    if (item.parentNode === this.container) {
                        item.remove();
                    }
                }, 300 + index * 50);
            });
            
            // Clear completely after animation
            setTimeout(() => {
                this.container.innerHTML = '';
            }, 1000);
        }
        if (this.timeline) {
            this.timeline.textContent = '';
        }
    }
}